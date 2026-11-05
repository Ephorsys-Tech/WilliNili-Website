'use client';

import React, { useState } from 'react';

/**
 * Helper to append Cloudinary dynamic transformation parameters
 * Example: https://res.cloudinary.com/demo/image/upload/sample.jpg
 * -> https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/sample.jpg
 */
export function getOptimizedCloudinaryUrl(url, { width, height, crop = 'fill', quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = ['f_auto', `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');
  return `${parts[0]}/upload/${transformString}/${parts[1]}`;
}

export function CloudinaryImage({
  src,
  alt = '',
  width,
  height,
  crop = 'fill',
  quality = 'auto',
  className = '',
  loading = 'lazy',
  priority = false,
  fallback = '',
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const cleanSrc = src && typeof src === 'string' && src.trim() !== '' ? src.trim() : null;

  if (!cleanSrc || hasError) {
    if (fallback && fallback.trim() !== '') {
      return (
        <div className={`relative overflow-hidden ${className}`}>
          <img
            src={fallback}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            {...props}
          />
        </div>
      );
    }

    return (
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0e3d2b] via-[#09261a] to-[#04120c] text-white/70 select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F5D061] mb-1.5 border border-white/10 shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-[#F5D061] uppercase tracking-wider text-center line-clamp-1">
          {alt || 'Photo Coming Soon'}
        </span>
      </div>
    );
  }

  const optimizedSrc = getOptimizedCloudinaryUrl(cleanSrc, { width, height, crop, quality });

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-200/60 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}

export default CloudinaryImage;
