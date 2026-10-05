import React from 'react';
import type { Metadata } from 'next';
import { AdminCsvManager } from '@/components/admin/AdminCsvManager';

export const metadata: Metadata = {
  title: 'CSV Bulk Manager | Webmaster Portal',
};

export default function CsvPortalPage() {
  return <AdminCsvManager />;
}

