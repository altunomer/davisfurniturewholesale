'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Check, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'davis_cookie_consent_v1';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    // Check if user has already made a decision
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (saved) {
        return; // Already consented/configured, do not show
      }
    } catch {
      // localStorage disabled or private browsing
      return;
    }

    // Delay showing the banner by 1.8 seconds after page load.
    // Why?
    // 1. Prevents Google / Bing crawlers from seeing an intrusive interstitial covering the initial viewport.
    // 2. Protects LCP (Largest Contentful Paint) and Core Web Vitals scores by letting the main DOM paint first.
    // 3. Excellent UX: Visitors see the brand and products first before a polite non-blocking notice appears.
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    } catch (err) {
      console.warn('Could not save cookie preferences', err);
    }
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      necessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md md:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] text-neutral-800">
        
        {/* Header Icon + Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                Privacy &amp; Cookie Notice
              </h3>
              <span className="text-[11px] text-amber-700 font-medium">
                UK &amp; EU GDPR Compliance
              </span>
            </div>
          </div>

          <button
            onClick={handleRejectNonEssential}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition-colors cursor-pointer"
            title="Decline non-essential cookies"
            aria-label="Decline non-essential cookies"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative text */}
        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          We use strictly necessary cookies to ensure our wholesale catalog and trade ordering operate smoothly. With your consent, we may also utilize anonymous analytics to understand site performance. Learn more in our{' '}
          <Link
            href="/privacy-policy"
            className="text-amber-700 hover:text-amber-800 underline underline-offset-2 font-medium"
          >
            Privacy &amp; Cookie Policy
          </Link>.
        </p>

        {/* Detailed Preferences Accordion */}
        {showPreferences && (
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 mb-4 space-y-3 animate-in fade-in duration-200">
            {/* Necessary */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200/60">
              <div className="pr-4">
                <span className="font-semibold text-neutral-900 block">Strictly Necessary</span>
                <span className="text-[11px] text-neutral-500">Essential for core security, admin authentication, and catalog navigation.</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                Always Active
              </span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200/60">
              <div className="pr-4">
                <span className="font-semibold text-neutral-900 block">Anonymous Analytics</span>
                <span className="text-[11px] text-neutral-500">Aggregated metrics to help us refine product discovery without tracking individuals.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between text-xs">
              <div className="pr-4">
                <span className="font-semibold text-neutral-900 block">Marketing &amp; Targeting</span>
                <span className="text-[11px] text-neutral-500">Personalized trade recommendations across partner channels.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={marketingAllowed}
                  onChange={(e) => setMarketingAllowed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          {showPreferences ? (
            <button
              onClick={handleSaveCustom}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save My Preferences</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm"
              >
                <span>Accept All</span>
              </button>
              
              <button
                onClick={handleRejectNonEssential}
                className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                <span>Essential Only</span>
              </button>
            </>
          )}

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="py-2.5 px-3 border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-medium rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1"
            title="Customise Cookies"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <span className="sm:hidden md:inline text-[11px]">Manage</span>
            {showPreferences ? (
              <ChevronUp className="w-3 h-3 text-neutral-400 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 text-neutral-400 ml-0.5" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
