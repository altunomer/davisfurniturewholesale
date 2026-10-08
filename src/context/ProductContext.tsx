'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, ContactSettings, HeroSlide, Inquiry } from '../types/product';
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
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPass: string) => void;
  changeCredentials: (newUsername?: string, newPassword?: string) => void;

  // Contact Settings & Mail Engine
  contactSettings: ContactSettings;
  updateContactSettings: (settings: Partial<ContactSettings>) => void;
  sendTestEmail: (testRecipient?: string) => Promise<{ success: boolean; message: string }>;

  // Inquiries & Leads Inbox
  inquiries: Inquiry[];
  addInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'isRead'>) => Promise<{ success: boolean; message?: string }>;
  markInquiryAsRead: (id: string, isRead?: boolean) => void;
  deleteInquiry: (id: string) => void;
  clearAllInquiries: () => void;
  unreadInquiriesCount: number;

  // Cloud status
  isCloudSynced: boolean;
  syncToCloud: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = 'davis_furniture_products_v1';
const SLIDES_STORAGE_KEY = 'davis_hero_slides_v1';
const AUTH_KEY = 'davis_admin_authenticated';
const USERNAME_KEY = 'davis_admin_username';
const PASSWORD_KEY = 'davis_admin_password';
const CONTACT_SETTINGS_KEY = 'davis_contact_settings';
const INQUIRIES_STORAGE_KEY = 'davis_inquiries_v1';

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
  companyAddress: SITE_INFO.address,
  mailProvider: 'resend',
  fromEmail: 'onboarding@resend.dev',
  fromName: 'Davis Furniture Wholesale',
  resendApiKey: '',
  smtpHost: 'mail.davisfurniturewholesale.com',
  smtpPort: '465',
  smtpUser: 'quotes@davisfurniturewholesale.com',
  smtpPassword: '',
  smtpSecure: true,
  ccEmail: '',
  enableAutoReply: false
};

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-sample-1',
    type: 'quote',
    name: 'John Miller',
    company: 'Belfast Bed & Living Ltd',
    email: 'john@belfastbeds.co.uk',
    phone: '+44 28 9012 3456',
    productName: 'Mars Range',
    quantity: '10-20 Units',
    message: 'Looking for wholesale trade pricing and delivery terms for next month to our Belfast warehouse.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false
  },
  {
    id: 'inq-sample-2',
    type: 'contact',
    name: 'Emma Watson',
    company: 'Watson Interiors Ltd',
    email: 'emma@watsoninteriors.co.uk',
    phone: '+44 77 0090 0123',
    subject: 'Trade Catalog & Material Swatches',
    message: 'Could you please forward your latest full wholesale catalogue PDF and linen fabric swatches?',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isRead: true
  }
];

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
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
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

        const savedInquiries = localStorage.getItem(INQUIRIES_STORAGE_KEY);
        if (savedInquiries) {
          try {
            const parsedInq = JSON.parse(savedInquiries);
            if (Array.isArray(parsedInq)) {
              setInquiries(parsedInq);
            }
          } catch {}
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
        const [prodRes, slideRes, setRes, inqRes] = await Promise.allSettled([
          fetch('/api/products').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/slides').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/inquiries').then((r) => (r.ok ? r.json() : null))
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

        // Inquiries from Cloudflare KV
        if (inqRes.status === 'fulfilled' && inqRes.value && Array.isArray(inqRes.value) && inqRes.value.length > 0) {
          setInquiries(inqRes.value);
          if (typeof window !== 'undefined') {
            localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inqRes.value));
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
  const login = (username: string, password: string): boolean => {
    const savedUser = (typeof window !== 'undefined' ? localStorage.getItem(USERNAME_KEY) : null) || 'dr4carys';
    const savedPass = (typeof window !== 'undefined' ? localStorage.getItem(PASSWORD_KEY) : null) || 'LetmeGetin010203*';
    if (username.trim() === savedUser && password === savedPass) {
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

  const changeCredentials = (newUsername?: string, newPassword?: string) => {
    if (typeof window !== 'undefined') {
      if (newUsername) localStorage.setItem(USERNAME_KEY, newUsername.trim());
      if (newPassword) localStorage.setItem(PASSWORD_KEY, newPassword);
    }
    apiPost('/api/auth/credentials', { username: newUsername, password: newPassword });
  };

  const updateContactSettings = (updates: Partial<ContactSettings>) => {
    setContactSettings((prev) => {
      const updated = { ...prev, ...updates };
      apiPost('/api/settings', updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONTACT_SETTINGS_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Inquiries / Leads Engine
  const addInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'isRead'>) => {
    const newInq: Inquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...inquiryData
    };

    setInquiries((prev) => {
      const updated = [newInq, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });

    apiPost('/api/inquiries', newInq);

    // Trigger email dispatch engine
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiry: newInq,
          config: contactSettings
        })
      });
      const data = await res.json();
      return { success: true, message: data.message };
    } catch (err: any) {
      console.warn('Mail dispatch warning:', err);
      return { success: true, message: 'Inquiry saved successfully!' };
    }
  };

  const markInquiryAsRead = (id: string, isRead: boolean = true) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq.id === id ? { ...inq, isRead } : inq));
      if (typeof window !== 'undefined') {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const updated = prev.filter((inq) => inq.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
    fetch('/api/inquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => {});
  };

  const clearAllInquiries = () => {
    setInquiries([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(INQUIRIES_STORAGE_KEY);
    }
    fetch('/api/inquiries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: null })
    }).catch(() => {});
  };

  const sendTestEmail = async (testRecipient?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTest: true,
          testRecipient: testRecipient || contactSettings.recipientEmail,
          config: contactSettings
        })
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message || (data.success ? 'Test email dispatched successfully!' : 'Dispatch failed.')
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error while attempting test dispatch.'
      };
    }
  };

  const unreadInquiriesCount = inquiries.filter((i) => !i.isRead).length;

  // Manual trigger to force sync everything to cloud
  const syncToCloud = useCallback(async () => {
    await Promise.all([
      apiPost('/api/products', products),
      apiPost('/api/slides', slides),
      apiPost('/api/settings', contactSettings),
      apiPost('/api/inquiries', inquiries)
    ]);
    setIsCloudSynced(true);
  }, [products, slides, contactSettings, inquiries]);

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
        changeCredentials,
        contactSettings,
        updateContactSettings,
        sendTestEmail,
        inquiries,
        addInquiry,
        markInquiryAsRead,
        deleteInquiry,
        clearAllInquiries,
        unreadInquiriesCount,
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

