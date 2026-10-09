'use client';

import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`bg-surface-card border border-surface-border rounded-theme shadow-card transition-all duration-200 overflow-hidden ${
        hoverEffect ? 'hover:shadow-elevation hover:-translate-y-0.5' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Card;
