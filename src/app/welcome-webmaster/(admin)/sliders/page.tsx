import React from 'react';
import type { Metadata } from 'next';
import { AdminSlidersPage } from '@/components/admin/AdminSlidersPage';

export const metadata: Metadata = {
  title: 'Hero Sliders Manager | Webmaster Portal',
};

export default function SlidersManagerPage() {
  return <AdminSlidersPage />;
}

