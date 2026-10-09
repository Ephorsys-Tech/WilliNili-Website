'use client';

import React, { useState, useEffect } from 'react';
import { Trees, Save, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getFarmHouseContent, updateFarmHouseContent } from '@/api/farm-house.api';

export default function FarmHouseAdminPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getFarmHouseContent()
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

  const handleArrayChange = (field, text) => {
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    setFormData((prev) => ({ ...prev, [field]: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateFarmHouseContent(formData);
      setAlertState({ type: 'success', message: 'Farm House property content updated successfully.' });
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating Farm House content.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Farm House configuration..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-content-main">Farm House & Events Configuration</h2>
          <p className="text-xs text-content-muted">Update property descriptions, capacity specifications, and facilities.</p>
        </div>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Saved' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card padding="p-6 sm:p-8" className="space-y-5">
          <Input
            label="Section Title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Property Area"
              name="propertyArea"
              value={formData.propertyArea || ''}
              onChange={handleChange}
              placeholder="e.g. 8 Acres of Natural Greenery"
            />
            <Input
              label="Guest Capacity"
              name="guestCapacity"
              value={formData.guestCapacity || ''}
              onChange={handleChange}
              placeholder="e.g. Ideal for 50 to 800+ Guests"
            />
          </div>

          <Textarea
            label="Description & Event Ambience"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Facilities & Amenities (One per line)"
              value={(formData.facilities || []).join('\n')}
              onChange={(e) => handleArrayChange('facilities', e.target.value)}
              rows={5}
            />
            <Textarea
              label="Suitable Events (One per line)"
              value={(formData.suitableEvents || []).join('\n')}
              onChange={(e) => handleArrayChange('suitableEvents', e.target.value)}
              rows={5}
            />
          </div>

          <Textarea
            label="Location & Transit Guide"
            name="locationGuide"
            value={formData.locationGuide || ''}
            onChange={handleChange}
            rows={2}
          />

          <Textarea
            label="Property Visuals & Photography (Image URLs, one per line)"
            value={(formData.images || []).join('\n')}
            onChange={(e) => handleArrayChange('images', e.target.value)}
            rows={4}
            placeholder="https://images.unsplash.com/..."
          />

          {formData.images && formData.images.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-content-main block mb-2">
                Attached Images Preview
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formData.images.map((url, idx) => (
                  <div key={idx} className="aspect-video rounded-theme overflow-hidden border border-surface-border bg-surface-muted shadow-sm">
                    <img src={url} alt={`Farm House ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Farm House Content
          </Button>
        </div>
      </form>
    </div>
  );
}
