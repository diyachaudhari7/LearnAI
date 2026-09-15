import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FolderOpen,
  FileText,
  Search,
  UploadCloud,
  Trash2,
  Sparkles,
  CheckSquare,
  Layers,
  Eye,
  BookOpen,
  MoreVertical,
  Plus
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { TopicBadge } from '../components/Badges';
import Modal from '../components/Modal';
import { LoadingSpinner, EmptyState } from '../components/StateFeedback';

const MyMaterialsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all'); // all, recent, processed
  const [deleteModalDoc, setDeleteModalDoc] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to fetch materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async () => {
    if (!deleteModalDoc) return;
    try {
      setDeleting(true);
      await api.delete(`/documents/${deleteModalDoc.id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteModalDoc.id));
      addToast(`'${deleteModalDoc.filename}' was deleted.`, 'success');
      setDeleteModalDoc(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete document', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleQuickAnalyze = async (docId, filename) => {
    try {
      addToast(`Re-analyzing '${filename}' with AI...`, 'info');
      await api.post(`/documents/${docId}/analyze`);
      addToast(`AI analysis completed for '${filename}'.`, 'success');
      fetchDocuments();
      navigate(`/materials/${docId}`);
    } catch (err) {
      addToast(err.message || 'AI analysis failed', 'error');
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topics.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'recent') {
      const isRecent = new Date(doc.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return isRecent;
    }
    if (activeTab === 'processed') {
      return doc.status === 'processed';
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullPage text="Loading your learning materials..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            My Learning Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access, review, and generate quizzes & flashcards from your uploaded documents
          </p>
        </div>

        <Button
          onClick={() => navigate('/upload')}
          variant="primary"
          size="sm"
          icon={Plus}
        >
          Upload New Material
        </Button>
      </div>

      {/* Search Bar & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 dark:border-darkBorder pb-2 sm:pb-0">
          {[
            { id: 'all', label: `All (${documents.length})` },
            { id: 'recent', label: 'Recent' },
            { id: 'processed', label: 'Analyzed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-darkCardHover'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter materials or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-darkBorder focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="p-5 flex flex-col justify-between" hover>
              <div className="space-y-4">
                {/* File Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/materials/${doc.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate hover:text-primary-600 transition-colors">
                          {doc.filename}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.page_count} pages • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteModalDoc(doc)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex-shrink-0"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Detected Topics */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Topics Detected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.topics && doc.topics.length > 0 ? (
                      doc.topics.slice(0, 3).map((t) => (
                        <TopicBadge key={t.id} topic={t.name} size="xs" />
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No topics extracted yet</span>
                    )}
                    {doc.topics && doc.topics.length > 3 && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 self-center">
                        +{doc.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Resource Stats Bar */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-darkBg/60 text-center text-xs">
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-200">{doc.quiz_count}</span>
                    <span className="text-[10px] text-slate-400">Quizzes</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-slate-200">{doc.flashcard_count}</span>
                    <span className="text-[10px] text-slate-400">Flashcards</span>
                  </div>
                  <div>
                    <span className={`block font-bold ${doc.has_summary ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {doc.has_summary ? 'Ready' : 'Pending'}
                    </span>
                    <span className="text-[10px] text-slate-400">Summary</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-darkBorder flex items-center justify-between gap-2">
                <Link to={`/materials/${doc.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" icon={Eye}>
                    View Details
                  </Button>
                </Link>
                {doc.has_summary ? (
                  <Link to={`/summary/${doc.id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full" icon={BookOpen}>
                      Summary
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => handleQuickAnalyze(doc.id, doc.filename)}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    icon={Sparkles}
                  >
                    Analyze
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No Learning Materials Found"
          description={
            searchQuery
              ? `No materials matched '${searchQuery}'. Try another keyword.`
              : 'Upload your first PDF document to generate quizzes, flashcards, and summaries.'
          }
          actionLabel="Upload Material"
          onAction={() => navigate('/upload')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalDoc}
        onClose={() => setDeleteModalDoc(null)}
        title="Delete Learning Material"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to permanently delete <strong>{deleteModalDoc?.filename}</strong>? All associated topics, generated quizzes, flashcards, and summaries will also be removed.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalDoc(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleting}
              icon={Trash2}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyMaterialsPage;
