'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import {
  exportProductsToCsv,
  downloadCsvTemplate,
  parseProductsFromCsv
} from '../../utils/csvHandler';
import type { Product } from '../../types/product';
import {
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

export const AdminCsvManager: React.FC = () => {
  const { products, importProducts } = useProducts();
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setImportStatus(null);
    setFileName(file.name);

    try {
      const items = await parseProductsFromCsv(file);
      if (items.length === 0) {
        setError('No valid product rows found in the CSV file. Please verify column headers.');
        setParsedProducts([]);
      } else {
        setParsedProducts(items);
      }
    } catch (err) {
      setError(`Failed to parse CSV file: ${(err as Error).message}`);
    }
  };

  const handleExecuteImport = () => {
    if (parsedProducts.length === 0) return;

    importProducts(parsedProducts, replaceExisting);
    setImportStatus(
      `Successfully imported ${parsedProducts.length} products into local database!`
    );
    setParsedProducts([]);
    setFileName(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
            Data Exchange Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            CSV Import & Export
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Easily bulk-import your furniture products from Excel/CSV or export current live ranges.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => exportProductsToCsv(products)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Current CSV ({products.length})</span>
          </button>

          <button
            onClick={downloadCsvTemplate}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4 text-neutral-600" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Import Products from CSV</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Upload your CSV file with headers: <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">name, tagline, description, features, sizes, images, category, sku</code>
          </p>
        </div>

        {/* Drag Drop Upload Box */}
        <div className="border-2 border-dashed border-neutral-300 hover:border-amber-600 rounded-2xl p-8 text-center transition-colors bg-neutral-50/50">
          <input
            type="file"
            accept=".csv,text/csv"
            id="csv-file-input"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="p-3.5 bg-white rounded-full shadow-xs text-amber-600 border border-neutral-200">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-800">
                {fileName ? `Selected: ${fileName}` : 'Click or Drag & Drop CSV File'}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Supports semicolon (;) separated lists for features, sizes, and images.
              </p>
            </div>
          </label>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success notification */}
        {importStatus && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span className="font-medium">{importStatus}</span>
            </div>
            <Link
              href="/welcome-webmaster/products"
              className="font-bold text-emerald-900 underline hover:no-underline"
            >
              View Products &rarr;
            </Link>
          </div>
        )}

        {/* Preview of Parsed Products */}
        {parsedProducts.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Preview: {parsedProducts.length} Product(s) Ready to Import
                </h3>
                <p className="text-xs text-neutral-500">
                  Verify the parsed rows below before committing to the database.
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
                  />
                  <span>Replace entire catalog</span>
                </label>

                <button
                  onClick={handleExecuteImport}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors"
                >
                  Commit Import
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 font-bold uppercase tracking-wider sticky top-0">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Sizes</th>
                    <th className="p-3">Images</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {parsedProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="p-3 font-semibold text-neutral-900">{p.name}</td>
                      <td className="p-3 text-neutral-600">{p.category}</td>
                      <td className="p-3 text-neutral-600">{p.sizes.join(', ')}</td>
                      <td className="p-3 text-neutral-500">{p.images.length} image(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CSV Instructions Guide */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-3 text-xs text-neutral-600">
        <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-xs">
          CSV Formatting Guidelines
        </h3>
        <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
          <li><strong>features</strong>: Separate multiple bullet points with semicolons (<code className="bg-neutral-200/70 px-1 py-0.5 rounded font-mono">;</code>). Example: <code className="font-mono">Hydraulic lift; Wingback design; Hand-stitched</code></li>
          <li><strong>sizes</strong>: Separate multiple dimensions with semicolons. Example: <code className="font-mono">4'6" Double; 5'0" King; 6'0" Super King</code></li>
          <li><strong>images</strong>: Provide direct URLs separated by semicolons. Example: <code className="font-mono">https://example.com/bed1.webp; https://example.com/bed2.webp</code></li>
          <li><strong>isFavorite</strong>: Set to <code className="font-mono">true</code> to display on the "Your Favorites" homepage section.</li>
        </ul>
      </div>

    </div>
  );
};
