import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Important Notice',
  description: 'Davis Furniture Wholesale privacy statement and GDPR compliance policy for trade clients and visitors.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-neutral-200 pb-8 mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2 block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Privacy Policy and Important Notice
          </h1>
          <p className="text-xs text-neutral-500">
            Last Updated: January 2026 | Davis Furniture Wholesale
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-6 text-sm sm:text-base text-neutral-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">1. Introduction</h2>
            <p>
              Davis Furniture Wholesale (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is dedicated to protecting the privacy and personal data of our trade clients, website visitors, and business partners. This policy outlines how we collect, store, and process trade information in compliance with UK &amp; EU GDPR regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">2. Data We Collect</h2>
            <p>
              We exclusively collect business-relevant information when you request a quotation, register for a trade wholesale account, or contact us. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Company name, trade registration number, and VAT details</li>
              <li>Authorized contact person name, job title, and phone number</li>
              <li>Delivery addresses, dispatch requirements, and order history</li>
              <li>Communications and quotation request notes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">3. How We Use Your Data</h2>
            <p>
              Your data is utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Processing wholesale quotes, proforma invoices, and production orders</li>
              <li>Arranging reliable freight delivery across Northern Ireland, Republic of Ireland, and the UK</li>
              <li>Sending essential product updates, seasonal catalogs, and safety notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">4. Security &amp; Storage</h2>
            <p>
              We enforce appropriate technical and organizational measures to safeguard your data against unauthorized access, loss, or alteration. We do not sell or lease trade contact lists to any third party.
            </p>
          </section>

          <section className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2 flex items-center">
              <ShieldCheck className="w-5 h-5 text-amber-600 mr-2" /> Inquiries &amp; Data Rights
            </h3>
            <p className="text-xs text-neutral-600">
              For any privacy inquiries, data deletion, or correction requests, please contact our administrative desk at:
              <br />
              <strong>charlie@davisfurniturewholesale.com</strong>
              <br />
              33A BALLYDESLAND ROAD, WARRENPOINT, CO.DOWN, N. IRELAND BT34 3QB
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

