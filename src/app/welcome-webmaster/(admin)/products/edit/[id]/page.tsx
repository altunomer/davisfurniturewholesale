import React from 'react';
import type { Metadata } from 'next';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

import { INITIAL_PRODUCTS } from '@/data/initialProducts';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({ id: p.id }));
}

export const metadata: Metadata = {
  title: 'Edit Product | Webmaster Portal',
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <AdminProductForm productId={id} />;
}

