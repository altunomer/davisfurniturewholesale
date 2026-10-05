import React from 'react';
import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Webmaster Portal',
};

export default function DashboardPage() {
  return <AdminDashboard />;
}

