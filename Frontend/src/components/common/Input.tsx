import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          disabled ? 'text-gray-500' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {icon}
          </div>
        )}
        <input
          className={`input-field ${icon ? 'pl-10' : ''} ${
            error ? 'input-error' : ''
          } ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : ''
          } ${className}`}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
