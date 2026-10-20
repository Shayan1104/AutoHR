import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.models.job import JobPosting
from app.models.candidate import Application, CVEvaluation
from app.models.interview import Interview, InterviewEvaluation
from app.models.ranking import CandidateFinalRanking
from app.models.enums import DecisionVerdict, MediaRetentionStatus, ApplicationStatus
from app.schemas.ranking import (
    CandidateRankingResponse, LeaderboardResponse, HROverrideRequest
)
from app.api.deps import get_current_hr_user

router = APIRouter(prefix="/rankings", tags=["Phase 4: Combined Decision Dashboard & Retention Cleanup"])


@router.post("/job/{job_id}/calculate", response_model=LeaderboardResponse)
async def calculate_final_leaderboard(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_hr_user),
):
    """
    Step 10: Calculates composite scores across CV + Interview:
    Final Score = (CV_Score * 0.35) + (Interview_Score * 0.65)
    Assigns ranks, generates hire verdicts, and enforces media retention policies.
    """
    # 1. Fetch Job
    job_res = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")

    # 2. Fetch all completed applications with CV evaluation and Interview evaluation
    query = (
        select(Application)
        .options(
            selectinload(Application.candidate),
            selectinload(Application.cv_evaluation),
            selectinload(Application.interview).selectinload(Interview.evaluation),
        )
        .where(
            Application.job_posting_id == job_id,
            Application.status == ApplicationStatus.INTERVIEW_COMPLETED,
        )
    )
    res = await db.execute(query)
    completed_apps = res.scalars().all()

    if not completed_apps:
        raise HTTPException(
            status_code=400,
            detail="No completed interview candidates found to rank for this job.",
        )

    # 3. Clear existing rankings for recalculation
    await db.execute(delete(CandidateFinalRanking).where(CandidateFinalRanking.job_posting_id == job_id))

    # 4. Calculate composite scores
    scored_candidates = []
    for app in completed_apps:
        cv_s = float(app.cv_evaluation.overall_score) if app.cv_evaluation else 70.0
        int_s = float(app.interview.evaluation.composite_interview_score) if (app.interview and app.interview.evaluation) else 70.0

        # Weighted formula: 35% CV, 65% Interview
        composite = round((cv_s * 0.35) + (int_s * 0.65), 2)
        scored_candidates.append({
            "application": app,
            "cv_score": cv_s,
            "interview_score": int_s,
            "composite": composite,
        })

    # 5. Sort by composite score descending
    scored_candidates.sort(key=lambda x: x["composite"], reverse=True)

    rankings_created: List[CandidateFinalRanking] = []
    target_hires = job.target_hires

    for rank_idx, item in enumerate(scored_candidates, start=1):
        app = item["application"]
        composite = item["composite"]

        # Verdict assignment
        if composite >= 85.0 and rank_idx <= target_hires:
            verdict = DecisionVerdict.STRONG_HIRE
        elif composite >= 75.0 and rank_idx <= target_hires:
            verdict = DecisionVerdict.HIRE
        elif composite >= 65.0:
            verdict = DecisionVerdict.LEAN_HIRE
        else:
            verdict = DecisionVerdict.NO_HIRE

        # Step 10 Media Retention: Preserve recordings only for top target_hires
        is_retained = (rank_idx <= target_hires)
        if app.interview:
            if is_retained:
                app.interview.media_retention_status = MediaRetentionStatus.ACTIVE
            else:
                app.interview.media_retention_status = MediaRetentionStatus.MARKED_FOR_DELETION

        app.status = ApplicationStatus.FINAL_REVIEW

        ranking_row = CandidateFinalRanking(
            job_posting_id=job.id,
            application_id=app.id,
            final_rank=rank_idx,
            cv_score=item["cv_score"],
            interview_score=item["interview_score"],
            composite_score=composite,
            decision_verdict=verdict,
            ai_justification=(
                f"Rank #{rank_idx} ({verdict.value.replace('_', ' ').title()}). "
                f"Achieved composite score of {composite}/100 based on {item['cv_score']} CV match "
                f"and {item['interview_score']} interview assessment."
            ),
            recording_retained=is_retained,
        )
        db.add(ranking_row)
        rankings_created.append(ranking_row)

    await db.commit()

    # 6. Return populated leaderboard
    leaderboard_query = (
        select(CandidateFinalRanking)
        .options(
            selectinload(CandidateFinalRanking.application).selectinload(Application.candidate),
            selectinload(CandidateFinalRanking.application).selectinload(Application.cv_evaluation),
        )
        .where(CandidateFinalRanking.job_posting_id == job_id)
        .order_by(CandidateFinalRanking.final_rank.asc())
    )
    final_res = await db.execute(leaderboard_query)
    rankings_list = final_res.scalars().all()

    return LeaderboardResponse(
        job_id=job.id,
        job_title=job.title,
        target_hires=job.target_hires,
        total_candidates=len(rankings_list),
        rankings=rankings_list,
    )


@router.get("/job/{job_id}/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_hr_user),
):
    job_res = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")

    query = (
        select(CandidateFinalRanking)
        .options(
            selectinload(CandidateFinalRanking.application).selectinload(Application.candidate),
            selectinload(CandidateFinalRanking.application).selectinload(Application.cv_evaluation),
        )
        .where(CandidateFinalRanking.job_posting_id == job_id)
        .order_by(CandidateFinalRanking.final_rank.asc())
    )
    res = await db.execute(query)
    rankings_list = res.scalars().all()

    return LeaderboardResponse(
        job_id=job.id,
        job_title=job.title,
        target_hires=job.target_hires,
        total_candidates=len(rankings_list),
        rankings=rankings_list,
    )


@router.patch("/{ranking_id}/override", response_model=CandidateRankingResponse)
async def override_ranking_verdict(
    ranking_id: uuid.UUID,
    override_in: HROverrideRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_hr_user),
):
    query = (
        select(CandidateFinalRanking)
        .options(
            selectinload(CandidateFinalRanking.application).selectinload(Application.candidate),
            selectinload(CandidateFinalRanking.application).selectinload(Application.cv_evaluation),
        )
        .where(CandidateFinalRanking.id == ranking_id)
    )
    res = await db.execute(query)
    ranking = res.scalars().first()
    if not ranking:
        raise HTTPException(status_code=404, detail="Ranking record not found")

    ranking.hr_override_verdict = override_in.hr_override_verdict
    ranking.hr_feedback_notes = override_in.hr_feedback_notes
    await db.commit()
    await db.refresh(ranking)
    return ranking
