import { Banner, Product, SiteSettings, AnalyticsStats, UserProfile, CartItem } from '../types';
import { INITIAL_SITE_SETTINGS } from '../data/initialData';
import { getSupabase } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'daraz_real_products_v2',
  BANNERS: 'daraz_real_banners_v2',
  SETTINGS: 'daraz_real_settings_v2',
  USER_CART_PREFIX: 'daraz_user_cart_',
  USER_WISHLIST_PREFIX: 'daraz_user_wishlist_',
  USER_PROFILE: 'daraz_user_profile_v2',
  SEARCH_HISTORY: 'daraz_search_history_v2',
};

// Purge old demo storage keys from previous iterations
export function purgeLegacyDemoData(): void {
  try {
    const oldKeys = ['daraz_products_v1', 'daraz_banners_v1', 'daraz_user_v1', 'daraz_settings_v1'];
    oldKeys.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

// 1. Products: Fetch from Supabase - NO demo fallback
export async function loadProducts(): Promise<Product[]> {
  purgeLegacyDemoData();
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn('Supabase products table notice:', error.message);
      } else if (data) {
        // Cache real data locally
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
        return data as Product[];
      }
    } catch (e) {
      console.warn('Supabase products fetch failed:', e);
    }
  }

  // Check local cache for previously synced real data
  const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed as Product[];
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Zero demo items - returns empty array
  return [];
}

// Save single product to Supabase & update cache
export async function saveProductToDb(product: Product): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').upsert(product, { onConflict: 'id' });
      if (error) {
        console.error('Supabase save product error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.error('Supabase product sync error:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

// Delete product from Supabase & update cache
export async function deleteProductFromDb(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.error('Supabase delete product error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.error('Supabase product delete exception:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function saveProducts(products: Product[]): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  const supabase = getSupabase();
  if (supabase && products.length > 0) {
    try {
      await supabase.from('products').upsert(products, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase bulk products sync error:', err);
    }
  }
}

// 2. Banners: Fetch from Supabase - NO demo fallback
export async function loadBanners(): Promise<Banner[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.warn('Supabase banners table notice:', error.message);
      } else if (data) {
        localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(data));
        return data as Banner[];
      }
    } catch (e) {
      console.warn('Supabase banners fetch failed:', e);
    }
  }

  const cached = localStorage.getItem(STORAGE_KEYS.BANNERS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed as Banner[];
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Zero demo banners
  return [];
}

export async function saveBannerToDb(banner: Banner): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('banners').upsert(banner, { onConflict: 'id' });
      if (error) {
        console.error('Supabase banner save error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function deleteBannerFromDb(bannerId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('banners').delete().eq('id', bannerId);
      if (error) {
        console.error('Supabase banner delete error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

export async function saveBanners(banners: Banner[]): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  const supabase = getSupabase();
  if (supabase && banners.length > 0) {
    try {
      await supabase.from('banners').upsert(banners, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase banners sync error:', err);
    }
  }
}

// 3. Site Settings
export async function loadSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'primary')
        .maybeSingle();

      if (!error && data && data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        return data.settings as SiteSettings;
      }
    } catch (e) {
      console.warn('Supabase settings fetch error:', e);
    }
  }

  const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
  }

  return INITIAL_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert({ id: 'primary', settings });
    } catch (err) {
      console.warn('Supabase save settings error:', err);
    }
  }
}

// 4. User Cart & Wishlist persistence tied to real User ID
export function loadUserCart(userId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_CART_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserCart(userId: string, cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_CART_PREFIX + userId, JSON.stringify(cart));
  } catch {}
}

export function loadUserWishlist(userId: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_WISHLIST_PREFIX + userId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserWishlist(userId: string, productIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_WISHLIST_PREFIX + userId, JSON.stringify(productIds));
  } catch {}
}

export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  } catch {}
}

// 5. Visitor Tracking & Analytics
export async function trackVisit(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const lastVisitKey = 'daraz_last_visit_date';
  const lastVisitDate = localStorage.getItem(lastVisitKey);

  try {
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrer: document.referrer, isNewDay: lastVisitDate !== today }),
    }).catch(() => {});
  } catch {}

  localStorage.setItem(lastVisitKey, today);
}

export async function recordProductClick(productId: string): Promise<void> {
  try {
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clickedProductId: productId }),
    }).catch(() => {});
  } catch {}

  // Update cached click count
  const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (cached) {
    try {
      const products: Product[] = JSON.parse(cached);
      const updated = products.map((p) => (p.id === productId ? { ...p, clicks: (p.clicks || 0) + 1 } : p));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    } catch {}
  }
}

export async function fetchAnalytics(products: Product[]): Promise<AnalyticsStats> {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        totalProducts: products.length,
        popularProducts: [...products]
          .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
          .slice(0, 5)
          .map((p) => ({
            id: p.id,
            title: p.title,
            clicks: p.clicks || 0,
            price: p.price,
            image: p.images?.[0] || '',
          })),
      };
    }
  } catch {}

  const popularProducts = [...products]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      clicks: p.clicks || 0,
      price: p.price,
      image: p.images?.[0] || '',
    }));

  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0);

  return {
    totalVisits: 0,
    todayVisits: 0,
    concurrentVisitors: 1,
    monthlyVisits: 0,
    totalProducts: products.length,
    totalClicks,
    popularProducts,
  };
}

// 6. Search History
export function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSearchTerm(term: string): void {
  if (!term.trim()) return;
  const history = loadSearchHistory();
  const updated = [term.trim(), ...history.filter((t) => t.toLowerCase() !== term.trim().toLowerCase())].slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
}

// 7. Supabase Storage Image Upload with mobile optimization & client fallback
export async function uploadImageToSupabaseStorage(
  file: File
): Promise<{ success: boolean; url?: string; error?: string; bucketMissing?: boolean }> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '').slice(0, 20);
  const filePath = `products/${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${cleanName || 'image.' + fileExt}`;

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (error) {
        console.warn('Supabase storage upload error:', error.message);
        const isBucketErr =
          error.message.toLowerCase().includes('bucket') ||
          error.message.toLowerCase().includes('not found') ||
          error.message.toLowerCase().includes('policy');

        // Fallback to high-quality compressed data URL so upload never fails
        const dataUrl = await compressImageToDataUrl(file);
        return {
          success: true,
          url: dataUrl,
          error: error.message,
          bucketMissing: isBucketErr,
        };
      }

      if (data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(data.path);
        return { success: true, url: publicUrlData.publicUrl };
      }
    } catch (err: any) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // Fallback if supabase storage is not yet initialized
  const dataUrl = await compressImageToDataUrl(file);
  return {
    success: true,
    url: dataUrl,
    bucketMissing: true,
    error: 'Supabase storage বাকেট সক্রিয় না থাকায় ইমেজটি লোকালি কম্প্রেস করা হয়েছে।',
  };
}

// Client-side lightweight image compressor (prevents massive 10MB mobile camera files from slowing down site)
export function compressImageToDataUrl(file: File, maxWidth = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

