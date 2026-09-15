import React from 'react';

const ProgressBar = ({
  progress = 0,
  showLabel = false,
  size = 'md',
  colorScheme = 'auto', // 'auto', 'primary', 'emerald', 'amber', 'rose'
  className = '',
}) => {
  const clamped = Math.min(Math.max(progress, 0), 100);

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getAutoColor = (val) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-primary-500';
    if (val >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const colorClass =
    colorScheme === 'auto'
      ? getAutoColor(clamped)
      : colorScheme === 'primary'
      ? 'bg-primary-600'
      : colorScheme === 'emerald'
      ? 'bg-emerald-500'
      : colorScheme === 'amber'
      ? 'bg-amber-500'
      : colorScheme === 'rose'
      ? 'bg-rose-500'
      : 'bg-primary-600';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizeHeights[size]}`}>
        <div
          className={`${sizeHeights[size]} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
