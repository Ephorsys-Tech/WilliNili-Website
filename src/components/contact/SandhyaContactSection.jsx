'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Send,
  MessageCircle,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Building,
  Trees,
  Sprout,
} from 'lucide-react';
import { submitEnquiry } from '@/api/enquiry.api';

// Brand 3-leaf emblem SVG matching the design
export function LeafEmblem({ className = 'w-9 h-9' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 5C24 5 18 15 18 23C18 28.5 20.7 33 24 36C27.3 33 30 28.5 30 23C30 15 24 5 24 5Z"
        fill="#0E3D2B"
      />
      <path
        d="M22 22C22 22 13 19 8 25C4.8 28.8 6.5 34 11 35.5C15.5 37 21.5 30 22 22Z"
        fill="#136C43"
      />
      <path
        d="M26 22C26 22 35 19 40 25C43.2 28.8 41.5 34 37 35.5C32.5 37 26.5 30 26 22Z"
        fill="#136C43"
      />
      <path
        d="M12 40C18 42.5 30 42.5 36 40"
        stroke="#C59B27"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Decorative floating leaf
export function FloatingLeaf({ className = 'w-6 h-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19.5 4.5C15 4.5 11 7 8 11C6.5 13 5.5 15.5 5 18C7.5 17.5 10 16.5 12 15C16 12 18.5 8 19.5 4.5Z"
        fill="#14532D"
        opacity="0.75"
      />
      <path
        d="M8 11L18 5"
        stroke="#86EFAC"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

const INQUIRY_TOPICS = [
  'Farm Stay & Cottage Reservation',
  '50-Person Day Picnic & Pond Angling',
  'Plant Saplings Bulk Purchase (Sangeeta Nursery - Niali)',
  'Allora Jungle Resort Pre-Launch Preview (Dec 2026)',
  'Wedding / Sangeet / Celebration Venue Booking',
  'Corporate Day-Out & Team Retreat',
  'Horticulture & Farm Consultation',
  'Other General Query',
];

export function SandhyaContactSection({ settings }) {
  const [formData, setFormData] = useState({
    enquiryType: 'Contact',
    name: '',
    email: '',
    mobile: '',
    topic: '',
    preferredDate: '',
    message: '',
  });

  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const phonePrimary = settings?.phonePrimary || '+91 98765 43210';
  const phoneSecondary = settings?.phoneSecondary || '+91 98765 43211';
  const emailPrimary = settings?.emailPrimary || 'info@willynilly.in';
  const address =
    settings?.address || 'Willy Nilly Agro Campus, Green Valley Road, State Highway, Odisha';
  const hours =
    settings?.businessHours || 'Guest House: 24/7 Check-in | Farm & Nursery: 8 AM - 6 PM';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Your name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Valid email is required';
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 7) {
      errs.mobile = 'Valid phone number is required';
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = 'Please specify your message or inquiry';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        enquiryType: 'Contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: `${countryCode} ${formData.mobile.trim()}`.trim(),
        message: formData.topic
          ? `[Topic: ${formData.topic}] ${formData.message.trim()}`
          : formData.message.trim(),
      };

      if (formData.preferredDate) {
        payload.preferredDate = new Date(formData.preferredDate);
      }

      const res = await submitEnquiry(payload);
      setSubmittedRef(res.reference || 'REF-' + Date.now().toString().slice(-6));
      setFormData({
        enquiryType: 'Contact',
        name: '',
        email: '',
        mobile: '',
        topic: '',
        preferredDate: '',
        message: '',
      });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppNumber = '919876543210';
  const whatsAppMessage = encodeURIComponent(
    `Hello Willy Nilly! I would like to contact your team. Name: ${
      formData.name || 'Guest'
    }, Topic: ${formData.topic || 'General Inquiry'}.`
  );
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`;

  return (
    <section className="relative w-full rounded-[28px] sm:rounded-[36px] lg:rounded-[48px] overflow-hidden bg-gradient-to-b from-[#eaf2ec] via-[#f4f8f5] to-[#fbfdfa] border border-[#cfe2d5] shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Background Farm Atmosphere Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-multiply overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-[#0e3d2b] to-[#144f38]" />
      </div>

      {/* Decorative Floating Leaves (Hidden on extra small screens) */}
      <div className="hidden sm:block absolute top-10 left-6 pointer-events-none transform -rotate-12">
        <FloatingLeaf className="w-8 h-8 text-emerald-800" />
      </div>
      <div className="hidden sm:block absolute top-44 left-1 pointer-events-none transform rotate-45">
        <FloatingLeaf className="w-6 h-6 text-emerald-700" />
      </div>
      <div className="hidden sm:block absolute bottom-16 left-8 pointer-events-none transform -rotate-45">
        <FloatingLeaf className="w-7 h-7 text-emerald-800" />
      </div>
      <div className="hidden sm:block absolute top-20 right-10 pointer-events-none transform rotate-12">
        <FloatingLeaf className="w-8 h-8 text-emerald-800" />
      </div>
      <div className="hidden sm:block absolute bottom-28 right-12 pointer-events-none transform -rotate-25">
        <FloatingLeaf className="w-7 h-7 text-emerald-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* ─── Top Brand Header & Circular Feature Badges ────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8 pb-2">
          {/* Brand Logo & Headline */}
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-3">
              <LeafEmblem className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0" />
              <div>
                <h3 className="font-heading-serif font-extrabold text-lg sm:text-2xl text-[#0E3D2B] tracking-tight">
                  Willy Nilly Agro Tourism
                </h3>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#415A4D] uppercase">
                  Hospitality &bull; Direct Assistance &bull; Fast Response
                </p>
              </div>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-2 pt-1 sm:pt-2">
              <h2 className="font-heading-serif font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#0E3D2B] tracking-tight leading-[1.15]">
                Get in Touch with Our{' '}
                <span className="text-[#C59B27] drop-shadow-sm font-heading-serif">Farm &amp; Eco Team</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#415A4D] leading-relaxed max-w-xl">
                Have questions about cottage reservations, 50-person day picnics, 2 lakh nursery
                saplings, or directions to our 8-acre estate? Reach out directly or send us a
                message below.
              </p>
            </div>
          </div>

          {/* 4 Circular Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4 shrink-0 self-center lg:self-start">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/95 backdrop-blur shadow-md border border-[#cfe2d5] flex items-center justify-center text-[#0E3D2B] group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#C59B27] transition-all duration-300">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#0E3D2B]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#0E3D2B] mt-1.5 sm:mt-2 leading-tight">
                Direct Desk
                <br />
                &amp; Phone
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/95 backdrop-blur shadow-md border border-[#cfe2d5] flex items-center justify-center text-[#0E3D2B] group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#C59B27] transition-all duration-300">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#0E3D2B]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#0E3D2B] mt-1.5 sm:mt-2 leading-tight">
                Farm &amp; Campus
                <br />
                Visits
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/95 backdrop-blur shadow-md border border-[#cfe2d5] flex items-center justify-center text-[#0E3D2B] group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#C59B27] transition-all duration-300">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#0E3D2B]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#0E3D2B] mt-1.5 sm:mt-2 leading-tight">
                Instant
                <br />
                WhatsApp
              </span>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/95 backdrop-blur shadow-md border border-[#cfe2d5] flex items-center justify-center text-[#0E3D2B] group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#C59B27] transition-all duration-300">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#0E3D2B]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#0E3D2B] mt-1.5 sm:mt-2 leading-tight">
                Response in
                <br />
                &lt; 24 Hours
              </span>
            </div>
          </div>
        </div>

        {/* ─── Main Content: Polaroids & Desk (Left on XL), Form (Right) ──── */}
        <div className="relative flex flex-col xl:flex-row items-start gap-8">
          {/* Left Column: Polaroid Stack & Campus Info (Visible on xl+, width capped to 280px) */}
          <div className="hidden xl:flex flex-col space-y-5 pt-4 select-none relative w-72 shrink-0">
            {/* Polaroid 1 - Allora Jungle Resort */}
            <div className="relative w-full bg-white p-2.5 pb-6 rounded-xl shadow-xl border border-gray-200/90 transform -rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#18181b] to-[#27272a] flex items-center justify-center text-[#F5D061] shadow-inner">
                <Trees className="w-12 h-12" />
              </div>
              <p className="font-handwritten text-base text-[#10261C] font-bold mt-2 text-center">
                Allora Jungle Resort (Dec 2026)
              </p>
            </div>

            {/* Polaroid 2 - Sangeeta Grafting Nursery */}
            <div className="relative w-full bg-white p-2.5 pb-6 rounded-xl shadow-xl border border-gray-200/90 transform rotate-2 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 -mt-6 ml-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-[#0a2e20] to-[#134e4a] flex items-center justify-center text-teal-300 shadow-inner">
                <Sprout className="w-12 h-12" />
              </div>
              <p className="font-handwritten text-base text-[#10261C] font-bold mt-2 text-center">
                2 Lakh Grafted Saplings (Niali)
              </p>
            </div>

            {/* Campus Quick Details Box */}
            <div className="bg-white/95 rounded-2xl border border-[#cfe2d5] p-5 shadow-lg space-y-3.5 text-xs text-[#415A4D]">
              <div className="flex items-center gap-2 border-b border-[#e5efe8] pb-2.5">
                <Building className="w-4 h-4 text-[#0E3D2B]" />
                <h4 className="font-bold text-[#0E3D2B] text-sm">Direct Contact Desk</h4>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#136C43] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0E3D2B]">Campus Address:</strong>
                    <span>{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#136C43] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0E3D2B]">Telephone Lines:</strong>
                    <span>Primary: {phonePrimary}</span>
                    <br />
                    <span>Alternate: {phoneSecondary}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#136C43] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0E3D2B]">Official Email:</strong>
                    <span>{emailPrimary}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#136C43] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0E3D2B]">Visiting Hours:</strong>
                    <span>{hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "Send Us a Message" Form Card (Full width on mobile/tablet/laptop) */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] md:rounded-[36px] shadow-[0_20px_50px_rgba(14,61,43,0.10)] border border-[#cfe2d5]/80 p-4 sm:p-7 md:p-9 lg:p-10 relative overflow-hidden">
              {/* Form Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5efe8] pb-5 mb-6 sm:mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <LeafEmblem className="w-7 h-7 sm:w-8 sm:h-8 text-[#0E3D2B]" />
                    <h3 className="font-heading-serif font-extrabold text-xl sm:text-2xl md:text-3xl text-[#0E3D2B]">
                      Send Us a Direct Message
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#415A4D]">
                    Fill in the details below and our management office will get back to you promptly.
                  </p>
                </div>

                {/* Right handwritten callout */}
                <div className="hidden sm:block text-right self-start sm:self-center select-none shrink-0">
                  <div className="font-handwritten text-xl md:text-2xl text-[#14532D] font-bold leading-tight -rotate-2">
                    <span className="block">Warm Smiles 🌿</span>
                    <span className="block text-[#166534]">Authentic Care</span>
                    <span className="block text-[#0E3D2B] underline decoration-emerald-400 decoration-wavy">
                      Always Here
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Feedback Banner */}
              {submittedRef && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0E3D2B] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold">Message Received Successfully!</p>
                    <p className="text-xs text-[#415A4D] mt-0.5">
                      Your reference number is{' '}
                      <strong className="font-mono text-[#0E3D2B]">{submittedRef}</strong>. Our
                      desk will connect with you within 24 business hours.
                    </p>
                  </div>
                </div>
              )}

              {errors.form && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
                  {errors.form}
                </div>
              )}

              {/* Interactive Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Row 1: Full Name & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5 w-full min-w-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                      <User className="w-4 h-4 text-[#136C43]" />
                      <span>Your Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Mohapatra"
                      className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#10261C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 transition-all ${
                        errors.name ? 'border-red-400' : 'border-[#cfe2d5] hover:border-[#9dc4a9]'
                      }`}
                      required
                    />
                    {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name}</p>}
                  </div>

                  {/* Mobile Number with Country Code */}
                  <div className="space-y-1.5 w-full min-w-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                      <Phone className="w-4 h-4 text-[#136C43]" />
                      <span>Mobile Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl shadow-sm w-full min-w-0">
                      <div className="relative shrink-0">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          aria-label="Country Code"
                          className="appearance-none h-full pl-3 pr-7 py-3 rounded-l-xl bg-[#f4f8f5] border border-r-0 border-[#cfe2d5] text-xs font-bold text-[#0E3D2B] focus:outline-none cursor-pointer"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+1">+1 (US)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+971">+971 (AE)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#415A4D] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="98765 43210"
                        className={`flex-1 min-w-0 px-4 py-3 rounded-r-xl bg-white border text-sm text-[#10261C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 transition-all ${
                          errors.mobile
                            ? 'border-red-400'
                            : 'border-[#cfe2d5] hover:border-[#9dc4a9]'
                        }`}
                        required
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-xs text-red-600 font-medium">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email Address */}
                <div className="space-y-1.5 w-full min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                    <Mail className="w-4 h-4 text-[#136C43]" />
                    <span>Email Address</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#10261C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 transition-all ${
                      errors.email ? 'border-red-400' : 'border-[#cfe2d5] hover:border-[#9dc4a9]'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Row 3: Inquiry Topic & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Topic Dropdown */}
                  <div className="space-y-1.5 w-full min-w-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                      <FileText className="w-4 h-4 text-[#136C43]" />
                      <span>Inquiry Topic / Category</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-white border border-[#cfe2d5] hover:border-[#9dc4a9] text-sm text-[#10261C] focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 cursor-pointer transition-all"
                      >
                        <option value="">Select a topic (optional)...</option>
                        {INQUIRY_TOPICS.map((topic, i) => (
                          <option key={i} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#415A4D] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Preferred Visit Date */}
                  <div className="space-y-1.5 w-full min-w-0">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                      <Calendar className="w-4 h-4 text-[#136C43]" />
                      <span>Preferred Visit Date</span>
                      <span className="text-xs font-normal text-[#415A4D]">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#cfe2d5] hover:border-[#9dc4a9] text-sm text-[#10261C] focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Row 4: Message or Query */}
                <div className="space-y-1.5 w-full min-w-0">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#0E3D2B] tracking-wide">
                    <FileText className="w-4 h-4 text-[#136C43]" />
                    <span>Your Message or Query</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist your stay, event, or horticulture inquiry? Let us know what you have in mind..."
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-[#10261C] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3D2B]/20 transition-all ${
                      errors.message ? 'border-red-400' : 'border-[#cfe2d5] hover:border-[#9dc4a9]'
                    }`}
                    required
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 font-medium">{errors.message}</p>
                  )}
                </div>

                {/* Form Footer: Fully Responsive, No Overflow */}
                <div className="pt-5 sm:pt-6 flex flex-col xl:flex-row items-center justify-between gap-4 sm:gap-6 border-t border-[#e5efe8]">
                  {/* Left: Soft Watercolor Ochre Brush Badge */}
                  {/* <div className="inline-flex items-center justify-center px-5 py-2.5 bg-[#fbf5e6] border border-[#e8d7a7]/60 rounded-2xl shadow-sm self-center xl:self-auto shrink-0">
                    <span className="font-handwritten text-lg sm:text-xl md:text-2xl font-bold text-[#8a681d] -rotate-2 select-none tracking-wide whitespace-nowrap">
                      We&apos;d love to hear from you! ♡
                    </span>
                  </div> */}

                  {/* Right: Submit Button & WhatsApp Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
                    {/* Primary Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3.5 rounded-xl bg-[#0E3D2B] hover:bg-[#08281C] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 transform hover:-translate-y-0.5 cursor-pointer text-center"
                    >
                      <Send className="w-4 h-4 text-[#86EFAC] shrink-0" />
                      <span>{isSubmitting ? 'Sending Message...' : 'Send Direct Message'}</span>
                      <ArrowRight className="w-4 h-4 ml-0.5 text-white/80 shrink-0" />
                    </button>

                    {/* Secondary WhatsApp Button */}
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl bg-white border-2 border-[#0E3D2B] text-[#0E3D2B] hover:bg-emerald-50/60 font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap text-center"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Quick WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SandhyaContactSection as ContactSection };
export default SandhyaContactSection;
