import React from 'react';
import { X, Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  likedProducts: Product[];
  onAddToCart: (p: Product) => void;
  onRemoveLike: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  likedProducts,
  onAddToCart,
  onRemoveLike,
  onProductClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="font-bold text-gray-800 text-base">
              আপনার পছন্দের তালিকা ({likedProducts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1 divide-y divide-gray-100">
          {likedProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
              <Heart className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">কোন পছন্দের পণ্য যুক্ত করা হয়নি</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                যেকোনো পণ্যের হার্ট (Heart) আইকনে ক্লিক করে পরবর্তীতে দেখার জন্য সেভ করুন।
              </p>
            </div>
          ) : (
            likedProducts.map((product) => (
              <div
                key={product.id}
                className="py-3 flex items-center gap-3 hover:bg-gray-50/70 p-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => {
                  onProductClick(product);
                  onClose();
                }}
              >
                <img
                  src={product.images[0] || '/placeholder.png'}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {product.title}
                  </h4>
                  <div className="text-xs font-bold text-[#F85606] mt-0.5">
                    ৳ {product.price.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[#F85606] text-[11px] font-bold rounded-md flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>কার্টে নিন</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveLike(product);
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      বাদ দিন
                    </button>
                  </div>
                </div>

                {product.targetUrl && (
                  <a
                    href={product.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-gray-400 hover:text-[#F85606]"
                    title="দারাজে যান"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
