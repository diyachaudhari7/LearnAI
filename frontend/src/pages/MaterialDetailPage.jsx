import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Sparkles,
  BookOpen,
  CheckSquare,
  Layers,
  ArrowLeft,
  Flame,
  Zap,
  AlignLeft,
  ChevronRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { DifficultyBadge, TopicBadge } from '../components/Badges';
import Modal from '../components/Modal';
import { LoadingSpinner } from '../components/StateFeedback';

const MaterialDetailPage = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showRawTextModal, setShowRawTextModal] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchDocumentDetail = async () => {
    try {
      const res = await api.get(`/documents/${id}`);
      setDoc(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch document', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentDetail();
  }, [id]);

  const handleReanalyze = async () => {
    try {
      setAnalyzing(true);
      const res = await api.post(`/documents/${id}/analyze`);
      setDoc(res.data);
      addToast('AI re-analysis completed successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateQuiz = async (topicName) => {
    try {
      addToast(`Generating custom quiz on '${topicName}'...`, 'info');
      const res = await api.post('/ai/generate-quiz', {
        document_id: Number(id),
        topic: topicName,
        count: 5,
        title: `${topicName} Assessment`
      });
      addToast('Quiz generated!', 'success');
      navigate(`/quiz/${res.data.quiz_id}`);
    } catch (err) {
      addToast(err.message || 'Failed to generate quiz', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading material details..." />;
  }

  if (!doc) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-sm text-slate-500">Document not found.</p>
        <Link to="/materials">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Materials
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/materials')}
            icon={ArrowLeft}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Material Analysis
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI extracted insights, topics, and study resources
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawTextModal(true)}
            icon={AlignLeft}
          >
            View Extracted Text
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleReanalyze}
            isLoading={analyzing}
            icon={RefreshCw}
          >
            Re-Analyze with AI
          </Button>
        </div>
      </div>

      {/* Document Overview Header Card */}
      <Card className="p-6 sm:p-8" glass>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-darkBorder">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Processed Learning Material
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                {doc.filename}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <span>{doc.page_count} Pages</span>
                <span>•</span>
                <span>Uploaded {new Date(doc.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  AI Analyzed
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Launchers */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <Link to={`/summary/${doc.id}`} className="flex-1 sm:flex-none">
              <Button variant="primary" size="md" className="w-full" icon={BookOpen}>
                AI Summary
              </Button>
            </Link>
            <Link to="/quizzes" className="flex-1 sm:flex-none">
              <Button variant="secondary" size="md" className="w-full" icon={CheckSquare}>
                Quizzes ({doc.quiz_count})
              </Button>
            </Link>
            <Link to={`/flashcards?doc=${doc.id}`} className="flex-1 sm:flex-none">
              <Button variant="outline" size="md" className="w-full" icon={Layers}>
                Flashcards ({doc.flashcard_count})
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Key Insights Summary Box */}
        {doc.summary && (
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Overview Abstract
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {doc.summary.overview}
            </p>
          </div>
        )}
      </Card>

      {/* AI Identified Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              AI Identified Topics & Skills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Key concepts extracted directly from this document
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            {doc.topics?.length || 0} Topics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {doc.topics && doc.topics.length > 0 ? (
            doc.topics.map((t) => (
              <Card key={t.id} className="p-5 flex flex-col justify-between space-y-4" hover>
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                      {t.name}
                    </h3>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        t.importance === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {t.importance} Importance
                      </span>
                      <DifficultyBadge difficulty={t.difficulty} size="xs" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.description || 'Core topic understanding and practical application.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-darkBorder flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Ready for assessment</span>
                  <Button
                    onClick={() => handleGenerateQuiz(t.name)}
                    variant="ghost"
                    size="sm"
                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/50"
                    icon={Zap}
                  >
                    Generate Quiz
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic col-span-2">No topics found.</p>
          )}
        </div>
      </div>

      {/* Raw Extracted Text Modal */}
      <Modal
        isOpen={showRawTextModal}
        onClose={() => setShowRawTextModal(false)}
        title={`Extracted Text — ${doc.filename}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Raw text extracted by PyMuPDF parser from this document:
          </p>
          <div className="max-h-[60vh] overflow-y-auto p-4 rounded-xl bg-slate-100 dark:bg-darkBg text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-darkBorder">
            {doc.extracted_text || 'No extracted text found in document.'}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setShowRawTextModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MaterialDetailPage;
