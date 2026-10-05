import React from 'react';
import type { Metadata } from 'next';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

export const metadata: Metadata = {
  title: 'Add New Range | Webmaster Portal',
};

export default function NewProductPage() {
  return <AdminProductForm />;
}

