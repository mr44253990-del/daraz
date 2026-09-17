/**
 * Daraz BD Affiliate Partner & Smart Parser Utilities
 */

import { Product } from '../types';

export interface ParsedDarazShare {
  title?: string;
  originalPrice?: number;
  price?: number;
  discountPercent?: number;
  targetUrl?: string;
  matched: boolean;
}

/**
 * Parses raw text copied directly from Daraz App / Website share:
 * Example:
 * I found this great deal on Daraz! Check it out! 
 * Product Name:  360° Rotating Full Metal Phone & Tablet Stand – Aluminum Alloy Adjustable Desktop Holder for Mobile Devices
 * Product Price:  ৳345
 * Discount Price:  ৳99
 * https://s.daraz.com.bd/s.bAYtw?cc
 */
export function parseDarazShareText(text: string): ParsedDarazShare {
  if (!text || typeof text !== 'string') {
    return { matched: false };
  }

  const result: ParsedDarazShare = { matched: false };

  // 1. Extract Target URL (both short links s.daraz.com.bd and standard daraz.com.bd links)
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const urlMatch = text.match(urlRegex);
  if (urlMatch) {
    result.targetUrl = urlMatch[1].trim();
    result.matched = true;
  }

  // 2. Extract Product Name
  const nameRegex = /Product Name:\s*([^\n\r]+)/i;
  const nameMatch = text.match(nameRegex);
  if (nameMatch && nameMatch[1]) {
    result.title = nameMatch[1].trim();
    result.matched = true;
  } else {
    // Fallback line parsing
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const candidateLines = lines.filter(
      (l) =>
        !l.toLowerCase().includes('i found this') &&
        !l.toLowerCase().includes('check it out') &&
        !l.toLowerCase().includes('product price') &&
        !l.toLowerCase().includes('discount price') &&
        !l.startsWith('http')
    );
    if (candidateLines.length > 0) {
      result.title = candidateLines[0];
      result.matched = true;
    }
  }

  // 3. Extract Product Price (Original Price before discount)
  const origPriceRegex = /Product Price:\s*(?:৳|Tk|BDT|Rs\.?|\$)?\s*([0-9,]+(?:\.[0-9]+)?)/i;
  const origPriceMatch = text.match(origPriceRegex);
  if (origPriceMatch && origPriceMatch[1]) {
    const p = parseFloat(origPriceMatch[1].replace(/,/g, ''));
    if (!isNaN(p)) {
      result.originalPrice = Math.round(p);
      result.matched = true;
    }
  }

  // 4. Extract Discount Price (Actual Offer / Flash Price)
  const discPriceRegex = /Discount Price:\s*(?:৳|Tk|BDT|Rs\.?|\$)?\s*([0-9,]+(?:\.[0-9]+)?)/i;
  const discPriceMatch = text.match(discPriceRegex);
  if (discPriceMatch && discPriceMatch[1]) {
    const p = parseFloat(discPriceMatch[1].replace(/,/g, ''));
    if (!isNaN(p)) {
      result.price = Math.round(p);
      result.matched = true;
    }
  }

  // If only one price was extracted, set price
  if (!result.price && result.originalPrice) {
    result.price = result.originalPrice;
  }

  // Calculate discount % automatically
  if (result.originalPrice && result.price && result.originalPrice > result.price) {
    result.discountPercent = Math.round(
      ((result.originalPrice - result.price) / result.originalPrice) * 100
    );
  }

  return result;
}

/**
 * Builds an authentic Daraz Affiliate Link with tracking tokens and parameters.
 * Handles Daraz app universal deep linking & affiliate sub_id tracking.
 */
export function buildDarazAffiliateUrl(originalUrl: string, affiliateCode?: string): string {
  if (!originalUrl) return '#';
  const trimmed = originalUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const code = affiliateCode?.trim();

    if (code) {
      const cleanCode = code.replace(/^\$|\$$/g, '');

      // Daraz affiliate tracking params:
      // cc: Campaign Code (used by Daraz short-links)
      if (!url.searchParams.has('cc') || url.searchParams.get('cc') === '') {
        url.searchParams.set('cc', cleanCode);
      }
      url.searchParams.set('sub_id', cleanCode);
      url.searchParams.set('aff_code', cleanCode);
      url.searchParams.set('dsource', 'affiliate');
      url.searchParams.set('tag', cleanCode);
    }

    return url.toString();
  } catch {
    const sep = trimmed.includes('?') ? '&' : '?';
    const code = affiliateCode ? encodeURIComponent(affiliateCode.trim()) : '';
    return code ? `${trimmed}${sep}sub_id=${code}&aff_code=${code}` : trimmed;
  }
}

/**
 * Action to handle 1-click Daraz purchase:
 * - Copies the affiliate voucher/promo code to clipboard
 * - Triggers a brief user-friendly toast/alert
 * - Opens the affiliate link in a new tab (or triggers Daraz app deep link)
 */
export function executeDarazAffiliateBuy(
  productUrl: string,
  affiliateCode?: string,
  onNotify?: (msg: string) => void
): void {
  const code = affiliateCode?.trim();
  const finalUrl = buildDarazAffiliateUrl(productUrl, code);

  if (code && navigator.clipboard) {
    navigator.clipboard.writeText(code).catch(() => {});
    if (onNotify) {
      onNotify(`🎁 দারাজ অ্যাফিলিয়েট কোড "${code}" কপি হয়েছে! দারাজ অ্যাপে চেকআউটের সময় কোডটি ব্যবহার করুন।`);
    }
  }

  // Open the target link
  if (finalUrl && finalUrl !== '#') {
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Generates the user's requested Daraz deal share message:
 * 
 * I found this great deal on Daraz! Check it out! 
 * Product Name:  360° Rotating Full Metal Phone & Tablet Stand – Aluminum Alloy Adjustable Desktop Holder for Mobile Devices
 * Product Price:  ৳345
 * Discount Price:  ৳99
 * https://s.daraz.com.bd/s.bAYtw?cc
 */
export function generateDarazShareMessage(product: Product, defaultAffiliateCode?: string): string {
  const origPrice =
    product.originalPrice ||
    (product.discountPercent && product.discountPercent > 0
      ? Math.round(product.price / (1 - product.discountPercent / 100))
      : Math.round(product.price * 1.3));

  const targetLink = buildDarazAffiliateUrl(
    product.targetUrl || (typeof window !== 'undefined' ? `${window.location.origin}/?product=${product.id}` : ''),
    product.affiliateCode || defaultAffiliateCode
  );

  return `I found this great deal on Daraz! Check it out! \nProduct Name:  ${product.title}\nProduct Price:  ৳${origPrice}\nDiscount Price:  ৳${product.price}\n${targetLink}`;
}

/**
 * Handles Web Share API with clipboard fallback
 */
export async function shareDarazProduct(
  product: Product,
  defaultAffiliateCode?: string
): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const text = generateDarazShareMessage(product, defaultAffiliateCode);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: product.title,
        text: text,
      });
      return { success: true, method: 'native' };
    } catch (e: any) {
      // If user cancelled or abort, don't fail hard
      if (e?.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return { success: true, method: 'clipboard' };
  }

  return { success: false, method: 'clipboard' };
}

