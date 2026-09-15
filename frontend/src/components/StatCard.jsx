import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, icon: Icon, color = 'primary', subtext, trend }) => {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400',
    secondary: 'bg-secondary-50 text-secondary-600 dark:bg-secondary-950/50 dark:text-secondary-400',
    cyan: 'bg-cyan-50 text-cyanAccent-600 dark:bg-cyan-950/50 dark:text-cyanAccent-500',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  };

  return (
    <Card className="p-5 flex items-center justify-between" hover>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-heading">{value}</h4>
          {trend && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-slate-500 dark:text-slate-400">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorMap[color] || colorMap.primary}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </Card>
  );
};

export default StatCard;
