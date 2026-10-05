'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { useProducts } from '@/context/ProductContext';
import { ProductLightbox } from '@/components/product/ProductLightbox';
import {
  ChevronRight,
  Check,
  Shield,
  Truck,
  ArrowLeft,
  Mail,
  X,
  CheckCircle2,
  Maximize2,
  Package,
  Sparkles,
  ShieldCheck,
  Ruler
} from 'lucide-react';

interface ProductDetailClientProps {
  slug?: string;
  initialProduct?: Product | null;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ slug, initialProduct }) => {
  const { products, getProductBySlug } = useProducts();
  
  // Extract slug from prop, initialProduct, or window.location
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const urlSlug = pathname.split('/').filter(Boolean).pop() || '';
  const targetSlug = slug || initialProduct?.slug || urlSlug;

  const product = (targetSlug ? getProductBySlug(targetSlug) : undefined) || initialProduct;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  // Quote Form state
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    quantity: '5-10 Units',
    message: ''
  });

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-neutral-50">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
          <Package className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Product Not Found</h1>
        <p className="text-sm text-neutral-500 mt-2 max-w-md">
          The requested bed model could not be found or may have been updated.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Wholesale Catalog
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : ['/images/davis-logo.webp'];

  const activeImage = images[selectedImageIndex] || images[0];

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSent(true);
    setTimeout(() => {
      setShowQuoteModal(false);
      setQuoteSent(false);
    }, 2500);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-neutral-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-neutral-900">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link href="/products" className="hover:text-neutral-900">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Image with Fullscreen Zoom Trigger */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-4/3 sm:aspect-16/11 bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm cursor-pointer group"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                decoding="async"
              />
              
              {/* Fullscreen Hint Badge */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white p-2 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity flex items-center space-x-1.5 text-xs font-medium">
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Click to Zoom</span>
              </div>

              {product.isFavorite && (
                <div className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  Bestseller Range
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-amber-600 ring-2 ring-amber-600/20 shadow-md'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2">
                <span>{product.category}</span>
                {product.sku && <span>• SKU: {product.sku}</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-2">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-base text-neutral-600 font-medium mb-4">
                  {product.tagline}
                </p>
              )}

              {/* Description */}
              <div className="prose prose-sm text-neutral-600 mb-6 leading-relaxed whitespace-pre-line border-y border-neutral-100 py-4">
                {product.description}
              </div>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Production Sizes
                    </label>
                    <span className="text-xs text-neutral-500">Bespoke sizing available</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    Key Specifications
                  </h4>
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-700">
                      <div className="p-0.5 bg-emerald-100 text-emerald-700 rounded-full mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-4 px-6 bg-neutral-900 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Get in Touch For a Quote</span>
                </button>

                <p className="text-center text-[11px] text-neutral-500">
                  Wholesale trade prices available upon verified retailer enquiry.
                </p>
              </div>
            </div>

            {/* Value Props / Assurance */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-neutral-100 text-neutral-600">
              <div className="flex items-center space-x-2 text-xs">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Reinforced Steel & Wood</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>UK & Ireland Freight</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4 ICONBOX FEATURES MODULE */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2 block">
              Wholesale Superiority
            </span>
            <h3 className="text-2xl font-bold text-neutral-900">
              Engineering & Craftsmanship Standards
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Box 1: Ottoman Storage */}
            <div className="bg-neutral-50 hover:bg-white p-6 rounded-2xl border border-neutral-200 hover:border-amber-600/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 mb-2">
                Gas-Lift Ottoman Storage
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Heavy-duty dual hydraulic pistons effortlessly lift the base to reveal deep, organized storage capacity.
              </p>
            </div>

            {/* Box 2: Handcrafted in Ireland */}
            <div className="bg-neutral-50 hover:bg-white p-6 rounded-2xl border border-neutral-200 hover:border-amber-600/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 mb-2">
                Irish Zanaat & Upholstery
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hand-stitched deep diamond tufting and fluting by veteran artisans in our Warrenpoint, Northern Ireland workshop.
              </p>
            </div>

            {/* Box 3: Reinforced Solid Frame */}
            <div className="bg-neutral-50 hover:bg-white p-6 rounded-2xl border border-neutral-200 hover:border-amber-600/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 mb-2">
                Heavy-Duty Timber & Steel
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Engineered hardwood core, heavy metal braces, and posture slats built for rigorous contract and retail longevity.
              </p>
            </div>

            {/* Box 4: Bespoke Sizes & Fabrics */}
            <div className="bg-neutral-50 hover:bg-white p-6 rounded-2xl border border-neutral-200 hover:border-amber-600/40 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                <Ruler className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 mb-2">
                Custom Sizes & Swatches
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tailored from 3&apos;0&quot; Single up to 6&apos;0&quot; Super King with textured bouclé, linen, and plush velvet fabric selections.
              </p>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-neutral-200">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2 block">
                Complementary Ranges
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Related Products
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all"
                >
                  <div className="aspect-4/3 overflow-hidden bg-neutral-100">
                    <img
                      src={rel.images[0] || '/images/davis-logo.webp'}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-base text-neutral-900 group-hover:text-amber-600 transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{rel.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Pinch & Slide Lightbox Modal */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        images={images}
        initialIndex={selectedImageIndex}
        productName={product.name}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {quoteSent ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Quote Request Sent!</h3>
                <p className="text-neutral-600 text-sm">
                  Thank you! Our wholesale sales desk will contact you regarding <strong>{product.name}</strong> shortly.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
                  Direct Trade Enquiry
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 mb-1">
                  Request a Quote
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Inquiring about: <strong className="text-neutral-900">{product.name}</strong> {selectedSize ? `(${selectedSize})` : ''}
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Store Name *</label>
                      <input
                        type="text"
                        required
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Estimated Quantity</label>
                    <select
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                    >
                      <option>1-4 Sample Units</option>
                      <option>5-10 Units</option>
                      <option>11-25 Units</option>
                      <option>25+ Container / Bulk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Notes / Requirements</label>
                    <textarea
                      rows={3}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      placeholder="Specify fabrics, delivery destination or special requirements..."
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Wholesale Enquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

