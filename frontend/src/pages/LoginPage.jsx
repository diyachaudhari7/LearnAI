import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      addToast('Welcome back! Logged in successfully.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginAsDemo();
      addToast('Welcome Diya! Logged in with pre-seeded demo account.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-cyanAccent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary-600 via-secondary-600 to-cyanAccent-500 bg-clip-text text-transparent font-heading">
              LearnAI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Log in to continue your adaptive learning path
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 space-y-6" glass>
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-300 animate-fade-in">
              {error}
            </div>
          )}

          {/* 1-Click Demo Login Box */}
          <div className="p-3.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-semibold text-primary-900 dark:text-primary-200">Instant Demo Account</p>
              <p className="text-[11px] text-primary-700/80 dark:text-primary-400">Pre-seeded with PDFs, quizzes & stats</p>
            </div>
            <Button
              onClick={handleDemoLogin}
              variant="primary"
              size="sm"
              isLoading={loading}
              icon={PlayCircle}
              className="flex-shrink-0"
            >
              1-Click Demo
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-primary-500/25 mt-2"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Social login divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-darkBorder" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-darkCard px-2 text-slate-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToast('Google authentication UI placeholder.', 'info')}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-darkBorder hover:bg-slate-50 dark:hover:bg-darkCardHover text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
