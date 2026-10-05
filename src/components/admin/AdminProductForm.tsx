'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useProducts } from '../../context/ProductContext';
import type { Product } from '../../types/product';
import { optimizeImage } from '../../utils/imageOptimizer';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Sparkles,
  Check
} from 'lucide-react';

export const AdminProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const routeParams = useParams();
  const router = useRouter();
  const id = productId || (routeParams?.id as string | undefined);
  const { addProduct, updateProduct, getProductById } = useProducts();

  const isEdit = Boolean(id);
  const existingProduct = id ? getProductById(id) : undefined;

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    shortDescription: '',
    category: 'Storage Beds',
    sku: '',
    isFavorite: false,
    inStock: true,
    sizes: ["4'6\" Double", "5'0\" King", "6'0\" Super King"],
    features: [
      'Gas-lift hydraulic ottoman mechanism',
      'Handcrafted padded headboard',
      'Solid reinforced frame'
    ],
    images: []
  });

  const [newSizeInput, setNewSizeInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && existingProduct) {
      setFormData({
        name: existingProduct.name,
        slug: existingProduct.slug,
        tagline: existingProduct.tagline || '',
        description: existingProduct.description || '',
        shortDescription: existingProduct.shortDescription || '',
        category: existingProduct.category || 'Storage Beds',
        sku: existingProduct.sku || '',
        isFavorite: existingProduct.isFavorite,
        inStock: existingProduct.inStock ?? true,
        sizes: existingProduct.sizes || [],
        features: existingProduct.features || [],
        images: existingProduct.images || []
      });
    }
  }, [isEdit, existingProduct]);

  // Auto-generate slug when name changes in create mode
  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: !isEdit ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
    }));
  };

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  // Auto Image Optimization when user uploads local files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsOptimizing(true);
    setOptimizationStats(null);

    let totalOriginal = 0;
    let totalOptimized = 0;
    const optimizedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await optimizeImage(files[i], 1600, 1600, 0.85);
        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
        optimizedUrls.push(result.dataUrl);
      } catch (err) {
        console.error('Failed to optimize image:', err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...optimizedUrls]
    }));

    setIsOptimizing(false);
    if (totalOriginal > 0) {
      const origMB = (totalOriginal / (1024 * 1024)).toFixed(2);
      const optKB = Math.round(totalOptimized / 1024);
      const savings = Math.round(((totalOriginal - totalOptimized) / totalOriginal) * 100);
      setOptimizationStats(`Optimized ${files.length} images: ${origMB}MB reduced to ${optKB}KB (${savings}% savings in WebP format).`);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Sizes handlers
  const addSize = (sizeToAdd: string) => {
    const trimmed = sizeToAdd.trim();
    if (!trimmed || formData.sizes.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, trimmed] }));
    setNewSizeInput('');
  };

  const removeSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove)
    }));
  };

  // Features handlers
  const addFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureInput.trim()]
    }));
    setNewFeatureInput('');
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Product name is required.');
      return;
    }

    if (isEdit && id) {
      updateProduct(id, formData);
    } else {
      addProduct(formData);
    }

    router.push('/welcome-webmaster/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/welcome-webmaster/products"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
        </Link>
        <span className="text-xs text-neutral-400">
          {isEdit ? `Editing ID: ${id}` : 'Creating New Range'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8">
        <div className="border-b border-neutral-100 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">
            {isEdit ? `Edit "${formData.name || 'Product'}"` : 'Add New Furniture Range'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Specify range name, upholstery descriptions, dimensions, and upload auto-optimized photos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Product / Range Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Oxford Range"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. oxford-range"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Storage Beds"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  SKU / Model Code
                </label>
                <input
                  type="text"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="DVR-OXF-01"
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center space-x-6 pt-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-neutral-800">Featured (Favorite)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-neutral-800">In Production</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Sub-Headline / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Modern Storage Bed with Deep Padded Wings"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Detailed Range Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write full materials, upholstery, and hydraulic details..."
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Section 2: Automatic Image Optimization & Uploads */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center">
                  <Sparkles className="w-4 h-4 text-amber-600 mr-1.5" />
                  2. Product Images (Auto-Optimized to WebP)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Uploaded local photos are automatically scaled and converted into compressed WebP format.
                </p>
              </div>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-neutral-300 hover:border-amber-600 rounded-2xl p-6 text-center transition-colors bg-neutral-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                id="image-file-input"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isOptimizing}
              />
              <label
                htmlFor="image-file-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="p-3 bg-white rounded-full shadow-xs text-amber-600 border border-neutral-200">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  {isOptimizing ? 'Optimizing Images...' : 'Click to Upload Images from Computer'}
                </div>
                <p className="text-[11px] text-neutral-500">
                  PNG, JPG, WEBP • Automatically compressed on device
                </p>
              </label>
            </div>

            {/* Optimization Status Badge */}
            {optimizationStats && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{optimizationStats}</span>
              </div>
            )}

            {/* Or add via URL */}
            <div className="flex space-x-2 pt-1">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image URL here..."
                className="flex-1 px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Image Preview Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-neutral-200 bg-neutral-100"
                  >
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-neutral-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {index === 0 ? 'Primary' : `#${index + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Sizes & Dimensions */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              3. Production Sizes
            </h3>

            {/* Quick Add presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-500 font-medium">Quick presets:</span>
              {["3'0\" Single", "4'0\" Small Double", "4'6\" Double", "5'0\" King", "6'0\" Super King"].map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addSize(preset)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium"
                  >
                    + {preset}
                  </button>
                )
              )}
            </div>

            {/* Custom size input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                placeholder="Or enter custom size (e.g. 7'0&quot; Emperor)..."
                className="flex-1 px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={() => addSize(newSizeInput)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-800"
              >
                Add
              </button>
            </div>

            {/* Current sizes tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium border border-neutral-200"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-neutral-400 hover:text-rose-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Specifications / Features */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              4. Key Features & Specifications
            </h3>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                placeholder="e.g. Dual heavy-duty hydraulic gas struts"
                className="flex-1 px-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-800"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {formData.features.map((feat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-neutral-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 border-t border-neutral-100 flex items-center justify-end space-x-3">
            <Link
              href="/welcome-webmaster/products"
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
