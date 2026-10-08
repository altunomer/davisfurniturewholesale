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

export interface Inquiry {
  id: string;
  type: 'contact' | 'quote';
  name: string;
  company?: string;
  email: string;
  phone?: string;
  productName?: string;
  quantity?: string;
  subject?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface ContactSettings {
  recipientEmail: string;
  notificationSubject: string;
  autoReplyMessage: string;
  companyPhone: string;
  companyAddress: string;
  
  // Mail Dispatch Engine Settings
  mailProvider: 'resend' | 'smtp' | 'custom';
  
  // Resend / API mode
  resendApiKey?: string;
  fromEmail?: string;
  fromName?: string;
  
  // SMTP mode
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  
  // Routing
  ccEmail?: string;
  enableAutoReply?: boolean;
}

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

