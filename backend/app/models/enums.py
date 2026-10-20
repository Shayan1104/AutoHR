import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    HR_MANAGER = "hr_manager"
    INTERVIEWER = "interviewer"


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    PUBLISHED = "published"
    PAUSED = "paused"
    CLOSED = "closed"


class JobBoardPlatform(str, enum.Enum):
    INDEED = "indeed"
    ROZEE_PK = "rozee_pk"
    LINKEDIN = "linkedin"
    CUSTOM_CAREER_PAGE = "custom_career_page"


class BoardSyncStatus(str, enum.Enum):
    PENDING = "pending"
    PUBLISHED = "published"
    FAILED = "failed"
    EXPIRED = "expired"


class ApplicationSource(str, enum.Enum):
    EMAIL_INBOUND = "email_inbound"
    WEB_FORM = "web_form"
    INDEED = "indeed"
    ROZEE_PK = "rozee_pk"
    MANUAL_UPLOAD = "manual_upload"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    PARSING_CV = "parsing_cv"
    SCREENED = "screened"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    INTERVIEW_INVITED = "interview_invited"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEW_IN_PROGRESS = "interview_in_progress"
    INTERVIEW_COMPLETED = "interview_completed"
    FINAL_REVIEW = "final_review"
    HIRED = "hired"
    ARCHIVED = "archived"


class InterviewStageType(str, enum.Enum):
    SCREENING = "screening"
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"


class StageStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"


class MediaRetentionStatus(str, enum.Enum):
    ACTIVE = "active"
    MARKED_FOR_DELETION = "marked_for_deletion"
    PURGED = "purged"


class DecisionVerdict(str, enum.Enum):
    STRONG_HIRE = "strong_hire"
    HIRE = "hire"
    LEAN_HIRE = "lean_hire"
    NO_HIRE = "no_hire"


class NotificationType(str, enum.Enum):
    REJECTION = "rejection"
    INTERVIEW_INVITE = "interview_invite"
    INTERVIEW_REMINDER = "interview_reminder"
    HR_STATUS_UPDATE = "hr_status_update"
