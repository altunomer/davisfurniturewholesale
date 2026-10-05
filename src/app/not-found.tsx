import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
      <span className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-2">
        Error 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
        Page Not Found
      </h1>
      <p className="text-neutral-500 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        The range, page, or document you are trying to view does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-6 py-3 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Return to Homepage
      </Link>
    </div>
  );
}

