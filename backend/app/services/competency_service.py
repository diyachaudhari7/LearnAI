import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.competency import Competency
from app.models.quiz import QuizAttempt, QuizAttemptAnswer, Question, Quiz
from app.models.user import User

def calculate_status(score: float) -> str:
    if score >= 80.0:
        return "Strong"
    elif score >= 60.0:
        return "Good"
    elif score >= 40.0:
        return "Needs Improvement"
    else:
        return "Weak"

class CompetencyService:
    @staticmethod
    def recalculate_user_competencies(db: Session, user_id: int) -> List[Competency]:
        """
        Recalculates competency scores for all skills based on user's quiz attempts.
        Aggregates question-level results per skill/topic.
        """
        # Fetch all answers given by user across all attempts
        attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
        
        # Skill stats: { skill_name: {"total": X, "correct": Y} }
        skill_stats: Dict[str, Dict[str, int]] = {}

        for attempt in attempts:
            answers = db.query(QuizAttemptAnswer).filter(QuizAttemptAnswer.attempt_id == attempt.id).all()
            for ans in answers:
                question = db.query(Question).filter(Question.id == ans.question_id).first()
                if question:
                    skill = question.topic or "General"
                    if skill not in skill_stats:
                        skill_stats[skill] = {"total": 0, "correct": 0}
                    skill_stats[skill]["total"] += 1
                    if ans.is_correct == 1:
                        skill_stats[skill]["correct"] += 1

        # If user has no quiz attempts yet, ensure standard baseline skills exist
        if not skill_stats:
            existing = db.query(Competency).filter(Competency.user_id == user_id).all()
            if not existing:
                default_skills = [
                    ("Statistics", 85.0, 10, 8),
                    ("Python", 72.0, 10, 7),
                    ("SQL", 42.0, 10, 4),
                    ("Data Analysis", 35.0, 10, 3)
                ]
                for skill_name, default_score, total, correct in default_skills:
                    status = calculate_status(default_score)
                    comp = Competency(
                        user_id=user_id,
                        skill=skill_name,
                        score=default_score,
                        status=status,
                        total_questions=total,
                        correct_questions=correct,
                        updated_at=datetime.utcnow()
                    )
                    db.add(comp)
                db.commit()
            return db.query(Competency).filter(Competency.user_id == user_id).all()

        # Update or create competencies in DB
        results = []
        for skill_name, stats in skill_stats.items():
            score = (stats["correct"] / stats["total"]) * 100.0 if stats["total"] > 0 else 0.0
            score = round(score, 1)
            status = calculate_status(score)

            comp = db.query(Competency).filter(
                Competency.user_id == user_id,
                Competency.skill == skill_name
            ).first()

            if comp:
                comp.score = score
                comp.status = status
                comp.total_questions = stats["total"]
                comp.correct_questions = stats["correct"]
                comp.updated_at = datetime.utcnow()
            else:
                comp = Competency(
                    user_id=user_id,
                    skill=skill_name,
                    score=score,
                    status=status,
                    total_questions=stats["total"],
                    correct_questions=stats["correct"],
                    updated_at=datetime.utcnow()
                )
                db.add(comp)
            results.append(comp)

        db.commit()
        return db.query(Competency).filter(Competency.user_id == user_id).all()

    @staticmethod
    def get_competency_analysis(db: Session, user_id: int) -> Dict[str, Any]:
        """
        Generates full Competency Gap Analysis with diagnosis and recommended focus.
        """
        competencies = db.query(Competency).filter(Competency.user_id == user_id).all()
        if not competencies:
            competencies = CompetencyService.recalculate_user_competencies(db, user_id)

        # Sort by score ascending (weakest first)
        sorted_comps = sorted(competencies, key=lambda c: c.score)
        
        strongest = sorted_comps[-1].skill if sorted_comps and sorted_comps[-1].score >= 60 else (sorted_comps[-1].skill if sorted_comps else None)
        weakest = sorted_comps[0].skill if sorted_comps and sorted_comps[0].score < 60 else (sorted_comps[0].skill if sorted_comps else None)

        weak_skills = [c.skill for c in sorted_comps if c.status in ("Weak", "Needs Improvement")]
        recommended_focus = [c.skill for c in sorted_comps]  # Order of priority

        # Generate insightful diagnosis text
        analysis_parts = []
        if strongest:
            analysis_parts.append(f"Your strongest demonstrated skill is {strongest}.")
        if weakest:
            analysis_parts.append(f"Your biggest competency gap is currently in {weakest}.")
        
        needs_improvement = [c.skill for c in sorted_comps if c.status == "Needs Improvement"]
        if needs_improvement:
            analysis_parts.append(f"{', '.join(needs_improvement)} also requires targeted practice before advanced topics.")
        
        if not analysis_parts:
            analysis_text = "Complete more topic quizzes to generate your real-time competency diagnostic."
        else:
            analysis_text = " ".join(analysis_parts)

        return {
            "competencies": competencies,
            "strongest_skill": strongest,
            "weakest_skill": weakest,
            "ai_analysis": analysis_text,
            "recommended_focus": recommended_focus
        }

competency_service = CompetencyService()
