import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Bookmark,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle2,
  XCircle,
  Flag,
  FileText,
  Eye,
  Type
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { DifficultyBadge, TopicBadge } from '../components/Badges';
import Modal from '../components/Modal';
import { LoadingSpinner } from '../components/StateFeedback';

const QuizActivePage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { question_id: option_index }
  const [visitedQuestions, setVisitedQuestions] = useState(new Set()); // Set of question_ids
  const [markedForReview, setMarkedForReview] = useState(new Set()); // Set of question_ids
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState('countdown'); // 'countdown' or 'elapsed'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState('md'); // 'sm', 'md', 'lg'
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState('all'); // 'all', 'answered', 'unanswered', 'marked'

  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
        if (res.data?.questions?.length > 0) {
          setVisitedQuestions(new Set([res.data.questions[0].id]));
        }
      } catch (err) {
        addToast(err.message || 'Failed to load examination', 'error');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Exam timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = quiz?.questions?.length || 0;
  const allocatedSeconds = Math.max(totalQuestions * 90, 600); // 90 sec per question or 10 min
  const remainingSeconds = Math.max(allocatedSeconds - elapsedSeconds, 0);

  // Mark current question as visited whenever index changes
  useEffect(() => {
    if (quiz?.questions?.[currentIndex]) {
      const qId = quiz.questions[currentIndex].id;
      setVisitedQuestions((prev) => new Set([...prev, qId]));
    }
  }, [currentIndex, quiz]);

  // Keyboard navigation and option selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in inputs or modal open
      if (submitModalOpen || instructionsModalOpen || !quiz?.questions) return;

      const q = quiz.questions[currentIndex];
      if (!q) return;

      const key = e.key.toUpperCase();
      if (['A', '1'].includes(key) && q.options.length > 0) handleSelectOption(q.id, 0);
      else if (['B', '2'].includes(key) && q.options.length > 1) handleSelectOption(q.id, 1);
      else if (['C', '3'].includes(key) && q.options.length > 2) handleSelectOption(q.id, 2);
      else if (['D', '4'].includes(key) && q.options.length > 3) handleSelectOption(q.id, 3);
      else if (['E', '5'].includes(key) && q.options.length > 4) handleSelectOption(q.id, 4);
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, quiz, submitModalOpen, instructionsModalOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearResponse = (questionId) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleToggleReview = (questionId) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMarkAndNext = (questionId) => {
    handleToggleReview(questionId);
    handleNext();
  };

  const handleSaveAndNext = () => {
    handleNext();
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      const answersPayload = quiz.questions.map((q) => ({
        question_id: q.id,
        selected_option: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      }));

      const res = await api.post(`/quizzes/${id}/submit`, {
        time_taken_seconds: elapsedSeconds,
        answers: answersPayload,
      });

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      addToast(`Assessment finished! Scored: ${res.data.percentage}%`, 'success');
      navigate(`/quiz/${id}/result`, { state: { resultData: res.data, quizTitle: quiz.title } });
    } catch (err) {
      addToast(err.message || 'Submission error', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Initiating secure examination environment..." />;
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">This examination currently contains no active question papers.</p>
        <Button onClick={() => navigate('/quizzes')} variant="primary" size="sm" className="mt-4">
          Return to Examinations
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  // Calculate CBT status breakdown
  let answeredCount = 0;
  let markedCount = 0;
  let answeredAndMarkedCount = 0;
  let notAnsweredCount = 0;
  let notVisitedCount = 0;

  quiz.questions.forEach((q) => {
    const isAnswered = selectedAnswers[q.id] !== undefined;
    const isMarked = markedForReview.has(q.id);
    const isVisited = visitedQuestions.has(q.id);

    if (isAnswered && isMarked) answeredAndMarkedCount++;
    else if (isMarked) markedCount++;
    else if (isAnswered) answeredCount++;
    else if (isVisited) notAnsweredCount++;
    else notVisitedCount++;
  });

  const totalAnsweredOverall = answeredCount + answeredAndMarkedCount;
  const progressPercent = Math.round((totalAnsweredOverall / totalQuestions) * 100);

  // Status helper for question palette button
  const getQuestionStatus = (qId) => {
    const isAnswered = selectedAnswers[qId] !== undefined;
    const isMarked = markedForReview.has(qId);
    const isVisited = visitedQuestions.has(qId);

    if (isAnswered && isMarked) return 'answered_marked';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not_answered';
    return 'not_visited';
  };

  const getStatusColorClass = (status, isCurrent) => {
    if (isCurrent) {
      return 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-darkBg font-black shadow-md';
    }
    switch (status) {
      case 'answered':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'not_answered':
        return 'bg-rose-500 text-white border-rose-600';
      case 'marked':
        return 'bg-purple-600 text-white border-purple-700';
      case 'answered_marked':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-darkBorder hover:bg-slate-200';
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in pb-16">
      {/* Real CBT Examination Top Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Exam Info */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
            icon={ArrowLeft}
            className="text-slate-500 hover:text-rose-600"
          >
            Exit Exam
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300">
                Official Examination Mode
              </span>
              <TopicBadge topic={quiz.topic} size="xs" />
              <DifficultyBadge difficulty={quiz.difficulty} size="xs" />
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-heading truncate mt-0.5">
              {quiz.title}
            </h1>
          </div>
        </div>

        {/* Right: Live Timer, Font zoom, Fullscreen, Exam Metrics */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-center">
          {/* Font Zoom Toggle */}
          <div className="hidden sm:flex items-center rounded-xl bg-slate-100 dark:bg-darkBg border border-slate-200 dark:border-darkBorder p-0.5">
            <button
              onClick={() => setFontSize('sm')}
              title="Standard text"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-white dark:bg-darkCard shadow-xs text-primary-600' : 'text-slate-500'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('md')}
              title="Medium text"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'md' ? 'bg-white dark:bg-darkCard shadow-xs text-primary-600' : 'text-slate-500'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              title="Large text"
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-white dark:bg-darkCard shadow-xs text-primary-600' : 'text-slate-500'}`}
            >
              A+
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 dark:bg-darkBg border border-slate-200 dark:border-darkBorder text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Exam Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Marking Scheme / Instructions Help */}
          <button
            onClick={() => setInstructionsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-darkBg border border-slate-200 dark:border-darkBorder text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary-500" />
            <span>Marking Scheme</span>
          </button>

          {/* Official Exam Timer */}
          <button
            onClick={() => setTimerMode(timerMode === 'countdown' ? 'elapsed' : 'countdown')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              remainingSeconds < 180
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                : 'bg-slate-100 dark:bg-darkBg text-slate-800 dark:text-slate-200 border-slate-200 dark:border-darkBorder'
            }`}
            title="Click to toggle between Countdown and Elapsed timer"
          >
            <Clock className={`w-3.5 h-3.5 ${remainingSeconds < 180 ? 'text-rose-600' : 'text-primary-600'}`} />
            <span>
              {timerMode === 'countdown' ? `Left: ${formatTimer(remainingSeconds)}` : `Time: ${formatTimer(elapsedSeconds)}`}
            </span>
          </button>
        </div>
      </div>

      {/* CBT Assessment Main Canvas & Question Palette Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Question Paper Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6 sm:p-8 space-y-6" glass>
            {/* Question Header & Marking Scheme */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-darkBorder pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-primary-600 text-white font-black text-xs flex items-center justify-center">
                  Q{currentIndex + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                {markedForReview.has(currentQuestion.id) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                    <Bookmark className="w-3 h-3 fill-purple-600" />
                    Marked for Review
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                  +1.00 Mark
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                  0.00 Negative
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className={`${fontSizeClasses[fontSize]} font-bold text-slate-900 dark:text-white leading-relaxed font-heading`}>
                {currentQuestion.question}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Tip: Press keys <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">A</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">B</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">C</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">D</kbd> or click to choose.
              </p>
            </div>

            {/* Examination Options (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 text-xs sm:text-sm font-medium group ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/90 dark:bg-primary-950/60 text-primary-950 dark:text-primary-100 shadow-sm ring-2 ring-primary-500/80 font-semibold'
                        : 'border-slate-200 dark:border-darkBorder bg-white dark:bg-darkCard hover:bg-slate-50 dark:hover:bg-darkCardHover text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200'
                        }`}
                      >
                        {optionLetters[optIdx]}
                      </span>
                      <span className="leading-relaxed break-words">{opt}</span>
                    </div>

                    {/* Radio visual indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CBT Action Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-darkBorder flex flex-wrap items-center justify-between gap-3">
              {/* Left CBT options: Clear Response & Mark for Review */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearResponse(currentQuestion.id)}
                  disabled={selectedAnswers[currentQuestion.id] === undefined}
                  icon={RotateCcw}
                  className="text-xs"
                >
                  Clear Response
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAndNext(currentQuestion.id)}
                  icon={Bookmark}
                  className={`text-xs ${markedForReview.has(currentQuestion.id) ? 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  {markedForReview.has(currentQuestion.id) ? 'Unmark & Next' : 'Mark for Review & Next'}
                </Button>
              </div>

              {/* Right CBT options: Previous, Save & Next, Submit */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrev}
                  variant="outline"
                  size="sm"
                  disabled={currentIndex === 0}
                  icon={ArrowLeft}
                >
                  Previous
                </Button>

                {currentIndex < totalQuestions - 1 ? (
                  <Button
                    onClick={handleSaveAndNext}
                    variant="primary"
                    size="sm"
                  >
                    <span>Save & Next</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setSubmitModalOpen(true)}
                    variant="success"
                    size="sm"
                    icon={Send}
                  >
                    Finish & Submit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Real Examination Question Palette (CBT Grid) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBorder pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 font-heading">
                Question Palette
              </h3>
              <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400">
                {totalAnsweredOverall} / {totalQuestions} Done
              </span>
            </div>

            {/* CBT Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 p-2 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200/60 dark:border-darkBorder">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 flex-shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 flex-shrink-0" />
                <span>Not Answered ({notAnsweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-purple-600 flex-shrink-0" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 flex-shrink-0" />
                <span>Ans & Review ({answeredAndMarkedCount})</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <span>Not Visited ({notVisitedCount})</span>
              </div>
            </div>

            {/* Interactive Question Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Select Question to Jump:</span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1">
                {quiz.questions.map((q, idx) => {
                  const status = getQuestionStatus(q.id);
                  const isCurrent = currentIndex === idx;
                  const colorClass = getStatusColorClass(status, isCurrent);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center relative ${colorClass}`}
                      title={`Question ${idx + 1} (${status})`}
                    >
                      <span>{idx + 1}</span>
                      {markedForReview.has(q.id) && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Submit Test Button */}
            <div className="pt-2 border-t border-slate-100 dark:border-darkBorder">
              <Button
                variant="success"
                size="md"
                onClick={() => setSubmitModalOpen(true)}
                className="w-full justify-center"
                icon={Send}
              >
                Submit Examination
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Pre-Submission Summary Confirmation Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title="Official Examination Submission Summary"
      >
        <div className="space-y-5">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Please review your examination status before confirming final submission. Once submitted, your answers will be permanently evaluated and graded.
          </p>

          {/* Real Exam Statistics Table */}
          <div className="rounded-xl border border-slate-200 dark:border-darkBorder overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-darkBg text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-darkBorder">
                <tr>
                  <th className="p-3">Status Category</th>
                  <th className="p-3 text-right">Question Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-darkBorder">
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Answered Questions
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-600">{answeredCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Not Answered / Skipped
                  </td>
                  <td className="p-3 text-right font-bold text-rose-600">{notAnsweredCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    Marked for Review (Unanswered)
                  </td>
                  <td className="p-3 text-right font-bold text-purple-600">{markedCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Answered & Marked for Review
                  </td>
                  <td className="p-3 text-right font-bold text-amber-600">{answeredAndMarkedCount}</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    Not Visited Questions
                  </td>
                  <td className="p-3 text-right font-bold text-slate-500">{notVisitedCount}</td>
                </tr>
                <tr className="bg-slate-50/60 dark:bg-darkBg/60 font-bold">
                  <td className="p-3 text-slate-900 dark:text-white">Total Examination Questions</td>
                  <td className="p-3 text-right text-slate-900 dark:text-white">{totalQuestions}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {totalAnsweredOverall < totalQuestions && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Attention:</strong> You have {totalQuestions - totalAnsweredOverall} unattempted questions remaining. Are you sure you want to finish now?
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmitModalOpen(false)}
              disabled={submitting}
            >
              Return to Exam
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleSubmitQuiz}
              isLoading={submitting}
              icon={Send}
            >
              Confirm & Submit Assessment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Marking Scheme and Instructions Modal */}
      <Modal
        isOpen={instructionsModalOpen}
        onClose={() => setInstructionsModalOpen(false)}
        title="Official Examination Instructions & Marking Scheme"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">1. Evaluation Rules:</h4>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Each correct answer awards <strong>+1.00 Mark</strong>.</li>
              <li>There is <strong>no negative marking (0.00)</strong> for incorrect or skipped choices.</li>
              <li>Only one option is objectively correct per question.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">2. Question Palette Navigation:</h4>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><strong className="text-emerald-600">Green:</strong> Question has been answered.</li>
              <li><strong className="text-rose-600">Red:</strong> Visited but not answered.</li>
              <li><strong className="text-purple-600">Purple:</strong> Marked for review.</li>
              <li><strong className="text-amber-600">Orange:</strong> Answered and marked for review.</li>
              <li><strong className="text-slate-500">Grey:</strong> Question not yet visited.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">3. Keyboard Shortcuts:</h4>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">A</kbd>, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">B</kbd>, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">C</kbd>, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">D</kbd> or numbers <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">1-4</kbd> to pick options.</li>
              <li>Press Right Arrow (<kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">→</kbd>) to go to Next.</li>
              <li>Press Left Arrow (<kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono">←</kbd>) to go to Previous.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-3">
            <Button variant="primary" size="sm" onClick={() => setInstructionsModalOpen(false)}>
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizActivePage;
