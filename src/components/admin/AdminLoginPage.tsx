'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { Lock, KeyRound, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login, isAuthenticated } = useProducts();
  const router = useRouter();

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/welcome-webmaster/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      router.push('/welcome-webmaster/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-600/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-600/30 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-500 font-bold block pt-2">
            Restricted Access
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Webmaster Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Please enter the administrative key to access store management.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>Invalid password. (Default key: <strong>davis2026</strong>)</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1.5">
              Default password: <code className="text-neutral-400 font-mono">davis2026</code> (can be changed in settings)
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Authenticate & Enter</span>
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

