import type { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/data/initialProducts';
import { ProductDetailClient } from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

  if (!product) {
    return {
      title: 'Davis Furniture | Wholesale Bed Specialists',
    };
  }

  const primaryImage = product.images[0] || '/images/slider-mars-dt.webp';

  return {
    title: product.name,
    description: `${product.name} - ${product.tagline}. ${product.shortDescription || product.description}`.slice(0, 160),
    openGraph: {
      title: `${product.name} | Davis Furniture Wholesale`,
      description: product.tagline,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Davis Furniture`,
      description: product.tagline,
      images: [primaryImage],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: product.images,
              description: product.description,
              category: product.category,
              brand: {
                '@type': 'Brand',
                name: 'Davis Furniture',
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'GBP',
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition',
              },
            }),
          }}
        />
      )}
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
