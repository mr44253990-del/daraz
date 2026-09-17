export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  targetUrl: string;
  affiliateCode?: string;
  tags: string[];
  clicks: number;
  isFlashSale?: boolean;
  inStock: boolean;
  previewData?: {
    title?: string;
    image?: string;
    price?: string;
    description?: string;
  };
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  link: string;
  active: boolean;
  badge?: string;
  order: number;
}

export interface CustomMenuLink {
  id: string;
  label: string;
  url: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  announcement: string;
  defaultAffiliateCode?: string;
  adminPasscode?: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  customMenuLinks: CustomMenuLink[];
  metaTitle: string;
  metaDescription: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  todayVisits: number;
  concurrentVisitors: number;
  monthlyVisits: number;
  totalProducts: number;
  totalClicks: number;
  popularProducts: Array<{
    id: string;
    title: string;
    clicks: number;
    price: number;
    image: string;
  }>;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  cart: CartItem[];
  likedProductIds: string[];
}
