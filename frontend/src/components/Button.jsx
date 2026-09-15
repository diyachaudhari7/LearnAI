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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
    xl: 'px-7 py-3.5 text-lg font-semibold gap-3',
  };

  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 focus:ring-primary-500 border border-primary-500/30',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md shadow-secondary-500/20 focus:ring-secondary-500 border border-secondary-500/30',
    accent: 'bg-cyanAccent-500 hover:bg-cyanAccent-600 text-white shadow-md shadow-cyanAccent-500/20 focus:ring-cyan-500',
    outline: 'border border-slate-300 dark:border-darkBorder hover:bg-slate-100 dark:hover:bg-darkCardHover text-slate-700 dark:text-slate-200 focus:ring-slate-400',
    ghost: 'hover:bg-slate-100 dark:hover:bg-darkCardHover text-slate-700 dark:text-slate-200 focus:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 focus:ring-rose-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 focus:ring-emerald-500',
    glass: 'bg-white/70 dark:bg-darkCard/70 backdrop-blur-md border border-white/20 dark:border-darkBorder hover:bg-white dark:hover:bg-darkCard text-slate-800 dark:text-slate-100 shadow-soft',
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
