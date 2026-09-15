import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  Clock,
  ArrowRight,
  RefreshCw,
  Award,
  Zap,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge, DifficultyBadge } from '../components/Badges';
import { LoadingSpinner } from '../components/StateFeedback';

const LearningPathPage = () => {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [togglingTopicId, setTogglingTopicId] = useState(null);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchLearningPath = async () => {
    try {
      const res = await api.get('/learning-path');
      setPath(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch learning path', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const handleRegeneratePath = async () => {
    try {
      setRegenerating(true);
      const res = await api.post('/learning-path/generate');
      setPath(res.data);
      addToast('Personalized learning roadmap regenerated based on latest competency gaps!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to regenerate roadmap', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const handleToggleTopic = async (weekId, topicId) => {
    try {
      setTogglingTopicId(topicId);
      const res = await api.post(`/learning-path/week/${weekId}/topic/${topicId}/toggle`);
      const { completed, week_progress, week_status } = res.data;

      // Update local state smoothly
      setPath((prev) => {
        if (!prev) return prev;
        const updatedWeeks = prev.weeks.map((w) => {
          if (w.id === weekId) {
            const updatedTopics = w.topics.map((t) =>
              t.id === topicId ? { ...t, completed } : t
            );
            return {
              ...w,
              progress: week_progress,
              status: week_status,
              topics: updatedTopics,
            };
          }
          return w;
        });
        return { ...prev, weeks: updatedWeeks };
      });

      addToast(completed ? 'Milestone completed!' : 'Milestone marked incomplete', 'info');
      // Re-fetch to synchronize unlocks
      fetchLearningPath();
    } catch (err) {
      addToast('Failed to update milestone status', 'error');
    } finally {
      setTogglingTopicId(null);
    }
  };

  const handleStartWeekQuiz = (weekTitle) => {
    navigate(`/quizzes?q=${encodeURIComponent(weekTitle)}`);
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Generating your personalized learning path..." />;
  }

  const weeks = path?.weeks || [];
  const totalMilestones = weeks.reduce((acc, w) => acc + (w.topics?.length || 0), 0);
  const completedMilestones = weeks.reduce(
    (acc, w) => acc + (w.topics?.filter((t) => t.completed).length || 0),
    0
  );
  const totalProgress = Math.round(
    (completedMilestones / Math.max(totalMilestones, 1)) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Your Personalized Learning Path
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 text-xs font-bold">
              AI Tailored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly milestone roadmap generated from your verified competency gaps
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRegeneratePath}
          isLoading={regenerating}
          icon={RefreshCw}
        >
          Regenerate Roadmap
        </Button>
      </div>

      {/* Roadmap Overview & Progress Banner */}
      <Card className="p-6 sm:p-8" glass>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-darkBorder">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Curriculum Strategy
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
              {path?.title || 'Personalized Skill Recovery Roadmap'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {path?.overview || 'This 4-week tailored learning path focuses on closing your competency gaps in weak subjects.'}
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Overall Roadmap Completion</span>
              <span>{totalProgress}%</span>
            </div>
            <ProgressBar progress={totalProgress} colorScheme="primary" size="md" />
            <p className="text-[11px] text-slate-400 text-right">
              {completedMilestones} of {totalMilestones} topics completed
            </p>
          </div>
        </div>
      </Card>

      {/* 4 Weekly Milestone Cards */}
      <div className="space-y-6">
        {weeks.map((week, idx) => {
          const isCompleted = week.status === 'Completed';
          const isInProgress = week.status === 'In Progress';
          const isLocked = week.status === 'Locked';

          return (
            <Card
              key={week.id}
              className={`p-6 sm:p-8 transition-all relative overflow-hidden ${
                isInProgress
                  ? 'border-primary-400 dark:border-primary-600 shadow-md ring-1 ring-primary-400/40'
                  : isCompleted
                  ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'opacity-70 dark:opacity-60 bg-slate-50 dark:bg-darkCard'
              }`}
            >
              {/* Top Week Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-darkBorder">
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      : isInProgress
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isLocked ? <Lock className="w-5 h-5" /> : `W${week.week_number}`}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                        {week.title}
                      </h3>
                      <StatusBadge status={week.status} size="xs" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {week.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{week.estimated_hours}h</span>
                  </div>
                  <DifficultyBadge difficulty={week.difficulty} size="xs" />
                </div>
              </div>

              {/* Progress & Milestone Topics Checklist */}
              <div className="pt-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Week Progress</span>
                    <span>{week.progress}%</span>
                  </div>
                  <ProgressBar progress={week.progress} colorScheme="auto" size="sm" />
                </div>

                {/* Topics Checkbox List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {week.topics?.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      disabled={isLocked || togglingTopicId === topic.id}
                      onClick={() => handleToggleTopic(week.id, topic.id)}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium transition-all ${
                        topic.completed
                          ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                          : isLocked
                          ? 'border-slate-200 dark:border-darkBorder text-slate-400 cursor-not-allowed'
                          : 'border-slate-200 dark:border-darkBorder bg-white dark:bg-darkCard hover:border-primary-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                            topic.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-darkCard'
                          }`}
                        >
                          {topic.completed && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`truncate ${topic.completed ? 'line-through opacity-80' : ''}`}>
                          {topic.name}
                        </span>
                      </div>

                      {topic.completed ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400">
                          Pending
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-darkBorder">
                  <span className="text-[11px] text-slate-400">
                    {isCompleted
                      ? '✓ All weekly objectives fulfilled'
                      : isInProgress
                      ? 'Mark milestones complete to unlock the next week'
                      : '🔒 Complete previous week to unlock'}
                  </span>

                  {!isLocked && (
                    <Button
                      onClick={() => handleStartWeekQuiz(week.title)}
                      variant={isCompleted ? 'outline' : 'primary'}
                      size="sm"
                      icon={PlayCircle}
                    >
                      {isCompleted ? 'Review Knowledge' : 'Practice Skills'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathPage;
