import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, Clock } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FlashSaleProps {
  products: Product[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleLike: (p: Product) => void;
  isLiked: (productId: string) => boolean;
}

export const FlashSale: React.FC<FlashSaleProps> = ({
  products,
  onProductClick,
  onAddToCart,
  onToggleLike,
  isLiked,
}) => {
  // Flash sale countdown timer state (resets daily)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale).slice(0, 6);
  if (flashProducts.length === 0) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div id="flash-sale" className="max-w-7xl mx-auto px-4 mt-6">
      {/* Flash Sale Header Bar */}
      <div className="bg-white rounded-t-xl p-3 md:p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#F85606] font-extrabold text-base md:text-lg">
            <Flame className="w-5 h-5 fill-[#F85606] animate-bounce" />
            <span>ফ্ল্যাশ সেল (Flash Sale)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-2">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">সময় বাকি:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-white">
              <span className="bg-[#D32F2F] px-1.5 py-0.5 rounded text-[11px]">{pad(timeLeft.hours)}</span>
              <span className="text-gray-600">:</span>
              <span className="bg-[#D32F2F] px-1.5 py-0.5 rounded text-[11px]">{pad(timeLeft.minutes)}</span>
              <span className="text-gray-600">:</span>
              <span className="bg-[#D32F2F] px-1.5 py-0.5 rounded text-[11px]">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        <a
          href="#all-products"
          className="text-xs md:text-sm font-bold text-[#F85606] hover:text-[#e04b03] flex items-center gap-1 border border-[#F85606]/30 hover:border-[#F85606] px-3 py-1 rounded-lg transition-all"
        >
          <span>সব অফার দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Products Strip */}
      <div className="bg-white rounded-b-xl p-3 md:p-4 border border-t-0 border-gray-100 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3.5">
          {flashProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleLike={onToggleLike}
              isLiked={isLiked(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
