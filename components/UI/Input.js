
// components/UI/Input.js
import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300';
  const iconPadding = icon ? 'pl-10' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconPadding} ${className}`;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;