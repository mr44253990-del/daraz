import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  HelpCircle,
  Smartphone,
  ShieldCheck,
  Truck,
  Flame,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { SiteSettings, UserProfile } from '../types';
import { PRODUCT_CATEGORIES } from '../data/initialData';
import { loadSearchHistory } from '../lib/storage';

interface NavbarProps {
  settings: SiteSettings;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
  likedCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenMenu: () => void;
  onOpenAdmin: () => void;
  currentUser: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  likedCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenMenu,
  onOpenAdmin,
  currentUser,
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchHistory(loadSearchHistory());
  }, [showSearchDropdown]);

  // Click outside listener for search suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm transition-all">
      {/* Top Notification Announcement Bar */}
      {settings.announcement && (
        <div id="top-announcement-bar" className="bg-[#FFE5D8] text-[#F85606] text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#ffd2bd]">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="bg-[#F85606] text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">ঘোষণা</span>
              <span className="truncate">{settings.announcement}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] text-gray-600">
              <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-[#F85606]" /> দ্রুততম ডেলিভারি</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> ১০০% আসল প্রোডাক্ট</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Utility Micro-bar */}
      <div className="hidden md:block bg-[#F85606] text-white text-[12px] border-b border-[#e24b03]">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => alert('দারাজ মোবাইল অ্যাপ ডাউনলোড করতে গুগল প্লে স্টোরে সার্চ করুন অথবা ব্রাউজার বুকমার্ক করুন।')}
              className="hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" /> দারাজ অ্যাপ ডাউনলোড
            </button>
            <span className="text-white/40">|</span>
            <a href="#contact" className="hover:underline flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> হেল্প ও কাস্টমার কেয়ার
            </a>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1 text-white/90">
              <Phone className="w-3 h-3" /> {settings.contactPhone || '01941429881'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-black/20 px-2.5 py-0.5 rounded font-semibold text-[11px] tracking-wide text-white/95">
              অফিসিয়াল দারাজ অ্যাফিলিয়েট পার্টনার মল
            </span>
            <span className="text-white/40">|</span>
            <span className="font-semibold cursor-default">বাংলা / BDT (৳)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onOpenMenu}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Daraz Brand Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('সকল ক্যাটাগরি');
              onSearchChange('');
            }}
            className="flex items-center gap-1.5 group select-none"
            id="brand-logo-link"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F85606] to-[#ff7a38] flex items-center justify-center text-white font-extrabold text-2xl shadow-sm group-hover:scale-105 transition-transform">
              d
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tight text-[#0F136D]">
                daraz<span className="text-[#F85606]">.com.bd</span>
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider">বাংলাদেশ মল</span>
            </div>
          </a>
        </div>

        {/* Advanced Smart Search Bar */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative w-full flex items-center border-2 border-[#F85606] rounded-lg overflow-hidden bg-white shadow-xs focus-within:shadow-md transition-all">
              <input
                id="main-product-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="দারাজে খুঁজুন (স্মার্টফোন, ঘড়ি, হেডফোন, পাঞ্জাবি...)"
                className="w-full py-2 px-3 md:py-2.5 md:px-4 text-sm text-gray-800 focus:outline-none placeholder-gray-400"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setShowSearchDropdown(false);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                id="search-submit-button"
                type="submit"
                className="bg-[#F85606] hover:bg-[#e04b03] text-white px-4 md:px-6 py-2.5 transition-colors flex items-center justify-center font-medium cursor-pointer"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>

          {/* Smart Search Suggestions Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in duration-150">
              {/* Recent Searches */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> সাম্প্রতিক সার্চ</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSearchChange(item);
                          setShowSearchDropdown(false);
                        }}
                        className="text-xs bg-gray-100 hover:bg-[#FFE5D8] hover:text-[#F85606] text-gray-700 px-2.5 py-1 rounded-md transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Hot Keywords */}
              <div className="p-3 bg-gray-50/70">
                <div className="flex items-center gap-1 text-xs text-[#F85606] font-bold mb-2">
                  <Flame className="w-3.5 h-3.5" /> ট্রেন্ডিং কীওয়ার্ড (গুগল ও দারাজ)
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {['অরিজিনাল ইয়ারবাডস', 'স্মার্টওয়াচ কলিং', 'কটন সেমি-লং পাঞ্জাবি', 'ফাস্ট চার্জার ৬৫ ওয়াট', 'সাউন্ডকোর ব্লুটুথ স্পিকার', 'সেরা স্কিনকেয়ার'].map((term, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onSearchChange(term);
                        setShowSearchDropdown(false);
                      }}
                      className="text-left text-xs text-gray-600 hover:text-[#F85606] p-1 rounded hover:bg-white flex items-center gap-1.5"
                    >
                      <TrendingUp className="w-3 h-3 text-gray-400" />
                      <span className="truncate">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Actions (Wishlist, Cart, Profile) */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Wishlist Button */}
          <button
            id="wishlist-toggle-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-gray-700 hover:text-[#F85606] hover:bg-orange-50 rounded-full transition-all cursor-pointer"
            title="পছন্দের তালিকা"
          >
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
            {likedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#F85606] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {likedCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            id="cart-toggle-btn"
            onClick={onOpenCart}
            className="relative p-2 text-gray-700 hover:text-[#F85606] hover:bg-orange-50 rounded-full transition-all cursor-pointer"
            title="শপিং কার্ট"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#F85606] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Support Shortcut */}
          <a
            href="#contact"
            id="nav-help-shortcut-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#F85606] hover:bg-orange-50/50 text-gray-700 hover:text-[#F85606] transition-all text-xs font-semibold"
            title="কাস্টমার সাপোর্ট"
          >
            <HelpCircle className="w-4 h-4 text-[#F85606]" />
            <span>সাপোর্ট</span>
          </a>
        </div>
      </div>

      {/* Category Strip Bar */}
      <div className="bg-[#FAF9F8] border-t border-gray-200 overflow-x-auto scrollbar-none py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium whitespace-nowrap">
          <span className="text-gray-400 text-xs hidden sm:inline mr-1">ক্যাটাগরি:</span>
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F85606] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-[#F85606] border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
