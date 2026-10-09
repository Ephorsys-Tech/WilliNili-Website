'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getAdminEnquiries, updateEnquiryStatus } from '@/api/enquiry.api';

const TYPES = ['All', 'FarmHouse', 'Horticulture', 'ShopRental', 'General', 'Contact'];
const STATUSES = ['All', 'New', 'Contacted', 'In Progress', 'Closed', 'Archived'];

export default function EnquiriesAdminPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchEnquiries = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await getAdminEnquiries({
        page,
        type: selectedType === 'All' ? '' : selectedType,
        status: selectedStatus === 'All' ? '' : selectedStatus,
        search,
      });
      if (res?.items) {
        setEnquiries(res.items);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: res.items.length });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(1);
  }, [selectedType, selectedStatus, search]);

  const handleOpenDetail = (e) => {
    setSelectedEnquiry(e);
    setNewStatus(e.status);
    setAdminNotes(e.adminNotes || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    setAlertState(null);

    try {
      const updated = await updateEnquiryStatus(selectedEnquiry._id, {
        status: newStatus,
        adminNotes,
      });
      setAlertState({ type: 'success', message: `Enquiry ${updated.reference} status updated to ${newStatus}.` });
      setSelectedEnquiry(null);
      fetchEnquiries(pagination.page);
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating enquiry.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Enquiries & Customer Pipeline</h2>
          <p className="text-xs text-content-muted">Manage all inbound service requests, event enquiries, and messages.</p>
        </div>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Updated' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search reference, customer, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                selectedType === t
                  ? 'bg-primary text-content-inverted border-primary'
                  : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedStatus(s)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${
                selectedStatus === s
                  ? 'bg-secondary text-content-inverted border-secondary'
                  : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Fetching enquiries..." />
      ) : enquiries.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <MessageSquare className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No enquiries found</p>
          <p className="text-xs text-content-muted mt-1">No customer submissions match your filter.</p>
        </Card>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-content-main">
              <thead className="bg-surface-muted/60 text-content-muted font-semibold uppercase tracking-wider border-b border-surface-border">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Subject / Item</th>
                  <th className="p-4">Received</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {enquiries.map((e) => (
                  <tr key={e._id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{e.reference}</td>
                    <td className="p-4">
                      <Badge variant="primary">{e.enquiryType}</Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-content-main">{e.name}</p>
                      <p className="text-[11px] text-content-muted">{e.mobile}</p>
                    </td>
                    <td className="p-4 max-w-xs truncate text-content-muted">
                      {e.eventType || e.plantName || e.shopTitle || e.message}
                    </td>
                    <td className="p-4 text-content-light">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={e.status === 'New' ? 'warning' : 'neutral'}>
                        {e.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => handleOpenDetail(e)}>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail & Follow-up Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={Boolean(selectedEnquiry)}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.reference} (${selectedEnquiry.enquiryType})`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-xs text-content-main">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-theme bg-surface-muted/60 border border-surface-border">
              <div>
                <p className="text-content-muted font-medium">Customer Name</p>
                <p className="text-sm font-bold text-content-main mt-0.5">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-content-muted font-medium">Contact</p>
                <p className="font-semibold mt-0.5">{selectedEnquiry.mobile}</p>
                <p className="text-content-muted">{selectedEnquiry.email}</p>
              </div>
              {selectedEnquiry.eventType && (
                <div>
                  <p className="text-content-muted font-medium">Event Type</p>
                  <p className="font-semibold mt-0.5">{selectedEnquiry.eventType}</p>
                </div>
              )}
              {selectedEnquiry.preferredDate && (
                <div>
                  <p className="text-content-muted font-medium">Preferred Date</p>
                  <p className="font-semibold mt-0.5">{new Date(selectedEnquiry.preferredDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedEnquiry.expectedGuests && (
                <div>
                  <p className="text-content-muted font-medium">Expected Guests</p>
                  <p className="font-semibold mt-0.5">{selectedEnquiry.expectedGuests} Guests</p>
                </div>
              )}
              {selectedEnquiry.plantName && (
                <div>
                  <p className="text-content-muted font-medium">Horticulture Plant</p>
                  <p className="font-semibold mt-0.5">{selectedEnquiry.plantName} (Qty: {selectedEnquiry.plantQuantity || 1})</p>
                </div>
              )}
              {selectedEnquiry.shopTitle && (
                <div>
                  <p className="text-content-muted font-medium">Shop Unit</p>
                  <p className="font-semibold mt-0.5">{selectedEnquiry.shopTitle}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface rounded-theme border border-surface-border space-y-1">
              <p className="font-semibold text-content-main">Customer Message / Requirements:</p>
              <p className="text-content-muted whitespace-pre-line leading-relaxed">{selectedEnquiry.message}</p>
            </div>

            {/* Status & Notes update */}
            <form onSubmit={handleUpdate} className="space-y-4 pt-2 border-t border-surface-border">
              <h4 className="font-bold text-sm text-content-main">Follow-up Management</h4>

              <Select
                label="Enquiry Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={['New', 'Contacted', 'In Progress', 'Closed', 'Archived']}
                required
              />

              <Textarea
                label="Internal Admin Notes (Logged in History)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Record customer conversation, pricing discussed, or actions taken..."
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setSelectedEnquiry(null)}>
                  Close
                </Button>
                <Button type="submit" variant="primary" isLoading={isUpdating}>
                  Update Follow-up Status
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
