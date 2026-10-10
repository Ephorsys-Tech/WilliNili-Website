'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  BookOpenCheck,
  Trees,
  Flower2,
  Store,
  Images,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getDashboardMetrics } from '@/api/settings.api';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getDashboardMetrics()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  const metrics = data?.metrics || {};
  const recentBookings = data?.recentBookings || [];
  const recentEnquiries = data?.recentEnquiries || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card padding="p-5" className="flex items-center justify-between border-primary/20 bg-primary-light/10">
          <div>
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wider">New Bookings</p>
            <p className="text-3xl font-extrabold text-primary mt-1">{metrics.newBookingsCount || 0}</p>
            <p className="text-[11px] text-content-light mt-1">Total: {metrics.totalBookingsCount || 0} requests</p>
          </div>
          <div className="w-12 h-12 rounded-theme bg-primary/20 text-primary flex items-center justify-center">
            <BookOpenCheck className="w-6 h-6" />
          </div>
        </Card>

        <Card padding="p-5" className="flex items-center justify-between border-amber-200 bg-amber-50/40">
          <div>
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wider">New Enquiries</p>
            <p className="text-3xl font-extrabold text-amber-700 mt-1">{metrics.newEnquiriesCount || 0}</p>
            <p className="text-[11px] text-content-light mt-1">Total: {metrics.totalEnquiriesCount || 0} submissions</p>
          </div>
          <div className="w-12 h-12 rounded-theme bg-amber-100 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </Card>

        <Card padding="p-5" className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wider">Guest Rooms</p>
            <p className="text-3xl font-extrabold text-content-main mt-1">{metrics.activeRoomsCount || 0}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Available for Request</p>
          </div>
          <div className="w-12 h-12 rounded-theme bg-surface-muted text-content-muted flex items-center justify-center">
            <BedDouble className="w-6 h-6" />
          </div>
        </Card>

        <Card padding="p-5" className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wider">Shop Rental Status</p>
            <div className="mt-1">
              <Badge variant={metrics.shopRentalActive ? 'success' : 'neutral'}>
                {metrics.shopRentalActive ? 'Module Active' : 'Module Inactive'}
              </Badge>
            </div>
            <p className="text-[11px] text-content-light mt-1">{metrics.activeShopsCount || 0} Units Listed</p>
          </div>
          <div className="w-12 h-12 rounded-theme bg-surface-muted text-content-muted flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Two Column Section: Recent Bookings & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Booking Requests */}
        <Card padding="p-6" className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-content-main">Recent Booking Requests</h2>
            </div>
            <Link href="/admin/bookings">
              <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="text-xs text-content-muted py-6 text-center">No booking requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-3 rounded-theme bg-surface-muted/40 border border-surface-border flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate">
                    <p className="font-semibold text-content-main truncate">{b.guestName}</p>
                    <p className="text-[11px] text-content-muted font-mono">{b.bookingReference}</p>
                    <p className="text-[11px] text-content-light">
                      Check-in: {new Date(b.checkInDate).toLocaleDateString()} &bull; {b.guestCount} guests
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge
                      variant={
                        b.status === 'New'
                          ? 'warning'
                          : b.status === 'Confirmed'
                          ? 'success'
                          : b.status === 'Declined'
                          ? 'error'
                          : 'info'
                      }
                    >
                      {b.status}
                    </Badge>
                    <span className="text-[10px] text-content-light">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Enquiries */}
        <Card padding="p-6" className="space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-content-main">Recent Enquiries & Messages</h2>
            </div>
            <Link href="/admin/enquiries">
              <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-content-muted py-6 text-center">No enquiries recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((e) => (
                <div
                  key={e._id}
                  className="p-3 rounded-theme bg-surface-muted/40 border border-surface-border flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate">
                    <p className="font-semibold text-content-main truncate">{e.name}</p>
                    <p className="text-[11px] text-content-muted font-mono">{e.reference}</p>
                    <p className="text-[11px] text-content-light truncate">
                      {e.enquiryType}: {e.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Badge variant={e.status === 'New' ? 'warning' : 'neutral'}>
                      {e.status}
                    </Badge>
                    <span className="text-[10px] text-content-light">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Shortcuts */}
      <Card padding="p-6" className="space-y-4">
        <h3 className="text-sm font-bold text-content-main uppercase tracking-wider">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/admin/guest-house" className="p-3.5 rounded-theme border border-surface-border hover:border-primary hover:bg-primary-light/10 transition-colors text-center block">
            <BedDouble className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-xs font-medium text-content-main">Manage Rooms</span>
          </Link>
          <Link href="/admin/horticulture" className="p-3.5 rounded-theme border border-surface-border hover:border-primary hover:bg-primary-light/10 transition-colors text-center block">
            <Flower2 className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-xs font-medium text-content-main">Manage Plants</span>
          </Link>
          <Link href="/admin/gallery" className="p-3.5 rounded-theme border border-surface-border hover:border-primary hover:bg-primary-light/10 transition-colors text-center block">
            <Images className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-xs font-medium text-content-main">Curate Gallery</span>
          </Link>
          {/* <Link href="/admin/business-info" className="p-3.5 rounded-theme border border-surface-border hover:border-primary hover:bg-primary-light/10 transition-colors text-center block">
            <Trees className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-xs font-medium text-content-main">Business Info</span>
          </Link> */}
        </div>
      </Card>
    </div>
  );
}
