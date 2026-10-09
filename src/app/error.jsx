'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-surface p-8 rounded-theme border border-surface-border shadow-elevation">
        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-status-error flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-content-main mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-content-muted mb-6 leading-relaxed">
          An unexpected situation interrupted your request. Please try refreshing the page or return to the main homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} variant="primary" className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
