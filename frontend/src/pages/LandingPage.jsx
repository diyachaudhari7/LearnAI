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
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';

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
    { skill: 'Statistics', score: 85, status: 'Strong', color: 'bg-emerald-500' },
    { skill: 'Python', score: 72, status: 'Good', color: 'bg-indigo-500' },
    { skill: 'SQL', score: 42, status: 'Needs Improvement', color: 'bg-amber-500' },
    { skill: 'Data Analysis', score: 35, status: 'Weak', color: 'bg-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-darkBg/80 backdrop-blur-md border-b border-slate-200/80 dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-cyanAccent-500 flex items-center justify-center shadow-md shadow-primary-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-secondary-600 to-cyanAccent-500 bg-clip-text text-transparent font-heading">
              LearnAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#competency" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Competency Engine
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} variant="primary" size="sm">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={handleDemoClick} variant="outline" size="sm" className="hidden sm:inline-flex">
                  1-Click Demo
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
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
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-primary-500/15 via-secondary-500/10 to-cyanAccent-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            <span>Next-Gen AI Adaptive Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight font-heading mb-6">
            Learn Smarter. <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-cyanAccent-500 bg-clip-text text-transparent">Identify Gaps.</span> Master Your Skills.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Upload your study material and let AI transform it into personalized quizzes, flashcards, summaries, and learning paths.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary-500/25" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
            <Button onClick={handleDemoClick} variant="glass" size="lg" className="w-full sm:w-auto" icon={PlayCircle}>
              Explore Platform (Demo)
            </Button>
          </div>

          {/* Interactive Product Preview Illustration */}
          <div className="max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-slate-200/60 to-slate-100/30 dark:from-darkCard dark:to-darkBg border border-slate-200 dark:border-darkBorder shadow-2xl shadow-primary-500/10 backdrop-blur-xl">
            <div className="rounded-2xl bg-white dark:bg-darkCard p-6 sm:p-8 text-left border border-slate-100 dark:border-darkBorder overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-darkBorder">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">Live AI Engine Preview</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Adaptive Competency Dashboard</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Real-time Recalculation
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {/* Competency Gap List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detected Competency Profile</h4>
                  {sampleCompetencies.map((comp) => (
                    <div key={comp.skill} className="p-3.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-100 dark:border-darkBorder">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-slate-800 dark:text-slate-200">{comp.skill}</span>
                        <span className="text-slate-600 dark:text-slate-400">{comp.score}% — {comp.status}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${comp.color} rounded-full transition-all duration-1000`} style={{ width: `${comp.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Generated Recommendation & Learning Path */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-50/50 via-secondary-50/30 to-cyan-50/30 dark:from-primary-950/30 dark:to-cyan-950/20 border border-primary-100 dark:border-primary-900/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase mb-2">
                      <Zap className="w-4 h-4" />
                      AI Diagnosis & Path
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      "Your SQL score is currently 42%. We recommend starting with SQL Basics."
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      AI identified your highest-priority skill gaps and automatically organized a 4-week structured milestone roadmap to bridge them.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-primary-200/50 dark:border-primary-800/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Week 1 — SQL Basics</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Completed</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Week 2 — Joins & Queries</span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">In Progress (50%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-darkCard/50 border-y border-slate-200/80 dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
              Comprehensive Features
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Everything You Need to Master Any Subject
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: UploadCloud, title: 'AI PDF Analysis', desc: 'Drag-and-drop any PDF. Instant text extraction, topic discovery, and smart chunking.' },
              { icon: CheckCircle2, title: 'Smart MCQs & Quizzes', desc: 'Dynamic questions with detailed pedagogical explanations and topic tagging.' },
              { icon: Layers, title: '3D Interactive Flashcards', desc: 'Active recall spaced repetition flashcards with flip animations and mastery tracking.' },
              { icon: FileText, title: 'Intelligent Summaries', desc: 'Structured summaries with core concepts, definition cards, and key takeaways.' },
              { icon: Target, title: 'Competency Gap Analysis', desc: 'Real calculation from quiz scores mapping skills to Strong, Good, Needs Improvement, or Weak.' },
              { icon: Milestone, title: 'Personalized Roadmaps', desc: 'Automated 4-week weekly learning path prioritizing your biggest skill gaps.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Interactive Recharts showing score history over time, study hours, and mastery trends.' },
              { icon: ShieldCheck, title: 'Robust Demo Mode', desc: 'Works out-of-the-box with Gemini AI or intelligent offline fallback data.' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 space-y-3" hover>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading">{feature.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
              4-Step Workflow
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              How LearnAI Transforms Your Study
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Material', desc: 'Drop your PDF notes, slides, or documents into the uploader.' },
              { step: '02', title: 'AI Understands Content', desc: 'Extracts core skills, builds summaries, and creates topic quizzes.' },
              { step: '03', title: 'Practice & Learn', desc: 'Test yourself with interactive quizzes and 3D flashcards.' },
              { step: '04', title: 'Bridge Skill Gaps', desc: 'Follow your tailored weekly roadmap and watch competency rise.' }
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-white dark:bg-darkCard border border-slate-200/80 dark:border-darkBorder shadow-sm">
                <span className="text-3xl font-extrabold text-primary-200 dark:text-primary-950/80 font-heading block mb-2">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competency Gap Explanation Section */}
      <section id="competency" className="py-20 bg-slate-100/70 dark:bg-darkCard/40 border-y border-slate-200/80 dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Data-Driven Mastery
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                Objective Competency Gap Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike traditional platforms with arbitrary scores, LearnAI calculates your exact competency from your actual quiz answers and topic accuracy.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300"><strong>80–100% (Strong):</strong> Mastered core principles.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300"><strong>60–79% (Good):</strong> Solid foundation with minor gaps.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300"><strong>40–59% (Needs Improvement):</strong> Foundation needs reinforcement.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300"><strong>0–39% (Weak):</strong> Critical gap automatically prioritized in Week 1.</span>
                </div>
              </div>
            </div>

            <Card className="p-6 sm:p-8 space-y-6" glass>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
                Live Skill Evaluation
              </h4>
              <div className="space-y-4">
                {sampleCompetencies.map((c) => (
                  <div key={c.skill} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-900 dark:text-slate-100">{c.skill}</span>
                      <span className="text-slate-500 dark:text-slate-400">{c.score}% — {c.status}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-xs text-primary-900 dark:text-primary-200">
                💡 <strong>AI Analysis:</strong> Your strongest skill is Statistics. Your biggest competency gap is Data Analysis. SQL also requires improvement.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Start Your Personalized Learning Journey
          </h3>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join students and professionals who accelerate mastery and close competency gaps using AI.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <button className="px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-base shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                Get Started Now
              </button>
            </Link>
            <button
              onClick={handleDemoClick}
              className="px-8 py-3.5 rounded-xl bg-primary-800/80 border border-white/20 text-white font-bold text-base hover:bg-primary-800 transition-all active:scale-95"
            >
              Try 1-Click Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-darkCard border-t border-slate-200/80 dark:border-darkBorder py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">LearnAI Platform</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
            <Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-primary-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
