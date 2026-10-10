'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BgHero } from '@/components/ui/BgHero';
import { getPublicSettings } from '@/api/settings.api';
import { submitEnquiry } from '@/api/enquiry.api';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    enquiryType: 'Contact',
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted && data) setSettings(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      errs.mobile = 'Valid phone is required';
    }
    if (!formData.message.trim()) errs.message = 'Please enter your message';

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
        enquiryType: 'Contact',
        name: '',
        email: '',
        mobile: '',
        message: '',
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = settings?.phonePrimary || '+91 98765 43210';
  const phoneAlt = settings?.phoneSecondary || '+91 98765 43211';
  const email = settings?.emailPrimary || 'info@willynilly.in';
  const address = settings?.address || 'Willy Nilly Agro Campus, Green Valley, India';
  const hours = settings?.businessHours || 'Guest House: 24/7 Check-in | Nursery: 8 AM - 6 PM';

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=85"
        alt="Willy Nilly campus pathway at dusk"
        size="sm"
        align="center"
        eyebrow="Connect With Us"
        title={
          <>
            Get in <span style={{ color: '#f0d87a' }}>Touch</span>
          </>
        }
        subtitle="Reach out for stay reservations, farm house celebration dates, sapling availability, or directions to our campus. We're here to help."
        breadcrumbs={[{ label: 'Contact Us' }]}
        stats={[
          { value: '24/7', label: 'Guest House Reception' },
          { value: '< 24h', label: 'Response Time' },
          { value: 'On-Call', label: 'Estate Concierge' },
          { value: 'Free', label: 'Campus Parking' },
        ]}
        actions={
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            Send a Message
          </a>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div
        id="contact-form"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information & Location Guide */}
          <div className="space-y-8">
            <Card padding="p-8" className="space-y-6">
              <h2 className="text-2xl font-bold text-content-main">Campus Information</h2>

              <div className="space-y-5 text-sm text-content-muted">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-main">Campus Address</h4>
                    <p className="mt-0.5 leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-main">Telephone Lines</h4>
                    <p className="mt-0.5">Primary: {phone}</p>
                    <p>Alternate: {phoneAlt}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-main">Official Email</h4>
                    <p className="mt-0.5">{email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-content-main">Operating Schedule</h4>
                    <p className="mt-0.5">{hours}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="p-6" className="bg-surface-muted/50 border-surface-border">
              <h3 className="text-base font-semibold text-content-main mb-2">Location &amp; Transit Note</h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Located directly off the State Highway with expansive on-site parking for cars and private buses. Look for the official Willy Nilly Horticulture entrance arch.
              </p>
            </Card>
          </div>

          {/* Message Form */}
          <div>
            <Card padding="p-8 sm:p-10" className="shadow-elevation space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-content-main">Send Us a Direct Message</h2>
                <p className="text-xs text-content-muted mt-1">
                  We respond to all verified public inquiries within 24 business hours.
                </p>
              </div>

              {submittedRef && (
                <Alert variant="success" title="Message Received">
                  Your message has been registered with reference <strong className="font-mono">{submittedRef}</strong>. Our management office will contact you shortly.
                </Alert>
              )}

              {errors.form && (
                <Alert variant="error" title="Submission Error">
                  {errors.form}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                </div>

                <Textarea
                  label="Message or Query"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="How can we assist your stay, event, or horticulture inquiry?"
                  rows={4}
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
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
