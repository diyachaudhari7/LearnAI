from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.learning_path import LearningPath, LearningPathWeek, LearningPathTopic
from app.models.competency import Competency
from app.models.activity import UserActivity
from app.services.ai_service import ai_service

class LearningPathService:
    @staticmethod
    def generate_personalized_path(db: Session, user_id: int) -> LearningPath:
        """
        Creates or updates a 4-week personalized learning path prioritized by competency gaps.
        """
        competencies = db.query(Competency).filter(Competency.user_id == user_id).all()
        comp_data = [{"skill": c.skill, "score": c.score, "status": c.status} for c in competencies]
        weak_skills = [c.skill for c in competencies if c.status in ("Weak", "Needs Improvement")]

        # Call AI service (with Gemini or smart fallback)
        roadmap = ai_service.generate_learning_path(comp_data, weak_skills)

        # Remove old learning paths or mark inactive
        db.query(LearningPath).filter(LearningPath.user_id == user_id).delete()

        learning_path = LearningPath(
            user_id=user_id,
            title=roadmap.get("title", "Personalized Skill Mastery Roadmap"),
            overview=roadmap.get("overview", "Targeted 4-week roadmap based on your competency gap analysis."),
            created_at=datetime.utcnow()
        )
        db.add(learning_path)
        db.flush()

        for w_data in roadmap.get("weeks", []):
            week = LearningPathWeek(
                learning_path_id=learning_path.id,
                week_number=w_data.get("week_number", 1),
                title=w_data.get("title", f"Week {w_data.get('week_number', 1)}"),
                description=w_data.get("description", ""),
                status=w_data.get("status", "Locked"),
                progress=w_data.get("progress", 0),
                estimated_hours=w_data.get("estimated_hours", 6),
                difficulty=w_data.get("difficulty", "Intermediate")
            )
            db.add(week)
            db.flush()

            for t_item in w_data.get("topics", []):
                t_name = t_item if isinstance(t_item, str) else t_item.get("name", "")
                t_completed = False if isinstance(t_item, str) else t_item.get("completed", False)
                topic = LearningPathTopic(
                    week_id=week.id,
                    name=t_name,
                    completed=t_completed
                )
                db.add(topic)

        # Log Activity
        activity = UserActivity(
            user_id=user_id,
            activity_type="learning_path_progress",
            title="Generated Personalized Learning Path",
            description=f"AI customized 4-week roadmap focusing on {', '.join(weak_skills) if weak_skills else 'Skill Mastery'}.",
            timestamp=datetime.utcnow()
        )
        db.add(activity)

        db.commit()
        return db.query(LearningPath).filter(LearningPath.id == learning_path.id).first()

    @staticmethod
    def toggle_topic_completion(db: Session, user_id: int, week_id: int, topic_id: int) -> Dict[str, Any]:
        """
        Toggles topic completion and updates week progress and unlock status.
        """
        topic = db.query(LearningPathTopic).filter(LearningPathTopic.id == topic_id, LearningPathTopic.week_id == week_id).first()
        if not topic:
            raise ValueError("Topic not found")

        week = db.query(LearningPathWeek).filter(LearningPathWeek.id == week_id).first()
        if not week:
            raise ValueError("Week not found")

        topic.completed = not topic.completed
        db.flush()

        # Recalculate week progress
        all_topics = db.query(LearningPathTopic).filter(LearningPathTopic.week_id == week_id).all()
        completed_count = sum(1 for t in all_topics if t.completed)
        total_count = len(all_topics)
        progress = int((completed_count / total_count) * 100) if total_count > 0 else 0
        week.progress = progress

        # Update week status
        if progress == 100:
            week.status = "Completed"
            # Auto-unlock next week if exists
            next_week = db.query(LearningPathWeek).filter(
                LearningPathWeek.learning_path_id == week.learning_path_id,
                LearningPathWeek.week_number == week.week_number + 1
            ).first()
            if next_week and next_week.status == "Locked":
                next_week.status = "In Progress"
        elif progress > 0:
            week.status = "In Progress"

        db.commit()
        return {
            "topic_id": topic.id,
            "completed": topic.completed,
            "week_id": week.id,
            "week_progress": week.progress,
            "week_status": week.status
        }

learning_path_service = LearningPathService()
