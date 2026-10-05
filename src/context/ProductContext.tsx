'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, ContactSettings, HeroSlide } from '../types/product';
import { INITIAL_PRODUCTS, SITE_INFO } from '../data/initialProducts';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFavorite: (id: string) => void;
  importProducts: (newProducts: Product[], replaceExisting: boolean) => void;
  resetToDefaults: () => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Slides
  slides: HeroSlide[];
  addSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  deleteSlide: (id: string) => void;
  updateSlide: (id: string, updates: Partial<HeroSlide>) => void;
  resetSlides: () => void;

  // Auth
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPass: string) => void;

  // Contact Settings
  contactSettings: ContactSettings;
  updateContactSettings: (settings: Partial<ContactSettings>) => void;

  // Cloud status
  isCloudSynced: boolean;
  syncToCloud: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'davis_furniture_products_v1';
const SLIDES_STORAGE_KEY = 'davis_hero_slides_v1';
const AUTH_KEY = 'davis_admin_authenticated';
const PASSWORD_KEY = 'davis_admin_password';
const CONTACT_SETTINGS_KEY = 'davis_contact_settings';

const DEFAULT_SLIDES: HeroSlide[] = SITE_INFO.heroSlides.map((s) => ({
  id: String(s.id),
  desktopImage: s.desktopImage,
  mobileImage: s.mobileImage,
  title: s.title,
  subtitle: s.subtitle,
  linkUrl: '/products'
}));

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  recipientEmail: SITE_INFO.email,
  notificationSubject: 'New Trade Wholesale Inquiry - Davis Furniture',
  autoReplyMessage: 'Thank you for your inquiry. Our sales desk will respond promptly.',
  companyPhone: SITE_INFO.phone,
  companyAddress: SITE_INFO.address
};

// Helper for cloud sync
async function apiPost(endpoint: string, data: any) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    console.warn(`[Cloud Sync] Error sending to ${endpoint}:`, err);
    return false;
  }
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // 1. Initial hydration: localStorage first for speed, then fetch live from Cloudflare KV
  useEffect(() => {
    let isMounted = true;

    try {
      if (typeof window !== 'undefined') {
        const savedProducts = localStorage.getItem(STORAGE_KEY);
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }

        const savedSlides = localStorage.getItem(SLIDES_STORAGE_KEY);
        if (savedSlides) {
          const parsed = JSON.parse(savedSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
          }
        }

        const authState = sessionStorage.getItem(AUTH_KEY);
        if (authState === 'true') {
          setIsAuthenticated(true);
        }

        const savedContact = localStorage.getItem(CONTACT_SETTINGS_KEY);
        if (savedContact) {
          setContactSettings((prev) => ({ ...prev, ...JSON.parse(savedContact) }));
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    } finally {
      if (isMounted) setIsHydrated(true);
    }

    // 2. Fetch live data from Cloudflare KV
    async function fetchCloudData() {
      try {
        const [prodRes, slideRes, setRes] = await Promise.allSettled([
          fetch('/api/products').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/slides').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/settings').then((r) => (r.ok ? r.json() : null))
        ]);

        if (!isMounted) return;

        // Products from Cloudflare KV
        if (prodRes.status === 'fulfilled' && prodRes.value) {
          if (Array.isArray(prodRes.value) && prodRes.value.length > 0) {
            setProducts(prodRes.value);
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(prodRes.value));
            }
          }
        } else if (prodRes.status === 'fulfilled' && prodRes.value === null) {
          // Cloud KV is empty on first run: auto-seed initial products to KV
          apiPost('/api/products', INITIAL_PRODUCTS);
          apiPost('/api/slides', DEFAULT_SLIDES);
          apiPost('/api/settings', DEFAULT_CONTACT_SETTINGS);
        }

        // Slides from Cloudflare KV
        if (slideRes.status === 'fulfilled' && slideRes.value && Array.isArray(slideRes.value) && slideRes.value.length > 0) {
          setSlides(slideRes.value);
          if (typeof window !== 'undefined') {
            localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slideRes.value));
          }
        }

        // Settings from Cloudflare KV
        if (setRes.status === 'fulfilled' && setRes.value && typeof setRes.value === 'object') {
          setContactSettings((prev) => ({ ...prev, ...setRes.value }));
          if (typeof window !== 'undefined') {
            localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(setRes.value));
          }
        }

        setIsCloudSynced(true);
      } catch (err) {
        console.warn('[Cloud Sync] Cloudflare KV not reachable or running in local dev mode:', err);
      }
    }

    fetchCloudData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to persist products to localStorage', e);
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
    } catch (e) {
      console.error('Failed to persist slides to localStorage', e);
    }
  }, [slides, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(contactSettings));
    } catch (e) {
      console.error('Failed to persist contact settings', e);
    }
  }, [contactSettings, isHydrated]);

  // Product Operations with automatic Cloudflare KV sync
  const addProduct = (item: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...item,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      apiPost('/api/products', updated);
      return updated;
    });
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      apiPost('/api/products', updated);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      apiPost('/api/products', updated);
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setProducts((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      apiPost('/api/products', updated);
      return updated;
    });
  };

  const importProducts = (newProducts: Product[], replaceExisting: boolean) => {
    if (replaceExisting) {
      setProducts(newProducts);
      apiPost('/api/products', newProducts);
    } else {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const nonDuplicates = newProducts.filter((p) => !existingIds.has(p.id));
        const updated = [...prev, ...nonDuplicates];
        apiPost('/api/products', updated);
        return updated;
      });
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSlides(DEFAULT_SLIDES);
    apiPost('/api/products', INITIAL_PRODUCTS);
    apiPost('/api/slides', DEFAULT_SLIDES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SLIDES_STORAGE_KEY);
    }
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    if (!slug) return undefined;
    return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  // Slides handlers with automatic Cloudflare KV sync
  const addSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    setSlides((prev) => {
      const updated = [...prev, newSlide];
      apiPost('/api/slides', updated);
      return updated;
    });
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      apiPost('/api/slides', updated);
      return updated;
    });
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      apiPost('/api/slides', updated);
      return updated;
    });
  };

  const resetSlides = () => {
    setSlides(DEFAULT_SLIDES);
    apiPost('/api/slides', DEFAULT_SLIDES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SLIDES_STORAGE_KEY);
    }
  };

  // Auth functions
  const login = (password: string): boolean => {
    const savedPass = (typeof window !== 'undefined' ? localStorage.getItem(PASSWORD_KEY) : null) || 'davis2026';
    if (password === savedPass) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_KEY, 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_KEY);
    }
  };

  const changePassword = (newPass: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PASSWORD_KEY, newPass);
    }
    apiPost('/api/auth/password', { password: newPass });
  };

  const updateContactSettings = (updates: Partial<ContactSettings>) => {
    setContactSettings((prev) => {
      const updated = { ...prev, ...updates };
      apiPost('/api/settings', updated);
      return updated;
    });
  };

  // Manual trigger to force sync everything to cloud
  const syncToCloud = useCallback(async () => {
    await Promise.all([
      apiPost('/api/products', products),
      apiPost('/api/slides', slides),
      apiPost('/api/settings', contactSettings)
    ]);
    setIsCloudSynced(true);
  }, [products, slides, contactSettings]);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFavorite,
        importProducts,
        resetToDefaults,
        getProductBySlug,
        getProductById,
        slides,
        addSlide,
        deleteSlide,
        updateSlide,
        resetSlides,
        isAuthenticated,
        login,
        logout,
        changePassword,
        contactSettings,
        updateContactSettings,
        isCloudSynced,
        syncToCloud
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
