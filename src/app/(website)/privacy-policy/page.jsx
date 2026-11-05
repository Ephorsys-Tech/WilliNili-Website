import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Willy Nilly Agro Tourism & Farm',
  description: 'Privacy policy and data protection practices for visitors, guests, and customers of Willy Nilly Agro Tourism & Farm.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-emerald-800 hover:text-emerald-950 transition-colors gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-stone-200 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Legal &amp; Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Willy Nilly Agro Tourism &amp; Farm &bull; Effective Date: October 2026
          </p>
        </div>

        {/* Policy Text Content */}
        <div className="space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">1. Introduction</h2>
            <p>
              Welcome to Willy Nilly Agro Tourism &amp; Farm (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines our practices concerning the collection, use, disclosure, and protection of information obtained through our website, guest house booking forms, event inquiries, and nursery order requests.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">2. Information We Collect</h2>
            <p>
              We collect information that you directly provide to us when you interact with our services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Contact Information:</strong> Full name, telephone/mobile number, email address, and residential location when you place an enquiry, book a room, or contact us.</li>
              <li><strong>Stay &amp; Reservation Details:</strong> Check-in and check-out dates, number of guests (adults and children), special dietary requests, and preferences for our Guest House or Farm House event grounds.</li>
              <li><strong>Identity Verification:</strong> Government-issued identification details (such as Aadhaar, Voter ID, Passport, or Driving License) presented upon physical check-in at our campus, as mandated by local tourism regulations.</li>
              <li><strong>Horticulture Inquiries:</strong> Plant varieties, required sapling quantities, and nursery delivery or pickup preferences.</li>
              <li><strong>Automated Device Data:</strong> Basic browser type, device information, and IP address collected via standard server logs for website performance and cybersecurity monitoring.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">3. How We Use Your Information</h2>
            <p>
              We use the collected information for specific, legitimate business purposes, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Processing, confirming, and managing your guest house room bookings and farmhouse event requests.</li>
              <li>Communicating reservation confirmations, arrival directions, and customer support via phone, SMS, WhatsApp, or email.</li>
              <li>Fulfilling nursery plant orders and providing customized cultivation advice.</li>
              <li>Ensuring security on our agro campus and complying with applicable state and national regulatory requirements.</li>
              <li>Improving the design, performance, and functionality of our online services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">4. Information Sharing &amp; Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data with third-party marketers. We may share your information only in the following strictly limited situations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Service Providers:</strong> Trusted payment gateways, SMS/communication gateways, or cloud hosting partners who assist in operating our website under strict confidentiality agreements.</li>
              <li><strong>Legal Compliance:</strong> When required by court order, law enforcement, or governmental authority under applicable Indian law to protect the safety, rights, or property of our guests and premises.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">5. Data Security &amp; Storage</h2>
            <p>
              We implement industry-standard physical, technical, and managerial safeguards to protect your personal information against unauthorized access, loss, misuse, or alteration. All web transmissions are encrypted using standard SSL/TLS protocols. Access to guest records is restricted to authorized administrative personnel on a strict need-to-know basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">6. Cookies &amp; Tracking</h2>
            <p>
              Our website uses minimal, necessary cookies to ensure basic session navigation and security. We do not use third-party behavioral advertising trackers. You may configure your web browser to reject cookies, though certain interactive features of the website may function with limited efficiency.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">7. Your Rights</h2>
            <p>
              You have the right to request access to the personal data we hold about you, request corrections to inaccurate information, or ask for the deletion of non-essential records, subject to regulatory retention obligations. To exercise any of these rights, please contact our administrative desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">8. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to us:
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-1 text-sm text-stone-800">
              <p><strong>Willy Nilly Agro Tourism &amp; Farm</strong></p>
              <p>Green Valley Road, State Highway, Odisha, India</p>
              <p>Email: <a href="mailto:info@willynilly.in" className="text-emerald-800 font-medium underline">info@willynilly.in</a></p>
              <p>Phone: <a href="tel:+919876543210" className="text-emerald-800 font-medium underline">+91 98765 43210</a></p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

