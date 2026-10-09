'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { getPublicRooms } from '@/api/room.api';
import { submitBookingRequest } from '@/api/booking.api';

export default function BookingRequestPage() {
  const searchParams = useSearchParams();
  const preselectedRoomId = searchParams.get('room') || '';

  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guestName: '',
    mobile: '',
    email: '',
    checkInDate: '',
    checkOutDate: '',
    guestCount: 2,
    roomsCount: 1,
    room: preselectedRoomId,
    specialRequest: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  useEffect(() => {
    getPublicRooms()
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data);
          if (preselectedRoomId && !formData.room) {
            setFormData((prev) => ({ ...prev, room: preselectedRoomId }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, [preselectedRoomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.guestName.trim()) errs.guestName = 'Guest name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      errs.mobile = 'Valid phone number is required';
    }
    if (!formData.checkInDate) errs.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) errs.checkOutDate = 'Check-out date is required';
    if (formData.checkInDate && formData.checkOutDate && formData.checkOutDate <= formData.checkInDate) {
      errs.checkOutDate = 'Check-out must be strictly after check-in';
    }
    if (!formData.room) errs.room = 'Please select a room';
    if (Number(formData.guestCount) < 1) errs.guestCount = 'At least 1 guest required';
    if (Number(formData.roomsCount) < 1) errs.roomsCount = 'At least 1 room required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await submitBookingRequest(formData);
      setSubmissionSuccess(response);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit booking request. Please check inputs and retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Min date today
  const todayStr = new Date().toISOString().split('T')[0];

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
        <Card padding="p-8 sm:p-10" className="border-emerald-200 bg-surface shadow-elevation text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <Badge variant="success" className="mb-2">Request Received</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
              Booking Request Submitted
            </h1>
            <p className="text-sm text-content-muted mt-2">
              Thank you, <strong>{submissionSuccess.guestName}</strong>. Your stay request has been assigned reference:
            </p>
            <div className="mt-4 p-3 bg-surface-muted rounded-theme font-mono font-bold text-lg text-primary border border-surface-border inline-block">
              {submissionSuccess.bookingReference}
            </div>
          </div>

          <div className="text-left bg-surface-muted/60 p-4 rounded-theme text-xs text-content-muted space-y-2 border border-surface-border">
            <p>
              <strong>Status:</strong> Under Review by Administration
            </p>
            <p>
              <strong>Check-in:</strong> {new Date(submissionSuccess.checkInDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong> {new Date(submissionSuccess.checkOutDate).toLocaleDateString()}
            </p>
            <p className="pt-2 text-content-main">
              Our hospitality coordinator will check room availability against our master register and call or email you shortly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/guest-house">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View Other Rooms
              </Button>
            </Link>
            <Link href="/">
              <Button variant="primary">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const roomOptions = rooms.map((r) => ({
    value: r._id,
    label: `${r.name} (${r.roomType} - ${r.isAc ? 'AC' : 'Non-AC'}${r.priceDisplay ? ` - ₹${r.pricePerNight}/night` : ''})`,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <Badge variant="primary">Reservation Form</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-main tracking-tight">
          Guest House Booking Request
        </h1>
        <p className="text-sm text-content-muted max-w-xl mx-auto">
          Please fill in your dates and room preference. Submissions are processed as booking requests awaiting administrator review.
        </p>
      </div>

      <Alert variant="info" title="Reservation Request Notice">
        In accordance with Willy Nilly booking policy, no instant payment or immediate room locking occurs on submission. You will receive direct confirmation from our manager after reviewing the dates.
      </Alert>

      {errors.form && (
        <Alert variant="error" title="Submission Error">
          {errors.form}
        </Alert>
      )}

      <Card padding="p-6 sm:p-8" className="shadow-elevation">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Guest Full Name"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              error={errors.guestName}
              placeholder="e.g. Ramesh Kumar"
              required
            />

            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Check-in Date"
              name="checkInDate"
              type="date"
              min={todayStr}
              value={formData.checkInDate}
              onChange={handleChange}
              error={errors.checkInDate}
              required
            />

            <Input
              label="Check-out Date"
              name="checkOutDate"
              type="date"
              min={formData.checkInDate || todayStr}
              value={formData.checkOutDate}
              onChange={handleChange}
              error={errors.checkOutDate}
              required
            />
          </div>

          <Select
            label="Select Accommodation Room"
            name="room"
            value={formData.room}
            onChange={handleChange}
            options={roomOptions}
            error={errors.room}
            placeholder="-- Choose from Available Rooms --"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Total Guests"
              name="guestCount"
              type="number"
              min="1"
              max="50"
              value={formData.guestCount}
              onChange={handleChange}
              error={errors.guestCount}
              required
            />

            <Input
              label="Number of Rooms"
              name="roomsCount"
              type="number"
              min="1"
              max="20"
              value={formData.roomsCount}
              onChange={handleChange}
              error={errors.roomsCount}
              required
            />
          </div>

          <Textarea
            label="Special Requests / Dietary / Arrival Notes (Optional)"
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            rows={3}
            placeholder="Specify late check-in, extra bedding, or travel requirements..."
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Submit Booking Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
