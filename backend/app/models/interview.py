import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String, Integer, BigInteger, Numeric, Text, Boolean, DateTime,
    ForeignKey, UniqueConstraint, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import InterviewStageType, StageStatus, MediaRetentionStatus


class InterviewSchedule(Base):
    __tablename__ = "interview_schedules"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    scheduled_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), default="UTC", nullable=False)
    room_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_rescheduled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    application = relationship("Application", back_populates="interview_schedule")
    consent = relationship("InterviewConsent", back_populates="schedule", uselist=False, cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="schedule")


class InterviewConsent(Base):
    __tablename__ = "interview_consents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    interview_schedule_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interview_schedules.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    consent_recording: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    consent_ai_processing: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    user_agent: Mapped[str] = mapped_column(Text, nullable=False)
    consented_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    schedule = relationship("InterviewSchedule", back_populates="consent")


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    interview_schedule_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interview_schedules.id", ondelete="RESTRICT"),
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
    recording_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recording_file_size_bytes: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    media_retention_status: Mapped[MediaRetentionStatus] = mapped_column(
        SQLEnum(MediaRetentionStatus, name="media_retention_enum", values_callable=lambda x: [e.value for e in x]),
        default=MediaRetentionStatus.ACTIVE,
        nullable=False,
    )
    media_purged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    application = relationship("Application", back_populates="interview")
    schedule = relationship("InterviewSchedule", back_populates="interviews")
    stages = relationship("InterviewStage", back_populates="interview", cascade="all, delete-orphan", order_by="InterviewStage.sequence_order")
    evaluation = relationship("InterviewEvaluation", back_populates="interview", uselist=False, cascade="all, delete-orphan")


class InterviewStage(Base):
    __tablename__ = "interview_stages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    interview_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interviews.id", ondelete="CASCADE"),
        nullable=False,
    )
    stage_type: Mapped[InterviewStageType] = mapped_column(
        SQLEnum(InterviewStageType, name="interview_stage_type_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[StageStatus] = mapped_column(
        SQLEnum(StageStatus, name="stage_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=StageStatus.NOT_STARTED,
        nullable=False,
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("interview_id", "sequence_order", name="uq_interview_stage_order"),
        UniqueConstraint("interview_id", "stage_type", name="uq_interview_stage_type"),
    )

    # Relationships
    interview = relationship("Interview", back_populates="stages")
    questions = relationship("InterviewQuestionAnswer", back_populates="stage", cascade="all, delete-orphan", order_by="InterviewQuestionAnswer.question_number")


class InterviewQuestionAnswer(Base):
    __tablename__ = "interview_questions_answers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    stage_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interview_stages.id", ondelete="CASCADE"),
        nullable=False,
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    audio_clip_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    transcript_text: Mapped[str] = mapped_column(Text, nullable=False)
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # 5 Dimensions (0.00 to 10.00)
    communication_score: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    confidence_score: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    technical_score: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    relevance_score: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)
    problem_solving_score: Mapped[Optional[float]] = mapped_column(Numeric(4, 2), nullable=True)

    ai_rationale: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("stage_id", "question_number", name="uq_stage_question_number"),
    )

    # Relationships
    stage = relationship("InterviewStage", back_populates="questions")


class InterviewEvaluation(Base):
    __tablename__ = "interview_evaluations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    interview_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interviews.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    communication_avg: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    confidence_avg: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    technical_avg: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    relevance_avg: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    problem_solving_avg: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    composite_interview_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)

    strengths: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    weaknesses: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    executive_summary: Mapped[str] = mapped_column(Text, nullable=False)
    evaluated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    interview = relationship("Interview", back_populates="evaluation")
