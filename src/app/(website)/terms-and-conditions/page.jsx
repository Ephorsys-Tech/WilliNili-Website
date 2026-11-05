import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms and Conditions | Willy Nilly Agro Tourism & Farm',
  description: 'Terms of service, guest policies, booking conditions, and campus guidelines for Willy Nilly Agro Tourism & Farm.',
};

export default function TermsAndConditionsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Willy Nilly Agro Tourism &amp; Farm &bull; Effective Date: October 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">1. Agreement to Terms</h2>
            <p>
              By accessing our website, reserving accommodations, booking event grounds, or purchasing horticulture nursery products from Willy Nilly Agro Tourism &amp; Farm (&quot;Willy Nilly&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our services or visiting our facilities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">2. Guest House Bookings &amp; Check-in Policies</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Check-in &amp; Check-out:</strong> Standard check-in time is 12:00 PM and check-out time is 11:00 AM. Early check-in or late check-out is subject to room availability and prior management approval.</li>
              <li><strong>Identification:</strong> In accordance with government regulations, all adult guests must present valid government-issued photo identification (Aadhaar, Passport, Voter ID, or Driving License) upon arrival. PAN cards are not accepted as valid proof of address.</li>
              <li><strong>Occupancy Limits:</strong> Each room type has a maximum permissible guest capacity (adults and children). Exceeding the stated capacity without prior management consent is prohibited.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">3. Farm House Grounds &amp; Event Hosting</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Our open farm grounds and lawns are available for family celebrations, eco-gatherings, corporate retreats, and agro workshops upon confirmed booking.</li>
              <li>Sound amplification and loud music must adhere strictly to local district regulations and noise curfew guidelines (music must be lowered or concluded by 10:00 PM).</li>
              <li>Event organizers are responsible for the conduct of their attendees and any physical damage caused to orchards, landscapes, structures, or electrical fixtures on the property.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">4. Horticulture Nursery &amp; Plant Sales</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Plants, saplings, and nursery supplies are offered based on seasonal availability.</li>
              <li>All plants are inspected for health and quality prior to handover or dispatch. Due to biological factors beyond our control after purchase (soil quality, watering, weather), plants cannot be returned or replaced once received in healthy condition.</li>
              <li>Cultivation instructions provided by our horticulturists serve as general guidance based on local climate conditions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">5. Tariffs, Pricing &amp; Payments</h2>
            <p>
              All published tariffs, room rates, and plant prices are listed in Indian Rupees (₹). We reserve the right to revise tariffs without prior notice, provided that confirmed and pre-paid bookings will honor the agreed rate. Any applicable government taxes and cess will be levied as required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">6. Cancellation &amp; Rescheduling Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Guest House Bookings:</strong> Cancellations made at least 48 hours prior to the scheduled check-in date are eligible for a full refund or date rescheduling. Cancellations within 48 hours of arrival may incur a one-night retention charge.</li>
              <li><strong>Event Grounds:</strong> Advance booking deposits for event spaces are subject to specific agreements signed at the time of reservation.</li>
              <li><strong>No-Shows:</strong> Failure to arrive without prior notification will be treated as a no-show, and no refund will be issued.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">7. Campus Conduct &amp; Environmental Protection</h2>
            <p>
              Willy Nilly is an eco-friendly sanctuary dedicated to agriculture, nature, and peaceful relaxation. All visitors and guests agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Respect the plants, trees, crops, and local wildlife on the property. Plucking fruits, flowers, or branches without permission is strictly prohibited.</li>
              <li>Dispose of all litter and plastics in designated waste bins. Littering across the farm campus is strictly prohibited.</li>
              <li>Prohibit unauthorized open fires, fireworks, or hazardous materials anywhere on the farm grounds.</li>
              <li>Possession or consumption of illicit substances is strictly forbidden and will be reported to law enforcement immediately.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">8. Limitation of Liability</h2>
            <p>
              While we maintain rigorous security and safety standards throughout our campus, Willy Nilly Agro Tourism &amp; Farm shall not be held liable for any loss, theft, or damage to personal belongings brought onto the premises. Guests are advised to keep valuables secured. Participation in agro-farming activities or nature walks is at the guest&apos;s own discretion and care.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">9. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal dispute, claim, or proceeding arising under or in connection with these terms shall fall under the exclusive jurisdiction of the competent courts in the state of Odisha, India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-stone-900">10. Contact Details</h2>
            <p>
              For inquiries regarding bookings, terms of service, or campus regulations, please contact:
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

