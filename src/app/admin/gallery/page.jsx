'use client';

import React, { useState, useEffect } from 'react';
import { Images, Plus, Trash2, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/api/gallery.api';
import { uploadImage } from '@/api/settings.api';

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

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    album: 'General',
    imageUrl: '',
    caption: '',
    isPublic: true,
    sortOrder: 0,
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState(null);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await getAdminGallery({ album: selectedAlbum === 'All' ? '' : selectedAlbum });
      if (res?.items) setImages(res.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedAlbum]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
        setAlertState({ type: 'success', message: 'Image uploaded and validated securely.' });
      }
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'File upload failed.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setAlertState({ type: 'error', message: 'Image URL or uploaded file is required' });
      return;
    }

    setIsSaving(true);
    setAlertState(null);

    try {
      await createGalleryItem(formData);
      setAlertState({ type: 'success', message: 'Photo added to gallery successfully.' });
      setIsModalOpen(false);
      setFormData({
        title: '',
        album: 'General',
        imageUrl: '',
        caption: '',
        isPublic: true,
        sortOrder: 0,
      });
      fetchGallery();
    } catch (err) {
      setAlertState({ type: 'error', message: err.message || 'Error saving photo.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await updateGalleryItem(item._id, { isPublic: !item.isPublic });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this photo from the gallery?')) return;
    try {
      await deleteGalleryItem(id);
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-content-main">Campus Photo Gallery Curation</h2>
          <p className="text-xs text-content-muted">Upload and curate photographs shown to visitors across categories.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Photo
        </Button>
      </div>

      {alertState && (
        <Alert variant={alertState.type} title={alertState.type === 'success' ? 'Success' : 'Notice'}>
          {alertState.message}
        </Alert>
      )}

      {/* Album Filter */}
      <div className="flex flex-wrap gap-1.5">
        {['All', ...ALBUMS].map((alb) => (
          <button
            key={alb}
            type="button"
            onClick={() => setSelectedAlbum(alb)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              selectedAlbum === alb
                ? 'bg-primary text-content-inverted border-primary'
                : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted'
            }`}
          >
            {alb}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading gallery photos..." />
      ) : images.length === 0 ? (
        <Card padding="p-8" className="text-center">
          <Images className="w-12 h-12 text-content-light mx-auto mb-3" />
          <p className="text-sm font-semibold text-content-main">No gallery photos in this album</p>
          <p className="text-xs text-content-muted mt-1">Click &quot;Add Photo&quot; to upload campus visuals.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((item) => (
            <Card key={item._id} padding="p-2" className="flex flex-col justify-between group">
              <div className="aspect-square bg-surface-muted rounded-theme overflow-hidden relative mb-2">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 right-1.5">
                  <Badge variant={item.isPublic ? 'success' : 'neutral'} size="sm">
                    {item.isPublic ? 'Public' : 'Hidden'}
                  </Badge>
                </div>
              </div>

              <div className="px-1 space-y-1">
                <p className="font-semibold text-xs text-content-main truncate">{item.title}</p>
                <p className="text-[10px] text-primary font-medium">{item.album}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border mt-2 px-1">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(item)}
                  className="p-1 text-content-muted hover:text-content-main"
                  title={item.isPublic ? 'Hide from public' : 'Publish to gallery'}
                >
                  {item.isPublic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="p-1 text-content-muted hover:text-status-error"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Photo to Gallery"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Photo Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Guest House Garden Pavilion"
            required
          />

          <Select
            label="Album / Category"
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            options={ALBUMS}
            required
          />

          {/* Secure Image Upload */}
          <div>
            <label className="block text-xs font-medium text-content-main mb-1.5">
              Upload Image File (JPEG, PNG, WebP &le; 5MB)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-theme file:border-0 file:text-xs file:bg-surface-muted file:text-content-main hover:file:bg-primary-light/40"
              />
              {isUploading && <LoadingSpinner size="sm" text="" />}
            </div>
          </div>

          <Input
            label="Or Direct Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="/images/example.jpg or https://..."
            required
          />

          <Input
            label="Caption (Optional)"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="Short description displayed on lightbox"
          />

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Make Publicly Visible in Gallery</span>
          </label>

          <div className="flex justify-end gap-3 pt-3 border-t border-surface-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
