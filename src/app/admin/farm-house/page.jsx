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
  ChevronUp,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Eye,
  Info,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getFarmHouseContent, updateFarmHouseContent } from '@/api/farm-house.api';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';

const CATEGORY_OPTIONS = [
  'Cultural & Agro Heritage',
  'Historic Temple & Spiritual Shrine',
  'Craft Village & Artisan Community',
  'Nature Sanctuary & Wildlife',
  'Lake, Lagoon & Eco-Tourism',
  'Horticulture Nursery & Plant Orchard',
  'Forestry & Jungle Resort',
  'Picnic Spot & Rural Farmstay',
];

const FARMHOUSE_ASSIGNMENTS = [
  'All Farmhouses',
  'Sandhya Agro Farm House (Kisan Nagar, Cuttack)',
  'Sangeeta Grafting & Nursery (Juanga, Niali)',
  'Allora Agro Forestry & Jungle Resort (Dhenkanal)',
];

export default function FarmHouseAdminPage() {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);
  const [activeTab, setActiveTab] = useState('touristPlaces'); // Default to tourist places for immediate access

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

  // Tourist places management (Layman friendly)
  const handleTouristPlaceChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.touristPlaces || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, touristPlaces: updated };
    });
  };

  const handleAddTouristPlace = () => {
    const newPlace = {
      name: '',
      category: 'Cultural & Agro Heritage',
      distance: '15 km from Farm',
      travelTime: '25 mins drive',
      description: '',
      cultureHighlight: '',
      cuisineHighlight: '',
      farmingMethod: '',
      image: '',
      mapUrl: '',
      displayOnFarmhouseBlog: true,
      nearFarmhouse: 'All Farmhouses',
    };

    setFormData((prev) => ({
      ...prev,
      touristPlaces: [newPlace, ...(prev.touristPlaces || [])],
    }));

    setActiveTab('touristPlaces');
    setAlertState({
      type: 'info',
      message: 'New tourist place card added at the top. Fill in the details below and click Save.',
    });
  };

  const handleRemoveTouristPlace = (index) => {
    const place = formData.touristPlaces?.[index];
    const placeName = place?.name ? `"${place.name}"` : 'this attraction';
    if (!confirm(`Are you sure you want to remove ${placeName} from the nearest tourist places?`)) {
      return;
    }

    setFormData((prev) => {
      const updated = (prev.touristPlaces || []).filter((_, i) => i !== index);
      return { ...prev, touristPlaces: updated };
    });
  };

  const handleMovePlace = (index, direction) => {
    setFormData((prev) => {
      const list = [...(prev.touristPlaces || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, touristPlaces: list };
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    setAlertState(null);

    try {
      await updateFarmHouseContent(formData);
      setAlertState({
        type: 'success',
        message: 'Farmhouse details and nearest tourist places saved successfully! Updates are live on the website.',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setAlertState({
        type: 'error',
        message: err.message || 'Error saving Farm House content. Please check required fields.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading Farmhouse configuration..." />;
  }

  const touristPlacesCount = formData?.touristPlaces?.length || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* ─── Top Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl border border-surface-border p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              Content &amp; Tourism Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Farmhouse &amp; Nearest Tourist Places
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-1 max-w-2xl">
            Layman management panel: Set farmhouse information and configure nearest tourist places displayed at the bottom of all farmhouse blog pages.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          isLoading={isSaving}
          className="self-start sm:self-auto shadow-elevation font-bold flex-shrink-0"
        >
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Changes Saved' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {/* ─── Layman Friendly Step Tabs ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('touristPlaces')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            activeTab === 'touristPlaces'
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-surface text-content-main border-surface-border hover:bg-surface-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                activeTab === 'touristPlaces' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">Step 1 (Main)</span>
              <strong className="text-sm font-bold block">Nearest Tourist Places</strong>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'touristPlaces' ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
            }`}
          >
            {touristPlacesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('property')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            activeTab === 'property'
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-surface text-content-main border-surface-border hover:bg-surface-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                activeTab === 'property' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">Step 2</span>
              <strong className="text-sm font-bold block">Farmhouse Info &amp; Hero</strong>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            activeTab === 'gallery'
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-surface text-content-main border-surface-border hover:bg-surface-muted'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">Step 3</span>
              <strong className="text-sm font-bold block">Farm Photo Gallery</strong>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'gallery' ? 'bg-white text-primary' : 'bg-surface-muted text-content-muted'
            }`}
          >
            {formData?.images?.length || 0}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ════════════════════════════════════════════════════════════
            TAB 1: NEAREST TOURIST PLACES (DISPLAYED ON FARMHOUSE BLOGS)
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'touristPlaces' && (
          <div className="space-y-6">
            {/* Layman Helper Explanation Banner */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>How This Works (Layman Guide):</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Every tourist place you add or edit here automatically appears in the <strong>&ldquo;Nearest Tourist Places from this Farmhouse&rdquo;</strong> grid at the bottom of all individual farmhouse blog pages (such as Sandhya Farm House). Visitors can view photos, distances, cultural stories, and get Google Maps directions.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-surface-border">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-secondary" />
                <span className="text-sm font-bold text-content-main">
                  Configured Attractions ({touristPlacesCount} places)
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddTouristPlace}
                className="self-start sm:self-auto font-bold shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add New Tourist Attraction
              </Button>
            </div>

            {/* List of Tourist Places */}
            {touristPlacesCount === 0 ? (
              <Card padding="p-8" className="text-center space-y-3">
                <Compass className="w-12 h-12 text-content-light mx-auto" />
                <h3 className="text-base font-bold text-content-main">No Tourist Places Added Yet</h3>
                <p className="text-xs text-content-muted max-w-md mx-auto">
                  Click the button below to add your first nearby Odisha tourist place. It will show up on all farmhouse blogs.
                </p>
                <Button type="button" variant="primary" onClick={handleAddTouristPlace}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add First Tourist Place
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {(formData.touristPlaces || []).map((place, index) => (
                  <Card
                    key={index}
                    padding="p-6"
                    className="border border-surface-border hover:border-primary/40 transition-colors shadow-sm space-y-6"
                  >
                    {/* Card Header with Reordering & Delete */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-white">
                          #{index + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-content-main truncate max-w-md">
                          {place.name || 'New Tourist Place (Fill name below)'}
                        </h3>
                        {place.category && (
                          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-muted text-content-muted border border-surface-border">
                            {place.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMovePlace(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg border border-surface-border text-content-muted hover:text-primary hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMovePlace(index, 'down')}
                          disabled={index === (formData.touristPlaces || []).length - 1}
                          className="p-1.5 rounded-lg border border-surface-border text-content-muted hover:text-primary hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTouristPlace(index)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-2 flex items-center gap-1 text-xs font-semibold cursor-pointer"
                          title="Delete this attraction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Place Core Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label="1. Tourist Place Name (Required)"
                          value={place.name || ''}
                          onChange={(e) => handleTouristPlaceChange(index, 'name', e.target.value)}
                          placeholder="e.g. Raghurajpur Heritage Craft & Agro Village"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-content-main block mb-1.5">
                          2. Category / Place Type
                        </label>
                        <select
                          value={place.category || 'Cultural & Agro Heritage'}
                          onChange={(e) => handleTouristPlaceChange(index, 'category', e.target.value)}
                          className="w-full text-xs rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-content-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Input
                          label="3. Distance from Farm"
                          value={place.distance || ''}
                          onChange={(e) => handleTouristPlaceChange(index, 'distance', e.target.value)}
                          placeholder="e.g. 22 km from Farm"
                        />
                      </div>

                      <div>
                        <Input
                          label="4. Driving Time"
                          value={place.travelTime || ''}
                          onChange={(e) => handleTouristPlaceChange(index, 'travelTime', e.target.value)}
                          placeholder="e.g. 35 mins drive"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-content-main block mb-1.5">
                          5. Associated Farmhouse Hub
                        </label>
                        <select
                          value={place.nearFarmhouse || 'All Farmhouses'}
                          onChange={(e) => handleTouristPlaceChange(index, 'nearFarmhouse', e.target.value)}
                          className="w-full text-xs rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-content-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {FARMHOUSE_ASSIGNMENTS.map((fh) => (
                            <option key={fh} value={fh}>
                              {fh}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Short Description */}
                    <Textarea
                      label="6. What will visitors see & experience here? (Description)"
                      value={place.description || ''}
                      onChange={(e) => handleTouristPlaceChange(index, 'description', e.target.value)}
                      rows={2}
                      placeholder="Describe what makes this place special for visiting families, tourists, and students..."
                      required
                    />

                    {/* Layman Friendly Photo Upload (Cloudinary CDN) */}
                    <div className="p-4 rounded-xl bg-surface-muted/60 border border-surface-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-content-main flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          7. Photo of this Tourist Place (Upload from Phone or Computer)
                        </span>
                        {place.image && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Photo Saved
                          </span>
                        )}
                      </div>

                      <CloudinaryUploader
                        label="Click to Choose Image (Auto-optimizes and uploads to Cloudinary CDN)"
                        value={place.image || ''}
                        folder="willy_nilly/tourist_places"
                        onChange={(newUrl) => handleTouristPlaceChange(index, 'image', newUrl)}
                        helpText="Select a landscape photo from your device. It will immediately show up at the bottom of the farmhouse blogs."
                      />
                    </div>

                    {/* Optional Details Collapsible or Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <Input
                        label="Culture / Craft Highlights (Optional)"
                        value={place.cultureHighlight || ''}
                        onChange={(e) => handleTouristPlaceChange(index, 'cultureHighlight', e.target.value)}
                        placeholder="e.g. Master Pattachitra scroll art & palm leaf engravings"
                      />
                      <Input
                        label="Authentic Food to Try (Optional)"
                        value={place.cuisineHighlight || ''}
                        onChange={(e) => handleTouristPlaceChange(index, 'cuisineHighlight', e.target.value)}
                        placeholder="e.g. Clay-pot Chhenagaja, sweet coconut water"
                      />
                      <Input
                        label="Google Maps Directions Link (Optional)"
                        value={place.mapUrl || ''}
                        onChange={(e) => handleTouristPlaceChange(index, 'mapUrl', e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>

                    {/* Layman Visual Mini-Preview */}
                    <div className="pt-3 border-t border-surface-border/60">
                      <div className="text-[11px] font-semibold text-content-muted flex items-center gap-1 mb-2">
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        Live Preview on Public Farmhouse Blog Downside:
                      </div>
                      <div className="p-3 rounded-xl bg-surface border border-surface-border flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-surface-muted overflow-hidden flex-shrink-0 flex items-center justify-center border border-surface-border">
                          {place.image ? (
                            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                          ) : (
                            <Landmark className="w-5 h-5 text-content-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <strong className="text-xs font-bold text-content-main truncate block">
                            {place.name || 'Untitled Tourist Place'}
                          </strong>
                          <span className="text-[10px] text-content-muted block truncate">
                            {place.distance || 'Near Farm'} • {place.travelTime || 'Short drive'} &bull; {place.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Bottom Add Place Button */}
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTouristPlace}
                    className="font-bold border-dashed border-2 px-6 py-3"
                  >
                    <Plus className="w-4 h-4 mr-2 text-secondary" />
                    + Add Another Nearby Tourist Place
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: FARMHOUSE PROPERTY INFO & HERO PHOTO
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'property' && (
          <div className="space-y-6">
            <Card padding="p-6 sm:p-8" className="space-y-6">
              <div className="flex items-center gap-3 border-b border-surface-border pb-4">
                <Trees className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-content-main">Main Farmhouse Information</h3>
                  <p className="text-xs text-content-muted">General title, description, and guest capacity settings.</p>
                </div>
              </div>

              <Input
                label="Farmhouse Section Title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Total Property Area"
                  name="propertyArea"
                  value={formData.propertyArea || ''}
                  onChange={handleChange}
                  placeholder="e.g. 8 Acres of Natural Greenery & Groves"
                />
                <Input
                  label="Guest Capacity"
                  name="guestCapacity"
                  value={formData.guestCapacity || ''}
                  onChange={handleChange}
                  placeholder="e.g. Ideal for 50-Person Picnics to 800+ Events"
                />
              </div>

              <Textarea
                label="Farmhouse Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={3}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Textarea
                  label="Facilities & Amenities (One item per line)"
                  value={(formData.facilities || []).join('\n')}
                  onChange={(e) => handleArrayChange('facilities', e.target.value)}
                  rows={4}
                />
                <Textarea
                  label="Suitable Events (One item per line)"
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
                  <h3 className="text-lg font-bold text-content-main">Main Header Cover Photo</h3>
                  <p className="text-xs text-content-muted">
                    Full-width scenic cover photo displayed on the main Farmhouse page header.
                  </p>
                </div>
              </div>

              <CloudinaryUploader
                label="Cover Photograph (Upload from Device)"
                value={formData.heroImage || ''}
                folder="willy_nilly/farmhouse/hero"
                onChange={(newUrl) => setFormData((prev) => ({ ...prev, heroImage: newUrl }))}
                helpText="Select a high-resolution landscape photo from your device. Uploads directly to Cloudinary CDN."
              />
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: FARM PHOTO GALLERY
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <Card padding="p-6 sm:p-8" className="space-y-6">
              <div className="flex items-center gap-3 border-b border-surface-border pb-4">
                <ImageIcon className="w-5 h-5 text-secondary" />
                <div>
                  <h3 className="text-lg font-bold text-content-main">Farmhouse Photo Gallery</h3>
                  <p className="text-xs text-content-muted">
                    Upload photos of the farm, pond angling, sandalwood groves, and group picnic setups.
                  </p>
                </div>
              </div>

              {/* Instant Device Photo Upload */}
              <CloudinaryUploader
                label="Upload New Photo from Phone / Computer"
                folder="willy_nilly/farmhouse"
                onChange={(newUrl) => {
                  if (newUrl) {
                    setFormData((prev) => ({
                      ...prev,
                      images: [...(prev.images || []), newUrl],
                    }));
                  }
                }}
                helpText="Uploads directly to Cloudinary CDN and appends to the preview below."
              />

              {/* Gallery Thumbnails */}
              {formData.images && formData.images.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-content-main block">
                    Current Gallery ({formData.images.length} photos) — Hover to delete
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="aspect-video rounded-xl overflow-hidden border border-surface-border bg-surface-muted shadow-sm relative group"
                      >
                        <img src={url} alt={`Farmhouse ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] bg-black/60 text-white font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-content-muted text-xs bg-surface-muted/40 rounded-xl border border-dashed border-surface-border">
                  No gallery photos uploaded yet. Use the upload box above to add your first photo.
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ─── Sticky Save Bar ───────────────────────────────────── */}
        <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-surface/95 backdrop-blur-md border border-surface-border shadow-elevation flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-content-muted flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span>Click &ldquo;Save All Changes&rdquo; to apply your updates to the public website.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            className="w-full sm:w-auto font-bold shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
