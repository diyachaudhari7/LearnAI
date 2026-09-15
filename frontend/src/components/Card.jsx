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
          ? 'glass-panel border-white/40 dark:border-darkBorder shadow-soft'
          : 'bg-white dark:bg-darkCard border-slate-200/80 dark:border-darkBorder shadow-sm'
      } ${
        hover
          ? 'hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500/40 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
