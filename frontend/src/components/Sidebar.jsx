import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  UploadCloud,
  FileText,
  CheckSquare,
  Layers,
  Milestone,
  Target,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Materials', icon: FolderOpen, path: '/materials' },
    { label: 'Upload Material', icon: UploadCloud, path: '/upload' },
    { label: 'Quizzes & MCQs', icon: CheckSquare, path: '/quizzes' },
    { label: '3D Flashcards', icon: Layers, path: '/flashcards' },
    { label: 'Learning Path', icon: Milestone, path: '/learning-path', badge: 'Active' },
    { label: 'Competency Gaps', icon: Target, path: '/competency', badge: 'AI' },
    { label: 'Progress Analytics', icon: TrendingUp, path: '/progress' },
  ];

  const secondaryNavItems = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#090D16] border-r border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Close Button */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06]">
            <NavLink to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(79,70,229,0.35)] border border-primary-400/40 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  LEARN<span className="text-primary-500">.AI</span>
                </span>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
                  v2.4
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-mono">
                Platform Engine
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-primary-50/90 text-primary-700 dark:bg-white/[0.07] dark:text-white border border-primary-200/70 dark:border-white/10 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.badge === 'AI'
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyanAccent-600 dark:text-cyanAccent-400 border border-cyan-200/50 dark:border-cyan-800/50'
                              : 'bg-primary-100/80 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-800/50'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 font-mono">
                Workspace
              </p>
              <nav className="space-y-1">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-primary-50/90 text-primary-700 dark:bg-white/[0.07] dark:text-white border border-primary-200/70 dark:border-white/10 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
