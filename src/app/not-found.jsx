import Link from 'next/link';
import { Compass, Home, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-surface p-8 rounded-theme border border-surface-border shadow-elevation">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary-light/50 text-primary flex items-center justify-center mb-6">
          <Compass className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">
          404 Not Found
        </span>
        <h2 className="text-2xl font-bold text-content-main mb-3">
          Destination Unreachable
        </h2>
        <p className="text-sm text-content-muted mb-8 leading-relaxed">
          The sanctuary page or listing you are looking for does not exist, has been archived, or may be temporarily inactive.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Visit Homepage
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <PhoneCall className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
