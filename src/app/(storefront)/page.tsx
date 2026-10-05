import React from 'react';
import type { Metadata } from 'next';
import { HeroSlider } from '@/components/home/HeroSlider';
import { FavoritesSection } from '@/components/home/FavoritesSection';
import { EditorialSection } from '@/components/home/EditorialSection';
import { AllProductsSection } from '@/components/home/AllProductsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'Davis Furniture | Wholesale Base, Headboard & Mattress Specialists',
  description: 'Premium handcrafted wholesale bed bases, gas-lift ottoman storage beds, and headboards in Northern Ireland. Supplying retail stores across the UK & Ireland.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />
      <FavoritesSection />
      <EditorialSection />
      <AllProductsSection />
      <NewsletterSection />
    </div>
  );
}

