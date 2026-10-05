import Papa from 'papaparse';
import type { Product } from '../types/product';

export interface CsvProductRow {
  id?: string;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  shortDescription?: string;
  features?: string; // Semicolon-separated
  sizes?: string; // Semicolon-separated
  images?: string; // Semicolon-separated URLs
  category?: string;
  sku?: string;
  isFavorite?: string | boolean;
  inStock?: string | boolean;
}

export function exportProductsToCsv(products: Product[]) {
  const rows: CsvProductRow[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline || '',
    description: p.description || '',
    shortDescription: p.shortDescription || '',
    features: (p.features || []).join('; '),
    sizes: (p.sizes || []).join('; '),
    images: (p.images || []).join('; '),
    category: p.category || 'Storage Beds',
    sku: p.sku || '',
    isFavorite: p.isFavorite ? 'true' : 'false',
    inStock: p.inStock ? 'true' : 'false'
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `davis_furniture_products_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCsvTemplate() {
  const templateRows: CsvProductRow[] = [
    {
      name: 'Sample Storage Bed',
      slug: 'sample-storage-bed',
      tagline: 'Modern Elegance & Hidden Ottoman Storage',
      description: 'Comprehensive description about the bed, fabric materials and design features.',
      shortDescription: 'Modern ottoman storage bed with tufted headboard.',
      features: 'Hydraulic lift storage; Deep button tufting; Solid hardwood frame',
      sizes: "4'6\" Double; 5'0\" King; 6'0\" Super King",
      images: '/images/products/mars-1.webp; /images/products/mars-2.webp',
      category: 'Storage Beds',
      sku: 'DVR-SMPL-01',
      isFavorite: 'true',
      inStock: 'true'
    }
  ];

  const csv = Papa.unparse(templateRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'products_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseProductsFromCsv(file: File): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvProductRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed: Product[] = results.data
            .filter((row) => row.name && row.name.trim().length > 0)
            .map((row, index) => {
              const name = row.name.trim();
              const slug =
                row.slug && row.slug.trim().length > 0
                  ? row.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              const features = row.features
                ? row.features.split(';').map((s) => s.trim()).filter(Boolean)
                : [];
              const sizes = row.sizes
                ? row.sizes.split(';').map((s) => s.trim()).filter(Boolean)
                : ["4'6\" Double", "5'0\" King", "6'0\" Super King"];
              const images = row.images
                ? row.images.split(';').map((s) => s.trim()).filter(Boolean)
                : [];

              return {
                id: row.id || `csv-${Date.now()}-${index}`,
                name,
                slug,
                tagline: row.tagline || '',
                description: row.description || '',
                shortDescription: row.shortDescription || '',
                features,
                sizes,
                images: images.length > 0 ? images : [],
                isFavorite: String(row.isFavorite).toLowerCase() === 'true',
                inStock: String(row.inStock).toLowerCase() !== 'false',
                category: row.category || 'Storage Beds',
                sku: row.sku || `DVR-IMP-${index + 1}`,
                createdAt: new Date().toISOString()
              };
            });

          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}
