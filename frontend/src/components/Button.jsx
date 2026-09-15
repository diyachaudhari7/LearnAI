import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-darkBg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none tracking-tight';

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-[11px] gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
    xl: 'px-7 py-3 text-base font-bold gap-3',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-1px_rgba(79,70,229,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_16px_-1px_rgba(79,70,229,0.45)] border border-primary-400/40',
    secondary: 'bg-gradient-to-b from-secondary-500 to-secondary-600 hover:from-secondary-400 hover:to-secondary-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-1px_rgba(139,92,246,0.3)] border border-secondary-400/40',
    accent: 'bg-gradient-to-b from-cyanAccent-500 to-cyanAccent-600 hover:from-cyanAccent-400 hover:to-cyanAccent-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_2px_10px_-1px_rgba(6,182,212,0.35)] border border-cyan-400/40',
    outline: 'border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white/90 dark:bg-darkCard hover:bg-slate-50 dark:hover:bg-darkCardHover text-slate-800 dark:text-slate-200 shadow-sm',
    ghost: 'hover:bg-slate-100/80 dark:hover:bg-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-sm border border-rose-400/30',
    success: 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-sm border border-emerald-400/30',
    glass: 'bg-white/80 dark:bg-white/[0.05] backdrop-blur-md border border-slate-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/[0.09] text-slate-900 dark:text-slate-100 shadow-sm hover:shadow',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
