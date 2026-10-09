'use client';

import React from 'react';

export function Select({
  label,
  id,
  name,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  placeholder = 'Select an option...',
  ...props
}) {
  const selectId = id || name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-content-main mb-1.5">
          {label} {required && <span className="text-status-error">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full px-3.5 py-2.5 bg-surface text-content-main border rounded-theme shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm ${
          error ? 'border-status-error focus:ring-status-error' : 'border-surface-border'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs text-status-error font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1.5 text-xs text-content-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Select;
