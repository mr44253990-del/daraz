import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Shield, Gift, Sparkles } from 'lucide-react';
import { Banner } from '../types';
import { PRODUCT_CATEGORIES } from '../data/initialData';

interface HeroBannerProps {
  banners: Banner[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onBannerClick?: (banner: Banner) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners,
  selectedCategory,
  onSelectCategory,
  onBannerClick,
}) => {
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3 md:pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Category Drawer Column (Daraz Desktop Style) */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-gray-200/80 shadow-xs p-3">
          <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F85606]" />
            <span>জনপ্রিয় ক্যাটাগরি সমূহ</span>
          </div>
          <ul className="space-y-1">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFE5D8] text-[#F85606] font-bold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#F85606]'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-orange-50/70 p-2 rounded-lg">
              <Zap className="w-4 h-4 text-[#F85606] shrink-0" />
              <span>সরাসরি Supabase ডাটাবেসের সাথে সংযুক্ত</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-emerald-50/70 p-2 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>কোন ডেমো ডাটা বা ফেক একাউন্ট নেই</span>
            </div>
          </div>
        </div>

        {/* Center & Right Banner Carousel or Supabase Welcome Banner */}
        <div className="lg:col-span-9 relative rounded-xl overflow-hidden shadow-sm group bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 aspect-[16/8] md:aspect-[16/6] max-h-[360px] flex items-center">
          {activeBanners.length > 0 ? (
            <>
              {/* Banner Images */}
              {activeBanners.map((banner, index) => {
                const isVisible = index === currentIndex;
                return (
                  <div
                    key={banner.id}
                    onClick={() => {
                      if (onBannerClick) onBannerClick(banner);
                      else if (banner.link) window.open(banner.link, '_blank');
                    }}
                    className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
                      isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-8 text-white">
                      {banner.badge && (
                        <span className="inline-block self-start bg-[#F85606] text-white text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5 shadow-md">
                          {banner.badge}
                        </span>
                      )}
                      <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-tight drop-shadow-sm line-clamp-1">
                        {banner.title}
                      </h2>
                      {banner.subtitle && (
                        <p className="text-xs md:text-sm text-gray-200 mt-1 line-clamp-1 drop-shadow-sm">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Controls */}
              {activeBanners.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5">
                    {activeBanners.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(i);
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          i === currentIndex ? 'w-6 bg-[#F85606]' : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col justify-center p-6 md:p-10 text-white relative z-10">
              <span className="inline-block self-start bg-[#F85606] text-white text-[11px] md:text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-md">
                সুপাবেস লাইভ স্টোর
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight text-white mb-2">
                দারাজ বাংলাদেশ অনলাইন শপিং মল
              </h2>
              <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed">
                আপনার স্টোরটি সরাসরি Supabase ডাটাবেসের সাথে সংযুক্ত রয়েছে। ডেমো বা ফেক ডাটা সম্পূর্ণরূপে অপসারিত। এডমিন প্যানেল থেকে আসল ব্যানার ও প্রোডাক্ট যোগ করুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
