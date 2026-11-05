'use client';

/**
 * BgHero — Reusable full-width page hero component
 *
 * Props:
 *  @param {string}         image        - Background image URL (required)
 *  @param {string}         alt          - Alt text for the background image
 *  @param {string}         eyebrow      - Small label shown above the title
 *  @param {ReactNode}      title        - Main headline. Supports JSX <span> highlights.
 *  @param {string}         subtitle     - Supporting description text
 *  @param {ReactNode}      actions      - CTA buttons / links rendered below the subtitle
 *  @param {Array}          breadcrumbs  - [{ label, href? }] – breadcrumb trail
 *  @param {Array}          stats        - [{ value, label }] – glassmorphism stat pills
 *  @param {'sm'|'md'|'lg'|'xl'} size   - Controls minimum height of the hero section
 *  @param {'left'|'center'|'right'} align - Text / content alignment
 *  @param {string}         overlayClass - Override the default dark gradient overlay class
 *  @param {string}         className    - Extra classes for the outer <section>
 */

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/* ─── Minimum height by size preset ─── */
const SIZES = {
  sm: 'min-h-[320px] sm:min-h-[380px]',
  md: 'min-h-[420px] sm:min-h-[500px] lg:min-h-[580px]',
  lg: 'min-h-[520px] sm:min-h-[620px] lg:min-h-[720px]',
  xl: 'min-h-[620px] sm:min-h-[720px] lg:min-h-[90vh]',
};

/* ─── Text + flex-item alignment ─── */
const ALIGNS = {
  left:   'text-left items-start',
  center: 'text-center items-center',
  right:  'text-right items-end',
};

export function BgHero({
  image,
  alt          = 'Hero background',
  eyebrow,
  title,
  subtitle,
  actions,
  breadcrumbs,
  stats,
  size         = 'md',
  align        = 'center',
  overlayClass,
  className    = '',
}) {
  const imgRef     = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(true);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [image]);

  /* ── Subtle parallax scroll (desktop only, disabled on low-end via will-change) ── */
  useEffect(() => {
    const section = sectionRef.current;
    const img     = imgRef.current;
    if (!section || !img) return;

    // Skip parallax on very small screens (avoids layout thrashing on mobile)
    if (window.innerWidth < 640) return;

    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const rect  = section.getBoundingClientRect();
        const viewH = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewH) return;
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const shift    = (progress - 0.5) * 60;
        img.style.transform = `scale(1.08) translateY(${shift}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const alignClasses   = ALIGNS[align] ?? ALIGNS.center;
  const sizeClass      = SIZES[size]   ?? SIZES.md;
  const defaultOverlay = 'bg-gradient-to-t from-[#061c14] via-[#0b1a13]/75 to-black/55';

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${sizeClass} flex flex-col justify-center bg-[#071d15] text-white ${className}`}
      aria-label="Page hero banner"
    >
      {/* ── Background Image (overflow clip lives here, not on section) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] bg-[#071d15]">
        {image ? (
          <img
            ref={imgRef}
            src={image}
            alt={alt}
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover object-center will-change-transform transition-opacity duration-300 opacity-90"
            style={{ transform: 'scale(1.08)' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0e3d2b] via-[#09261a] to-[#04120c] opacity-90" />
        )}
        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${overlayClass ?? defaultOverlay}`} />
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* ── Decorative gold accent bar – right edge ── */}
      <div
        className="absolute top-0 right-0 h-full w-[3px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #d4af37 35%, #c59b27 65%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      {/* ── Main Content ── */}
      <div
        className={`
          relative z-10 w-full max-w-6xl mx-auto
          px-4 sm:px-6 lg:px-8
          py-14 sm:py-20 lg:py-24
          flex flex-col ${alignClasses}
          gap-3 sm:gap-4 lg:gap-5
        `}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-1.5 text-xs font-medium text-white/65 flex-wrap ${
              align === 'center' ? 'justify-center' : ''
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-white/90 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 text-white/40 flex-shrink-0" />
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-white/90 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/85">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Eyebrow pill */}
        {eyebrow && (
          <div
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-widest"
            style={{
              background:    'rgba(212,175,55,0.15)',
              borderColor:   'rgba(212,175,55,0.35)',
              color:         '#f0d87a',
              backdropFilter:'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#d4af37' }}
            />
            {eyebrow}
          </div>
        )}

        {/* Title */}
        {title && (
          <h1
            className={`
              font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-lg
              text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl
              max-w-4xl
              ${align === 'center' ? 'mx-auto' : ''}
            `}
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {title}
          </h1>
        )}

        {/* Gold divider */}
        <div
          className={`h-px w-14 sm:w-20 flex-shrink-0 ${align === 'center' ? 'mx-auto' : ''}`}
          style={{
            background: 'linear-gradient(90deg, transparent, #d4af37 40%, #c59b27 60%, transparent)',
          }}
        />

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`
              text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed font-normal
              max-w-xs sm:max-w-xl lg:max-w-3xl
              ${align === 'center' ? 'mx-auto' : ''}
            `}
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}
          >
            {subtitle}
          </p>
        )}

        {/* CTA Actions */}
        {actions && (
          <div
            className={`flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2 w-full ${
              align === 'center' ? 'items-center justify-center' : 'items-start'
            }`}
          >
            {actions}
          </div>
        )}

        {/* Stats strip
          FIX: was inline `gridTemplateColumns: repeat(4, …)` — always 4 cols, breaks on mobile.
          Now uses Tailwind responsive: 2 cols on mobile → 4 cols on sm+
        */}
        {stats && stats.length > 0 && (
          <div
            className={`
              w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl
              mt-3 sm:mt-4 pt-4 sm:pt-6
              border-t
              grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3
              ${align === 'center' ? 'mx-auto' : ''}
            `}
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-0.5 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl"
                style={{
                  background:          'rgba(255,255,255,0.08)',
                  backdropFilter:      'blur(10px)',
                  WebkitBackdropFilter:'blur(10px)',
                  border:              '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs text-white/70 leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom fade into page background ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-6 sm:h-8 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
        }}
      />
    </section>
  );
}

export default BgHero;
