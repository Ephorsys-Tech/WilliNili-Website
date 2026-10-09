'use client';

import React from 'react';

export function Badge({ children, variant = 'info', size = 'sm', className = '' }) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    primary: 'bg-primary-light text-primary-dark border-primary/20',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${variants[variant] || variants.info} ${
        sizes[size] || sizes.sm
      } ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
