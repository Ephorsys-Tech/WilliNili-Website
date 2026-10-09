'use client';

import React, { useState } from 'react';
import {
  BedDouble,
  Trees,
  Flower2,
  ShieldCheck,
  Lock,
  Send,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import { submitBookingRequest } from '@/api/booking.api';
import { submitEnquiry } from '@/api/enquiry.api';

export function EstateConciergeSection({ rooms = [] }) {
  const [activeTab, setActiveTab] = useState('stay'); // 'stay' | 'event' | 'flora'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    checkOutDate: '',
    selectedRoom: rooms[0]?._id || '',
    guestCount: 2,
    eventType: 'Destination Wedding',
    expectedGuests: 150,
    specificRequests: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSubmissionSuccess(null);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSubmissionSuccess(null);

    try {
      if (activeTab === 'stay') {
        // Prepare Guest House Booking Request
        const checkIn = new Date(formData.preferredDate);
        if (isNaN(checkIn.getTime())) {
          throw new Error('Please select a valid check-in date');
        }

        let checkOut;
        if (formData.checkOutDate) {
          checkOut = new Date(formData.checkOutDate);
        } else {
          // Default to next day
          checkOut = new Date(checkIn.getTime() + 24 * 60 * 60 * 1000);
        }

        if (checkOut <= checkIn) {
          throw new Error('Check-out date must be after check-in date');
        }

        const roomId = formData.selectedRoom || rooms[0]?._id;
        if (!roomId) {
          throw new Error('No rooms currently available for booking');
        }

        const payload = {
          guestName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          guestCount: Number(formData.guestCount) || 2,
          roomsCount: 1,
          room: roomId,
          specialRequest: formData.specificRequests.trim(),
        };

        const res = await submitBookingRequest(payload);
        setSubmissionSuccess({
          type: 'booking',
          reference: res.bookingReference,
          message: 'Your guest house reservation enquiry has been registered directly with the estate concierge.',
        });
      } else if (activeTab === 'event') {
        // Farm House Event Enquiry
        const eventDate = formData.preferredDate ? new Date(formData.preferredDate) : undefined;

        const payload = {
          enquiryType: 'FarmHouse',
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          message: formData.specificRequests.trim() || `Event Enquiry: ${formData.eventType} for ${formData.expectedGuests} guests.`,
          eventType: formData.eventType,
          preferredDate: eventDate ? eventDate.toISOString() : undefined,
          expectedGuests: Number(formData.expectedGuests) || 100,
        };

        const res = await submitEnquiry(payload);
        setSubmissionSuccess({
          type: 'event',
          reference: res.reference,
          message: 'Your Farm House celebration enquiry has been submitted. Our event coordinator will contact you shortly.',
        });
      } else {
        // General / Flora Enquiry
        const payload = {
          enquiryType: 'General',
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.phone.trim(),
          message: formData.specificRequests.trim() || 'General inquiry regarding botanical plants and estate visit.',
        };

        const res = await submitEnquiry(payload);
        setSubmissionSuccess({
          type: 'flora',
          reference: res.reference,
          message: 'Your inquiry has been received. Our horticultural team will respond with full details.',
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit enquiry. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(null);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      preferredDate: '',
      checkOutDate: '',
      selectedRoom: rooms[0]?._id || '',
      guestCount: 2,
      eventType: 'Destination Wedding',
      expectedGuests: 150,
      specificRequests: '',
    });
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Eyebrow & Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-secondary/15 border border-secondary/25 text-secondary text-xs font-bold uppercase tracking-widest shadow-sm">
          <span>Estate Direct Concierge</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-main tracking-tight">
          Reserve Your Dates &amp; Submit Enquiry
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-content-muted leading-relaxed">
          Whether planning an overnight orchard stay, a grand birthday celebration, or a botanical plant order, share your details below for personalized estate coordination.
        </p>
      </div>

      {/* Main Concierge Card */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-elevation overflow-hidden">
        {/* Top Tab Bar */}
        <div className="grid grid-cols-3 border-b border-surface-border bg-surface-muted/40">
          <button
            type="button"
            onClick={() => handleTabChange('stay')}
            className={`py-4 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'stay'
                ? 'bg-surface text-primary border-primary shadow-sm'
                : 'text-content-muted hover:text-content-main border-transparent hover:bg-surface-muted/60'
            }`}
          >
            <BedDouble className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">BOOK A GUEST STAY</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('event')}
            className={`py-4 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'event'
                ? 'bg-surface text-primary border-primary shadow-sm'
                : 'text-content-muted hover:text-content-main border-transparent hover:bg-surface-muted/60'
            }`}
          >
            <Trees className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">FARM HOUSE EVENT</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('flora')}
            className={`py-4 px-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
              activeTab === 'flora'
                ? 'bg-surface text-primary border-primary shadow-sm'
                : 'text-content-muted hover:text-content-main border-transparent hover:bg-surface-muted/60'
            }`}
          >
            <Flower2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">GENERAL INQUIRY / FLORA</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {submissionSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-content-main">
                  Enquiry Successfully Registered!
                </h3>
                <p className="text-sm text-content-muted max-w-lg mx-auto">
                  {submissionSuccess.message}
                </p>
              </div>

              <div className="inline-block p-4 rounded-theme bg-surface-muted border border-surface-border">
                <span className="text-xs uppercase tracking-wider text-content-muted block">
                  Reference Identifier
                </span>
                <span className="text-xl font-mono font-bold text-primary tracking-wider mt-0.5 block">
                  {submissionSuccess.reference}
                </span>
              </div>

              <div className="pt-2">
                <Button onClick={handleReset} variant="outline" size="sm">
                  Submit Another Enquiry
                </Button>
              </div>
            </div>
          ) : (
            /* Interactive Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <Alert variant="error" title="Submission Issue">
                  {errorMessage}
                </Alert>
              )}

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Your Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aditi Sharma"
                  required
                />
                <Input
                  label="Contact Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>

              {/* Row 2: Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aditi@example.com"
                  required
                />

                <Input
                  label={
                    activeTab === 'stay'
                      ? 'Preferred Check-In Date *'
                      : activeTab === 'event'
                      ? 'Preferred Event Date *'
                      : 'Approximate Visit Date'
                  }
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required={activeTab !== 'flora'}
                />
              </div>

              {/* Context Row: Stay specifics or Event specifics */}
              {activeTab === 'stay' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <Select
                      label="Select Room Preference"
                      name="selectedRoom"
                      value={formData.selectedRoom || (rooms[0]?._id || '')}
                      onChange={handleChange}
                      options={
                        rooms.length > 0
                          ? rooms.map((r) => ({
                              value: r._id,
                              label: `${r.name} (${r.roomType} ${r.isAc ? 'AC' : 'Non-AC'}) — ₹${r.pricePerNight}/night`,
                            }))
                          : [{ value: '', label: 'Standard Guest House Room' }]
                      }
                    />
                  </div>

                  <Input
                    label="Guest Count"
                    type="number"
                    name="guestCount"
                    min="1"
                    max="30"
                    value={formData.guestCount}
                    onChange={handleChange}
                  />
                </div>
              )}

              {activeTab === 'event' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Event Celebration Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    options={[
                      'Destination Wedding',
                      'Reception Ceremony',
                      'Birthday or Anniversary',
                      'Corporate Retreat / Offsite',
                      'Agro Workshop / Gathering',
                      'Other Celebration',
                    ]}
                  />

                  <Input
                    label="Estimated Guest Count"
                    type="number"
                    name="expectedGuests"
                    min="20"
                    max="1500"
                    value={formData.expectedGuests}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                  />
                </div>
              )}

              {/* Textarea */}
              <Textarea
                label="Specific Requests or Guest Count *"
                name="specificRequests"
                value={formData.specificRequests}
                onChange={handleChange}
                placeholder="Specify number of guests, rooms required, or botanical inquiries..."
                rows={3}
                required
              />

              {/* Verified Estate Protocol Banner */}
              <div className="flex items-start gap-3 p-4 rounded-theme bg-primary-light/40 border border-primary/20 text-xs text-primary-dark">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Verified Estate Protocol:</strong> Requests are reviewed directly by the Estate Administrator. No online payment is required during this initial enquiry stage. You will receive a direct confirmation call or email.
                </p>
              </div>

              {/* Footer Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-border">
                <div className="flex items-center gap-1.5 text-xs text-content-muted">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your information is kept private &bull; Never shared</span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto shadow-sm"
                >
                  <span>SUBMIT RESERVATION ENQUIRY</span>
                  <span className="ml-1.5 text-xs">▷</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
