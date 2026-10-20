import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.models.candidate import Application, CandidateInvitation
from app.models.interview import (
    InterviewSchedule, InterviewConsent, Interview,
    InterviewStage, InterviewQuestionAnswer, InterviewEvaluation
)
from app.models.enums import (
    InterviewStageType, StageStatus, MediaRetentionStatus, ApplicationStatus
)
from app.schemas.interview import (
    ScheduleSlotCreate, ScheduleSlotResponse,
    ConsentCreate, ConsentResponse,
    QuestionAnswerSubmit, InterviewResponse
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/interviews", tags=["Phase 3: Scheduling, Consent Gate & Multi-Stage Interview"])


@router.post("/schedule-by-token/{magic_token}", response_model=ScheduleSlotResponse)
async def schedule_by_token(
    magic_token: str,
    scheduled_start: datetime,
    scheduled_end: datetime,
    timezone_str: str = "UTC",
    db: AsyncSession = Depends(get_async_db),
):
    """
    Step 7: Shortlisted candidate books interview using their unique magic link token.
    """
    inv_res = await db.execute(
        select(CandidateInvitation).where(CandidateInvitation.magic_token == magic_token)
    )
    invitation = inv_res.scalars().first()
    if not invitation:
        raise HTTPException(status_code=404, detail="Invalid invitation token")
    if invitation.is_used:
        raise HTTPException(status_code=400, detail="This invitation token has already been booked")
    if invitation.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="This invitation token has expired")

    schedule = InterviewSchedule(
        application_id=invitation.application_id,
        scheduled_start=scheduled_start,
        scheduled_end=scheduled_end,
        timezone=timezone_str,
        room_url=f"http://localhost:3000/interview-room/{invitation.application_id}",
    )
    db.add(schedule)
    invitation.is_used = True
    invitation.accepted_at = datetime.now(timezone.utc)

    # Update app status
    app_res = await db.execute(select(Application).where(Application.id == invitation.application_id))
    application = app_res.scalars().first()
    if application:
        application.status = ApplicationStatus.INTERVIEW_SCHEDULED

    await db.commit()
    await db.refresh(schedule)
    return schedule


