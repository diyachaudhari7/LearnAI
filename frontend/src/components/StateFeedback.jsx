import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-950 border-t-primary-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>
      {text && <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-darkBorder bg-slate-50/50 dark:bg-darkCard/50 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-heading mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-all shadow-md shadow-primary-500/20 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
