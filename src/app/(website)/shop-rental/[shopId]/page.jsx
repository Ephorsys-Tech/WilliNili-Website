'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, Maximize, ArrowLeft, Send, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicShopById } from '@/api/shop-rental.api';
import { submitEnquiry } from '@/api/enquiry.api';

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInactive, setIsInactive] = useState(false);

  const [formData, setFormData] = useState({
    enquiryType: 'ShopRental',
    name: '',
    email: '',
    mobile: '',
    shop: shopId,
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (shopId) {
      getPublicShopById(shopId)
        .then((data) => {
          if (isMounted && data) {
            setShop(data);
            setFormData((prev) => ({ ...prev, shop: shopId }));
          }
        })
        .catch((err) => {
          if (err.status === 404 || err.code === 'NOT_FOUND') {
            if (isMounted) setIsInactive(true);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [shopId]);

  if (isInactive) {
    return notFound();
  }

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
      errs.mobile = 'Valid phone is required';
    }
    if (!formData.message.trim()) errs.message = 'Please specify business nature and lease requirements';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitEnquiry(formData);
      setSubmittedRef(res.reference);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit rental enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading shop details..." />;
  }

  if (!shop) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      <Link
        href="/shop-rental"
        className="inline-flex items-center text-sm font-medium text-content-muted hover:text-primary transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop Rental listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shop Visual & Amenities */}
        <div className="space-y-6">
          <div className="h-80 bg-surface-muted rounded-theme border border-surface-border overflow-hidden relative flex items-center justify-center">
            {shop.images && shop.images[0] ? (
              <img src={shop.images[0]} alt={shop.title} className="w-full h-full object-cover" />
            ) : (
              <Store className="w-16 h-16 text-content-light" />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="primary">Shop #{shop.shopNumber}</Badge>
              <Badge variant={shop.isAvailable ? 'success' : 'neutral'}>
                {shop.isAvailable ? 'Available for Lease' : 'Occupied'}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-content-main">{shop.title}</h1>
            <div className="flex items-center gap-4 text-sm text-content-muted">
              <span className="flex items-center gap-1.5 font-semibold text-content-main">
                <Maximize className="w-4 h-4 text-primary" /> {shop.sizeSqFt} Sq. Ft.
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> {shop.location}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-2xl font-extrabold text-primary">₹{shop.rentAmount}</span>
              <span className="text-xs text-content-muted"> / {shop.rentPeriod || 'Month'}</span>
            </div>

            <p className="text-sm text-content-muted leading-relaxed whitespace-pre-line pt-2">
              {shop.description}
            </p>

            {shop.facilities && shop.facilities.length > 0 && (
              <div className="pt-4 border-t border-surface-border">
                <h3 className="text-sm font-semibold text-content-main mb-3">Unit Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {shop.facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-content-muted">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shop Rental Enquiry Form */}
        <div>
          <Card padding="p-8" className="shadow-elevation space-y-6">
            <div>
              <Badge variant="secondary">Commercial Lease</Badge>
              <h2 className="text-2xl font-bold text-content-main mt-1">
                Lease Enquiry for {shop.title}
              </h2>
              <p className="text-xs text-content-muted mt-1">
                Direct submission to Willy Nilly administration.
              </p>
            </div>

            {submittedRef && (
              <Alert variant="success" title="Lease Request Received">
                Your shop inquiry has been registered with reference <strong className="font-mono">{submittedRef}</strong>. Our management team will contact you to schedule a site walkthrough.
              </Alert>
            )}

            {errors.form && (
              <Alert variant="error" title="Submission Error">
                {errors.form}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name / Business Name"
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
                label="Proposed Business & Lease Duration"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Mention business type (e.g. handicrafts, nursery tools), expected start date, and lease term..."
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
                Submit Commercial Lease Enquiry
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
