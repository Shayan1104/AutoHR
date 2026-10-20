import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    String, Numeric, Text, Boolean, DateTime, ForeignKey,
    UniqueConstraint, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import ApplicationSource, ApplicationStatus


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    job_posting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_postings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source: Mapped[ApplicationSource] = mapped_column(
        SQLEnum(ApplicationSource, name="application_source_enum", values_callable=lambda x: [e.value for e in x]),
        default=ApplicationSource.WEB_FORM,
        nullable=False,
    )
    source_message_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    resume_file_url: Mapped[str] = mapped_column(Text, nullable=False)
    resume_original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    resume_mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[ApplicationStatus] = mapped_column(
        SQLEnum(ApplicationStatus, name="application_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=ApplicationStatus.APPLIED,
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("job_posting_id", "candidate_id", name="uq_job_candidate"),
    )

    # Relationships
    job_posting = relationship("JobPosting", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")
    parsed_cv = relationship("ParsedCV", back_populates="application", uselist=False, cascade="all, delete-orphan")
    cv_evaluation = relationship("CVEvaluation", back_populates="application", uselist=False, cascade="all, delete-orphan")
    invitation = relationship("CandidateInvitation", back_populates="application", uselist=False, cascade="all, delete-orphan")
    interview_schedule = relationship("InterviewSchedule", back_populates="application", uselist=False, cascade="all, delete-orphan")
    interview = relationship("Interview", back_populates="application", uselist=False, cascade="all, delete-orphan")
    final_ranking = relationship("CandidateFinalRanking", back_populates="application", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("EmailNotification", back_populates="application", cascade="all, delete-orphan")


class ParsedCV(Base):
    __tablename__ = "parsed_cvs"

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
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    structured_profile: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    extracted_skills: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    extracted_experience_years: Mapped[Optional[float]] = mapped_column(Numeric(4, 1), nullable=True)
    highest_degree: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    parsing_model: Mapped[str] = mapped_column(String(100), default="gpt-4o", nullable=False)
    parsed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    application = relationship("Application", back_populates="parsed_cv")


class CVEvaluation(Base):
    __tablename__ = "cv_evaluations"

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
    overall_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    skill_match_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    experience_match_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    education_match_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    
    match_breakdown: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    ai_summary: Mapped[str] = mapped_column(Text, nullable=False)
    strengths: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    concerns: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    
    is_shortlisted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    evaluated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    application = relationship("Application", back_populates="cv_evaluation")


class CandidateInvitation(Base):
    __tablename__ = "candidate_invitations"

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
    magic_token: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    application = relationship("Application", back_populates="invitation")
