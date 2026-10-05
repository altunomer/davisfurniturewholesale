'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export const ContactClient: React.FC = () => {
  const { contactSettings } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: contactSettings.notificationSubject || 'Wholesale Pricing & Catalog',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-neutral-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2 block">
            We&apos;d love to hear from you
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Visit Us & Get in Touch
          </h1>
          <p className="text-neutral-400 text-base max-w-xl mx-auto leading-relaxed">
            Reach out directly for wholesale quotations, trade accounts, or to visit our manufacturing facilities in Northern Ireland.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Address (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-200 space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 border-b border-neutral-200 pb-4">
                Headquarters & Workshop
              </h2>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-xs text-amber-600 border border-neutral-200 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Address
                  </h4>
                  <p className="text-sm font-semibold text-neutral-900 leading-snug">
                    {contactSettings.companyAddress}
                  </p>
                  <a
                    href="https://maps.google.com/?q=33A+BALLYDESLAND+ROAD+WARRENPOINT+CO.DOWN+BT34+3QB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 mt-2 uppercase tracking-wider"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1" /> Get Directions
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-xs text-amber-600 border border-neutral-200 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Wholesale Inquiries
                  </h4>
                  <a
                    href={`mailto:${contactSettings.recipientEmail}`}
                    className="text-sm font-semibold text-neutral-900 hover:text-amber-600 transition-colors"
                  >
                    {contactSettings.recipientEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-xs text-amber-600 border border-neutral-200 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Working Hours
                  </h4>
                  <p className="text-sm text-neutral-700">
                    Monday – Friday: 08:30 – 17:30 GMT
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Saturday & Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm h-56 relative bg-neutral-200">
              <iframe
                title="Davis Furniture Location"
                src="https://maps.google.com/maps?q=Warrenpoint+BT34+3QB&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter grayscale contrast-125"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Contact / Quote Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
              Quick Form
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-neutral-500 text-sm mb-8">
              Fill in the form below and Charlie or our trade operations team will respond promptly.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-neutral-900">Message Received!</h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Thank you for reaching out. We have logged your request and our sales desk will be in touch shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Business / Retailer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Dublin Bed Stores"
                      className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 7000 000000"
                      className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white cursor-pointer"
                  >
                    <option>Wholesale Pricing & Catalog</option>
                    <option>Become an Authorized Stockist</option>
                    <option>Custom Dimension / Bespoke Order</option>
                    <option>Logistics & Delivery Schedule</option>
                    <option>General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the beds/headboards you are interested in, estimated volumes, etc."
                    className="w-full px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

