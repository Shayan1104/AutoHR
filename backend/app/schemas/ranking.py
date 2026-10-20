import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.enums import DecisionVerdict
from app.schemas.application import ApplicationResponse


class CandidateRankingResponse(BaseModel):
    id: uuid.UUID
    job_posting_id: uuid.UUID
    application_id: uuid.UUID
    final_rank: int
    cv_score: float
    interview_score: float
    composite_score: float
    decision_verdict: DecisionVerdict
    ai_justification: str
    recording_retained: bool
    hr_override_verdict: Optional[DecisionVerdict] = None
    hr_feedback_notes: Optional[str] = None
    calculated_at: datetime
    application: Optional[ApplicationResponse] = None

    class Config:
        from_attributes = True


class LeaderboardResponse(BaseModel):
    job_id: uuid.UUID
    job_title: str
    target_hires: int
    total_candidates: int
    rankings: List[CandidateRankingResponse]


class HROverrideRequest(BaseModel):
    hr_override_verdict: DecisionVerdict
    hr_feedback_notes: str = Field(..., min_length=5)
