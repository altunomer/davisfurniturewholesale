'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  Sliders,
  Inbox,
  ArrowLeft,
  Menu,
  X,
  ExternalLink,
  RotateCcw,
  LogOut
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { products, slides, unreadInquiriesCount, resetToDefaults, logout, isAuthenticated } = useProducts();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      router.push('/welcome-webmaster');
    }
  }, [isAuthenticated, router]);

  const navItems = [
    { label: 'Dashboard', path: '/welcome-webmaster/dashboard', icon: LayoutDashboard },
    { label: 'Inquiries & Leads', path: '/welcome-webmaster/inquiries', icon: Inbox, count: unreadInquiriesCount },
    { label: 'All Products', path: '/welcome-webmaster/products', icon: Package, count: products.length },
    { label: 'Add New Product', path: '/welcome-webmaster/products/new', icon: PlusCircle },
    { label: 'Hero Sliders', path: '/welcome-webmaster/sliders', icon: Sliders, count: slides.length },
    { label: 'CSV Portal', path: '/welcome-webmaster/csv', icon: FileSpreadsheet },
    { label: 'Mail & Settings', path: '/welcome-webmaster/settings', icon: Settings },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all catalog data back to default website products? Any manual changes will be replaced.')) {
      resetToDefaults();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/welcome-webmaster');
  };

  const isActive = (path: string) => {
    if (path === '/welcome-webmaster/dashboard' && pathname === '/welcome-webmaster/dashboard') return true;
    if (path !== '/welcome-webmaster/dashboard' && pathname?.startsWith(path)) return true;
    return false;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white text-xs uppercase tracking-widest">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row text-neutral-900">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-neutral-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-neutral-300 hover:text-white rounded focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm tracking-wider uppercase">Davis Admin</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-amber-500 hover:text-amber-400 flex items-center space-x-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-neutral-400 hover:text-rose-400 p-1 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar for Desktop & Drawer for Mobile */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold block">
                Webmaster Portal
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Davis Furniture
              </h2>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-amber-600 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Products</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Preview Storefront</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors border border-rose-800/40 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
};

