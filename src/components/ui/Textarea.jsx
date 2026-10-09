'use client';

import React from 'react';

export function Textarea({
  label,
  id,
  name,
  error,
  helperText,
  required = false,
  rows = 4,
  className = '',
  ...props
}) {
  const textareaId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-content-main mb-1.5">
          {label} {required && <span className="text-status-error">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        className={`w-full px-3.5 py-2.5 bg-surface text-content-main border rounded-theme shadow-sm placeholder:text-content-light/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm resize-y ${
          error ? 'border-status-error focus:ring-status-error' : 'border-surface-border'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-status-error font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${textareaId}-helper`} className="mt-1.5 text-xs text-content-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Textarea;
