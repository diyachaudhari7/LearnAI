import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckSquare,
  Award,
  Flame,
  UploadCloud,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  Milestone,
  Target,
  Sparkles,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge } from '../components/Badges';
import { LoadingSpinner, EmptyState } from '../components/StateFeedback';

const DashboardPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading your learning dashboard..." />;
  }

  const stats = data?.stats || {
    total_documents: 0,
    quizzes_completed: 0,
    average_score: 0,
    learning_streak_days: 0,
    skills_mastered: 0,
    flashcards_reviewed: 0,
  };

  const competencies = data?.competencies || [];
  const aiRec = data?.ai_recommendation || {
    title: 'Focus Area',
    message: 'Start by uploading your first study material to analyze skill gaps.',
    action_link: '/upload',
    action_label: 'Upload Material',
  };
  const recentActivity = data?.recent_activity || [];
  const activePath = data?.active_learning_path;

  // Radar chart data structure
  const radarData = competencies.map((c) => ({
    subject: c.skill,
    score: c.score,
    fullMark: 100,
  }));

  const getBarColor = (score) => {
    if (score >= 80) return '#10B981'; // Emerald
    if (score >= 60) return '#6366F1'; // Indigo
    if (score >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Rose
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header Greeting & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Good morning, {user?.name?.split(' ')[0] || 'Learner'} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continue your learning journey and improve your weakest skills.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={RefreshCw}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/upload')}
            icon={UploadCloud}
          >
            Upload Material
          </Button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Documents"
          value={stats.total_documents}
          icon={FileText}
          color="primary"
          subtext="PDFs uploaded & analyzed"
        />
        <StatCard
          title="Quizzes Completed"
          value={stats.quizzes_completed}
          icon={CheckSquare}
          color="secondary"
          subtext="Total assessments taken"
        />
        <StatCard
          title="Average Score"
          value={`${stats.average_score}%`}
          icon={Award}
          color="emerald"
          trend="+8% this week"
          subtext="Across all skill topics"
        />
        <StatCard
          title="Learning Streak"
          value={`${stats.learning_streak_days} Days`}
          icon={Flame}
          color="amber"
          subtext="Consecutive days active"
        />
      </div>

      {/* AI Recommendation Alert Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary-600 via-secondary-600 to-indigo-700 text-white shadow-lg shadow-primary-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-amber-200">
              AI Skill Recommendation
            </span>
            <h3 className="text-base sm:text-lg font-bold mt-1 leading-snug">{aiRec.message}</h3>
          </div>
        </div>

        <Link to={aiRec.action_link || '/learning-path'} className="w-full md:w-auto">
          <button className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-primary-700 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
            <span>{aiRec.action_label || 'View Learning Path'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Main Grid: Competency Overview & Active Learning Path */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Competency Gap Radar & Bars */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-darkBorder">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Competency Gap Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculated dynamically from your actual quiz scores
                </p>
              </div>
              <Link to="/competency">
                <Button variant="ghost" size="sm" icon={ChevronRight}>
                  Full Analysis
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radar Chart */}
              <div className="h-64 flex items-center justify-center">
                {radarData.length >= 3 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" />
                      <Radar
                        name="Competency"
                        dataKey="score"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center p-6 text-xs text-slate-400">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Complete quizzes in 3+ skills to view radar chart
                  </div>
                )}
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {competencies.map((c) => (
                  <div key={c.skill} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{c.skill}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 dark:text-slate-400">{c.score}%</span>
                        <StatusBadge status={c.status} size="xs" />
                      </div>
                    </div>
                    <ProgressBar progress={c.score} colorScheme="auto" size="md" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              onClick={() => navigate('/upload')}
              className="p-4 flex items-center gap-3.5 cursor-pointer hover:border-primary-400 transition-all"
              hover
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Upload New PDF</h4>
                <p className="text-[11px] text-slate-500">Extract & analyze</p>
              </div>
            </Card>

            <Card
              onClick={() => navigate('/quizzes')}
              className="p-4 flex items-center gap-3.5 cursor-pointer hover:border-secondary-400 transition-all"
              hover
            >
              <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-950/60 text-secondary-600 dark:text-secondary-400 flex items-center justify-center flex-shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Take a Quiz</h4>
                <p className="text-[11px] text-slate-500">Test skill mastery</p>
              </div>
            </Card>

            <Card
              onClick={() => navigate('/flashcards')}
              className="p-4 flex items-center gap-3.5 cursor-pointer hover:border-cyan-400 transition-all"
              hover
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyanAccent-600 dark:text-cyanAccent-400 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">3D Flashcards</h4>
                <p className="text-[11px] text-slate-500">Spaced repetition</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right 1 Col: Active Learning Path & Recent Activity */}
        <div className="space-y-6">
          {/* Active Learning Path Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-darkBorder">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Personalized Roadmap
                </h3>
                <p className="text-[11px] text-slate-500">4-Week Gap Bridge</p>
              </div>
              <Link to="/learning-path">
                <span className="text-xs font-semibold text-primary-600 hover:underline">View All</span>
              </Link>
            </div>

            {activePath && activePath.weeks?.length > 0 ? (
              <div className="space-y-3">
                {activePath.weeks.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    onClick={() => navigate('/learning-path')}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder hover:border-primary-300 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{w.title}</span>
                      <StatusBadge status={w.status} size="xs" />
                    </div>
                    <ProgressBar progress={w.progress} colorScheme="auto" size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Milestone}
                title="No Learning Path"
                description="Generate a personalized roadmap to guide your study."
                actionLabel="Generate Path"
                onAction={() => navigate('/learning-path')}
              />
            )}
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading mb-4 pb-3 border-b border-slate-100 dark:border-darkBorder">
              Recent Activity
            </h3>

            {recentActivity.length > 0 ? (
              <div className="space-y-3.5">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{act.title}</p>
                      {act.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent activity logged yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
