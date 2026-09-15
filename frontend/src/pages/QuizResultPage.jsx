import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Milestone,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Printer,
  FileCheck2,
  BarChart3,
  Filter,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge, TopicBadge } from '../components/Badges';

const QuizResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [filterReview, setFilterReview] = useState('all'); // 'all', 'correct', 'incorrect', 'unattempted'

  const result = location.state?.resultData;
  const quizTitle = location.state?.quizTitle || 'Assessment Examination';

  if (!result) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm text-slate-500">No active examination session results found.</p>
        <Link to="/quizzes">
          <Button variant="primary" size="sm">
            View All Examinations
          </Button>
        </Link>
      </div>
    );
  }

  const {
    score,
    total_questions,
    percentage,
    time_taken_seconds,
    ai_recommendation,
    topic_breakdown,
    answer_reviews,
  } = result;

  const attemptedCount = answer_reviews?.filter(a => a.selected_option !== -1).length || 0;
  const unattemptedCount = total_questions - attemptedCount;
  const incorrectCount = attemptedCount - score;
  const avgSecondsPerQ = total_questions > 0 ? Math.round(time_taken_seconds / total_questions) : 0;

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', label: 'Outstanding Mastery', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' };
    if (pct >= 80) return { grade: 'A', label: 'Excellent Competency', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' };
    if (pct >= 70) return { grade: 'B', label: 'Good Proficiency', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-950/60 border-primary-300 dark:border-primary-800' };
    if (pct >= 55) return { grade: 'C', label: 'Average Understanding', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' };
    return { grade: 'F', label: 'Revision Required', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800' };
  };

  const gradeInfo = getGrade(percentage);

  // Filter answer reviews
  const filteredReviews = (answer_reviews || []).filter((ans) => {
    if (filterReview === 'correct') return ans.is_correct;
    if (filterReview === 'incorrect') return !ans.is_correct && ans.selected_option !== -1;
    if (filterReview === 'unattempted') return ans.selected_option === -1;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Official Examination Report Card Header */}
      <Card className="p-8 sm:p-10 text-center relative overflow-hidden" glass>
        <div className="max-w-xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold border border-primary-200/80 dark:border-primary-800/80">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Official Examination Report Card</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              {quizTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Standardized CBT Assessment Completion Record
            </p>
          </div>

          {/* Big Score and Grade Badge */}
          <div className="flex items-center justify-center gap-6 py-3">
            <div className="text-center">
              <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                {percentage}%
              </span>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                Final Score ({score} / {total_questions})
              </span>
            </div>

            <div className={`px-5 py-3 rounded-2xl border text-center ${gradeInfo.bg}`}>
              <span className={`text-3xl sm:text-4xl font-black ${gradeInfo.color} font-heading block`}>
                {gradeInfo.grade}
              </span>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${gradeInfo.color}`}>
                {gradeInfo.label}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid: Attempted, Correct, Incorrect, Unattempted, Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-darkBorder text-center">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60">
              <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">{score}</span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Correct</span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60">
              <span className="block text-lg font-black text-rose-600 dark:text-rose-400">{incorrectCount}</span>
              <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">Incorrect</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-darkBg border border-slate-200 dark:border-darkBorder">
              <span className="block text-lg font-black text-slate-700 dark:text-slate-300">{unattemptedCount}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Unattempted</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-darkBg border border-slate-200 dark:border-darkBorder">
              <span className="block text-lg font-black text-slate-800 dark:text-slate-200">{formatTimer(time_taken_seconds)}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Pace: {avgSecondsPerQ}s / Q</span>
            </div>
          </div>

          {/* Action Toolbar: Retake, Print, Back */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to={`/quiz/${id}`}>
              <Button variant="outline" size="sm" icon={RotateCcw}>
                Retake Examination
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Scorecard
            </Button>

            <Link to="/quizzes">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                All Examinations
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* AI Diagnostic Feedback Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary-600 via-secondary-600 to-indigo-700 text-white shadow-lg shadow-primary-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md text-amber-200">
              AI Pedagogical Diagnosis
            </span>
            <h3 className="text-sm sm:text-base font-bold mt-1 leading-snug">{ai_recommendation}</h3>
          </div>
        </div>

        <Link to="/learning-path" className="w-full md:w-auto">
          <button className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-primary-700 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
            <span>Adaptive Study Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {/* Performance by Topic Breakdown */}
      {topic_breakdown && topic_breakdown.length > 0 && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary-500" />
            <span>Syllabus Competency Breakdown</span>
          </h2>

          <div className="space-y-4">
            {topic_breakdown.map((t, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.correct}/{t.total} ({t.score_percentage}%)
                    </span>
                    <StatusBadge status={t.status} size="xs" />
                  </div>
                </div>
                <ProgressBar progress={t.score_percentage} colorScheme="auto" size="md" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Official Answer Key & Solutions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-primary-500" />
              <span>Question Solutions & Pedagogical Explanations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Review correct answer keys, chosen selections, and detailed rationale for each question.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-darkCard border border-slate-200 dark:border-darkBorder self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setFilterReview('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterReview === 'all' ? 'bg-white dark:bg-darkBg text-primary-600 shadow-xs' : 'text-slate-500'}`}
            >
              All ({answer_reviews?.length || 0})
            </button>
            <button
              onClick={() => setFilterReview('correct')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterReview === 'correct' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 shadow-xs' : 'text-slate-500'}`}
            >
              Correct ({score})
            </button>
            <button
              onClick={() => setFilterReview('incorrect')}
              className={`px-3 py-1 rounded-lg transition-colors ${filterReview === 'incorrect' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 shadow-xs' : 'text-slate-500'}`}
            >
              Incorrect ({incorrectCount})
            </button>
            {unattemptedCount > 0 && (
              <button
                onClick={() => setFilterReview('unattempted')}
                className={`px-3 py-1 rounded-lg transition-colors ${filterReview === 'unattempted' ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 shadow-xs' : 'text-slate-500'}`}
              >
                Skipped ({unattemptedCount})
              </button>
            )}
          </div>
        </div>

        {/* List of Question Review Cards */}
        <div className="space-y-4">
          {filteredReviews.map((ans, idx) => {
            const isUnattempted = ans.selected_option === -1;
            const isExpanded = expandedQuestion === ans.question_id;

            return (
              <Card
                key={ans.question_id}
                className={`p-5 sm:p-6 transition-all border ${
                  ans.is_correct
                    ? 'border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : isUnattempted
                    ? 'border-slate-200 dark:border-darkBorder bg-slate-50/40 dark:bg-darkBg/20'
                    : 'border-rose-200/80 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                }`}
              >
                {/* Question Header Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Question {idx + 1}
                      </span>
                      {ans.topic && <TopicBadge topic={ans.topic} size="xs" />}
                      {ans.is_correct ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Correct (+1.0)
                        </span>
                      ) : isUnattempted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Skipped / Unattempted (0.0)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded">
                          <X className="w-3 h-3" /> Incorrect (0.0)
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug font-heading">
                      {ans.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : ans.question_id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-darkCard transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Options List showing user selection vs correct answer */}
                <div className="space-y-2 mt-4">
                  {ans.options?.map((optText, optIdx) => {
                    const isUserChoice = ans.selected_option === optIdx;
                    const isCorrectAnswer = ans.correct_answer === optIdx;

                    let optionBorderClass = 'border-slate-200 dark:border-darkBorder bg-white/60 dark:bg-darkCard/60 text-slate-700 dark:text-slate-300';
                    let badgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

                    if (isCorrectAnswer) {
                      optionBorderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs';
                      badgeClass = 'bg-emerald-600 text-white';
                    } else if (isUserChoice && !ans.is_correct) {
                      optionBorderClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold shadow-xs';
                      badgeClass = 'bg-rose-600 text-white';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${optionBorderClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${badgeClass}`}>
                            {optionLetters[optIdx]}
                          </span>
                          <span>{optText}</span>
                        </div>

                        {/* Status tag */}
                        <div className="flex items-center gap-1 text-[11px] font-bold flex-shrink-0">
                          {isCorrectAnswer && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct Key</span>
                            </span>
                          )}
                          {isUserChoice && !ans.is_correct && (
                            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Your Choice</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pedagogical Explanation Box */}
                {ans.explanation && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200/60 dark:border-darkBorder text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-primary-600 dark:text-primary-400 block">
                      Pedagogical Explanation:
                    </span>
                    <p className="leading-relaxed">{ans.explanation}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
