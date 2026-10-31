'use client';

import React, { useState, useEffect } from 'react';
import {
  Trees,
  Save,
  Plus,
  Trash2,
  Compass,
  MapPin,
  Clock,
  Landmark,
  Utensils,
  Wheat,
  Image as ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getFarmHouseContent, updateFarmHouseContent } from '@/api/farm-house.api';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';

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

  // Tourist places management
  const handleTouristPlaceChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.touristPlaces || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, touristPlaces: updated };
    });
  };

  const handleAddTouristPlace = () => {
    setFormData((prev) => ({
      ...prev,
      touristPlaces: [
        ...(prev.touristPlaces || []),
        {
          name: '',
          category: 'Cultural & Agro Heritage',
          distance: '20 km from Farm',
          travelTime: '30 mins drive',
          description: '',
          cultureHighlight: '',
          cuisineHighlight: '',
          farmingMethod: '',
          image: '',
          mapUrl: '',
        },
      ],
    }));
  };

  const handleRemoveTouristPlace = (index) => {
    setFormData((prev) => {
      const updated = (prev.touristPlaces || []).filter((_, i) => i !== index);
      return { ...prev, touristPlaces: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateFarmHouseContent(formData);
      setAlertState({ type: 'success', message: 'Farm House property and Odisha tourist attractions updated successfully.' });
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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-content-main">Farm House &amp; Tourism Configuration</h2>
          <p className="text-sm text-content-muted">
            Manage property details, location visuals, and nearest Odisha cultural/agro tourist spots.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          isLoading={isSaving}
          className="self-start sm:self-auto shadow-elevation"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Saved' : 'Error'}>
          {alertState.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Property Details */}
        <Card padding="p-6 sm:p-8" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-surface-border pb-4">
            <Trees className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-content-main">Property Information</h3>
          </div>

          <Input
            label="Section Title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Textarea
              label="Facilities & Amenities (One per line)"
              value={(formData.facilities || []).join('\n')}
              onChange={(e) => handleArrayChange('facilities', e.target.value)}
              rows={4}
            />
            <Textarea
              label="Suitable Events (One per line)"
              value={(formData.suitableEvents || []).join('\n')}
              onChange={(e) => handleArrayChange('suitableEvents', e.target.value)}
              rows={4}
            />
          </div>

          <Textarea
            label="Location & Transit Guide"
            name="locationGuide"
            value={formData.locationGuide || ''}
            onChange={handleChange}
            rows={2}
          />
        </Card>

        {/* Farm House Banner / Hero Visual */}
        <Card padding="p-6 sm:p-8" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-surface-border pb-4">
            <ImageIcon className="w-5 h-5 text-secondary" />
            <div>
              <h3 className="text-lg font-bold text-content-main">Main Banner / Hero Image</h3>
              <p className="text-xs text-content-muted">
                The primary full-width cover photo displayed on the public Farm House page header.
              </p>
            </div>
          </div>

          <CloudinaryUploader
            label="Hero Cover Photograph (Cloudinary CDN)"
            value={formData.heroImage || ''}
            folder="willy_nilly/farmhouse/hero"
            onChange={(newUrl) => setFormData((prev) => ({ ...prev, heroImage: newUrl }))}
            helpText="Upload a high-resolution landscape photo to Cloudinary CDN for the main header."
          />
        </Card>

        {/* Farm Location Visuals & Photography */}
        <Card padding="p-6 sm:p-8" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-surface-border pb-4">
            <ImageIcon className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-bold text-content-main">Farm Location Images</h3>
          </div>

          <Textarea
            label="Farm Photography & Location Visuals (Image URLs, one per line)"
            value={(formData.images || []).join('\n')}
            onChange={(e) => handleArrayChange('images', e.target.value)}
            rows={3}
            placeholder="Upload images below or paste Cloudinary URLs..."
          />

          {/* Cloudinary Instant Image Uploader */}
          <CloudinaryUploader
            label="Upload New Farm Location Photo (Cloudinary CDN)"
            folder="willy_nilly/farmhouse"
            onChange={(newUrl) => {
              if (newUrl) {
                setFormData((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), newUrl],
                }));
              }
            }}
            helpText="Uploads directly to Cloudinary CDN and appends to the farm gallery preview."
          />

          {formData.images && formData.images.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-content-main block">
                Gallery Preview ({formData.images.length} images) — Hover to remove
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {formData.images.map((url, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-xl overflow-hidden border border-surface-border bg-surface-muted shadow-sm relative group"
                  >
                    <img src={url} alt={`Farm House ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white font-mono">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Nearest Tourist Attractions in Odisha */}
        <Card padding="p-6 sm:p-8" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-secondary" />
              <div>
                <h3 className="text-lg font-bold text-content-main">Nearest Odisha Tourist Attractions</h3>
                <p className="text-xs text-content-muted">
                  Places where tourists stay, experience Odisha agro-farming methods, living culture, and eat traditional farm food.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTouristPlace}
              className="self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 mr-1 text-secondary" />
              Add Tourist Attraction
            </Button>
          </div>

          <div className="space-y-6">
            {(formData.touristPlaces || []).map((place, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-surface-border bg-surface-muted/40 space-y-4 relative"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    Attraction #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTouristPlace(index)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Remove this attraction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Attraction Name"
                    value={place.name || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'name', e.target.value)}
                    placeholder="e.g. Raghurajpur Heritage Craft & Agro Village"
                    required
                  />
                  <Input
                    label="Category"
                    value={place.category || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'category', e.target.value)}
                    placeholder="e.g. Agro Heritage & Craft"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Distance"
                      value={place.distance || ''}
                      onChange={(e) => handleTouristPlaceChange(index, 'distance', e.target.value)}
                      placeholder="22 km from Farm"
                    />
                    <Input
                      label="Travel Time"
                      value={place.travelTime || ''}
                      onChange={(e) => handleTouristPlaceChange(index, 'travelTime', e.target.value)}
                      placeholder="35 mins drive"
                    />
                  </div>
                </div>

                <Textarea
                  label="Overview Description"
                  value={place.description || ''}
                  onChange={(e) => handleTouristPlaceChange(index, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe the tourist place, living hamlets, landscape, and tourist experience..."
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Culture & Rural Living Highlight"
                    value={place.cultureHighlight || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'cultureHighlight', e.target.value)}
                    placeholder="e.g. Mud-plastered houses with heritage murals..."
                  />
                  <Input
                    label="Traditional Agro Farming Method"
                    value={place.farmingMethod || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'farmingMethod', e.target.value)}
                    placeholder="e.g. Traditional betel-vine cultivation (Paan Baraja)..."
                  />
                  <Input
                    label="Heritage Food / Traditional Cuisine"
                    value={place.cuisineHighlight || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'cuisineHighlight', e.target.value)}
                    placeholder="e.g. Woodfire Dalma, Pakhala & warm Chhena Poda..."
                  />
                </div>

                <div className="space-y-4">
                  <CloudinaryUploader
                    label="Attraction Photograph (Cloudinary CDN or URL)"
                    value={place.image || ''}
                    folder="willy_nilly/tourist_places"
                    onChange={(newUrl) => handleTouristPlaceChange(index, 'image', newUrl)}
                    helpText="Upload an authentic landscape photo or paste an external URL."
                  />
                  <Input
                    label="Google Map / Directions Link"
                    value={place.mapUrl || ''}
                    onChange={(e) => handleTouristPlaceChange(index, 'mapUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" size="lg" isLoading={isSaving} className="shadow-elevation">
            <Save className="w-4 h-4 mr-2" />
            Save Farm House Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
