import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  wrapperClassName = '',
  id,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-full ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700 mb-1.5 transition-colors"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full text-sm rounded-xl border outline-none bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900 transition-all ${
            icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 ${
            error
              ? 'border-red-300 bg-red-50/20 text-red-950 placeholder-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1.5 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};
