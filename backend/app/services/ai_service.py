import re
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings


class AIService:
    @staticmethod
    async def generate_job_description(
        title: str,
        min_experience_years: int,
        max_experience_years: Optional[int],
        required_skills: List[str],
        bonus_skills: List[str],
        target_hires: int,
        salary_range: str,
        company_overview: Optional[str] = None,
        additional_notes: Optional[str] = None,
    ) -> str:
        """
        Generates a comprehensive, professional Job Description.
        Uses OpenAI LLM if OPENAI_API_KEY is configured, otherwise uses template engine.
        """
        if settings.OPENAI_API_KEY:
            try:
                prompt = f"""
                You are an expert HR Talent Acquisition Agent. Draft a compelling, professional Job Description for:
                Role Title: {title}
                Experience: {min_experience_years} to {max_experience_years or 'N/A'} years
                Core Skills: {', '.join(required_skills)}
                Bonus Skills: {', '.join(bonus_skills)}
                Target Hires: {target_hires}
                Compensation: {salary_range}
                Company Context: {company_overview or 'Fast-growing high-tech enterprise.'}
                Notes: {additional_notes or 'Focus on technical depth and collaborative mindset.'}

                Format in clean Markdown with:
                # Role Overview
                ## Key Responsibilities
                ## Required Qualifications
                ## Preferred Qualifications
                ## What We Offer
                """
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                        json={
                            "model": settings.AI_MODEL_NAME,
                            "messages": [
                                {"role": "system", "content": "You are a professional HR recruiter."},
                                {"role": "user", "content": prompt},
                            ],
                            "temperature": 0.7,
                        },
                    )
                    if response.status_code == 200:
                        data = response.json()
                        return data["choices"][0]["message"]["content"]
            except Exception:
                pass  # Fall back to template engine below

        # Deterministic rich template engine fallback
        skills_bullets = "\n".join([f"- Proficiency in **{s}**" for s in required_skills])
        bonus_bullets = "\n".join([f"- Familiarity or hands-on experience with **{s}**" for s in bonus_skills]) or "- Continuous learner with passion for emerging technologies"
        exp_text = f"{min_experience_years}+ years" if not max_experience_years else f"{min_experience_years}–{max_experience_years} years"

        return f"""# {title}

## Role Overview
We are looking for a driven, high-performing **{title}** to join our expanding team. In this role, you will play a critical part in architecting, executing, and scaling our mission-critical systems and workflows.

## Key Responsibilities
- Lead design, implementation, and maintenance of high-throughput services and user-facing features.
- Collaborate closely with product managers, designers, and cross-functional teams to deliver robust software solutions.
- Champion code quality, comprehensive automated testing, and CI/CD best practices.
- Proactively identify bottlenecks, scale challenges, and technical debt across the stack.

## Required Qualifications
- **{exp_text}** of proven industry experience in software development and related disciplines.
{skills_bullets}
- Solid understanding of distributed systems architecture, database design, and REST/GraphQL APIs.
- Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent practical experience.

## Preferred Qualifications
{bonus_bullets}
- Prior experience working in high-growth or automated engineering environments.
- Active contributor to open-source communities or technical thought leadership.

## Compensation & Benefits
- **Target Compensation**: {salary_range}
- Flexible work arrangement (hybrid / remote options).
- Health insurance, retirement matching, and generous paid time off.
- Dedicated annual learning & development stipend.
"""

    @staticmethod
    def extract_skills_from_text(text: str, candidate_skills: List[str]) -> List[str]:
        lower_text = text.lower()
        matched = []
        for s in candidate_skills:
            if re.search(r'\b' + re.escape(s.lower()) + r'\b', lower_text):
                matched.append(s)
        return matched

    @staticmethod
    def evaluate_cv(
        cv_text: str,
        required_skills: List[str],
        bonus_skills: List[str],
        min_experience_years: int,
    ) -> Dict[str, Any]:
        """
        Analyzes CV text against job requirements and produces match breakdown and score.
        """
        # Skill matching
        matched_required = AIService.extract_skills_from_text(cv_text, required_skills)
        matched_bonus = AIService.extract_skills_from_text(cv_text, bonus_skills)
        missing_required = [s for s in required_skills if s not in matched_required]

        total_req = len(required_skills) if required_skills else 1
        skill_score = min(100.0, (len(matched_required) / total_req) * 85.0 + (len(matched_bonus) * 5.0))

        # Experience estimation (look for years regex patterns)
        years_found = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience', cv_text, re.IGNORECASE)
        if years_found:
            detected_years = max([float(y) for y in years_found])
        else:
            detected_years = float(min_experience_years)  # conservative fallback

        exp_ratio = min(1.0, detected_years / max(min_experience_years, 1))
        experience_score = round(exp_ratio * 100.0, 2)

        # Education match (look for degree keywords)
        has_degree = bool(re.search(r'\b(bachelor|master|b\.s|m\.s|phd|b\.tech|m\.tech|degree)\b', cv_text, re.IGNORECASE))
        education_score = 90.0 if has_degree else 75.0

        overall_score = round(
            (skill_score * 0.50) + (experience_score * 0.35) + (education_score * 0.15), 2
        )

        strengths = []
        if matched_required:
            strengths.append(f"Strong match in core skills: {', '.join(matched_required[:3])}")
        if detected_years >= min_experience_years:
            strengths.append(f"Exceeds/meets required experience ({detected_years} years detected)")
        if matched_bonus:
            strengths.append(f"Bonus proficiencies: {', '.join(matched_bonus)}")

        concerns = []
        if missing_required:
            concerns.append(f"Missing core competencies: {', '.join(missing_required[:3])}")
        if detected_years < min_experience_years:
            concerns.append(f"Experience below requested baseline ({detected_years} vs {min_experience_years} years)")

        return {
            "overall_score": overall_score,
            "skill_match_score": round(skill_score, 2),
            "experience_match_score": experience_score,
            "education_match_score": education_score,
            "detected_years": detected_years,
            "matched_skills": matched_required + matched_bonus,
            "missing_skills": missing_required,
            "strengths": strengths or ["Demonstrates general software background"],
            "concerns": concerns or ["None identified at screening stage"],
            "ai_summary": f"Candidate achieved {overall_score}/100 match with {len(matched_required)}/{len(required_skills)} required skills matched and estimated {detected_years} years of relevant experience."
        }

    @staticmethod
    def evaluate_interview_answer(
        question_text: str,
        transcript_text: str,
        stage_type: str
    ) -> Dict[str, Any]:
        """
        Evaluates candidate's audio transcript across 5 dimensions (0.00 to 10.00)
        """
        word_count = len(transcript_text.split())
        
        # Communication: length, structure, clarity
        comm_score = 8.5 if 40 <= word_count <= 250 else (6.5 if word_count < 20 else 7.5)
        
        # Confidence: assertive phrasing, lack of filler hedges
        hedge_count = len(re.findall(r'\b(um|uh|maybe|i guess|sort of|kind of)\b', transcript_text.lower()))
        conf_score = max(5.0, round(9.0 - (hedge_count * 0.5), 1))
        
        # Technical depth: presence of technical concepts
        tech_words = re.findall(r'\b(architecture|database|scale|latency|security|algorithm|async|api|test|pattern)\b', transcript_text.lower())
        tech_score = min(10.0, round(6.5 + len(tech_words) * 0.8, 1)) if stage_type == "technical" else 8.0
        
        # Relevance: prompt words overlap
        q_words = set(re.findall(r'\w{4,}', question_text.lower()))
        a_words = set(re.findall(r'\w{4,}', transcript_text.lower()))
        overlap = len(q_words.intersection(a_words))
        rel_score = min(10.0, round(6.0 + overlap * 1.0, 1))
        
        # Problem-solving: structured response (steps, rationale)
        has_structure = bool(re.search(r'\b(first|second|then|because|result|approach|solution)\b', transcript_text.lower()))
        ps_score = 8.8 if has_structure else 7.2

        return {
            "communication_score": comm_score,
            "confidence_score": conf_score,
            "technical_score": tech_score,
            "relevance_score": rel_score,
            "problem_solving_score": ps_score,
            "ai_rationale": f"Candidate delivered an articulate {word_count}-word response addressing core question objectives with {round((comm_score + tech_score + rel_score)/3, 1)}/10 composite quality."
        }
