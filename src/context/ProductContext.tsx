'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate client-side from localStorage
  useEffect(() => {
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
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage only after initial hydration
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

  const addProduct = (item: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...item,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const importProducts = (newProducts: Product[], replaceExisting: boolean) => {
    if (replaceExisting) {
      setProducts(newProducts);
    } else {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const nonDuplicates = newProducts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...nonDuplicates];
      });
    }
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSlides(DEFAULT_SLIDES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SLIDES_STORAGE_KEY);
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Slides handlers
  const addSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const resetSlides = () => {
    setSlides(DEFAULT_SLIDES);
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
  };

  const updateContactSettings = (updates: Partial<ContactSettings>) => {
    setContactSettings((prev) => ({ ...prev, ...updates }));
  };

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
        updateContactSettings
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

