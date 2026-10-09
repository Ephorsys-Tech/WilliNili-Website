'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Flower2, Sprout, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicPlantById } from '@/api/horticulture.api';
import { submitEnquiry } from '@/api/enquiry.api';

export default function PlantDetailPage() {
  const { plantId } = useParams();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    enquiryType: 'Horticulture',
    name: '',
    email: '',
    mobile: '',
    plant: plantId,
    plantQuantity: 5,
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (plantId) {
      getPublicPlantById(plantId)
        .then((data) => {
          if (isMounted && data) {
            setPlant(data);
            setFormData((prev) => ({ ...prev, plant: plantId }));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [plantId]);

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
      errs.mobile = 'Valid mobile number is required';
    }
    if (!formData.message.trim()) errs.message = 'Please provide details or delivery instructions';

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
      setErrors({ form: err.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading plant details..." />;
  }

  if (!plant) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-bold text-content-main mb-3">Plant Listing Not Found</h2>
        <p className="text-sm text-content-muted mb-6">
          This horticulture item is not available or has been archived.
        </p>
        <Link href="/horticulture">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Nursery Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
      <Link
        href="/horticulture"
        className="inline-flex items-center text-sm font-medium text-content-muted hover:text-primary transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Nursery Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Plant Details & Care */}
        <div className="space-y-6">
          <div className="h-80 bg-surface-muted rounded-theme border border-surface-border overflow-hidden relative flex items-center justify-center">
            {plant.images && plant.images[0] ? (
              <img src={plant.images[0]} alt={plant.name} className="w-full h-full object-cover" />
            ) : (
              <Sprout className="w-16 h-16 text-content-light" />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="primary">{plant.category}</Badge>
              <Badge variant={plant.availability === 'In Stock' ? 'success' : 'warning'}>
                {plant.availability}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-content-main">{plant.name}</h1>
            {plant.scientificName && (
              <p className="text-sm text-content-light italic">{plant.scientificName}</p>
            )}
            <div className="pt-2">
              <span className="text-2xl font-extrabold text-primary">₹{plant.price}</span>
              <span className="text-xs text-content-muted"> / {plant.priceBasis || 'sapling'}</span>
            </div>
            <p className="text-sm text-content-muted leading-relaxed whitespace-pre-line pt-2">
              {plant.description}
            </p>
          </div>

          <div className="p-5 rounded-theme bg-surface-muted/60 border border-surface-border space-y-3">
            <h3 className="text-sm font-semibold text-content-main flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" />
              Cultivation & Care Instructions
            </h3>
            <p className="text-xs text-content-muted leading-relaxed">
              {plant.careInstructions || 'Water with organic compost; ensure adequate morning sunlight.'}
            </p>
            {plant.heightSize && (
              <p className="text-xs text-content-muted">
                <strong>Standard Size:</strong> {plant.heightSize}
              </p>
            )}
          </div>
        </div>

        {/* Purchase & Collection Enquiry Form */}
        <div>
          <Card padding="p-8" className="shadow-elevation space-y-6">
            <div>
              <Badge variant="secondary">Purchase & Collection</Badge>
              <h2 className="text-2xl font-bold text-content-main mt-1">
                Enquire for {plant.name}
              </h2>
              <p className="text-xs text-content-muted mt-1">
                Orders are collected at Willy Nilly Nursery or prepared for bulk agro dispatch.
              </p>
            </div>

            {submittedRef && (
              <Alert variant="success" title="Enquiry Submitted">
                Your plant enquiry has been recorded with reference <strong className="font-mono">{submittedRef}</strong>. Our horticulture manager will contact you with availability and pickup schedule.
              </Alert>
            )}

            {errors.form && (
              <Alert variant="error" title="Submission Error">
                {errors.form}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
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

              <Input
                label="Quantity Desired (Saplings / Pots)"
                name="plantQuantity"
                type="number"
                min="1"
                max="5000"
                value={formData.plantQuantity}
                onChange={handleChange}
                required
              />

              <Textarea
                label="Message / Collection Notes"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Mention preferred pickup dates, planting queries, or soil requirements..."
                rows={3}
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
                Submit Plant Purchase Enquiry
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
