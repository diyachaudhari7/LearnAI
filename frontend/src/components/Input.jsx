import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border bg-white dark:bg-darkCard text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors py-2.5 text-sm ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-400 dark:border-rose-600'
              : 'border-slate-300 dark:border-darkBorder focus:ring-primary-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export default Input;
