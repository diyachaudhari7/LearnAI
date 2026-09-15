import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Clock,
  Shield,
  Save,
  Check,
  LogOut,
  Target
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { LoadingSpinner } from '../components/StateFeedback';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [dailyGoal, setDailyGoal] = useState(30);
  const [preferredDifficulty, setPreferredDifficulty] = useState('Intermediate');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [learningReminders, setLearningReminders] = useState(true);
  const [quizReminders, setQuizReminders] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const s = res.data;
        setDailyGoal(s.daily_goal_minutes || 30);
        setPreferredDifficulty(s.preferred_difficulty || 'Intermediate');
        setEmailNotifs(s.email_notifications ?? true);
        setLearningReminders(s.learning_reminders ?? true);
        setQuizReminders(s.quiz_reminders ?? true);
      } catch (err) {
        addToast(err.message || 'Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/settings', {
        daily_goal_minutes: Number(dailyGoal),
        preferred_difficulty: preferredDifficulty,
        dark_mode: isDarkMode,
        email_notifications: emailNotifs,
        learning_reminders: learningReminders,
        quiz_reminders: quizReminders,
      });
      addToast('Preferences saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading your platform settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your study targets, appearance theme, notification channels, and security
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Appearance Theme */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-darkBorder pb-3">
            <Sun className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Appearance & Theme
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode Interface</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle between dark and light color themes
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isDarkMode
                  ? 'bg-primary-950 text-primary-300 border-primary-800'
                  : 'bg-white text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-primary-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}</span>
            </button>
          </div>
        </Card>

        {/* Section 2: Learning Preferences */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-darkBorder pb-3">
            <Target className="w-5 h-5 text-primary-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Learning Goals & Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Daily Study Target (Minutes)
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-darkBorder bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value={15}>15 Minutes / Day (Casual)</option>
                <option value={30}>30 Minutes / Day (Standard)</option>
                <option value={45}>45 Minutes / Day (Active)</option>
                <option value={60}>60 Minutes / Day (Intensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preferred Assessment Difficulty
              </label>
              <select
                value={preferredDifficulty}
                onChange={(e) => setPreferredDifficulty(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-darkBorder bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Section 3: Notification Switches */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-darkBorder pb-3">
            <Bell className="w-5 h-5 text-secondary-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Email Notifications</p>
                <p className="text-[11px] text-slate-500">Receive weekly competency reports via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Learning Reminders</p>
                <p className="text-[11px] text-slate-500">Daily prompts to preserve your active learning streak</p>
              </div>
              <input
                type="checkbox"
                checked={learningReminders}
                onChange={(e) => setLearningReminders(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-darkBg/60 border border-slate-200 dark:border-darkBorder cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Quiz Milestone Alerts</p>
                <p className="text-[11px] text-slate-500">Reminders when a new weekly quiz assessment unlocks</p>
              </div>
              <input
                type="checkbox"
                checked={quizReminders}
                onChange={(e) => setQuizReminders(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* Section 4: Security & Session */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-darkBorder pb-3">
            <Shield className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Security & Session
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Change Account Password</p>
              <p className="text-[11px] text-slate-500">Update credentials in the profile tab</p>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Manage Profile & Password
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-darkBorder">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Logout Session</p>
              <p className="text-[11px] text-slate-500">Sign out of this browser session</p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleLogout}
              icon={LogOut}
            >
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            icon={Save}
            className="shadow-lg shadow-primary-500/25"
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
