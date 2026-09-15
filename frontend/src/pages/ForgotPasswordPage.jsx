import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(79,70,229,0.35)] border border-primary-400/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                LEARN<span className="text-primary-500">.AI</span>
              </span>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
                v2.4
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We will dispatch a secure recovery token to authenticate your identity
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]" glass>
          {submitted ? (
            <div className="text-center space-y-4 py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                We sent a password reset link to <strong>{email}</strong>. For development mode, you can immediately log in with your credentials or the demo account.
              </p>
              <Link to="/login" className="block pt-2">
                <Button variant="primary" size="md" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-medium text-rose-600 dark:text-rose-300">
                  {error}
                </div>
              )}

              <Input
                label="Your Registered Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-primary-500/25"
                isLoading={loading}
                icon={ArrowRight}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
