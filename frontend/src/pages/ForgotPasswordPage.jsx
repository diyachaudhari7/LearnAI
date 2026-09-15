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
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 via-secondary-600 to-cyanAccent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary-600 via-secondary-600 to-cyanAccent-500 bg-clip-text text-transparent font-heading">
              LearnAI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We will send a secure link to reset your account password
          </p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6" glass>
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
