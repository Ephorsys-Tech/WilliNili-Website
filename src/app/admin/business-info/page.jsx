'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building2, User, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicSettings, updateAdminSettings } from '@/api/settings.api';

export default function BusinessInfoAdminPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted && data) setFormData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHighlightsChange = (e) => {
    const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
    setFormData((prev) => ({ ...prev, highlights: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateAdminSettings(formData);
      setAlertState({ type: 'success', message: 'Business information and profile successfully updated!' });
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading business settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Saved' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Business Identity */}
        <Card padding="p-6 sm:p-8" className="space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-content-main">Core Brand & Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business / Brand Name"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Tagline"
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="About Story / Background"
            name="aboutStory"
            value={formData.aboutStory || ''}
            onChange={handleChange}
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Vision Statement"
              name="vision"
              value={formData.vision || ''}
              onChange={handleChange}
              rows={3}
            />
            <Textarea
              label="Mission Statement"
              name="mission"
              value={formData.mission || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Textarea
            label="Key Highlights (One per line)"
            name="highlights"
            value={(formData.highlights || []).join('\n')}
            onChange={handleHighlightsChange}
            rows={4}
            helperText="Enter each highlighted benefit on a new line."
          />
        </Card>

        {/* Founder & Owner Information */}
        <Card padding="p-6 sm:p-8" className="space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <User className="w-5 h-5 text-secondary" />
            <h2 className="text-base font-bold text-content-main">Founder & Owner Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner / Founder Name"
              name="ownerName"
              value={formData.ownerName || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Title / Designation"
              name="ownerTitle"
              value={formData.ownerTitle || ''}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Founder Biography / Welcome Note"
            name="ownerBio"
            value={formData.ownerBio || ''}
            onChange={handleChange}
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center pt-1">
            <div className="sm:col-span-3">
              <Input
                label="Founder / Owner Portrait Photo URL"
                name="ownerPhotoUrl"
                value={formData.ownerPhotoUrl || ''}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or /uploads/..."
              />
            </div>
            {formData.ownerPhotoUrl && (
              <div className="flex items-center gap-3">
                <img
                  src={formData.ownerPhotoUrl}
                  alt={formData.ownerName || 'Founder'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
                <span className="text-[11px] text-content-muted">Profile Photo</span>
              </div>
            )}
          </div>
        </Card>

        {/* Contact Details & Operations */}
        <Card padding="p-6 sm:p-8" className="space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Phone className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-content-main">Contact Details & Operations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Phone"
              name="phonePrimary"
              value={formData.phonePrimary || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Secondary Phone"
              name="phoneSecondary"
              value={formData.phoneSecondary || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Contact Email"
              name="emailPrimary"
              type="email"
              value={formData.emailPrimary || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Business Hours"
              name="businessHours"
              value={formData.businessHours || ''}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Postal / Physical Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            rows={2}
          />
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Business Information
          </Button>
        </div>
      </form>
    </div>
  );
}
