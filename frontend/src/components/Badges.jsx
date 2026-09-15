import React from 'react';

export const DifficultyBadge = ({ difficulty = 'Medium', size = 'sm' }) => {
  const normalized = difficulty.toLowerCase();

  const configs = {
    easy: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    beginner: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    },
    medium: {
      dot: 'bg-amber-500',
      badge: 'bg-amber-50/80 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    },
    intermediate: {
      dot: 'bg-amber-500',
      badge: 'bg-amber-50/80 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    },
    hard: {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    },
    advanced: {
      dot: 'bg-rose-500',
      badge: 'bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    },
  };

  const current = configs[normalized] || configs.medium;
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md border ${current.badge} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} flex-shrink-0`} />
      <span>{difficulty}</span>
    </span>
  );
};

export const TopicBadge = ({ topic, size = 'sm', className = '' }) => {
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50 ${sizeClass} ${className}`}
    >
      #{topic}
    </span>
  );
};

export const StatusBadge = ({ status, size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();
  
  let dotColor = 'bg-slate-400';
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60';

  if (normalized === 'strong' || normalized === 'completed') {
    dotColor = 'bg-emerald-500';
    badgeStyle = 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
  } else if (normalized === 'good' || normalized === 'in progress') {
    dotColor = 'bg-indigo-500';
    badgeStyle = 'bg-indigo-50/80 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
  } else if (normalized === 'needs improvement') {
    dotColor = 'bg-amber-500';
    badgeStyle = 'bg-amber-50/80 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
  } else if (normalized === 'weak' || normalized === 'locked') {
    dotColor = 'bg-rose-500';
    badgeStyle = 'bg-rose-50/80 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
  }

  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-md border ${badgeStyle} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
      <span>{status}</span>
    </span>
  );
};
