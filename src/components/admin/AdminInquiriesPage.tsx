'use client';

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import {
  Inbox,
  Mail,
  Phone,
  Building,
  Calendar,
  Package,
  Trash2,
  CheckCircle,
  Download,
  Search,
  Filter,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  RefreshCw
} from 'lucide-react';

export const AdminInquiriesPage: React.FC = () => {
  const { inquiries, markInquiryAsRead, deleteInquiry, clearAllInquiries } = useProducts();
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'quote' | 'contact'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    // Tab filter
    if (filterType === 'unread' && inq.isRead) return false;
    if (filterType === 'quote' && inq.type !== 'quote') return false;
    if (filterType === 'contact' && inq.type !== 'contact') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inq.name.toLowerCase().includes(q);
      const matchEmail = inq.email.toLowerCase().includes(q);
      const matchComp = inq.company?.toLowerCase().includes(q);
      const matchProd = inq.productName?.toLowerCase().includes(q);
      const matchMsg = inq.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchComp || matchProd || matchMsg;
    }
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.isRead).length;
  const quoteCount = inquiries.filter((i) => i.type === 'quote').length;
  const contactCount = inquiries.filter((i) => i.type === 'contact').length;

  const handleExportCsv = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Type', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Product', 'Quantity', 'Subject', 'Message', 'ReadStatus'];
    const rows = inquiries.map((i) => [
      i.id,
      i.type,
      new Date(i.createdAt).toLocaleString(),
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      i.email,
      i.phone || '',
      `"${(i.productName || '').replace(/"/g, '""')}"`,
      i.quantity || '',
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`,
      i.isRead ? 'Read' : 'Unread'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `davis_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
            Customer Inquiries & Leads
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Incoming Quotes & Messages
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review wholesale quote submissions, client contact forms, and trade account requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={inquiries.length === 0}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>

          {inquiries.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all stored inquiries?')) {
                  clearAllInquiries();
                }
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-rose-50 text-neutral-700 hover:text-rose-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Leads</div>
          <div className="text-3xl font-bold text-neutral-900 mt-2">{inquiries.length}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">All-time form submissions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Unread New</div>
          <div className={`text-3xl font-bold mt-2 ${unreadCount > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>
            {unreadCount}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Pending client review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Quote Requests</div>
          <div className="text-3xl font-bold text-neutral-900 mt-2">{quoteCount}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Product pricing leads</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Contact Messages</div>
          <div className="text-3xl font-bold text-neutral-900 mt-2">{contactCount}</div>
          <span className="text-[11px] text-neutral-400 mt-1 block">General inquiries</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All ({inquiries.length})
          </button>

          <button
            onClick={() => setFilterType('unread')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
              filterType === 'unread'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filterType === 'unread' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilterType('quote')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'quote'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Quotes ({quoteCount})
          </button>

          <button
            onClick={() => setFilterType('contact')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'contact'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Contact ({contactCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No Inquiries Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchQuery
              ? `No inquiries matching "${searchQuery}". Try a different search term.`
              : 'When visitors fill out the contact form or request a wholesale quote on the website, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const isQuote = inq.type === 'quote';
            const isSelected = selectedInquiryId === inq.id;

            return (
              <div
                key={inq.id}
                className={`bg-white rounded-2xl border transition-all ${
                  !inq.isRead
                    ? 'border-amber-300 ring-1 ring-amber-400/30 shadow-sm'
                    : 'border-neutral-200 shadow-xs hover:border-neutral-300'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top line: Badges & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isQuote
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                        }`}
                      >
                        {isQuote ? 'Wholesale Quote Request' : 'General Contact'}
                      </span>

                      {!inq.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Unread" />
                      )}

                      {isQuote && inq.productName && (
                        <span className="text-xs font-bold text-neutral-900 flex items-center space-x-1">
                          <Package className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                          <span>{inq.productName}</span>
                          {inq.quantity && <span className="text-neutral-500 font-normal">({inq.quantity})</span>}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(inq.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Customer info & Message */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left: Client info (4 cols) */}
                    <div className="md:col-span-4 space-y-1.5 text-xs">
                      <div className="font-bold text-sm text-neutral-900">{inq.name}</div>
                      {inq.company && (
                        <div className="text-neutral-600 flex items-center space-x-1.5">
                          <Building className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                          <span className="truncate">{inq.company}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <a href={`mailto:${inq.email}`} className="text-amber-700 hover:underline truncate">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                          <a href={`tel:${inq.phone}`} className="text-neutral-700 hover:underline">
                            {inq.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: Message Body (8 cols) */}
                    <div className="md:col-span-8 bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-col justify-between">
                      <div>
                        {inq.subject && !isQuote && (
                          <div className="text-xs font-bold text-neutral-800 mb-1">
                            Subject: {inq.subject}
                          </div>
                        )}
                        <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                          {inq.message || 'No additional message provided.'}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-200/60">
                        <div className="flex items-center space-x-2">
                          {/* Direct email reply button */}
                          <a
                            href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(
                              isQuote ? `Davis Furniture Quote - ${inq.productName || 'Bed Model'}` : inq.subject || 'Wholesale Inquiry'
                            )}`}
                            onClick={() => markInquiryAsRead(inq.id, true)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email</span>
                          </a>

                          {/* Toggle Read */}
                          <button
                            onClick={() => markInquiryAsRead(inq.id, !inq.isRead)}
                            className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            {inq.isRead ? 'Mark as Unread' : 'Mark as Read'}
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this inquiry?')) {
                              deleteInquiry(inq.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

