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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-darkCard border-r border-slate-200/80 dark:border-darkBorder flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Close Button */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-darkBorder">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-cyanAccent-500 flex items-center justify-center shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-secondary-600 to-cyanAccent-500 bg-clip-text text-transparent font-heading">
                  LearnAI
                </span>
                <span className="text-[9px] block uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Adaptive Platform
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkCardHover"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Main Menu
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
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-darkCardHover hover:text-slate-900 dark:hover:text-slate-200'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.badge === 'AI'
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyanAccent-600 dark:text-cyanAccent-400 border border-cyan-200/50 dark:border-cyan-800/50'
                              : 'bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300'
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
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Preferences
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
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-darkCardHover hover:text-slate-900 dark:hover:text-slate-200'
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
        <div className="p-3 border-t border-slate-100 dark:border-darkBorder">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
