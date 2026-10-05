import React from 'react';
import type { Metadata } from 'next';
import { AdminProductList } from '@/components/admin/AdminProductList';

export const metadata: Metadata = {
  title: 'Products Manager | Webmaster Portal',
};

export default function ProductsManagerPage() {
  return <AdminProductList />;
}