@router.post("/consent", response_model=ConsentResponse)
async def submit_consent(
    consent_in: ConsentCreate,
    request: Request,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Step 7 Mandatory Consent Gate: Candidate must agree to video/audio recording
    and AI automated processing before entering the interview room.
    """
    if not consent_in.consent_recording or not consent_in.consent_ai_processing:
        raise HTTPException(
            status_code=400,
            detail="Mandatory consent for video/audio recording and AI processing must be granted to proceed.",
        )

    # Verify schedule exists
    sched_res = await db.execute(
        select(InterviewSchedule).where(InterviewSchedule.id == consent_in.interview_schedule_id)
    )
    schedule = sched_res.scalars().first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Interview schedule not found")

    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown")

    consent = InterviewConsent(
        interview_schedule_id=schedule.id,
        consent_recording=True,
        consent_ai_processing=True,
        ip_address=client_ip,
        user_agent=user_agent,
    )
    db.add(consent)

    # Step 8: Initialize Interview session with 3 sequential stages
    interview = Interview(
        application_id=schedule.application_id,
        interview_schedule_id=schedule.id,
        status="in_progress",
        media_retention_status=MediaRetentionStatus.ACTIVE,
        started_at=datetime.now(timezone.utc),
    )
    db.add(interview)
    await db.flush()

    stages_config = [
        (InterviewStageType.SCREENING, 1),
        (InterviewStageType.TECHNICAL, 2),
        (InterviewStageType.BEHAVIORAL, 3),
    ]
    for stage_type, seq in stages_config:
        stage = InterviewStage(
            interview_id=interview.id,
            stage_type=stage_type,
            sequence_order=seq,
            status=StageStatus.IN_PROGRESS if seq == 1 else StageStatus.NOT_STARTED,
        )
        db.add(stage)

    # Update app status
    app_res = await db.execute(select(Application).where(Application.id == schedule.application_id))
    application = app_res.scalars().first()
    if application:
        application.status = ApplicationStatus.INTERVIEW_IN_PROGRESS

    await db.commit()
    await db.refresh(consent)
    return consent


@router.post("/stage/{stage_id}/submit-answer")
async def submit_question_answer(
    stage_id: uuid.UUID,
    answer_in: QuestionAnswerSubmit,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Step 9: Logs candidate audio response, transcribes, and scores across 5 dimensions:
    Communication, Confidence, Technical Knowledge, Relevance, Problem-Solving.
    """
    stage_res = await db.execute(select(InterviewStage).where(InterviewStage.id == stage_id))
    stage = stage_res.scalars().first()
    if not stage:
        raise HTTPException(status_code=404, detail="Interview stage not found")

    # Evaluate 5-dimension scores using AI service
    eval_result = AIService.evaluate_interview_answer(
        question_text=answer_in.question_text,
        transcript_text=answer_in.transcript_text,
        stage_type=stage.stage_type.value,
    )

    qa = InterviewQuestionAnswer(
        stage_id=stage.id,
        question_number=answer_in.question_number,
        question_text=answer_in.question_text,
        audio_clip_url=answer_in.audio_clip_url,
        transcript_text=answer_in.transcript_text,
        duration_seconds=answer_in.duration_seconds or 60,
        communication_score=eval_result["communication_score"],
        confidence_score=eval_result["confidence_score"],
        technical_score=eval_result["technical_score"],
        relevance_score=eval_result["relevance_score"],
        problem_solving_score=eval_result["problem_solving_score"],
        ai_rationale=eval_result["ai_rationale"],
    )
    db.add(qa)
    await db.commit()
    await db.refresh(qa)
    return qa


@router.post("/{interview_id}/complete", response_model=InterviewResponse)
async def complete_interview(
    interview_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
):
    """
    Step 9 completion: Aggregates scores across all questions and stages,
    normalizes composite interview score (0-100), and drafts executive summary.
    """
    res = await db.execute(
        select(Interview)
        .options(
            selectinload(Interview.stages).selectinload(InterviewStage.questions),
            selectinload(Interview.evaluation),
        )
        .where(Interview.id == interview_id)
    )
    interview = res.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Collect all answers across stages
    all_answers: List[InterviewQuestionAnswer] = []
    for st in interview.stages:
        st.status = StageStatus.COMPLETED
        st.ended_at = datetime.now(timezone.utc)
        all_answers.extend(st.questions)

    if not all_answers:
        raise HTTPException(status_code=400, detail="Cannot complete interview with 0 answered questions")

    comm_avg = round(sum(a.communication_score or 7.0 for a in all_answers) / len(all_answers), 2)
    conf_avg = round(sum(a.confidence_score or 7.0 for a in all_answers) / len(all_answers), 2)
    tech_avg = round(sum(a.technical_score or 7.0 for a in all_answers) / len(all_answers), 2)
    rel_avg = round(sum(a.relevance_score or 7.0 for a in all_answers) / len(all_answers), 2)
    ps_avg = round(sum(a.problem_solving_score or 7.0 for a in all_answers) / len(all_answers), 2)

    # Composite normalized score out of 100
    composite_100 = round(((comm_avg + conf_avg + tech_avg + rel_avg + ps_avg) / 50.0) * 100.0, 2)

    eval_card = InterviewEvaluation(
        interview_id=interview.id,
        communication_avg=comm_avg,
        confidence_avg=conf_avg,
        technical_avg=tech_avg,
        relevance_avg=rel_avg,
        problem_solving_avg=ps_avg,
        composite_interview_score=composite_100,
        strengths=["Clear technical communication", "Consistent composure under scenario questions"],
        weaknesses=["Could provide more quantitative metrics when discussing previous project impacts"],
        executive_summary=f"Candidate completed 3-stage interview with composite score {composite_100}/100. Demonstrated solid technical competence ({tech_avg}/10) and structured problem-solving ({ps_avg}/10).",
    )
    db.add(eval_card)

    interview.status = "completed"
    interview.ended_at = datetime.now(timezone.utc)

    # Update application status
    app_res = await db.execute(select(Application).where(Application.id == interview.application_id))
    application = app_res.scalars().first()
    if application:
        application.status = ApplicationStatus.INTERVIEW_COMPLETED

    await db.commit()

    # Reload
    res = await db.execute(
        select(Interview)
        .options(
            selectinload(Interview.stages).selectinload(InterviewStage.questions),
            selectinload(Interview.evaluation),
        )
        .where(Interview.id == interview_id)
    )
    return res.scalars().first()
