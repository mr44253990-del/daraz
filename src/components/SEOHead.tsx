import React, { useEffect } from 'react';
import { Product, SiteSettings } from '../types';

interface SEOHeadProps {
  settings: SiteSettings;
  activeProduct?: Product | null;
  searchQuery?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ settings, activeProduct, searchQuery }) => {
  useEffect(() => {
    // Dynamic document title
    if (activeProduct) {
      document.title = `${activeProduct.title} | ৳ ${activeProduct.price} - Daraz Bangladesh`;
    } else if (searchQuery) {
      document.title = `"${searchQuery}" খুঁজুন - Daraz Bangladesh অনলাইন শপিং`;
    } else {
      document.title = settings.metaTitle || 'Daraz Bangladesh – Online Shopping Mall | দারাজ বাংলাদেশ';
    }

    // Dynamic Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        activeProduct ? activeProduct.description.slice(0, 160) : settings.metaDescription
      );
    }

    // Dynamic OpenGraph Title & Image
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        'content',
        activeProduct ? activeProduct.title : settings.metaTitle
      );
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && activeProduct?.images?.[0]) {
      ogImage.setAttribute('content', activeProduct.images[0]);
    }

    // Inject Schema.org JSON-LD for Google Rich Snippets & Indexing
    let scriptTag = document.getElementById('schema-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const jsonLdData = activeProduct
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: activeProduct.title,
          image: activeProduct.images,
          description: activeProduct.description,
          sku: activeProduct.id,
          offers: {
            '@type': 'Offer',
            url: activeProduct.targetUrl || window.location.href,
            priceCurrency: 'BDT',
            price: activeProduct.price,
            availability: activeProduct.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: activeProduct.rating || 4.8,
            reviewCount: activeProduct.reviewsCount || 120,
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Daraz Bangladesh',
          url: window.location.origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

    scriptTag.text = JSON.stringify(jsonLdData);
  }, [settings, activeProduct, searchQuery]);

  return null;
};
