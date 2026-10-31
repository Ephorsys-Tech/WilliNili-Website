'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Cloud, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadImage } from '@/api/settings.api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function CloudinaryUploader({
  value = '',
  onChange,
  label = 'Upload Image',
  folder = 'willy_nilly',
  helpText = 'Supports JPEG, PNG, WebP up to 5MB. Uploads to Cloudinary CDN.',
  className = '',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadImage(file, folder);
      if (res?.url) {
        onChange(res.url);
        setProvider(res.provider || (res.url.includes('cloudinary') ? 'cloudinary' : 'local'));
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-content-main">
          {label}
        </label>
      )}

      {/* Image Preview Card if value exists */}
      {value ? (
        <div className="relative group rounded-2xl border border-surface-border overflow-hidden bg-surface-muted/40 p-2">
          <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-xl overflow-hidden bg-stone-900/10">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold shadow-md hover:bg-stone-100 transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setProvider(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Provider Badge and URL snippet */}
          <div className="flex items-center justify-between gap-2 px-1 pt-2 text-[11px] text-content-muted">
            <span className="truncate max-w-[280px]" title={value}>
              {value}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0E3D2B] font-semibold text-[10px]">
              <Cloud className="w-3 h-3 text-secondary" />
              <span>{value.includes('cloudinary') || provider === 'cloudinary' ? 'Cloudinary CDN' : 'Local Storage'}</span>
            </span>
          </div>
        </div>
      ) : (
        /* Dropzone Card */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-secondary bg-secondary-light/40 scale-[1.01]'
              : 'border-surface-border hover:border-secondary/60 hover:bg-surface-muted/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2">
              <LoadingSpinner size="md" />
              <p className="text-xs font-semibold text-secondary">Uploading to Cloudinary CDN...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-secondary-light/60 flex items-center justify-center text-secondary border border-secondary/20">
                <Cloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-content-main">
                Click to browse or drag and drop image here
              </p>
              <p className="text-[11px] text-content-muted">{helpText}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default CloudinaryUploader;
