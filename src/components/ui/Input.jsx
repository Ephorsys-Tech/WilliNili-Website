'use client';

import React from 'react';

export function Input({
  label,
  id,
  name,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-content-main mb-1.5">
          {label} {required && <span className="text-status-error">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full px-3.5 py-2.5 bg-surface text-content-main border rounded-theme shadow-sm placeholder:text-content-light/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
          error ? 'border-status-error focus:ring-status-error' : 'border-surface-border'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-status-error font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-content-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
