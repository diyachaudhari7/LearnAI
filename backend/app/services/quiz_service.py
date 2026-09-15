import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.quiz import Quiz, Question, QuizAttempt, QuizAttemptAnswer
from app.models.activity import UserActivity
from app.schemas.schemas import QuizSubmitRequest, AnswerSubmission, TopicMastery, AnswerReview, QuizSubmitResult
from app.services.competency_service import competency_service, calculate_status

class QuizService:
    @staticmethod
    def evaluate_quiz_submission(db: Session, user_id: int, quiz_id: int, submission: QuizSubmitRequest) -> QuizSubmitResult:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise ValueError(f"Quiz with ID {quiz_id} not found")

        questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
        q_map = {q.id: q for q in questions}

        total_questions = len(questions)
        correct_count = 0
        answer_reviews: List[AnswerReview] = []
        topic_counts: Dict[str, Dict[str, int]] = {}

        # Parse submitted answers
        submitted_dict = {a.question_id: a.selected_option for a in submission.answers}

        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz_id,
            score=0,
            total_questions=total_questions,
            percentage=0.0,
            time_taken_seconds=submission.time_taken_seconds,
            completed_at=datetime.utcnow()
        )
        db.add(attempt)
        db.flush()  # to obtain attempt.id

        for q in questions:
            user_choice = submitted_dict.get(q.id, -1)
            is_correct = (user_choice == q.correct_answer)
            if is_correct:
                correct_count += 1

            topic_name = q.topic or "General"
            if topic_name not in topic_counts:
                topic_counts[topic_name] = {"total": 0, "correct": 0}
            topic_counts[topic_name]["total"] += 1
            if is_correct:
                topic_counts[topic_name]["correct"] += 1

            # Save answer attempt
            ans_record = QuizAttemptAnswer(
                attempt_id=attempt.id,
                question_id=q.id,
                selected_option=user_choice,
                is_correct=1 if is_correct else 0
            )
            db.add(ans_record)

            # Build review sheet
            options_list = json.loads(q.options) if isinstance(q.options, str) else q.options
            answer_reviews.append(AnswerReview(
                question_id=q.id,
                question=q.question,
                options=options_list,
                selected_option=user_choice,
                correct_answer=q.correct_answer,
                is_correct=is_correct,
                explanation=q.explanation,
                topic=topic_name
            ))

        percentage = round((correct_count / total_questions) * 100.0, 1) if total_questions > 0 else 0.0
        attempt.score = correct_count
        attempt.percentage = percentage

        # Build topic mastery list
        topic_breakdown: List[TopicMastery] = []
        weak_topics = []
        for t_name, counts in topic_counts.items():
            t_pct = round((counts["correct"] / counts["total"]) * 100.0, 1) if counts["total"] > 0 else 0.0
            t_status = calculate_status(t_pct)
            if t_pct < 60:
                weak_topics.append(t_name)
            topic_breakdown.append(TopicMastery(
                topic=t_name,
                score_percentage=t_pct,
                correct=counts["correct"],
                total=counts["total"],
                status=t_status
            ))

        attempt.topic_breakdown = json.dumps([t.dict() for t in topic_breakdown])

        # Generate contextual AI recommendation
        if percentage >= 80:
            ai_rec = f"Outstanding performance ({percentage}%)! You've mastered {quiz.title}. Ready for advanced challenges."
        elif percentage >= 60:
            if weak_topics:
                ai_rec = f"Good job ({percentage}%)! To reach mastery, practice {', '.join(weak_topics)}."
            else:
                ai_rec = f"Solid understanding ({percentage}%). Review key explanations to solidify memory."
        else:
            focus = ", ".join(weak_topics) if weak_topics else quiz.topic
            ai_rec = f"Score: {percentage}%. We recommend reviewing {focus} and following the personalized learning path."

        # Add Activity log
        activity = UserActivity(
            user_id=user_id,
            activity_type="quiz_completed",
            title=f"Completed {quiz.title}",
            description=f"Scored {percentage}% ({correct_count}/{total_questions} correct)",
            timestamp=datetime.utcnow()
        )
        db.add(activity)

        db.commit()

        # Recalculate global competencies
        competency_service.recalculate_user_competencies(db, user_id)

        return QuizSubmitResult(
            attempt_id=attempt.id,
            quiz_id=quiz.id,
            score=correct_count,
            total_questions=total_questions,
            percentage=percentage,
            time_taken_seconds=submission.time_taken_seconds,
            ai_recommendation=ai_rec,
            topic_breakdown=topic_breakdown,
            answer_reviews=answer_reviews
        )

quiz_service = QuizService()
