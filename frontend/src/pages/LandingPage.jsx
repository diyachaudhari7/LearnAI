import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  BrainCircuit,
  Target,
  Milestone,
  CheckCircle2,
  Layers,
  FileText,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  PlayCircle,
  BarChart3,
  Award,
  BookOpen,
  Terminal,
  Cpu,
  Sun,
  Moon,
  Compass,
  Activity,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { StatusBadge } from '../components/Badges';

const LandingPage = () => {
  const { isAuthenticated, loginAsDemo } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  const sampleCompetencies = [
    { skill: 'Statistical Foundations', score: 85, status: 'Strong', color: 'bg-emerald-500' },
    { skill: 'Python Architecture', score: 72, status: 'Good', color: 'bg-indigo-500' },
    { skill: 'SQL & Query Optimization', score: 42, status: 'Needs Improvement', color: 'bg-amber-500' },
    { skill: 'Exploratory Data Analysis', score: 35, status: 'Weak', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors selection:bg-primary-500/20 selection:text-primary-600">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(79,70,229,0.35)] border border-primary-400/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                LEARN<span className="text-primary-500">.AI</span>
              </span>
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60 hidden sm:inline-block">
                v2.4 Engine
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-white transition-colors">
              Platform Modules
            </a>
            <a href="#preview" className="hover:text-primary-600 dark:hover:text-white transition-colors">
              Diagnostics
            </a>
            <a href="#methodology" className="hover:text-primary-600 dark:hover:text-white transition-colors">
              IRT Methodology
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-white transition-colors">
              Pipeline
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="sm">
                Dashboard →
              </Button>
            ) : (
              <>
                <Button onClick={handleDemoClick} variant="glass" size="sm" className="hidden sm:inline-flex" icon={PlayCircle}>
                  1-Click Demo
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-dot-pattern">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Engineering Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium mb-8 shadow-sm animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-primary-600 dark:text-primary-400">IRT v2.4</span>
            <span className="text-slate-400">|</span>
            <span>Intelligent Skill Gap Diagnosis Engine</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Diagnose & Master Complex Skills With <span className="bg-gradient-to-r from-primary-600 to-indigo-500 dark:from-primary-400 dark:to-cyan-400 bg-clip-text text-transparent">Adaptive AI</span>
          </h1>

          {/* Precision Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Upload textbooks, research notes, and lecture slides. LearnAI parses domain competencies, runs diagnostic quizzes, and builds an automated 4-week remediation roadmap.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
                Start Free Evaluation
              </Button>
            </Link>
            <Button onClick={handleDemoClick} variant="outline" size="lg" className="w-full sm:w-auto" icon={PlayCircle}>
              Explore Live Demo
            </Button>
          </div>

          {/* Technical Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-500 dark:text-slate-400 mb-16 border-y border-slate-200/60 dark:border-white/[0.06] py-3.5 max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Grounded in Uploaded Content</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Item Response Theory (IRT)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Personalized 4-Week Paths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Spaced Recall Flashcards</span>
            </div>
          </div>

          {/* macOS Style Application Window Preview */}
          <div id="preview" className="max-w-5xl mx-auto rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-darkCard shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden text-left">
            {/* macOS Window Titlebar */}
            <div className="h-10 px-4 bg-slate-100/70 dark:bg-[#090D16]/90 border-b border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
              </div>
              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-primary-500" />
                <span>learn-ai / diagnostics / competency-matrix.ts</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACTIVE SESSION</span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header inside window */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Live Diagnostics Output
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-0.5">
                    Competency Matrix & Remediation Pipeline
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-darkBg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    Subject: Data Science & Engineering
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Left Column: Detected Competencies */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 font-sans mb-1">
                    <span>Evaluated Competency Dimensions</span>
                    <span className="font-mono text-[11px] text-slate-400">Score | Status</span>
                  </div>

                  {sampleCompetencies.map((comp) => (
                    <div
                      key={comp.skill}
                      className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-darkBg/70 border border-slate-100 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.skill}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-900 dark:text-white font-bold">{comp.score}%</span>
                          <StatusBadge status={comp.status} size="xs" />
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${comp.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: AI Prescribed Remediation */}
                <div className="p-5 rounded-xl bg-slate-50/70 dark:bg-darkBg/60 border border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-mono text-[11px] font-bold uppercase mb-2">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Adaptive Synthesis Algorithm</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      Priority Remediation: SQL & Query Optimization (42%)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      The diagnostic model identified join patterns and aggregations as the primary blocker. A customized 4-week roadmap has been scheduled with progressive recall quizzes.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-white/[0.06] font-mono text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-darkCard border border-slate-200/60 dark:border-white/5">
                      <span className="text-slate-700 dark:text-slate-300">Week 01: Relational Joins & Subqueries</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">[READY]</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-darkCard border border-slate-200/60 dark:border-white/5">
                      <span className="text-slate-700 dark:text-slate-300">Week 02: Indexing & Group Execution</span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-[11px]">[QUEUED]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Platform Features */}
      <section id="features" className="py-24 border-y border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Architectural Components
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">
              Everything Needed for Mastery Engineering
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Engineered with modern pedagogical principles, active recall, and zero-hallucination document anchoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                code: 'MOD_01',
                icon: UploadCloud,
                title: 'AI Document Parsing',
                desc: 'Upload multi-chapter PDFs. Automatic topic extraction, lexical discovery, and hierarchical chunking.',
              },
              {
                code: 'MOD_02',
                icon: CheckCircle2,
                title: 'Adaptive MCQs',
                desc: 'Targeted assessment questions paired with deep pedagogical rationales and skill attribution.',
              },
              {
                code: 'MOD_03',
                icon: Layers,
                title: '3D Spaced Flashcards',
                desc: 'Active recall flashcards featuring 3D flip physics, confidence ratings, and retention scheduling.',
              },
              {
                code: 'MOD_04',
                icon: FileText,
                title: 'Executive Summaries',
                desc: 'Hierarchical study guides covering core theorems, definitions, equations, and critical takeaways.',
              },
              {
                code: 'MOD_05',
                icon: Target,
                title: 'Competency Analysis',
                desc: 'Mathematically calculates mastery levels: Strong (80%+), Good (60-79%), Needs Imp. (40-59%), Weak (<40%).',
              },
              {
                code: 'MOD_06',
                icon: Milestone,
                title: '4-Week Roadmaps',
                desc: 'Automated milestone paths that intelligently sequence weak skills into structured remediation weeks.',
              },
              {
                code: 'MOD_07',
                icon: TrendingUp,
                title: 'Telemetry & Analytics',
                desc: 'Interactive Recharts telemetry showing score progression, radar mastery graphs, and study velocity.',
              },
              {
                code: 'MOD_08',
                icon: ShieldCheck,
                title: 'Deterministic Engine',
                desc: 'Operates with Gemini AI or deterministic pre-seeded fallback data for offline robustness.',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.code} className="p-6 flex flex-col justify-between group" hover>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        {f.code}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {f.desc}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4-Step Pipeline */}
      <section id="how-it-works" className="py-24 bg-[#FAFCFF] dark:bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Execution Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading mt-2">
              From Raw Material to Verified Competence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Ingest Material', desc: 'Drag-and-drop lecture slides, syllabi, or textbook chapters.' },
              { step: '02', title: 'Semantic Extraction', desc: 'AI maps competency domains, core lemmas, and concept links.' },
              { step: '03', title: 'Diagnostic Evaluation', desc: 'Execute active recall quizzes and rate mastery on 3D flashcards.' },
              { step: '04', title: 'Close Skill Gaps', desc: 'Follow structured weekly milestones and track score growth.' }
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-white/[0.08] shadow-card relative"
              >
                <span className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400 mb-3 block">
                  STEP_{s.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-heading">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competency Gap Explanation Section */}
      <section id="methodology" className="py-24 bg-white dark:bg-[#0B0F19] border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Data-Driven Rigor
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Objective Competency Tiers
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Traditional study platforms present vague percentage completions. LearnAI maps quiz performance directly to mathematical competency bands:
              </p>
              <div className="space-y-3 font-mono text-xs pt-1">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-darkBg border border-slate-100 dark:border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300"><strong>80–100% (Strong):</strong> Verified mastery of core principles.</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-darkBg border border-slate-100 dark:border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300"><strong>60–79% (Good):</strong> Solid comprehension with minor gaps.</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-darkBg border border-slate-100 dark:border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300"><strong>40–59% (Needs Improvement):</strong> Foundation requires targeted drills.</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-darkBg border border-slate-100 dark:border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300"><strong>0–39% (Weak):</strong> Critical bottleneck prioritized in Week 1.</span>
                </div>
              </div>
            </div>

            <Card className="p-6 sm:p-8 space-y-6" glass>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans uppercase tracking-wider">
                  Real-Time Skill Evaluation
                </h3>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  LIVE MODEL
                </span>
              </div>
              <div className="space-y-4">
                {sampleCompetencies.map((c) => (
                  <div key={c.skill} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-900 dark:text-slate-100">{c.skill}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{c.score}% — {c.status}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-primary-50/80 dark:bg-primary-950/50 border border-primary-200/80 dark:border-primary-800/60 text-xs text-primary-900 dark:text-primary-200 leading-relaxed">
                💡 <strong>Diagnostic Summary:</strong> Statistics demonstrated mastery (85%). Data Analysis (35%) flagged as critical gap. Remediation drills scheduled.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-white/10 text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Accelerate Your Technical Competency Today
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
              Experience the difference between passive reading and precision diagnostic learning.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Button onClick={handleDemoClick} variant="glass" size="lg" icon={PlayCircle}>
                Try 1-Click Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/[0.08] py-12 text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-primary-600 flex items-center justify-center text-white font-bold text-[10px]">
              AI
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">LEARN.AI PLATFORM</span>
            <span className="font-mono text-[11px]">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#preview" className="hover:text-primary-600 transition-colors">Diagnostics</a>
            <a href="#methodology" className="hover:text-primary-600 transition-colors">Methodology</a>
            <Link to="/login" className="hover:text-primary-600 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-primary-600 transition-colors">Create Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
