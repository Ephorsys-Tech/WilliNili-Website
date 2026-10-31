'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Compass,
  MapPin,
  ExternalLink,
  Utensils,
  Wheat,
  Landmark,
  Share2,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight,
  Maximize2,
  X,
  ChevronLeft,
  Trees,
  MessageCircle,
  Award,
  Phone,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getFarmHouseContent } from '@/api/farm-house.api';
import { submitEnquiry } from '@/api/enquiry.api';
import { farmBlogPosts, getFarmBlogBySlug } from '@/lib/farmBlogData';
import { slugify } from '@/lib/utils';

export default function FarmBlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Direct Enquiry Form state
  const [formData, setFormData] = useState({
    enquiryType: 'FarmHouse',
    name: '',
    email: '',
    mobile: '',
    eventType: 'Agro Tour / Cultural Visit',
    preferredDate: '',
    expectedGuests: 4,
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getFarmHouseContent()
      .then((data) => {
        if (!isMounted) return;
        const dynamicPlaces = data?.touristPlaces || [];
        const found = getFarmBlogBySlug(slug, dynamicPlaces);
        setPost(found);
        if (found) {
          const isSandhya = found.slug?.includes('sandhya') || Boolean(found.quickFacts?.picnicCapacity);
          const isNursery = found.slug?.includes('sangeeta') || Boolean(found.quickFacts?.inventoryForSale);
          const isJungleResort = found.slug?.includes('allora') || found.slug?.includes('2026');

          let defaultEvent = 'Agro Tour / Cultural Visit';
          let defaultGuests = 4;
          let defaultMsg = `Interested in guided tour & visit for: ${found.title}`;

          if (isSandhya) {
            defaultEvent = '50-Person Day Picnic & Angling (Sandhya Farm)';
            defaultGuests = 50;
            defaultMsg = 'Interested in booking a 50-person day picnic, woodfire food, and pond fishing at Sandhya Agro Farm House in Kisan Nagar, Cuttack.';
          } else if (isNursery) {
            defaultEvent = 'Plant Purchase & Grafting Consultation (2 Lakh Saplings)';
            defaultGuests = 2;
            defaultMsg = 'Interested in visiting Sangeeta Grafting Nursery in Niali for mango and kaju grafted saplings purchase and grafting consultation.';
          } else if (isJungleResort) {
            defaultEvent = 'Allora Jungle Resort Pre-Launch Preview (Dec 2026)';
            defaultGuests = 4;
            defaultMsg = 'Interested in VIP pre-launch registration and orchard tour at Allora Agro Forestry & Jungle Resort.';
          }

          setFormData((prev) => ({
            ...prev,
            eventType: defaultEvent,
            expectedGuests: defaultGuests,
            message: defaultMsg,
          }));
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setPost(getFarmBlogBySlug(slug, []));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.mobile.trim() || formData.mobile.length < 7) {
      errs.mobile = 'Valid phone is required';
    }
    if (!formData.message.trim()) errs.message = 'Please specify your travel requirements';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitEnquiry(formData);
      setSubmittedRef(res.reference);
      setFormData({
        enquiryType: 'FarmHouse',
        name: '',
        email: '',
        mobile: '',
        eventType: 'Agro Tour / Cultural Visit',
        preferredDate: '',
        expectedGuests: 4,
        message: '',
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Loading story & travel guide..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <h2 className="text-2xl font-bold text-content-main mb-3">Story Not Found</h2>
        <p className="text-sm text-content-muted mb-6">
          The requested farm or tourism guide could not be located.
        </p>
        <Link href="/farm-house">
          <Button variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Farm House
          </Button>
        </Link>
      </div>
    );
  }

  // Related posts (excluding current)
  const relatedPosts = farmBlogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-bg pb-24 animate-fade-in">
      {/* ─── Breadcrumb Navigation ───────────────────────────────── */}
      <div className="bg-surface border-b border-surface-border">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3.5 flex items-center justify-between text-xs sm:text-sm">
          <nav className="flex items-center gap-1.5 text-content-muted overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-content-light flex-shrink-0" />
            <Link href="/farm-house" className="hover:text-primary transition-colors">
              Farm House
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-content-light flex-shrink-0" />
            <span className="text-content-main font-semibold truncate max-w-[200px] sm:max-w-[350px]">
              {post.category}
            </span>
          </nav>
          <Link
            href="/farm-house"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-secondary-hover transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Farm Guides</span>
          </Link>
        </div>
      </div>

      {/* ─── Article Header (Expansive, Comfortable & Responsive) ─── */}
      <header className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-12 pb-8 space-y-6">
        {/* Willy Nilly Eco Tourism Dec 2026 Priority Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950 to-emerald-950 border border-secondary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0 text-secondary border border-secondary/30">
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                Willy Nilly Agro Eco Tourism Project • Launching Before December 2026
              </p>
              <p className="text-xs sm:text-sm text-stone-200">
                Official Odisha Agro-Corridor: Sandhya Farm House (Cuttack) • Sangeeta Nursery (Niali) • Allora Forestry &amp; Jungle Resort (Dhenkanal)
              </p>
            </div>
          </div>
          <Link
            href="/farm-house/willy-nilly-agro-eco-tourism-project-2026"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-primary-dark font-bold text-xs whitespace-nowrap hover:bg-secondary-hover transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>Learn About 2026 Vision</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider badge-glow-gold text-secondary">
            {post.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            {post.distance}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-muted text-content-muted border border-surface-border flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-5xl font-extrabold text-content-main tracking-tight leading-[1.2] max-w-5xl">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-content-muted leading-relaxed font-normal max-w-4xl">
          {post.subtitle}
        </p>

        {/* Author / Guide Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/20 border-2 border-secondary/40 flex items-center justify-center text-secondary font-bold text-sm shadow-sm">
              {post.author?.name ? post.author.name.charAt(0) : 'W'}
            </div>
            <div>
              <p className="text-sm font-bold text-content-main">{post.author?.name || 'Willy Nilly Agro-Tour Desk'}</p>
              <p className="text-xs text-content-muted">{post.author?.role || 'Agro Tourism Desk'} • {post.publishedAt}</p>
            </div>
          </div>

          {post.mapUrl && (
            <a
              href={post.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-surface-muted border border-surface-border text-content-main hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </header>

      {/* ─── Hero Cover Photo (Expansive Cinematic Panorama) ──────── */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-12 sm:mb-16">
        <div
          onClick={() => post.image && setLightboxImg(post.image)}
          className={`relative w-full h-[320px] sm:h-[440px] md:h-[500px] lg:h-[580px] xl:h-[640px] rounded-3xl overflow-hidden shadow-elevation border border-surface-border group ${
            post.image ? 'cursor-pointer' : ''
          }`}
        >
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0e3d2b] via-[#09261a] to-[#04120c] text-center select-none">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mb-3 border border-secondary/30 shadow-md">
                <Compass className="w-8 h-8 text-secondary" />
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                {post.category}
              </span>
              <p className="text-xl sm:text-2xl font-extrabold text-white mt-1 max-w-xl line-clamp-2">
                {post.title}
              </p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
          {post.image && (
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to expand</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 max-w-lg text-white pointer-events-none">
            <p className="text-xs font-semibold text-secondary-light">Odisha Agro &amp; Cultural Odyssey</p>
            <p className="text-sm font-bold text-white drop-shadow-sm">{post.quickFacts?.location || post.title}</p>
          </div>
        </div>
      </div>

      {/* ─── Main Article Content + Sticky Sidebar Layout ─────────── */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">

          {/* Left Column: Article Body (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Quick Tourist Facts Box */}
            {post.quickFacts && (
              <div className="p-6 sm:p-8 rounded-2xl bg-surface-card border-2 border-secondary/30 shadow-card space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-secondary font-bold text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Tourist Briefing &amp; Travel Highlights</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <span className="font-semibold text-content-muted block">📍 Destination Location</span>
                    <span className="font-bold text-content-main">{post.quickFacts.location}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-content-muted block">🌾 Primary Agro Agriculture</span>
                    <span className="font-bold text-emerald-800">{post.quickFacts.primaryAgro}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-content-muted block">🏛️ Cultural &amp; Living Highlight</span>
                    <span className="font-bold text-content-main">{post.quickFacts.culturalHighlights}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-content-muted block">🍲 Traditional Must-Eat Food</span>
                    <span className="font-bold text-amber-800">{post.quickFacts.mustEatFood}</span>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="font-semibold text-content-muted block">⏱️ Recommended Tour Duration</span>
                    <span className="font-bold text-content-main">{post.quickFacts.recommendedDuration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Section Paragraphs */}
            <div className="space-y-10 prose prose-lg max-w-none text-content-main">
              {post.sections?.map((sec, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-content-main flex items-center gap-2.5 border-b border-surface-border pb-3">
                    <span className="w-2 h-6 rounded-full bg-secondary" />
                    <span>{sec.heading}</span>
                  </h2>
                  <p className="text-sm sm:text-base text-content-muted leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </section>
              ))}
            </div>

            {/* Step-by-Step Day Itinerary (if provided) */}
            {post.dayItinerary && post.dayItinerary.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-surface-card border border-surface-border shadow-card space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold text-base">
                  <Compass className="w-5 h-5 text-secondary" />
                  <span>Curated Tour Day Itinerary (Starting from Willy Nilly Farm)</span>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-secondary/30">
                  {post.dayItinerary.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-sm" />
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-primary text-white mb-1">
                          {item.time}
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-content-main">
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Photo Journal / Gallery */}
            {post.gallery && post.gallery.filter((g) => g?.url && g.url.trim() !== '').length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-content-main flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span>Visual Journal &amp; Photo Perspective</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.gallery
                    .filter((img) => img?.url && img.url.trim() !== '')
                    .map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImg(img.url)}
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-surface-border bg-surface-card shadow-sm hover:shadow-card transition-all"
                    >
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 inset-x-3 text-white text-xs font-medium">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Reservation & Enquiry Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Direct Tour & Stay Booking Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-surface-card border-2 border-secondary/40 shadow-elevation space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                    Plan Your Experience
                  </span>
                  <h3 className="text-lg font-extrabold text-content-main">
                    Book Farm Stay &amp; Guided Tour
                  </h3>
                  <p className="text-xs text-content-muted">
                    Stay at Willy Nilly Farm House while exploring {post.title.split(':')[0]}.
                  </p>
                </div>

                {submittedRef && (
                  <Alert variant="success" title="Booking Received">
                    Reference <strong className="font-mono">{submittedRef}</strong>. Our tour manager will connect with tailored itinerary options.
                  </Alert>
                )}

                {errors.form && (
                  <Alert variant="error" title="Submission Error">
                    {errors.form}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select
                    label="Tour or Event Type"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    options={[
                      '50-Person Day Picnic & Angling (Sandhya Farm)',
                      'Agro Farm Stay & Sandalwood Walk',
                      'Plant Purchase & Grafting Consultation (2 Lakh Saplings)',
                      'Allora Jungle Resort Pre-Launch Preview (Dec 2026)',
                      'Agro Tour / Cultural Visit',
                      'Family Gathering / Private Celebration',
                    ]}
                  />

                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="e.g. Priyabrata Dash"
                    required
                  />

                  <Input
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="+91 98765 43210"
                    required
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="you@example.com"
                    required
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Preferred Date"
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                    />
                    <Input
                      label="Expected Guests"
                      name="expectedGuests"
                      type="number"
                      min="1"
                      max="150"
                      value={formData.expectedGuests}
                      onChange={handleChange}
                    />
                  </div>

                  <Textarea
                    label="Tour, Picnic & Food Requirements"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    rows={3}
                    placeholder="Mention if you want 50-person picnic cooking support, pond fishing, plant purchase, or guided sandalwood grove tour..."
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full font-bold shadow-elevation"
                  >
                    <Send className="w-4 h-4 mr-2 text-secondary" />
                    Submit Tour &amp; Picnic Enquiry
                  </Button>
                </form>

                {/* Instant WhatsApp Action */}
                <div className="pt-2 border-t border-surface-border space-y-3">
                  <div className="relative flex items-center justify-center">
                    <span className="bg-surface-card px-2 text-[11px] uppercase tracking-wider font-bold text-content-muted">
                      Or Connect Directly
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hello Willy Nilly! I am reading the guide for "${post.title}" and would like to arrange a visit / 50-person picnic.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>Instant WhatsApp Booking</span>
                  </a>
                </div>
              </div>

              {/* Quick Contacts Box */}
              <div className="p-5 rounded-2xl bg-surface border border-surface-border text-center space-y-2">
                <span className="text-xs font-semibold text-content-muted block">Direct Tour &amp; Farm Coordinator</span>
                <a
                  href="tel:+919876543210"
                  className="text-base font-bold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-secondary" />
                  <span>+91 98765 43210</span>
                </a>
                <p className="text-xs text-content-muted">Call anytime for 50-person picnic reservations, sapling orders, or stay packages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Articles & Stories ──────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 border-t border-surface-border mt-20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Continue Exploring
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main">
                More Odisha Cultural &amp; Agro-Tourism Guides
              </h2>
            </div>
            <Link
              href="/farm-house"
              className="text-xs sm:text-sm font-bold text-primary hover:text-secondary transition-colors inline-flex items-center gap-1"
            >
              <span>View All Farmhouse Features</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {relatedPosts.map((rPost, idx) => (
              <Link
                key={idx}
                href={`/farm-house/${rPost.slug}`}
                className="group flex flex-col bg-surface-card rounded-2xl border border-surface-border overflow-hidden card-rich-hover shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                  <img
                    src={rPost.image}
                    alt={rPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-white">
                      {rPost.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-secondary block mb-1">
                      {rPost.distance} • {rPost.readTime}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-content-main group-hover:text-primary transition-colors line-clamp-2">
                      {rPost.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-primary group-hover:text-secondary transition-colors inline-flex items-center gap-1">
                    <span>Read Story &amp; Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Lightbox Modal ────────────────────────────────────── */}
      {lightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl xl:max-w-7xl max-h-[88vh] rounded-2xl overflow-hidden border border-white/20 shadow-elevation bg-black"
          >
            <img src={lightboxImg} alt="Enlarged view" className="w-full h-full max-h-[88vh] object-contain" />
          </div>
        </div>
      )}
    </article>
  );
}
