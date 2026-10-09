'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Save, Ban, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getResortContent, updateResortContent } from '@/api/settings.api';

export default function ResortAdminPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getResortContent()
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

  const handleFeaturesChange = (e) => {
    const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
    setFormData((prev) => ({ ...prev, featuresPlanned: lines }));
  };

  const handleImagesChange = (e) => {
    const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0);
    setFormData((prev) => ({ ...prev, images: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateResortContent(formData);
      setAlertState({ type: 'success', message: 'Resort promotional content updated successfully.' });
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating Resort content.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Resort settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-content-main">Eco-Resort (Launching Soon)</h2>
        <p className="text-xs text-content-muted">Manage concept visuals, planned features, and promotional messaging.</p>
      </div>

      <Alert variant="warning" title="Scope Rule: Bookings Disabled">
        Per the business PRD, resort bookings remain strictly disabled until the owner authorizes a future scope expansion. The module functions purely as a promotional showcase.
      </Alert>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Saved' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="p-6 sm:p-8" className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Resort Project Name"
              name="resortName"
              value={formData.resortName || ''}
              onChange={handleChange}
              required
            />
            <Input
              label="Launch Status Badge"
              name="launchStatus"
              value={formData.launchStatus || ''}
              onChange={handleChange}
              placeholder="e.g. Launching Soon"
              required
            />
          </div>

          <Textarea
            label="Prominent Launch Message"
            name="launchMessage"
            value={formData.launchMessage || ''}
            onChange={handleChange}
            rows={3}
            required
          />

          <Textarea
            label="Architectural Concept & Vision"
            name="conceptDescription"
            value={formData.conceptDescription || ''}
            onChange={handleChange}
            rows={4}
            required
          />

          <Textarea
            label="Planned Amenities & Features (One per line)"
            value={(formData.featuresPlanned || []).join('\n')}
            onChange={handleFeaturesChange}
            rows={5}
          />

          <Textarea
            label="Resort Architectural Visuals (Image URLs, one per line)"
            value={(formData.images || []).join('\n')}
            onChange={handleImagesChange}
            rows={4}
            placeholder="https://images.unsplash.com/..."
          />

          {formData.images && formData.images.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-content-main block mb-2">
                Attached Images Preview
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="aspect-video rounded-theme overflow-hidden border border-surface-border bg-surface-muted shadow-sm">
                    <img src={url} alt={`Resort Concept ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Resort Content
          </Button>
        </div>
      </form>
    </div>
  );
}
