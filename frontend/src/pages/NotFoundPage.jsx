import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home, Compass } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg flex items-center justify-center p-4 text-center">
      <Card className="max-w-md w-full p-8 sm:p-10 space-y-6" glass>
        <div className="w-16 h-16 rounded-3xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-primary-600 font-heading">404</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The learning module or page you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full" icon={Home}>
              Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              Home Page
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
