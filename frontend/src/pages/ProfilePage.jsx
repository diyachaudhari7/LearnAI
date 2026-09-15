import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  Award,
  FileText,
  CheckSquare,
  Flame,
  Layers,
  Save
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import StatCard from '../components/StatCard';
import { LoadingSpinner } from '../components/StateFeedback';

const avatarPresets = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
];

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [avatar, setAvatar] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfileData(res.data);
      setName(res.data.user.name);
      setRole(res.data.user.role);
      setAvatar(res.data.user.avatar || avatarPresets[0]);
    } catch (err) {
      addToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/profile', { name, role, avatar });
      updateUser(res.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      await api.post('/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      addToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPwdError(err.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading user profile..." />;
  }

  const stats = profileData?.stats || {
    documents_uploaded: 0,
    quizzes_completed: 0,
    average_score: 0,
    skills_mastered: 0,
    learning_streak_days: 0,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, avatar, credentials, and track your achievements
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6 sm:p-8" glass>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={avatar || avatarPresets[0]}
              alt={name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-primary-500 shadow-lg"
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">{name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 text-xs font-bold self-center sm:self-auto">
                {role === 'Student' ? <GraduationCap className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{profileData?.user?.email}</p>
            <p className="text-[11px] text-slate-400">
              Member since {new Date(profileData?.user?.created_at || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </Card>

      {/* Learning Statistics Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">
          Learning Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Documents"
            value={stats.documents_uploaded}
            icon={FileText}
            color="primary"
          />
          <StatCard
            title="Quizzes Taken"
            value={stats.quizzes_completed}
            icon={CheckSquare}
            color="secondary"
          />
          <StatCard
            title="Average Score"
            value={`${stats.average_score}%`}
            icon={Award}
            color="emerald"
          />
          <StatCard
            title="Streak"
            value={`${stats.learning_streak_days} Days`}
            icon={Flame}
            color="amber"
          />
        </div>
      </div>

      {/* Edit Profile Form */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
          Edit Personal Details
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(preset)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === preset ? 'border-primary-500 scale-105 shadow-md ring-2 ring-primary-500/50' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-darkBorder bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="Student">Student</option>
                <option value="Employee">Employee / Professional</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={savingProfile}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Section */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading border-b border-slate-100 dark:border-darkBorder pb-3">
          Security & Password
        </h3>

        {pwdError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-300">
            {pwdError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="outline"
              size="md"
              isLoading={savingPassword}
              icon={Lock}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
