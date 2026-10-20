import sys
import os
import uuid
import secrets
from datetime import datetime, timezone, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SyncSessionLocal
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, JobPosting, JobBoardPosting, JobStatus,
    JobBoardPlatform, BoardSyncStatus, Candidate, Application,
    ApplicationSource, ApplicationStatus, ParsedCV, CVEvaluation,
    CandidateInvitation, InterviewSchedule, InterviewConsent,
    Interview, InterviewStage, InterviewQuestionAnswer, InterviewEvaluation,
    InterviewStageType, StageStatus, MediaRetentionStatus,
    CandidateFinalRanking, DecisionVerdict, EmailNotification, NotificationType
)


def seed_demo_data():
    db = SyncSessionLocal()
    try:
        print("Checking if demo data already seeded...")
        existing_job = db.query(JobPosting).filter(JobPosting.title == "Senior Full-Stack Engineer").first()
        if existing_job:
            print("Demo data already seeded.")
            return

        print("Seeding demo HR manager...")
        hr_user = db.query(User).filter(User.email == "hr@autohr.com").first()
        if not hr_user:
            hr_user = User(
                email="hr@autohr.com",
                full_name="Sarah Jenkins (Lead HR)",
                password_hash=get_password_hash("password123"),
                role=UserRole.HR_MANAGER,
                is_active=True,
            )
            db.add(hr_user)
            db.flush()

        print("Seeding Phase 1 Job Posting & External Board distribution...")
        job = JobPosting(
            created_by=hr_user.id,
            approved_by=hr_user.id,
            title="Senior Full-Stack Engineer",
            min_experience_years=4,
            max_experience_years=8,
            min_salary=90000,
            max_salary=140000,
            currency="USD",
            target_hires=2,
            shortlist_multiplier=3.0,
            required_skills=["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
            bonus_skills=["Docker", "Redis", "Whisper", "LLM APIs"],
            ai_generated_jd_draft="Drafted by AutoHR AI Agent.",
            approved_jd_content="Approved by HR. High-performance role building AI recruitment platforms.",
            status=JobStatus.PUBLISHED,
            approved_at=datetime.now(timezone.utc),
        )
        db.add(job)
        db.flush()

        # Step 3 Board distribution
        for platform in [JobBoardPlatform.INDEED, JobBoardPlatform.ROZEE_PK]:
            board = JobBoardPosting(
                job_posting_id=job.id,
                platform=platform,
                external_job_id=f"{platform.value}-demo-101",
                post_url=f"https://boards.example.com/{platform.value}/jobs/{job.id}",
                sync_status=BoardSyncStatus.PUBLISHED,
                published_at=datetime.now(timezone.utc),
            )
            db.add(board)

        print("Seeding Phase 2 Applications, CV Parsing & Evaluations...")
        candidates_data = [
            {
                "full_name": "Alexander Vance",
                "email": "alex.vance@example.com",
                "phone": "+1-555-0199",
                "location": "San Francisco, CA",
                "cv_score": 92.5,
                "int_score": 90.0,
                "skills": ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Docker"],
            },
            {
                "full_name": "Elena Rostova",
                "email": "elena.rostova@example.com",
                "phone": "+1-555-0245",
                "location": "New York, NY",
                "cv_score": 88.0,
                "int_score": 86.5,
                "skills": ["Python", "FastAPI", "PostgreSQL", "Next.js"],
            },
            {
                "full_name": "David Chen",
                "email": "david.chen@example.com",
                "phone": "+1-555-0377",
                "location": "Austin, TX",
                "cv_score": 78.5,
                "int_score": 74.0,
                "skills": ["TypeScript", "PostgreSQL"],
            },
        ]

        apps = []
        for cand_info in candidates_data:
            cand = Candidate(
                email=cand_info["email"],
                full_name=cand_info["full_name"],
                phone=cand_info["phone"],
                location=cand_info["location"],
            )
            db.add(cand)
            db.flush()

            app = Application(
                job_posting_id=job.id,
                candidate_id=cand.id,
                source=ApplicationSource.WEB_FORM,
                resume_file_url="uploads/sample_resume.pdf",
                resume_original_filename=f"{cand_info['full_name'].replace(' ', '_')}_Resume.pdf",
                resume_mime_type="application/pdf",
                status=ApplicationStatus.INTERVIEW_COMPLETED,
            )
            db.add(app)
            db.flush()
            apps.append((app, cand_info))

            # Parsed CV
            parsed = ParsedCV(
                application_id=app.id,
                raw_text=f"Resume of {cand_info['full_name']}. Experienced in {', '.join(cand_info['skills'])}.",
                structured_profile={"skills": cand_info["skills"], "experience_years": 5},
                extracted_skills=cand_info["skills"],
                extracted_experience_years=5.5,
                highest_degree="Master of Science in Software Engineering",
                parsing_model="gpt-4o",
            )
            db.add(parsed)

            # CV Evaluation
            eval_row = CVEvaluation(
                application_id=app.id,
                overall_score=cand_info["cv_score"],
                skill_match_score=cand_info["cv_score"],
                experience_match_score=90.0,
                education_match_score=95.0,
                match_breakdown={"matched": cand_info["skills"]},
                ai_summary=f"Strong fit for {job.title} with {cand_info['cv_score']}/100 match.",
                strengths=[f"Strong competence in {cand_info['skills'][0]}"],
                concerns=[],
                is_shortlisted=True,
            )
            db.add(eval_row)

            # Magic Invitation
            token = secrets.token_urlsafe(32)
            invitation = CandidateInvitation(
                application_id=app.id,
                magic_token=token,
                expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                is_used=True,
                accepted_at=datetime.now(timezone.utc),
            )
            db.add(invitation)

            # Schedule
            schedule = InterviewSchedule(
                application_id=app.id,
                scheduled_start=datetime.now(timezone.utc) - timedelta(hours=3),
                scheduled_end=datetime.now(timezone.utc) - timedelta(hours=2),
                room_url=f"http://localhost:3000/interview-room/{app.id}",
            )
            db.add(schedule)
            db.flush()

            # Consent Gate
            consent = InterviewConsent(
                interview_schedule_id=schedule.id,
                consent_recording=True,
                consent_ai_processing=True,
                ip_address="127.0.0.1",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            )
            db.add(consent)

            # Interview session
            interview = Interview(
                application_id=app.id,
                interview_schedule_id=schedule.id,
                status="completed",
                recording_url=f"uploads/recordings/{app.id}.webm",
                recording_file_size_bytes=42000000,
                media_retention_status=MediaRetentionStatus.ACTIVE,
                started_at=datetime.now(timezone.utc) - timedelta(hours=3),
                ended_at=datetime.now(timezone.utc) - timedelta(hours=2),
            )
            db.add(interview)
            db.flush()

            # Stages
            for seq, stage_type in enumerate([InterviewStageType.SCREENING, InterviewStageType.TECHNICAL, InterviewStageType.BEHAVIORAL], 1):
                stage = InterviewStage(
                    interview_id=interview.id,
                    stage_type=stage_type,
                    sequence_order=seq,
                    status=StageStatus.COMPLETED,
                    started_at=datetime.now(timezone.utc) - timedelta(hours=3),
                    ended_at=datetime.now(timezone.utc) - timedelta(hours=2),
                )
                db.add(stage)
                db.flush()

                # Questions & Answers
                qa = InterviewQuestionAnswer(
                    stage_id=stage.id,
                    question_number=1,
                    question_text=f"Discuss your approach to {stage_type.value} challenges in scalable systems.",
                    transcript_text=f"I prioritize decoupled service design, asynchronous worker queues, and structured error handling.",
                    duration_seconds=75,
                    communication_score=8.5,
                    confidence_score=9.0,
                    technical_score=8.8 if stage_type == InterviewStageType.TECHNICAL else 8.0,
                    relevance_score=9.0,
                    problem_solving_score=8.7,
                    ai_rationale="Well structured explanation with clear design tradeoffs.",
                )
                db.add(qa)

            # Interview Evaluation
            int_eval = InterviewEvaluation(
                interview_id=interview.id,
                communication_avg=8.6,
                confidence_avg=8.8,
                technical_avg=8.7,
                relevance_avg=8.9,
                problem_solving_avg=8.6,
                composite_interview_score=cand_info["int_score"],
                strengths=["Structured thinking", "Precise API design knowledge"],
                weaknesses=["Could elaborate more on database transaction boundaries"],
                executive_summary=f"Candidate achieved {cand_info['int_score']}/100 composite interview rating.",
            )
            db.add(int_eval)

        print("Seeding Phase 4 Final Composite Rankings...")
        # Sort apps by composite score
        ranked_items = []
        for app, cand_info in apps:
            composite = round((cand_info["cv_score"] * 0.35) + (cand_info["int_score"] * 0.65), 2)
            ranked_items.append((app, cand_info, composite))
        ranked_items.sort(key=lambda x: x[2], reverse=True)

        for rank, (app, cand_info, comp_score) in enumerate(ranked_items, start=1):
            verdict = DecisionVerdict.STRONG_HIRE if rank == 1 else (DecisionVerdict.HIRE if rank == 2 else DecisionVerdict.LEAN_HIRE)
            is_retained = (rank <= job.target_hires)

            ranking = CandidateFinalRanking(
                job_posting_id=job.id,
                application_id=app.id,
                final_rank=rank,
                cv_score=cand_info["cv_score"],
                interview_score=cand_info["int_score"],
                composite_score=comp_score,
                decision_verdict=verdict,
                ai_justification=f"Rank #{rank} with composite {comp_score}/100. Excellent overall performance.",
                recording_retained=is_retained,
            )
            db.add(ranking)

        db.commit()
        print("Demo data seeded successfully with full 4 phases and 10 steps workflow!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding demo data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
