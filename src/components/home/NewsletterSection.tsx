'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2 block">
          Stay Connected
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Join our newsletter!
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Be the first to receive updates on our new base designs, seasonal fabric collections, and exclusive wholesale trade pricing.
        </p>

        {submitted ? (
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-6 py-4 rounded-xl">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Thank you for subscribing to our newsletter!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Join!
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

