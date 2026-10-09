'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export function Alert({ variant = 'info', title, children, className = '' }) {
  const styles = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    },
  };

  const current = styles[variant] || styles.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 border rounded-theme shadow-sm text-sm ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1 text-sm">{title}</h4>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default Alert;
