'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getAdminSession, logoutAdmin } from '@/api/auth.api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getAdminSession()
      .then((data) => {
        if (isMounted && data?.admin) {
          setAdmin(data.admin);
        }
      })
      .catch(() => {
        if (isMounted) {
          router.push('/admin/login');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      router.push('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <LoadingSpinner size="lg" text="Authenticating administrator session..." />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  // Derive dynamic page title based on path
  const pageTitles = {
    '/admin': { title: 'Dashboard Overview', subtitle: 'Live metrics, booking requests, and enquiry pipelines' },
    '/admin/business-info': { title: 'Business Profile & Vision', subtitle: 'Manage company description, founder profile, and hours' },
    '/admin/guest-house': { title: 'Guest House Management', subtitle: 'Manage room configurations, tariffs, photos, and amenities' },
    '/admin/bookings': { title: 'Booking Requests Register', subtitle: 'Review, accept, or decline guest reservation requests' },
    '/admin/farm-house': { title: 'Farm House & Lawn Grounds', subtitle: 'Manage event capacity, venue facilities, and photos' },
    '/admin/resort': { title: 'Upcoming Eco-Resort', subtitle: 'Manage concept text, launch status, and planned amenities' },
    '/admin/horticulture': { title: 'Horticulture & Nursery Catalogue', subtitle: 'Manage plants, saplings, pricing, and stock availability' },
    '/admin/shop-rental': { title: 'Commercial Shop Rental', subtitle: 'Toggle module activation and manage commercial listings' },
    '/admin/gallery': { title: 'Campus Photo Gallery', subtitle: 'Upload, categorize, sort, and publish verified photos' },
    '/admin/enquiries': { title: 'Enquiries & Customer Messages', subtitle: 'Track and follow up on Farm House, Horticulture, and general enquiries' },
    '/admin/settings': { title: 'Website Settings & Theme', subtitle: 'Configure dynamic color palettes and system modules' },
  };

  const currentMeta = pageTitles[pathname] || { title: 'Admin Console', subtitle: 'Management Area' };

  return (
    <div className="min-h-screen flex bg-bg">
      <AdminSidebar onLogout={handleLogout} currentAdmin={admin} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={currentMeta.title} subtitle={currentMeta.subtitle} />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
