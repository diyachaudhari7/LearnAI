import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtext, trend }) => {
  const colorMap = {
    primary: 'bg-primary-50/80 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400 border-primary-100 dark:border-primary-900/50',
    secondary: 'bg-secondary-50/80 text-secondary-600 dark:bg-secondary-950/60 dark:text-secondary-400 border-secondary-100 dark:border-secondary-900/50',
    cyan: 'bg-cyan-50/80 text-cyanAccent-600 dark:bg-cyan-950/60 dark:text-cyanAccent-400 border-cyan-100 dark:border-cyan-900/50',
    emerald: 'bg-emerald-50/80 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50/80 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
  };

  return (
    <Card className="p-5 flex items-center justify-between" hover>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500/60 animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
            {title}
          </p>
        </div>
        <div className="flex items-baseline gap-2.5">
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
            {value}
          </h4>
          {trend && (
            <span className="inline-flex items-center font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {trend}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm ${colorMap[color] || colorMap.primary}`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
    </Card>
  );
};

export default StatCard;
