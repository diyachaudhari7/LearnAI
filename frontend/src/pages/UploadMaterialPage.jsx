import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Layers,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';

const UploadMaterialPage = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: idle, 1: upload, 2: extract, 3: ai analyze, 4: done
  const [error, setError] = useState('');

  const inputRef = useRef(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && !selectedFile.name.toLowerCase().endsWith('.txt')) {
      setError('Only PDF or TXT documents are supported.');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError('');

      // Step 1: Uploading
      setCurrentStep(1);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('auto_analyze', 'false');

      const uploadRes = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const docId = uploadRes.data.id;

      // Step 2: Extracting Text
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: AI Understanding & Generating Resources
      setCurrentStep(3);
      const analyzeRes = await api.post(`/documents/${docId}/analyze`);

      // Step 4: Complete
      setCurrentStep(4);
      addToast(`AI successfully processed '${file.name}'!`, 'success');

      setTimeout(() => {
        navigate(`/materials/${docId}`);
      }, 700);
    } catch (err) {
      setError(err.message || 'Failed to process document with AI.');
      setUploading(false);
      setCurrentStep(0);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const steps = [
    { title: 'Uploading Document', desc: 'Securely transmitting PDF file' },
    { title: 'Extracting Text & Layout', desc: 'Parsing pages, text streams, and structure' },
    { title: 'AI Understanding & Topics', desc: 'Identifying skills, concepts & building quizzes' },
    { title: 'Finalizing Study Kit', desc: 'Saving generated summary & flashcards' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          Upload Your Learning Material
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload any PDF lecture notes, textbook chapters, or training guides. AI will extract topics, create summaries, MCQs, and flashcards.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-300 flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload / Drag & Drop Area */}
      {!uploading ? (
        <Card className="p-8 sm:p-10 text-center" glass>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleChange}
            className="hidden"
          />

          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                dragActive
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 scale-[1.01]'
                  : 'border-slate-300 dark:border-darkBorder hover:border-primary-400 hover:bg-slate-50/70 dark:hover:bg-darkCardHover'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 font-heading">
                  Drag & Drop your PDF here, or <span className="text-primary-600 hover:underline">Browse File</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Supported: PDF, TXT (Maximum file size: 25MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder flex items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setFile(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleAnalyze}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-primary-500/25"
                  icon={Sparkles}
                >
                  Analyze with AI
                </Button>
                <Button
                  onClick={() => inputRef.current?.click()}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Choose Different File
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* Progress Animation Pipeline */
        <Card className="p-8 sm:p-10 space-y-8" glass>
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto animate-bounce">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Processing '{file?.name}'
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please wait while our AI engine digests the content and constructs your study kit.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {steps.map((s, idx) => {
              const stepIndex = idx + 1;
              const isCompleted = currentStep > stepIndex;
              const isCurrent = currentStep === stepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 shadow-sm'
                      : isCompleted
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-darkBorder opacity-40'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{s.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Feature Explanations Below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder">
          <BrainCircuit className="w-5 h-5 text-primary-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Skill Extraction</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Identifies topics and skill difficulties</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder">
          <BookOpen className="w-5 h-5 text-secondary-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Summary & Concepts</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Builds definition sheets and takeaways</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder">
          <Layers className="w-5 h-5 text-cyanAccent-500 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">MCQs & Flashcards</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Generates quizzes and 3D flashcards</p>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterialPage;
