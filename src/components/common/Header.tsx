'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, X, ArrowRight } from 'lucide-react';
import { SITE_INFO } from '../../data/initialProducts';
import { useProducts } from '../../context/ProductContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { products } = useProducts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  // Instant search results
  const searchResults = searchQuery.trim().length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-2'
            : 'bg-white/70 backdrop-blur-lg border-b border-neutral-100/60 py-3.5'
        }`}
        style={{
          boxShadow: isScrolled
            ? '0 8px 32px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.4)'
            : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* Mobile Menu Button (Left on mobile) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={onOpenMobileMenu}
                className="p-2 -ml-2 text-neutral-800 hover:text-amber-600 transition-colors focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <img
                  src={SITE_INFO.logo}
                  alt="Davis Furniture"
                  width={190}
                  height={48}
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:opacity-90"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium tracking-wider uppercase transition-colors duration-200 py-1 border-b-2 ${
                    isActive(link.path)
                      ? 'text-neutral-900 border-amber-600 font-semibold'
                      : 'text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              
              {/* Search Icon Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-700 hover:text-amber-600 hover:bg-neutral-100/60 rounded-full transition-colors focus:outline-none"
                aria-label="Search ranges"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Quote CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium uppercase tracking-wider text-white bg-neutral-900 hover:bg-amber-600 rounded transition-all duration-200 shadow-xs"
              >
                <span className="hidden sm:inline">Get in Touch For a Quote</span>
                <span className="sm:hidden">Quote</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Liquid Glass Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl max-w-2xl w-full p-6 relative overflow-hidden cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">
                Quick Catalog Search
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bed ranges, storage ottoman, sizes (e.g. 5'0 King)..."
                className="w-full pl-11 pr-4 py-3 bg-neutral-100/80 border border-neutral-200 rounded-xl text-neutral-900 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Quick Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={item.images[0] || '/images/davis-logo.webp'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-500 line-clamp-1">{item.tagline}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.trim().length > 0 && searchResults.length === 0 && (
              <div className="p-6 text-center text-xs text-neutral-500">
                No matching furniture ranges found for &quot;{searchQuery}&quot;.
              </div>
            )}

            <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Press <kbd className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">ESC</kbd> to close</span>
              <span>Press <kbd className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">ENTER</kbd> to see all results</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

