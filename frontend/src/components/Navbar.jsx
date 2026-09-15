import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Settings,
  BookOpen,
  CheckCircle2,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/materials?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'AI Analysis Ready',
      desc: 'SQL Fundamentals.pdf processed: 4 topics & quiz generated.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Competency Updated',
      desc: 'Your Python score reached 80% (Strong).',
      time: '2h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Learning Path Milestone',
      desc: 'Week 1 SQL Basics is 100% complete.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Command Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Developer-style Command Bar */}
          <form onSubmit={handleSearch} className="relative w-full hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search materials, topics, quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-2 text-xs bg-slate-100/80 dark:bg-darkCard/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200/80 dark:border-white/10 focus:border-primary-500 focus:bg-white dark:focus:bg-darkCard focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center">
              <kbd className="font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-darkBg px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 shadow-sm">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkCardHover transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-darkCardHover transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-darkCard rounded-2xl shadow-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-slate-200/90 dark:border-white/10 overflow-hidden py-2 animate-scale-in z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Notifications</h4>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950/70 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/50">
                    1 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        n.unread ? 'bg-primary-50/40 dark:bg-primary-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors focus:outline-none"
            >
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80'
                }
                alt={user?.name || 'User Avatar'}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-white/10"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.name || 'Student'}
                </p>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 leading-tight uppercase">{user?.role || 'Learner'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkCard rounded-2xl shadow-2xl dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] border border-slate-200/90 dark:border-white/10 overflow-hidden py-1.5 animate-scale-in z-50">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/5 md:hidden">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
                <div className="border-t border-slate-100 dark:border-darkBorder my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
