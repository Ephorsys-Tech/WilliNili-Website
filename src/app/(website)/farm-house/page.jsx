'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trees,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  MapPin,
  Clock,
  PartyPopper,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BgHero } from '@/components/ui/BgHero';
import { getFarmHouseContent } from '@/api/farm-house.api';
import { submitEnquiry } from '@/api/enquiry.api';

export default function FarmHousePage() {
  const [content, setContent] = useState(null);
  const [formData, setFormData] = useState({
    enquiryType: 'FarmHouse',
    name: '',
    email: '',
    mobile: '',
    eventType: 'Wedding / Reception',
    preferredDate: '',
    expectedGuests: 150,
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    getFarmHouseContent()
      .then((data) => {
        if (data) setContent(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      errs.mobile = 'Valid mobile number is required';
    }
    if (!formData.message.trim()) errs.message = 'Event details or requirements are required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitEnquiry(formData);
      setSubmittedRef(res.reference);
      setFormData({
        enquiryType: 'FarmHouse',
        name: '',
        email: '',
        mobile: '',
        eventType: 'Wedding / Reception',
        preferredDate: '',
        expectedGuests: 150,
        message: '',
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit event enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = content?.title || 'Willy Nilly Farm House & Open Event Grounds';
  const description =
    content?.description ||
    'A sprawling, picturesque agro retreat offering expansive open-air lawns, lush orchards, and natural countryside ambience for destination weddings, family celebrations, corporate offsites, and community festivals.';
  const area = content?.propertyArea || '8 Acres of Natural Greenery';
  const capacity = content?.guestCapacity || 'Ideal for 50 to 800+ Guests';
  const facilities = content?.facilities || [
    'Expansive Open Lawns with Natural Canopy',
    'Covered Dining & Banquet Pavilion',
    'Bridal & Guest Dressing Rooms',
    'Ample Secure Vehicle Parking',
    'Dedicated Catering Preparation Yard',
    'Ambient Landscape Lighting & Power Backup',
  ];
  const suitableEvents = content?.suitableEvents || [
    'Destination Weddings & Sangeet',
    'Reception & Engagement Parties',
    'Birthday & Anniversary Celebrations',
    'Corporate Retreats & Team Outings',
    'Agro Workshops & Family Gatherings',
  ];

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85"
        alt="Farm house celebration grounds with fairy lights"
        size="lg"
        align="center"
        eyebrow="Open Air Venue"
        title={
          <>
            Farm House &amp;{' '}
            <span style={{ color: '#f0d87a' }}>Event Grounds</span>
          </>
        }
        subtitle={description}
        breadcrumbs={[{ label: 'Farm House' }]}
        stats={[
          { value: area, label: 'Natural Expanse' },
          { value: '800+', label: 'Guest Capacity' },
          { value: '5+ Types', label: 'Celebration Events' },
          { value: 'Full', label: 'Power Backup' },
        ]}
        actions={
          <>
            <a
              href="#event-enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              Plan My Event
            </a>
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white hover:text-content-main transition-all"
            >
              <Send className="w-4 h-4" />
              General Enquiry
            </Link>
          </>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Facilities & Suitable Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card padding="p-8" className="space-y-6">
            <div className="w-12 h-12 rounded-theme bg-primary/10 text-primary flex items-center justify-center">
              <Trees className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-content-main">Venue Amenities &amp; Facilities</h2>
            <div className="space-y-3">
              {facilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-content-main font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="p-8" className="space-y-6">
            <div className="w-12 h-12 rounded-theme bg-secondary-light/40 text-secondary flex items-center justify-center">
              <PartyPopper className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-content-main">Ideal Event Types</h2>
            <div className="space-y-3">
              {suitableEvents.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-content-main font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Event Enquiry Section */}
        <div
          id="event-enquiry"
          className="bg-surface rounded-theme border border-surface-border p-8 sm:p-12 shadow-card max-w-4xl mx-auto space-y-8"
        >
          <div className="text-center space-y-2">
            <Badge variant="primary">Direct Enquiry</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-main">
              Plan Your Celebration at Farm House
            </h2>
            <p className="text-sm text-content-muted">
              Tell us about your event vision, expected guest count, and preferred dates. Our event manager will get back to you with custom lawn arrangements.
            </p>
          </div>

          {submittedRef && (
            <Alert variant="success" title="Event Enquiry Received">
              Your event request has been received with reference <strong className="font-mono">{submittedRef}</strong>. Our management team will contact you shortly to discuss dates and bespoke arrangements.
            </Alert>
          )}

          {errors.form && (
            <Alert variant="error" title="Submission Error">
              {errors.form}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Contact Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. Ananya Sharma"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Select
                label="Type of Event"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                options={[
                  'Wedding / Sangeet',
                  'Reception Party',
                  'Birthday / Anniversary',
                  'Corporate Offsite / Retreat',
                  'Family Gathering / Picnic',
                  'Other Custom Celebration',
                ]}
                required
              />

              <Input
                label="Preferred Date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
              />

              <Input
                label="Expected Guests"
                name="expectedGuests"
                type="number"
                min="10"
                max="2000"
                value={formData.expectedGuests}
                onChange={handleChange}
              />
            </div>

            <Textarea
              label="Event Details & Requirements"
              name="message"
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              rows={4}
              placeholder="Describe your catering requirements, decoration setup, duration, and any specific accommodations..."
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Event Enquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
