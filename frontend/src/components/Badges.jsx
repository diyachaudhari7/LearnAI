import React from 'react';

export const DifficultyBadge = ({ difficulty = 'Medium', size = 'sm' }) => {
  const normalized = difficulty.toLowerCase();

  const styles = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    advanced: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  };

  const style = styles[normalized] || styles.medium;
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${style} ${sizeClass}`}>
      {difficulty}
    </span>
  );
};

export const TopicBadge = ({ topic, size = 'sm', className = '' }) => {
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`inline-flex items-center font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 ${sizeClass} ${className}`}
    >
      {topic}
    </span>
  );
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();
  let style = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (normalized === 'strong' || normalized === 'completed') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  } else if (normalized === 'good' || normalized === 'in progress') {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
  } else if (normalized === 'needs improvement') {
    style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
  } else if (normalized === 'weak' || normalized === 'locked') {
    style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
  }

  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${style} ${sizeClass}`}>
      {status}
    </span>
  );
};
