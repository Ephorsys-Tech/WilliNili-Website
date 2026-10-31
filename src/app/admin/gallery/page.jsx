'use client';

import React, { useState, useEffect } from 'react';
import {
  Images,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CloudinaryUploader } from '@/components/admin/CloudinaryUploader';
import {
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/api/gallery.api';

const ALBUMS = [
  'Guest House',
  'Farm House',
  'Events',
  'Resort',
  'Horticulture',
  'Property',
  'Celebrations',
  'General',
];

const DEFAULT_FORM = {
  title: '',
  album: 'General',
  imageUrl: '',
  caption: '',
  isPublic: true,
  sortOrder: 0,
};

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [showManualUrl, setShowManualUrl] = useState(false);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminGallery({ album: selectedAlbum === 'All' ? '' : selectedAlbum });
      if (res?.items) setImages(res.items);
    } catch (err) {
      console.error(err);
      setAlertState({ type: 'error', message: err.message || 'Failed to load gallery images.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedAlbum]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...DEFAULT_FORM,
      album: selectedAlbum === 'All' ? 'General' : selectedAlbum,
    });
    setFormErrors({});
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      album: item.album || 'General',
      imageUrl: item.imageUrl || '',
      caption: item.caption || '',
      isPublic: item.isPublic !== undefined ? item.isPublic : true,
      sortOrder: item.sortOrder || 0,
    });
    setFormErrors({});
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  // Client-Side Validation & Sanitation
  const validateForm = () => {
    const errors = {};

    const cleanTitle = (formData.title || '').trim();
    if (!cleanTitle) {
      errors.title = 'Photo title is required.';
    } else if (cleanTitle.length < 2) {
      errors.title = 'Title must be at least 2 characters.';
    } else if (cleanTitle.length > 120) {
      errors.title = 'Title cannot exceed 120 characters.';
    }

    const cleanUrl = (formData.imageUrl || '').trim();
    if (!cleanUrl) {
      errors.imageUrl = 'Please upload a photo from your device or provide an image URL.';
    } else if (
      !cleanUrl.startsWith('https://') &&
      !cleanUrl.startsWith('http://') &&
      !cleanUrl.startsWith('/')
    ) {
      errors.imageUrl = 'Image URL must be a valid https link or local path.';
    } else if (cleanUrl.toLowerCase().startsWith('javascript:') || cleanUrl.toLowerCase().startsWith('data:')) {
      errors.imageUrl = 'Malicious URL schemes are not permitted.';
    }

    if (!ALBUMS.includes(formData.album)) {
      errors.album = 'Please select a valid album category.';
    }

    if (formData.caption && formData.caption.trim().length > 300) {
      errors.caption = 'Caption cannot exceed 300 characters.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setAlertState(null);

    // Sanitized payload
    const payload = {
      title: formData.title.trim(),
      album: formData.album,
      imageUrl: formData.imageUrl.trim(),
      caption: (formData.caption || '').trim(),
      isPublic: Boolean(formData.isPublic),
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      if (editingItem) {
        await updateGalleryItem(editingItem._id, payload);
        setAlertState({
          type: 'success',
          message: `Photo "${payload.title}" updated successfully and reflected on the website.`,
        });
      } else {
        await createGalleryItem(payload);
        setAlertState({
          type: 'success',
          message: `Photo "${payload.title}" added to gallery and is now live on the website!`,
        });
      }
      setIsModalOpen(false);
      setFormData(DEFAULT_FORM);
      fetchGallery();
    } catch (err) {
      setAlertState({
        type: 'error',
        message: err.message || 'Error saving photo to gallery. Please verify inputs.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    const nextState = !item.isPublic;
    try {
      await updateGalleryItem(item._id, { isPublic: nextState });
      setAlertState({
        type: 'success',
        message: `Photo "${item.title}" is now ${nextState ? 'PUBLIC (visible on website)' : 'HIDDEN from public visitors'}.`,
      });
      fetchGallery();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error updating visibility.' });
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete "${title || 'this photo'}" from the gallery?`)) {
      return;
    }
    try {
      await deleteGalleryItem(id);
      setAlertState({ type: 'success', message: 'Photo deleted from gallery.' });
      fetchGallery();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error deleting photo.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ─── Page Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface rounded-2xl border border-surface-border p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
              Media &amp; Visuals
            </span>
            <span className="text-xs text-content-muted">• {images.length} Photos in view</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Campus Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-1 max-w-2xl">
            Upload and manage photographs displayed to visitors on the website gallery and home page showcase. All uploads are validated, optimized, and served via Cloudinary CDN.
          </p>
        </div>

        <Button onClick={handleOpenCreate} variant="primary" size="lg" className="shadow-elevation font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add Photo to Gallery
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Success' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {/* ─── Album Category Filter Tabs ─────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-content-muted flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Album:
        </span>
        {['All', ...ALBUMS].map((alb) => (
          <button
            key={alb}
            type="button"
            onClick={() => setSelectedAlbum(alb)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
              selectedAlbum === alb
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted hover:text-content-main'
            }`}
          >
            {alb}
          </button>
        ))}
      </div>

      {/* ─── Gallery Cards Grid ─────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner text="Loading gallery photos..." />
      ) : images.length === 0 ? (
        <Card padding="p-12" className="text-center space-y-4">
          <Images className="w-16 h-16 text-content-light mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-content-main">
              No Photos in {selectedAlbum === 'All' ? 'Gallery' : `"${selectedAlbum}" Album`}
            </h3>
            <p className="text-xs text-content-muted max-w-md mx-auto">
              Upload your first photo to this album. It will immediately appear on the public website.
            </p>
          </div>
          <Button onClick={handleOpenCreate} variant="primary">
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Photo
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {images.map((item) => (
            <Card
              key={item._id}
              padding="p-0"
              className="flex flex-col justify-between overflow-hidden group hover:border-primary/40 transition-all shadow-sm hover:shadow-card"
            >
              {/* Photo Preview Thumbnail */}
              <div className="aspect-[4/3] bg-surface-muted relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                    {item.album}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant={item.isPublic ? 'success' : 'neutral'} size="sm">
                    {item.isPublic ? 'Public' : 'Hidden'}
                  </Badge>
                </div>
              </div>

              {/* Photo Metadata */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-content-main truncate" title={item.title}>
                    {item.title}
                  </h4>
                  {item.caption ? (
                    <p className="text-xs text-content-muted line-clamp-2 mt-1" title={item.caption}>
                      {item.caption}
                    </p>
                  ) : (
                    <span className="text-[11px] text-content-light italic block mt-1">No caption provided</span>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-content-muted hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
                      title="Edit photo details or replace image"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(item)}
                      className="p-1.5 rounded-lg text-content-muted hover:text-content-main hover:bg-surface-muted transition-colors cursor-pointer"
                      title={item.isPublic ? 'Hide from public visitors' : 'Publish to public gallery'}
                    >
                      {item.isPublic ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id, item.title)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Add / Edit Photo Modal (Layman Friendly & Sanitized) ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Photo: ${editingItem.title}` : 'Add Photo to Campus Gallery'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Photo Title */}
          <div>
            <Input
              label="Photo Title (Required)"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (formErrors.title) setFormErrors({ ...formErrors, title: null });
              }}
              placeholder="e.g. Guest House Garden Pavilion"
              required
              error={formErrors.title}
            />
            <p className="text-[11px] text-content-muted mt-1">
              Give a clear, descriptive title shown when visitors view or enlarge the photo.
            </p>
          </div>

          {/* Album / Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-content-main mb-1.5">
              Album / Category (Required)
            </label>
            <select
              value={formData.album}
              onChange={(e) => {
                setFormData({ ...formData, album: e.target.value });
                if (formErrors.album) setFormErrors({ ...formErrors, album: null });
              }}
              className="w-full text-xs rounded-xl border border-surface-border bg-surface px-3 py-2.5 text-content-main focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ALBUMS.map((alb) => (
                <option key={alb} value={alb}>
                  {alb}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-content-muted mt-1">
              Choose which album tab this photo belongs to on the public website.
            </p>
          </div>

          {/* Secure Cloudinary Image Upload & Live Preview */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-surface-muted/50 border border-surface-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-content-main flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-primary" />
                Upload Photo from Device (JPEG, PNG, WebP &le; 5MB)
              </span>
              {formData.imageUrl && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            <CloudinaryUploader
              label=""
              value={formData.imageUrl}
              folder="willy_nilly/gallery"
              aspectRatio="aspect-video"
              onChange={(newUrl) => {
                setFormData((prev) => ({ ...prev, imageUrl: newUrl || '' }));
                if (formErrors.imageUrl) setFormErrors((prev) => ({ ...prev, imageUrl: null }));
              }}
              helpText="Click or drop a photo from your computer or phone. Uploads directly to Cloudinary CDN."
            />

            {formErrors.imageUrl && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.imageUrl}
              </p>
            )}

            {/* Optional URL Toggle for Advanced Users */}
            <div className="pt-2 border-t border-surface-border/60">
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LinkIcon className="w-3 h-3" />
                <span>{showManualUrl ? 'Hide direct URL input' : 'Or enter an existing image URL manually'}</span>
              </button>

              {showManualUrl && (
                <div className="mt-2">
                  <Input
                    label="Direct Image URL"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      if (formErrors.imageUrl) setFormErrors({ ...formErrors, imageUrl: null });
                    }}
                    placeholder="https://res.cloudinary.com/... or /images/..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Caption (Optional) */}
          <div>
            <Input
              label="Caption / Story (Optional)"
              value={formData.caption}
              onChange={(e) => {
                setFormData({ ...formData, caption: e.target.value });
                if (formErrors.caption) setFormErrors({ ...formErrors, caption: null });
              }}
              placeholder="e.g. Afternoon sunset light over the pond and flower beds"
              error={formErrors.caption}
            />
            <p className="text-[11px] text-content-muted mt-1">
              Short descriptive caption displayed when visitors click the photo in the lightbox.
            </p>
          </div>

          {/* Public Visibility Checkbox */}
          <div className="p-3 rounded-xl bg-surface border border-surface-border">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-surface-border cursor-pointer"
              />
              <div>
                <strong className="text-xs text-content-main block">Make Publicly Visible in Gallery</strong>
                <span className="text-[11px] text-content-muted">
                  When checked, this photo immediately displays on the public website.
                </span>
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving} className="font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editingItem ? 'Update Photo' : 'Save & Publish Photo'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
