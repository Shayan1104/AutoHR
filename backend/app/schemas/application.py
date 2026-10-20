import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from app.models.enums import ApplicationSource, ApplicationStatus


class CandidateBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    location: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationCreate(BaseModel):
    job_posting_id: uuid.UUID
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    location: Optional[str] = None
    source: ApplicationSource = ApplicationSource.WEB_FORM


class ParsedCVResponse(BaseModel):
    id: uuid.UUID
    structured_profile: Dict[str, Any]
    extracted_skills: List[str]
    extracted_experience_years: Optional[float] = None
    highest_degree: Optional[str] = None
    parsed_at: datetime

    class Config:
        from_attributes = True


class CVEvaluationResponse(BaseModel):
    id: uuid.UUID
    overall_score: float
    skill_match_score: float
    experience_match_score: float
    education_match_score: float
    match_breakdown: Dict[str, Any]
    ai_summary: str
    strengths: List[str]
    concerns: List[str]
    is_shortlisted: bool
    evaluated_at: datetime

    class Config:
        from_attributes = True


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    job_posting_id: uuid.UUID
    candidate_id: uuid.UUID
    source: ApplicationSource
    resume_file_url: str
    resume_original_filename: str
    status: ApplicationStatus
    created_at: datetime
    candidate: Optional[CandidateResponse] = None
    parsed_cv: Optional[ParsedCVResponse] = None
    cv_evaluation: Optional[CVEvaluationResponse] = None

    class Config:
        from_attributes = True


class ShortlistBatchRequest(BaseModel):
    cutoff_score: Optional[float] = Field(None, ge=0, le=100)
    top_k: Optional[int] = Field(None, ge=1)
