import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.enums import InterviewStageType, StageStatus, MediaRetentionStatus


class ScheduleSlotCreate(BaseModel):
    application_id: uuid.UUID
    scheduled_start: datetime
    scheduled_end: datetime
    timezone: str = "UTC"


class ScheduleSlotResponse(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    scheduled_start: datetime
    scheduled_end: datetime
    timezone: str
    room_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConsentCreate(BaseModel):
    interview_schedule_id: uuid.UUID
    consent_recording: bool = Field(..., description="Must explicitly consent to video/audio recording")
    consent_ai_processing: bool = Field(..., description="Must explicitly consent to AI biometric/answer processing")


class ConsentResponse(BaseModel):
    id: uuid.UUID
    interview_schedule_id: uuid.UUID
    consent_recording: bool
    consent_ai_processing: bool
    consented_at: datetime

    class Config:
        from_attributes = True


class QuestionAnswerSubmit(BaseModel):
    question_number: int
    question_text: str
    transcript_text: str
    audio_clip_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    communication_score: Optional[float] = Field(None, ge=0, le=10)
    confidence_score: Optional[float] = Field(None, ge=0, le=10)
    technical_score: Optional[float] = Field(None, ge=0, le=10)
    relevance_score: Optional[float] = Field(None, ge=0, le=10)
    problem_solving_score: Optional[float] = Field(None, ge=0, le=10)
    ai_rationale: Optional[str] = None


class QuestionAnswerResponse(BaseModel):
    id: uuid.UUID
    question_number: int
    question_text: str
    transcript_text: str
    audio_clip_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    communication_score: Optional[float] = None
    confidence_score: Optional[float] = None
    technical_score: Optional[float] = None
    relevance_score: Optional[float] = None
    problem_solving_score: Optional[float] = None
    ai_rationale: Optional[str] = None

    class Config:
        from_attributes = True


class StageResponse(BaseModel):
    id: uuid.UUID
    stage_type: InterviewStageType
    sequence_order: int
    status: StageStatus
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    questions: List[QuestionAnswerResponse] = []

    class Config:
        from_attributes = True


class InterviewEvaluationResponse(BaseModel):
    id: uuid.UUID
    communication_avg: float
    confidence_avg: float
    technical_avg: float
    relevance_avg: float
    problem_solving_avg: float
    composite_interview_score: float
    strengths: List[str]
    weaknesses: List[str]
    executive_summary: str
    evaluated_at: datetime

    class Config:
        from_attributes = True


class InterviewResponse(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    status: str
    recording_url: Optional[str] = None
    media_retention_status: MediaRetentionStatus
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    stages: List[StageResponse] = []
    evaluation: Optional[InterviewEvaluationResponse] = None

    class Config:
        from_attributes = True
