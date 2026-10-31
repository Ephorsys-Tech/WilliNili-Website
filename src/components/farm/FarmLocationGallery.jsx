'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Maximize2,
  Sparkles,
  MapPin,
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CloudinaryImage } from '@/components/ui/CloudinaryImage';

export function FarmLocationGallery({
  images = [],
  title = 'Scenic Farm Grounds & Agro Landscapes',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Only display real user-uploaded or Cloudinary images; remove fake/dummy fallbacks
  const galleryList = (images || []).filter(
    (url) =>
      url &&
      typeof url === 'string' &&
      url.trim() !== '' &&
      !url.includes('images.unsplash.com') &&
      !url.includes('/images/destinations/')
  );

  const captions = [
    'Freshwater Fishing Pond & Waterside Angling Banks',
    'White & Red Sandalwood, Agarwood & Mahogany Avenues',
    'Curated 50-Person Group Picnic Lawns with Shaded Gazebos',
    'Colour Bird Aviary & Free-Range Turkey Cultivation Yard',
    'Towering Betel Nut (Gua) Palms & Shaded Agro Walkways',
    'Traditional Woodfire Chulhas & Farm-Fresh Odia Dining',
    'Living Agro Retreat in Sagadipatana, Kisan Nagar',
    '2 Lakh Grafted Saplings at Sangeeta Nursery (Niali)',
    '5,000 Mother Plants & Upcoming Jungle Resort (Dhenkanal)',
  ];

  const total = galleryList.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx !== null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, total]);

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) handleNext();
    else if (diff < -40) handlePrev();
  };

  /**
   * Calculate 3D transformation, tilt rotation, scale, and z-index for each card
   * based on its circular distance from currentIndex
   */
  const getCardStyle = (index) => {
    let offset = index - currentIndex;
    // Circular wrap around
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    // Center active card
    if (offset === 0) {
      return {
        transform: 'translateX(0%) translateY(0) scale(1) rotate(0deg) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(100%)',
        cursor: 'zoom-in',
        pointerEvents: 'auto',
      };
    }

    // Left card 1
    if (offset === -1) {
      return {
        transform: isMobile
          ? 'translateX(-45%) translateY(-6px) scale(0.78) rotate(-14deg)'
          : 'translateX(-62%) translateY(-10px) scale(0.85) rotate(-22deg) rotateY(18deg)',
        zIndex: 20,
        opacity: 0.92,
        filter: 'brightness(85%)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      };
    }

    // Left card 2
    if (offset === -2) {
      if (isMobile) {
        return {
          transform: 'translateX(-80%) scale(0.5) rotate(-25deg)',
          zIndex: 5,
          opacity: 0,
          pointerEvents: 'none',
        };
      }
      return {
        transform: 'translateX(-110%) translateY(-20px) scale(0.72) rotate(-32deg) rotateY(26deg)',
        zIndex: 10,
        opacity: 0.72,
        filter: 'brightness(70%)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      };
    }

    // Right card 1
    if (offset === 1) {
      return {
        transform: isMobile
          ? 'translateX(45%) translateY(-6px) scale(0.78) rotate(14deg)'
          : 'translateX(62%) translateY(-10px) scale(0.85) rotate(22deg) rotateY(-18deg)',
        zIndex: 20,
        opacity: 0.92,
        filter: 'brightness(85%)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      };
    }

    // Right card 2
    if (offset === 2) {
      if (isMobile) {
        return {
          transform: 'translateX(80%) scale(0.5) rotate(25deg)',
          zIndex: 5,
          opacity: 0,
          pointerEvents: 'none',
        };
      }
      return {
        transform: 'translateX(110%) translateY(-20px) scale(0.72) rotate(32deg) rotateY(-26deg)',
        zIndex: 10,
        opacity: 0.72,
        filter: 'brightness(70%)',
        cursor: 'pointer',
        pointerEvents: 'auto',
      };
    }

    // Cards further away
    return {
      transform: `translateX(${offset > 0 ? 150 : -150}%) scale(0.4) rotate(${offset > 0 ? 40 : -40}deg)`,
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
    };
  };

  const activeCaption = captions[currentIndex % captions.length];

  return (
    <section className="space-y-6">
      {/* ─── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-glow-gold text-xs font-semibold text-secondary tracking-wide uppercase">
            <Camera className="w-3.5 h-3.5 text-secondary" />
            <span>Interactive 3D Visual Tour</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-content-main tracking-tight">
            Explore Our <span className="gold-gradient-text text-glow-gold">Farm Grounds</span> in 3D
          </h2>
          <p className="text-sm sm:text-base text-content-muted max-w-2xl">
            Swipe or use the controls to rotate through authentic snapshots of our sandalwood groves, freshwater fishing pond, and picnic lawns.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-content-muted bg-surface-muted/60 px-4 py-2 rounded-full border border-surface-border">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>{total} Perspectives Captured</span>
        </div>
      </div>

      {/* ─── Gallery Stage (Only renders if images are uploaded) ─── */}
      {galleryList.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-secondary/30 bg-surface-card p-10 sm:p-14 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-sm">
            <Camera className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-content-main">Farm Photo Gallery Awaiting Uploads</h3>
            <p className="text-sm text-content-muted max-w-lg mx-auto">
              No photos have been uploaded yet. Upload high-resolution photos via the Cloudinary uploader in the Admin Dashboard (<span className="font-mono text-secondary font-semibold">/admin/farm-house</span>), and they will automatically appear here.
            </p>
          </div>
        </div>
      ) : (
        /* ─── 3D Rotating Stack Carousel Stage ─── */
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full bg-transparent overflow-hidden py-6 sm:py-10 md:py-14 px-2 select-none"
          style={{ perspective: '1200px' }}
        >
        {/* 3D Cards Track */}
        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[500px] flex items-center justify-center">
          {galleryList.map((imgUrl, index) => {
            const style = getCardStyle(index);
            const isCenter = index === currentIndex;

            return (
              <div
                key={index}
                onClick={() => {
                  if (isCenter) {
                    setLightboxIdx(index);
                  } else {
                    setCurrentIndex(index);
                  }
                }}
                style={style}
                className="absolute w-[260px] sm:w-[340px] md:w-[400px] lg:w-[460px] aspect-square rounded-[24px] sm:rounded-[28px] md:rounded-[32px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_20px_50px_-10px_rgba(14,61,43,0.22),0_10px_25px_-5px_rgba(0,0,0,0.18)] border border-emerald-900/15 bg-white group"
              >
                <img
                  src={imgUrl}
                  alt={captions[index % captions.length]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Glass Scrim & Reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                {/* Center Card Zoom / MapPin Indicators */}
                {isCenter && (
                  <>
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5 shadow-md">
                        <MapPin className="w-3 h-3 text-[#F5D061]" />
                        <span>Willy Nilly Farm</span>
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                      <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 transform transition-transform">
                      <div className="text-[11px] sm:text-xs font-bold text-[#F5D061] mb-1 tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse" />
                        <span>Photo {currentIndex + 1} of {total}</span>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-md line-clamp-1">
                        {activeCaption}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Bottom Navigation Arrows (Porcelain / Theme Style) ─── */}
        <div className="relative z-30 mt-6 sm:mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="w-12 h-12 rounded-full bg-white hover:bg-emerald-50/80 border border-emerald-900/15 text-[#0E3D2B] flex items-center justify-center shadow-md hover:shadow-lg hover:border-secondary/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 text-[#0E3D2B] group-hover:text-secondary group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Photo"
            className="w-12 h-12 rounded-full bg-white hover:bg-emerald-50/80 border border-emerald-900/15 text-[#0E3D2B] flex items-center justify-center shadow-md hover:shadow-lg hover:border-secondary/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          >
            <ArrowRight className="w-5 h-5 text-[#0E3D2B] group-hover:text-secondary group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Swipe Hint on Mobile */}
        <p className="text-center text-[11px] text-content-muted mt-3 sm:hidden">
          Swipe left / right or tap side cards to rotate
        </p>
      </div>
      )}

      {/* ─── Lightbox Fullscreen Modal ──────────────────────────── */}
      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 border border-white/20 transition-all cursor-pointer"
            aria-label="Close photo view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls in Lightbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev > 0 ? prev - 1 : total - 1));
            }}
            className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev < total - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Modal Image Box */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center animate-slide-up"
          >
            <div className="relative w-full max-h-[75vh] overflow-hidden rounded-3xl border border-white/20 shadow-elevation bg-black">
              <img
                src={galleryList[lightboxIdx]}
                alt={captions[lightboxIdx % captions.length]}
                className="w-full h-full max-h-[75vh] object-contain mx-auto"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-base sm:text-lg font-bold text-white text-glow-gold">
                {captions[lightboxIdx % captions.length]}
              </p>
              <p className="text-xs text-white/70 mt-1">
                Willy Nilly Farm House Grounds • Photo {lightboxIdx + 1} of {total}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FarmLocationGallery;
