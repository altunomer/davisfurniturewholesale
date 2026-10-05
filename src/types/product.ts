export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription?: string;
  features: string[];
  sizes: string[];
  images: string[];
  isFavorite: boolean;
  category: string;
  createdAt: string;
  sku?: string;
  inStock?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export interface ContactSettings {
  recipientEmail: string;
  notificationSubject: string;
  autoReplyMessage: string;
  companyPhone: string;
  companyAddress: string;
}

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

