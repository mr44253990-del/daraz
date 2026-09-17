import React from 'react';
import { Home, Grid, Flame, ShoppingCart, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  wishlistCount?: number;
  onOpenCategories: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenWishlist,
  wishlistCount = 0,
  onOpenCategories,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 py-1.5 px-3 shadow-lg flex items-center justify-around">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          activeTab === 'home' ? 'text-[#F85606] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>হোম</span>
      </button>

      <button
        onClick={onOpenCategories}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          activeTab === 'categories' ? 'text-[#F85606] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>ক্যাটাগরি</span>
      </button>

      <button
        onClick={() => {
          onSelectTab('flash');
          const el = document.getElementById('flash-sale');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
          activeTab === 'flash' ? 'text-[#F85606] font-bold' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span>হট ডিল</span>
      </button>

      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-0.5 text-[10px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-2 bg-[#F85606] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span>কার্ট</span>
      </button>

      <button
        onClick={onOpenWishlist}
        className="relative flex flex-col items-center gap-0.5 text-[10px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span>পছন্দ</span>
      </button>
    </div>
  );
};
