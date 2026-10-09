'use client';

import React, { useState, useEffect } from 'react';
import { Images, Eye, X, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getPublicGallery } from '@/api/gallery.api';

const ALBUMS = [
  'All',
  'Guest House',
  'Farm House',
  'Events',
  'Resort',
  'Horticulture',
  'Property',
  'Celebrations',
  'General',
];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getPublicGallery(selectedAlbum === 'All' ? '' : selectedAlbum)
      .then((data) => {
        if (isMounted && Array.isArray(data)) setImages(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedAlbum]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="primary">Campus Showcase</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-content-main tracking-tight">
          Willy Nilly Photo Gallery
        </h1>
        <p className="text-base sm:text-lg text-content-muted leading-relaxed">
          Glimpses of green farm expanses, peaceful guest house suites, joyful open-air celebrations, and thriving agro nursery life.
        </p>
      </div>

      {/* Album Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {ALBUMS.map((album) => (
          <button
            key={album}
            type="button"
            onClick={() => setSelectedAlbum(album)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
              selectedAlbum === album
                ? 'bg-primary text-content-inverted border-primary shadow-sm'
                : 'bg-surface text-content-muted border-surface-border hover:bg-surface-muted hover:text-content-main'
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <LoadingSpinner text="Loading gallery photos..." />
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-theme border border-surface-border p-8">
          <Images className="w-12 h-12 text-content-light mx-auto mb-3" />
          <h3 className="text-lg font-bold text-content-main">No Images in this Category</h3>
          <p className="text-sm text-content-muted mt-1">
            Photographs will appear here once approved by our curator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item) => (
            <div
              key={item._id}
              onClick={() => setActiveLightbox(item)}
              className="group relative aspect-square bg-surface-muted rounded-theme border border-surface-border overflow-hidden cursor-pointer shadow-sm hover:shadow-elevation transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  {item.album}
                </span>
                <p className="text-sm font-semibold text-white truncate">
                  {item.title}
                </p>
                {item.caption && (
                  <p className="text-xs text-gray-200 line-clamp-1 mt-0.5">
                    {item.caption}
                  </p>
                )}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-surface rounded-theme border border-surface-border overflow-hidden shadow-elevation animate-slide-up"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <div>
                <h3 className="font-bold text-base text-content-main">{activeLightbox.title}</h3>
                <span className="text-xs text-primary font-semibold uppercase">{activeLightbox.album}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                aria-label="Close Lightbox"
                className="p-1.5 rounded-full hover:bg-surface-muted text-content-muted hover:text-content-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {activeLightbox.caption && (
              <div className="p-4 bg-surface text-xs text-content-muted border-t border-surface-border">
                {activeLightbox.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
