import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Plus,
  PlayCircle,
  RotateCcw,
  Clock,
  Layers,
  Award,
  Trash2,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { DifficultyBadge, TopicBadge } from '../components/Badges';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { LoadingSpinner, EmptyState } from '../components/StateFeedback';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [regeneratingId, setRegeneratingId] = useState(null);


  // Custom Quiz Generator Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newCount, setNewCount] = useState(5);
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [generating, setGenerating] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleGenerateCustomQuiz = async (e) => {
    e.preventDefault();
    if (!newTopic.trim()) {
      addToast('Please specify a topic or skill name.', 'error');
      return;
    }

    try {
      setGenerating(true);
      const res = await api.post('/ai/generate-quiz', {
        topic: newTopic.trim(),
        count: Number(newCount),
        difficulty: newDifficulty,
        title: `${newTopic.trim()} Assessment`
      });
      addToast(`Generated ${res.data.title}!`, 'success');
      setCreateModalOpen(false);
      navigate(`/quiz/${res.data.quiz_id}`);
    } catch (err) {
      addToast(err.message || 'Failed to generate quiz', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateQuiz = async (quizId, quizTitle) => {
    try {
      setRegeneratingId(quizId);
      addToast(`Regenerating questions for ${quizTitle}...`, 'info');
      await api.post(`/quizzes/${quizId}/regenerate`);
      addToast(`Questions regenerated for ${quizTitle}!`, 'success');
      fetchQuizzes();
    } catch (err) {
      addToast(err.message || 'Failed to regenerate quiz', 'error');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDeleteQuiz = async (quizId, quizTitle) => {
    if (!window.confirm(`Are you sure you want to delete '${quizTitle}'?`)) return;
    try {
      await api.delete(`/quizzes/${quizId}`);
      addToast(`Quiz '${quizTitle}' deleted.`, 'success');
      fetchQuizzes();
    } catch (err) {
      addToast(err.message || 'Failed to delete quiz', 'error');
    }
  };

  const topics = Array.from(new Set(quizzes.map((q) => q.topic))).filter(Boolean);


  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  if (loading) {
    return <LoadingSpinner fullPage text="Loading assessment quizzes..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Quizzes & Assessments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Test your knowledge to update your Competency Gap Profile in real time
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Create Custom Quiz
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Topic Filter */}
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-darkBorder focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="p-5 flex flex-col justify-between" hover>
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <TopicBadge topic={quiz.topic} size="sm" />
                  <DifficultyBadge difficulty={quiz.difficulty} size="xs" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{quiz.question_count} Questions</span>
                    <span>•</span>
                    <span>{quiz.attempts_count} Attempts</span>
                  </div>
                </div>

                {/* Score Status Badge */}
                {quiz.last_score !== null && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Last Score:</span>
                    <span className={`font-bold ${
                      quiz.last_score >= 80
                        ? 'text-emerald-500'
                        : quiz.last_score >= 60
                        ? 'text-indigo-500'
                        : quiz.last_score >= 40
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }`}>
                      {quiz.last_score}%
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-darkBorder flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRegenerateQuiz(quiz.id, quiz.title)}
                    disabled={regeneratingId === quiz.id}
                    title="Regenerate questions from source material"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-darkBorder text-slate-500 hover:text-primary-600 hover:bg-slate-50 dark:hover:bg-darkCard transition-colors text-xs flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === quiz.id ? 'animate-spin text-primary-600' : ''}`} />
                    <span className="hidden sm:inline text-[10px] font-semibold">Regen</span>
                  </button>

                  <button
                    onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    title="Delete quiz"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-darkBorder text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link to={`/quiz/${quiz.id}`}>
                  <Button
                    variant={quiz.attempts_count > 0 ? 'outline' : 'primary'}
                    size="sm"
                    icon={quiz.attempts_count > 0 ? RotateCcw : PlayCircle}
                  >
                    {quiz.attempts_count > 0 ? 'Retake' : 'Start Exam'}
                  </Button>
                </Link>
              </div>

            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No Quizzes Found"
          description={
            searchQuery
              ? `No quizzes matched '${searchQuery}'.`
              : 'Generate custom quizzes or upload a PDF to automatically create assessments.'
          }
          actionLabel="Create Custom Quiz"
          onAction={() => setCreateModalOpen(true)}
        />
      )}

      {/* Create Custom Quiz Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Generate AI Quiz"
      >
        <form onSubmit={handleGenerateCustomQuiz} className="space-y-4">
          <Input
            label="Topic or Skill Name"
            placeholder="e.g. SQL Joins, Python OOP, Linear Regression"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Questions Count
              </label>
              <select
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-darkBorder bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 py-2.5 px-3 text-xs"
              >
                <option value={5}>5 Questions (Quick)</option>
                <option value={10}>10 Questions (Standard)</option>
                <option value={15}>15 Questions (Deep)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty
              </label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-darkBorder bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 py-2.5 px-3 text-xs"
              >
                <option value="Easy">Easy / Beginner</option>
                <option value="Medium">Medium / Intermediate</option>
                <option value="Hard">Hard / Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={generating}
              icon={Sparkles}
            >
              Generate Quiz
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuizListPage;
