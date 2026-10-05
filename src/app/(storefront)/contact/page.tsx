import React from 'react';
import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Wholesale Quotations & Factory Showroom',
  description: 'Connect with Davis Furniture Wholesale in Warrenpoint, Northern Ireland. Direct trade inquiries, quotations, and wholesale catalogue requests.',
};

export default function ContactPage() {
  return <ContactClient />;
}

