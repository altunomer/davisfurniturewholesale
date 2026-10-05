import React from 'react';
import Link from 'next/link';
import { SITE_INFO } from '../../data/initialProducts';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-widest text-white uppercase">
                DAVIS FURNITURE
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              Wholesale Base, Headboard & Mattress Specialists. Rooted in Northern Ireland, dedicated to timeless craftsmanship, premium comfort, and enduring quality for over two decades.
            </p>
            <p className="text-xs text-neutral-500">
              {SITE_INFO.address}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition-colors">
                  Products & Ranges
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">
                  Contact & Quotes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-neutral-400 hover:text-white transition-colors">
                  Privacy Policy & Notice
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {SITE_INFO.email}
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <h5 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Connect</h5>
              <div className="flex space-x-3 text-neutral-400">
                <a
                  href={SITE_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs uppercase"
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  href={SITE_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs uppercase"
                >
                  Instagram
                </a>
                <span>•</span>
                <a
                  href={SITE_INFO.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-xs uppercase"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 space-y-4 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Davis Furniture. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-neutral-400">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-neutral-400">
              Wholesale Enquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

