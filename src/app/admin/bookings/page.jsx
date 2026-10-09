'use client';

import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Search, Filter, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getAdminBookings, updateBookingStatus } from '@/api/booking.api';

const STATUSES = ['All', 'New', 'Under Review', 'Confirmed', 'Declined', 'Cancelled'];

export default function BookingsAdminPage() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchBookings = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await getAdminBookings({
        page,
        status: selectedStatus === 'All' ? '' : selectedStatus,
        search,
      });
      if (res?.items) {
        setBookings(res.items);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: res.items.length });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, [selectedStatus, search]);

  const handleOpenDetail = (b) => {
    setSelectedBooking(b);
    setNewStatus(b.status);
    setAdminNotes(b.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setIsUpdating(true);
    setAlertState(null);

    try {
      const updated = await updateBookingStatus(selectedBooking._id, {
        status: newStatus,
        adminNotes,
      });
      setAlertState({ type: 'success', message: `Booking ${updated.bookingReference} status updated to ${newStatus}.` });
      setSelectedBooking(null);
      fetchBookings(pagination.page);
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating booking.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Guest House Booking Requests</h2>
          <p className="text-xs text-content-muted">Review, verify room availability, and transition guest booking requests.</p>
        </div>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Updated' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search reference, guest, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                selectedStatus === st
                  ? 'bg-primary text-content-inverted border-primary'
                  : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Fetching booking records..." />
      ) : bookings.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <BookOpenCheck className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No booking requests found</p>
          <p className="text-xs text-content-muted mt-1">There are no requests matching this filter criteria.</p>
        </Card>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-content-main">
              <thead className="bg-surface-muted/60 text-content-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Guest</th>
                  <th className="p-4">Room Selected</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{b.bookingReference}</td>
                    <td className="p-4">
                      <p className="font-semibold text-content-main">{b.guestName}</p>
                      <p className="text-[11px] text-content-muted">{b.mobile} &bull; {b.email}</p>
                    </td>
                    <td className="p-4 font-medium text-content-main">
                      {b.room?.name || 'Assigned Room'}
                    </td>
                    <td className="p-4">
                      <p>{new Date(b.checkInDate).toLocaleDateString()} to</p>
                      <p>{new Date(b.checkOutDate).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">{b.guestCount} Guests ({b.roomsCount || 1} Room)</td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleOpenDetail(b)}>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Review Modal */}
      {selectedBooking && (
        <Modal
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Request: ${selectedBooking.bookingReference}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs text-content-main">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-theme bg-surface-muted/60 border border-surface-border">
              <div>
                <p className="text-content-muted font-medium">Guest Name</p>
                <p className="text-sm font-bold text-content-main mt-0.5">{selectedBooking.guestName}</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Contact Details</p>
                <p className="font-medium mt-0.5">{selectedBooking.mobile}</p>
                <p className="text-content-muted">{selectedBooking.email}</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Requested Room</p>
                <p className="font-semibold mt-0.5">{selectedBooking.room?.name || 'Selected Room'}</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Guests & Rooms</p>
                <p className="font-semibold mt-0.5">{selectedBooking.guestCount} Guests, {selectedBooking.roomsCount} Rooms</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Check-in Date</p>
                <p className="font-semibold mt-0.5">{new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Check-out Date</p>
                <p className="font-semibold mt-0.5">{new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
              </div>
            </div>

            {selectedBooking.specialRequest && (
              <div className="p-3 bg-amber-50 rounded-theme border border-amber-200">
                <p className="font-semibold text-amber-900 mb-0.5">Guest Note / Special Request:</p>
                <p className="text-amber-800">{selectedBooking.specialRequest}</p>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-surface-border">
              <h4 className="font-bold text-sm text-content-main">Update Status & Notes</h4>

              <Select
                label="Request Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={['New', 'Under Review', 'Confirmed', 'Declined', 'Cancelled']}
                required
              />

              <Textarea
                label="Internal Admin Notes (Logged to Audit History)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Called guest on phone; confirmed room availability for 2 nights..."
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                <Button type="submit" variant="primary" isLoading={isUpdating}>
                  Save Status Change
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
