'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Mail, MapPin, ChevronRight } from 'lucide-react';
import { SITE_INFO } from '../../data/initialProducts';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <img
            src={SITE_INFO.logo}
            alt="Davis Furniture"
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.path);

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium tracking-wide uppercase transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              </Link>
            );
          })}

          <div className="pt-4 border-t border-neutral-100 mt-4">
            <Link
              href="/contact"
              onClick={onClose}
              className="w-full flex items-center justify-center py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
            >
              Get in Touch For a Quote
            </Link>
          </div>
        </div>

        {/* Contact info at bottom */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-600 space-y-2">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Warrenpoint, Co.Down, N. Ireland</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <a
              href={`mailto:${SITE_INFO.email}`}
              className="truncate hover:text-neutral-900"
            >
              {SITE_INFO.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

