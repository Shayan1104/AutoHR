import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    Integer, Numeric, Text, Boolean, DateTime, ForeignKey,
    UniqueConstraint, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import DecisionVerdict


class CandidateFinalRanking(Base):
    __tablename__ = "candidate_final_rankings"

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
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    final_rank: Mapped[int] = mapped_column(Integer, nullable=False)
    cv_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    interview_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    composite_score: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, index=True)

    decision_verdict: Mapped[DecisionVerdict] = mapped_column(
        SQLEnum(DecisionVerdict, name="decision_verdict_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    ai_justification: Mapped[str] = mapped_column(Text, nullable=False)
    recording_retained: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    hr_override_verdict: Mapped[Optional[DecisionVerdict]] = mapped_column(
        SQLEnum(DecisionVerdict, name="decision_verdict_override_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=True,
    )
    hr_feedback_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("job_posting_id", "final_rank", name="uq_job_rank"),
    )

    # Relationships
    job_posting = relationship("JobPosting", back_populates="final_rankings")
    application = relationship("Application", back_populates="final_ranking")
