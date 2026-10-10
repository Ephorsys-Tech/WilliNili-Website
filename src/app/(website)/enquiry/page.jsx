'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BgHero } from '@/components/ui/BgHero';
import { submitEnquiry } from '@/api/enquiry.api';

export default function GeneralEnquiryPage() {
  const [formData, setFormData] = useState({
    enquiryType: 'General',
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

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
      errs.email = 'Valid email is required';
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      errs.mobile = 'Valid phone number is required';
    }
    if (!formData.message.trim()) errs.message = 'Please specify your requirements or enquiry';

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
        enquiryType: 'General',
        name: '',
        email: '',
        mobile: '',
        message: '',
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <BgHero
        image="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=2000&q=85"
        alt="Fresh organic farm produce at sunrise"
        size="sm"
        align="center"
        eyebrow="Agro Tourism Desk"
        title={
          <>
            General <span style={{ color: '#f0d87a' }}>Service Enquiry</span>
          </>
        }
        subtitle="Need custom agro arrangements, group visits, school farming workshops, or general assistance? Submit your enquiry below and we'll get right back to you."
        breadcrumbs={[{ label: 'Enquiry' }]}
        actions={
          <a
            href="#enquiry-form"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-elevation hover:bg-primary-hover transition-all transform hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            Submit Enquiry
          </a>
        }
      />

      {/* ─── Page Body ───────────────────────────────────── */}
      <div
        id="enquiry-form"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-8"
      >
        {submittedRef && (
          <Alert variant="success" title="Enquiry Received Successfully">
            Your general request has been recorded under reference <strong className="font-mono">{submittedRef}</strong>. Our guest relations team will review your message and reach out shortly.
          </Alert>
        )}

        {errors.form && (
          <Alert variant="error" title="Submission Error">
            {errors.form}
          </Alert>
        )}

        <Card padding="p-6 sm:p-8" className="shadow-elevation">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Your Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. Priyanshu Das"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@domain.com"
                required
              />

              <Select
                label="Primary Interest Category"
                name="enquiryType"
                value={formData.enquiryType}
                onChange={handleChange}
                options={[
                  { value: 'General', label: 'General / Agro Campus Visit' },
                  { value: 'FarmHouse', label: 'Farm House Celebration / Lawn' },
                  { value: 'Horticulture', label: 'Horticulture & Nursery Saplings' },
                  { value: 'Contact', label: 'Corporate Offsite / Partnership' },
                ]}
                required
              />
            </div>

            <Textarea
              label="Details of your Request / Questions"
              name="message"
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              rows={4}
              placeholder="Please detail your visit dates, group size, or questions..."
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
              Submit General Enquiry
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
