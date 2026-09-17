import { Banner, Product, SiteSettings } from '../types';

// Zero demo data - real data strictly comes from Supabase
export const INITIAL_BANNERS: Banner[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'Daraz Bangladesh',
  logoText: 'daraz',
  announcement: '🔥 দারাজ বাংলাদেশ অনলাইন শপিং মল - সরাসরি Supabase ডাটাবেসের সাথে সংযুক্ত।',
  defaultAffiliateCode: '$d9c9n$',
  adminPasscode: 'admin123',
  facebookUrl: 'https://facebook.com/darazbangladesh',
  telegramUrl: 'https://t.me/darazbddeals',
  whatsappNumber: '+8801941429881',
  contactEmail: 'support@darazbd-mall.com',
  contactPhone: '01941429881',
  customMenuLinks: [
    { id: 'c-1', label: 'আজকের সেরা ডিল', url: '#flash-sale' },
    { id: 'c-2', label: 'সকল প্রোডাক্ট', url: '#all-products' },
    { id: 'c-3', label: 'কাস্টমার কেয়ার', url: '#contact' },
  ],
  metaTitle: 'Daraz Bangladesh – Online Shopping Mall | দারাজ বাংলাদেশ',
  metaDescription: 'অনলাইন শপিং করুন দারাজ বাংলাদেশের সেরা কালেকশন থেকে। ফ্ল্যাশ ডিল, ইলেকট্রনিক্স, ফ্যাশন, মোবাইল ও লাইফস্টাইল পণ্য আকর্ষণীয় ছাড়ে কিনুন।',
};

export const PRODUCT_CATEGORIES = [
  'সকল ক্যাটাগরি',
  'ইলেকট্রনিক্স',
  'মোবাইল ও গ্যাজেট',
  'ফ্যাশন',
  'ঘড়ি ও এক্সেসরিজ',
  'হোম ও লিভিং',
  'বিউটি ও কেয়ার',
];
