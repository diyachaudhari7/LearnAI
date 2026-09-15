import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  Milestone,
  RefreshCw,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart3
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
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge } from '../components/Badges';
import { LoadingSpinner } from '../components/StateFeedback';

const CompetencyPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [generatingPath, setGeneratingPath] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchCompetency = async () => {
    try {
      const res = await api.get('/competency');
      setData(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load competency analysis', 'error');
    } finally {
      setLoading(false);
      setRecalculating(false);
    }
  };

  useEffect(() => {
    fetchCompetency();
  }, []);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const res = await api.post('/competency/recalculate');
      setData(res.data);
      addToast('Competency scores recalculated from quiz history!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to recalculate', 'error');
    } finally {
      setRecalculating(false);
    }
  };

  const handleGenerateLearningPath = async () => {
    try {
      setGeneratingPath(true);
      const res = await api.post('/learning-path/generate');
      addToast('Personalized Learning Path created from your skill gaps!', 'success');
      navigate('/learning-path');
    } catch (err) {
      addToast(err.message || 'Failed to generate learning path', 'error');
    } finally {
      setGeneratingPath(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Performing Competency Gap Analysis..." />;
  }

  const competencies = data?.competencies || [];
  const strongest = data?.strongest_skill;
  const weakest = data?.weakest_skill;
  const aiAnalysis = data?.ai_analysis || 'Complete assessments to generate detailed diagnostic recommendations.';
  const recommendedFocus = data?.recommended_focus || [];

  const radarData = competencies.map((c) => ({
    subject: c.skill,
    score: c.score,
    fullMark: 100,
  }));

  const barData = competencies.map((c) => ({
    name: c.skill,
    score: c.score,
    status: c.status,
  }));

  const getStatusColor = (score) => {
    if (score >= 80) return '#10B981'; // Emerald (Strong)
    if (score >= 60) return '#6366F1'; // Indigo (Good)
    if (score >= 40) return '#F59E0B'; // Amber (Needs Improvement)
    return '#EF4444'; // Rose (Weak)
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Competency Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time evaluation of your demonstrated skills, knowledge gaps, and focus priorities
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecalculate}
            isLoading={recalculating}
            icon={RefreshCw}
          >
            Recalculate Scores
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateLearningPath}
            isLoading={generatingPath}
            icon={Milestone}
          >
            Generate Learning Path
          </Button>
        </div>
      </div>

      {/* AI Diagnostic Commentary Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary-50/70 via-secondary-50/40 to-cyan-50/40 dark:from-primary-950/40 dark:via-darkCard dark:to-cyan-950/30 border-primary-200 dark:border-primary-900 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase">
              <Zap className="w-3.5 h-3.5 text-primary-600" />
              <span>AI Diagnostic Engine</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
              {aiAnalysis}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scores are calculated objectively from question-level results across your quiz attempts.
            </p>
          </div>

          <Button
            onClick={handleGenerateLearningPath}
            variant="primary"
            size="md"
            isLoading={generatingPath}
            icon={Milestone}
            className="flex-shrink-0 shadow-lg shadow-primary-500/25"
          >
            Bridge Gaps with Roadmap
          </Button>
        </div>
      </Card>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Map */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
            Multi-Skill Competency Radar
          </h3>
          <div className="h-72 flex items-center justify-center">
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#CBD5E1" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" />
                  <Radar
                    name="Competency"
                    dataKey="score"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Complete 3+ skill quizzes to visualize radar profile.</p>
            )}
          </div>
        </Card>

        {/* Bar Comparison */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
            Skill Score Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{ fontSize: 11, fontWeight: 600 }} width={100} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Score']}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Skill Assessment Table */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-darkBorder pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Skill Assessment & Gap Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Graded against standardized threshold benchmarks
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 80-100% Strong</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> 60-79% Good</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 40-59% Needs Impr.</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 0-39% Weak</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-darkBorder text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-2">Skill / Domain</th>
                <th className="pb-3 px-2">Score</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">Questions Evaluated</th>
                <th className="pb-3 px-2 text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-darkBorder">
              {competencies.map((comp) => {
                const isWeakest = comp.skill === weakest;
                const isStrongest = comp.skill === strongest;

                return (
                  <tr key={comp.skill} className="hover:bg-slate-50/60 dark:hover:bg-darkCardHover transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-900 dark:text-white text-sm">
                      {comp.skill}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3 max-w-[140px]">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{comp.score}%</span>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${comp.score}%`,
                              backgroundColor: getStatusColor(comp.score),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <StatusBadge status={comp.status} size="sm" />
                    </td>
                    <td className="py-4 px-2 text-slate-600 dark:text-slate-400">
                      {comp.correct_questions} of {comp.total_questions} correct
                    </td>
                    <td className="py-4 px-2 text-right">
                      {isWeakest ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-900">
                          Priority #1 (Immediate Gap)
                        </span>
                      ) : comp.status === 'Needs Improvement' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px]">
                          Priority #2
                        </span>
                      ) : isStrongest ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          Mastered Anchor
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommended Priority Focus */}
      {recommendedFocus.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 font-heading">
            AI Recommended Learning Priority Order
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedFocus.map((skillName, idx) => (
              <div
                key={skillName}
                className="p-4 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{skillName}</h4>
                  <p className="text-[11px] text-slate-500">
                    {idx === 0 ? 'Primary Gap Bridge' : idx === 1 ? 'Reinforce Core' : 'Advanced Application'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompetencyPage;
