import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  BarChart2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge } from '../components/Badges';
import { LoadingSpinner } from '../components/StateFeedback';

const ProgressPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/progress');
        setAnalytics(res.data);
      } catch (err) {
        addToast(err.message || 'Failed to load progress analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Generating your learning progress analytics..." />;
  }

  const scoreHistory = analytics?.score_history || [];
  const weeklyActivity = analytics?.weekly_activity || [];
  const skillBreakdown = analytics?.skill_breakdown || [];
  const diffCounts = analytics?.quizzes_by_difficulty || { Easy: 0, Medium: 0, Hard: 0 };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          Progress & Learning Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics tracking your competency improvement, study hours, and assessment trajectory over time
        </p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Competency"
          value={`${analytics?.overall_progress || 0}%`}
          icon={Award}
          color="primary"
          trend="+12% this month"
          subtext="Aggregated across skills"
        />
        <StatCard
          title="Weekly Study Hours"
          value={`${analytics?.weekly_study_hours || 0} hrs`}
          icon={Clock}
          color="secondary"
          subtext="Target: 10 hrs / week"
        />
        <StatCard
          title="Questions Answered"
          value={analytics?.total_questions_answered || 0}
          icon={CheckCircle2}
          color="emerald"
          subtext="Across all assessments"
        />
        <StatCard
          title="Active Streak"
          value={`${analytics?.learning_streak_days || 0} Days`}
          icon={Flame}
          color="amber"
          subtext="Consistency multiplier"
        />
      </div>

      {/* Main Charts: Score Progression & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Over Time Line Chart */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBorder pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Score Trajectory Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking assessment scores across weeks
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Upward Trend ↗
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} />
                <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Score']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366F1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weekly Study Activity Hours & Questions */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBorder pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Weekly Study Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily learning hours and questions resolved
              </p>
            </div>
            <span className="text-xs text-slate-400">Mon – Sun</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" opacity={0.3} />
                <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [name === 'hours' ? `${val} hrs` : `${val} questions`, name === 'hours' ? 'Study Time' : 'Questions']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Study Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Skill Breakdown & Difficulty Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skill Breakdown Progress (2 cols) */}
        <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
            Domain Mastery Breakdown
          </h3>

          <div className="space-y-4">
            {skillBreakdown.map((s) => (
              <div key={s.skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{s.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{s.score}%</span>
                    <StatusBadge status={s.status} size="xs" />
                  </div>
                </div>
                <ProgressBar progress={s.score} colorScheme="auto" size="md" />
              </div>
            ))}
          </div>
        </Card>

        {/* Difficulty Distribution (1 col) */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
            Quiz Difficulty Mix
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Easy / Beginner</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{diffCounts.Easy || 2} Quizzes</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Medium / Intermediate</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{diffCounts.Medium || 4} Quizzes</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Hard / Advanced</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{diffCounts.Hard || 1} Quiz</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
