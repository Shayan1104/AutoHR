import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.models.enums import JobStatus, JobBoardPlatform, BoardSyncStatus


class JobCreate(BaseModel):
    title: str = Field(..., example="Senior Full-Stack Engineer")
    min_experience_years: int = Field(0, ge=0)
    max_experience_years: Optional[int] = Field(None, ge=0)
    min_salary: Optional[float] = Field(None, ge=0)
    max_salary: Optional[float] = Field(None, ge=0)
    currency: str = Field("USD", min_length=3, max_length=3)
    target_hires: int = Field(1, ge=1)
    shortlist_multiplier: float = Field(3.0, ge=1.0)
    required_skills: List[str] = Field(default_factory=list)
    bonus_skills: List[str] = Field(default_factory=list)


class JobUpdate(BaseModel):
    title: Optional[str] = None
    min_experience_years: Optional[int] = None
    max_experience_years: Optional[int] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    currency: Optional[str] = None
    target_hires: Optional[int] = None
    shortlist_multiplier: Optional[float] = None
    required_skills: Optional[List[str]] = None
    bonus_skills: Optional[List[str]] = None
    approved_jd_content: Optional[str] = None
    status: Optional[JobStatus] = None


class JobGenerateJDRequest(BaseModel):
    additional_notes: Optional[str] = None
    company_overview: Optional[str] = None
    tone: str = "professional"


class JobApproveRequest(BaseModel):
    approved_jd_content: str
    publish_to_platforms: List[JobBoardPlatform] = Field(default_factory=list)


class JobBoardPostingResponse(BaseModel):
    id: uuid.UUID
    platform: JobBoardPlatform
    sync_status: BoardSyncStatus
    external_job_id: Optional[str] = None
    post_url: Optional[str] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class JobResponse(BaseModel):
    id: uuid.UUID
    created_by: uuid.UUID
    approved_by: Optional[uuid.UUID] = None
    title: str
    min_experience_years: int
    max_experience_years: Optional[int] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    currency: str
    target_hires: int
    shortlist_multiplier: float
    required_skills: List[str]
    bonus_skills: List[str]
    ai_generated_jd_draft: Optional[str] = None
    approved_jd_content: Optional[str] = None
    status: JobStatus
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    board_postings: List[JobBoardPostingResponse] = []

    class Config:
        from_attributes = True
