import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    String, Integer, Numeric, Text, DateTime, ForeignKey,
    UniqueConstraint, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import JobStatus, JobBoardPlatform, BoardSyncStatus


class JobPosting(Base):
    __tablename__ = "job_postings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    approved_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Step 1: Input requirements
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    min_experience_years: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_experience_years: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    min_salary: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
    max_salary: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    target_hires: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    shortlist_multiplier: Mapped[float] = mapped_column(Numeric(4, 2), default=3.0, nullable=False)
    required_skills: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    bonus_skills: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)

    # Step 2: AI JD Generation & Human Approval
    ai_jd_prompt_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    ai_generated_jd_draft: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    approved_jd_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[JobStatus] = mapped_column(
        SQLEnum(JobStatus, name="job_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=JobStatus.DRAFT,
        nullable=False,
    )
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

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
    creator = relationship("User", back_populates="created_jobs", foreign_keys=[created_by])
    approver = relationship("User", back_populates="approved_jobs", foreign_keys=[approved_by])
    board_postings = relationship("JobBoardPosting", back_populates="job_posting", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job_posting", cascade="all, delete-orphan")
    final_rankings = relationship("CandidateFinalRanking", back_populates="job_posting", cascade="all, delete-orphan")


class JobBoardPosting(Base):
    __tablename__ = "job_board_postings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    job_posting_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("job_postings.id", ondelete="CASCADE"),
        nullable=False,
    )
    platform: Mapped[JobBoardPlatform] = mapped_column(
        SQLEnum(JobBoardPlatform, name="job_board_platform_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    external_job_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    post_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sync_status: Mapped[BoardSyncStatus] = mapped_column(
        SQLEnum(BoardSyncStatus, name="board_sync_status_enum", values_callable=lambda x: [e.value for e in x]),
        default=BoardSyncStatus.PENDING,
        nullable=False,
    )
    response_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

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
        UniqueConstraint("job_posting_id", "platform", name="uq_job_platform"),
    )

    # Relationships
    job_posting = relationship("JobPosting", back_populates="board_postings")
