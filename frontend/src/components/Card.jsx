import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'glass-panel border-slate-200/80 dark:border-white/10 shadow-card dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.3)]'
          : 'bg-white dark:bg-darkCard border-slate-200/80 dark:border-white/[0.08] shadow-card dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)]'
      } ${
        hover
          ? 'hover:shadow-card-hover hover:border-slate-300 dark:hover:border-primary-500/40 dark:hover:bg-[#131C30] hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
