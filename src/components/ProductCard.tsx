import React, { useState } from 'react';
import { Heart, ShoppingCart, Share2, Star, ChevronLeft, ChevronRight, ExternalLink, Tag } from 'lucide-react';
import { Product } from '../types';
import { shareDarazProduct, executeDarazAffiliateBuy } from '../lib/affiliate';

interface ProductCardProps {
  product: Product;
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onToggleLike: (p: Product) => void;
  isLiked: boolean;
  defaultAffiliateCode?: string;
  onNotify?: (msg: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
  onAddToCart,
  onToggleLike,
  isLiked,
  defaultAffiliateCode,
  onNotify,
}) => {
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.png'];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const effectiveAffiliateCode = product.affiliateCode || defaultAffiliateCode;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await shareDarazProduct(product, effectiveAffiliateCode);
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onNotify) {
        onNotify('দারাজ ডিল কপি হয়েছে! আপনি বন্ধুদের সাথে পেস্ট করে শেয়ার করতে পারেন।');
      }
    }
  };

  const handleAffiliateRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.targetUrl) {
      executeDarazAffiliateBuy(product.targetUrl, effectiveAffiliateCode, onNotify);
    } else {
      onProductClick(product);
    }
  };

  return (
    <div
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-xl border border-gray-200/80 hover:border-[#F85606]/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
      id={`product-card-${product.id}`}
    >
      {/* Top Image Box with Multi-Image Slider */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden select-none">
        <img
          src={images[activeImageIndex]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discountPercent ? (
          <span className="absolute top-2 left-2 bg-[#F85606] text-white font-bold text-[10px] md:text-xs px-1.5 py-0.5 rounded-sm shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : null}

        {/* Free Delivery mini badge */}
        <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white font-semibold text-[9px] px-1.5 py-0.5 rounded-xs">
          ফ্রি ডেলিভারি
        </span>

        {/* Multi-Image Controls if 2+ images exist */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Micro dots */}
            <div className="absolute bottom-1.5 right-2 flex items-center gap-1 z-10">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i === activeImageIndex ? 'bg-[#F85606]' : 'bg-black/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Action icons overlay (Like & Share) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(product);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isLiked
                ? 'bg-red-50 text-red-500 shadow-xs'
                : 'bg-white/80 hover:bg-white text-gray-600 shadow-xs hover:text-red-500'
            }`}
            title="লাইক বা ফেভারিট"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-600 shadow-xs flex items-center justify-center hover:text-[#F85606] transition-all"
            title="লিংক কপি করুন"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Copied toast alert */}
        {copied && (
          <div className="absolute inset-x-2 top-2 bg-black/85 text-white text-[10px] py-1.5 px-2 rounded-md text-center z-20 font-medium shadow-md flex items-center justify-center gap-1">
            <span>দারাজ ডিল কপি হয়েছে!</span>
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-2.5 md:p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#F85606] transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Description snippet */}
          <p className="text-[11px] text-gray-500 line-clamp-1 mt-1 font-normal">
            {product.description}
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-gray-100">
          {/* Price strip */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm md:text-base font-extrabold text-[#F85606]">
              ৳ {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through">
                ৳ {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Affiliate Code Pill if configured */}
          {effectiveAffiliateCode && (
            <div className="mt-1.5 flex items-center justify-between bg-orange-50 border border-orange-200/80 rounded px-1.5 py-0.5 text-[10px] text-orange-900">
              <span className="flex items-center gap-1 font-medium">
                <Tag className="w-2.5 h-2.5 text-[#F85606]" />
                কোড:
              </span>
              <span className="font-mono font-bold text-[#F85606] select-all">
                {effectiveAffiliateCode}
              </span>
            </div>
          )}

          {/* Ratings & Sold */}
          <div className="flex items-center justify-between mt-1 text-[10px] md:text-[11px] text-gray-500">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
            {product.soldCount > 0 && (
              <span className="text-gray-400">{product.soldCount}+ বিক্রি</span>
            )}
          </div>

          {/* Card Button Actions */}
          <div className="grid grid-cols-2 gap-1.5 mt-2.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="py-1.5 px-2 bg-orange-50 hover:bg-orange-100 text-[#F85606] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>কার্ট</span>
            </button>

            <button
              onClick={handleAffiliateRedirect}
              className="py-1.5 px-2 bg-[#F85606] hover:bg-[#e04b03] text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              title="দারাজে অর্ডার করুন"
            >
              <span>দারাজে কিনুন</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
