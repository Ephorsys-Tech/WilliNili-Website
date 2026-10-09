'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-theme transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm select-none';

  const variants = {
    primary:
      'bg-primary text-content-inverted hover:bg-primary-hover focus:ring-primary shadow-card active:scale-[0.98]',
    secondary:
      'bg-secondary text-content-inverted hover:bg-secondary-hover focus:ring-secondary active:scale-[0.98]',
    outline:
      'border border-primary text-primary hover:bg-primary-light/20 focus:ring-primary bg-transparent',
    ghost:
      'text-content-main hover:bg-surface-muted focus:ring-primary bg-transparent shadow-none',
    danger:
      'bg-status-error text-white hover:bg-red-700 focus:ring-red-600',
    white:
      'bg-white text-content-main hover:bg-gray-100 focus:ring-white shadow-card',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
}

export default Button;
