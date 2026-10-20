import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_db
from app.models.user import User
from app.models.job import JobPosting, JobBoardPosting
from app.models.enums import JobStatus, BoardSyncStatus
from app.schemas.job import (
    JobCreate, JobUpdate, JobResponse, JobGenerateJDRequest, JobApproveRequest
)
from app.services.ai_service import AIService
from app.api.deps import get_current_hr_user

router = APIRouter(prefix="/jobs", tags=["Phase 1: Job Postings & Distribution"])


@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobCreate,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_hr_user),
):
    job = JobPosting(
        created_by=current_user.id,
        title=job_in.title,
        min_experience_years=job_in.min_experience_years,
        max_experience_years=job_in.max_experience_years,
        min_salary=job_in.min_salary,
        max_salary=job_in.max_salary,
        currency=job_in.currency,
        target_hires=job_in.target_hires,
        shortlist_multiplier=job_in.shortlist_multiplier,
        required_skills=job_in.required_skills,
        bonus_skills=job_in.bonus_skills,
        status=JobStatus.DRAFT,
    )
    db.add(job)
    await db.commit()
    
    # Reload with board postings
    result = await db.execute(
        select(JobPosting)
        .options(selectinload(JobPosting.board_postings))
        .where(JobPosting.id == job.id)
    )
    return result.scalars().first()


@router.get("/", response_model=List[JobResponse])
async def list_jobs(
    status_filter: Optional[JobStatus] = None,
    db: AsyncSession = Depends(get_async_db),
):
    query = select(JobPosting).options(selectinload(JobPosting.board_postings)).order_by(JobPosting.created_at.desc())
    if status_filter:
        query = query.where(JobPosting.status == status_filter)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_db),
):
    result = await db.execute(
        select(JobPosting)
        .options(selectinload(JobPosting.board_postings))
        .where(JobPosting.id == job_id)
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return job


@router.post("/{job_id}/generate-jd", response_model=JobResponse)
async def generate_jd_draft(
    job_id: uuid.UUID,
    req: JobGenerateJDRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_hr_user),
):
    result = await db.execute(select(JobPosting).where(JobPosting.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")

    salary_text = f"{job.currency} {job.min_salary:,.0f} - {job.max_salary:,.0f}" if job.min_salary and job.max_salary else "Competitive"

    draft = await AIService.generate_job_description(
        title=job.title,
        min_experience_years=job.min_experience_years,
        max_experience_years=job.max_experience_years,
        required_skills=job.required_skills,
        bonus_skills=job.bonus_skills,
        target_hires=job.target_hires,
        salary_range=salary_text,
        company_overview=req.company_overview,
        additional_notes=req.additional_notes,
    )

    job.ai_generated_jd_draft = draft
    job.status = JobStatus.PENDING_APPROVAL
    await db.commit()

    # Reload with board postings
    result = await db.execute(
        select(JobPosting)
        .options(selectinload(JobPosting.board_postings))
        .where(JobPosting.id == job.id)
    )
    return result.scalars().first()


@router.post("/{job_id}/approve", response_model=JobResponse)
async def approve_and_publish_job(
    job_id: uuid.UUID,
    req: JobApproveRequest,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_hr_user),
):
    result = await db.execute(
        select(JobPosting)
        .options(selectinload(JobPosting.board_postings))
        .where(JobPosting.id == job_id)
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")

    job.approved_by = current_user.id
    job.approved_jd_content = req.approved_jd_content
    job.status = JobStatus.PUBLISHED if req.publish_to_platforms else JobStatus.APPROVED
    job.approved_at = datetime.now(timezone.utc)

    # Step 3: Multi-platform syndication adapters
    for platform in req.publish_to_platforms:
        # Check if posting exists
        existing = next((b for b in job.board_postings if b.platform == platform), None)
        if not existing:
            board_entry = JobBoardPosting(
                job_posting_id=job.id,
                platform=platform,
                external_job_id=f"{platform.value}-{uuid.uuid4().hex[:8]}",
                post_url=f"https://boards.example.com/{platform.value}/jobs/{job.id}",
                sync_status=BoardSyncStatus.PUBLISHED,
                published_at=datetime.now(timezone.utc),
            )
            db.add(board_entry)

    await db.commit()

    # Reload
    result = await db.execute(
        select(JobPosting)
        .options(selectinload(JobPosting.board_postings))
        .where(JobPosting.id == job.id)
    )
    return result.scalars().first()
