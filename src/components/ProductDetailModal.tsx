import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { shareDarazProduct, executeDarazAffiliateBuy } from '../lib/affiliate';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onToggleLike: (p: Product) => void;
  isLiked: boolean;
  onSelectTag?: (tag: string) => void;
  defaultAffiliateCode?: string;
  onNotify?: (msg: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleLike,
  isLiked,
  onSelectTag,
  defaultAffiliateCode,
  onNotify,
}) => {
  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : ['/placeholder.png'];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const effectiveAffiliateCode = product.affiliateCode || defaultAffiliateCode;

  const handleShare = async () => {
    const res = await shareDarazProduct(product, effectiveAffiliateCode);
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (onNotify) {
        onNotify('দারাজ ডিল টেক্সট সফলভাবে কপি হয়েছে! এখন যে কাউকে পাঠাতে পারবেন।');
      }
    }
  };

  const handleCopyCode = () => {
    if (effectiveAffiliateCode && navigator.clipboard) {
      navigator.clipboard.writeText(effectiveAffiliateCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
      if (onNotify) {
        onNotify(`অ্যাফিলিয়েট কোড "${effectiveAffiliateCode}" কপি হয়েছে!`);
      }
    }
  };

  const handleBuyRedirect = () => {
    if (product.targetUrl) {
      executeDarazAffiliateBuy(product.targetUrl, effectiveAffiliateCode, onNotify);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-3.5 md:p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span>ক্যাটাগরি:</span>
            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-[#F85606]">
              {product.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 md:p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Multi-Image Showcase */}
            <div className="md:col-span-6 flex flex-col gap-3">
              {/* Main Large Image Display */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent ? (
                  <span className="absolute top-3 left-3 bg-[#F85606] text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                    -{product.discountPercent}% ছাড়
                  </span>
                ) : null}
              </div>

              {/* Thumbnails row if multiple images exist */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        i === selectedImageIndex
                          ? 'border-[#F85606] shadow-xs scale-95'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 text-center text-[11px] text-gray-600">
                <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>১০০% অথেনটিক</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                  <Truck className="w-4 h-4 text-[#F85606]" />
                  <span>হোম ডেলিভারি</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>৭ দিনে রিটার্ন</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div>
                {/* Title */}
                <h1 className="text-base md:text-xl font-bold text-gray-900 leading-snug">
                  {product.title}
                </h1>

                {/* Rating & reviews */}
                <div className="flex items-center gap-3 mt-2 pb-3 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-extrabold text-gray-800">{product.rating}</span>
                    <span className="text-gray-400">({product.reviewsCount} কাস্টমার রিভিউ)</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> স্টকে আছে
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-3.5 bg-[#FFF5EE] p-3.5 rounded-xl border border-[#FFE0D0]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-[#F85606]">
                      ৳ {product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳ {product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.discountPercent && (
                      <span className="text-xs bg-[#F85606] text-white px-2 py-0.5 rounded font-bold">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    ক্যাশ অন ডেলিভারি (COD) এবং অনলাইন পেমেন্ট প্রযোজ্য
                  </p>
                </div>

                {/* Affiliate Partner Promo Code Box */}
                {effectiveAffiliateCode && (
                  <div className="mt-3.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F85606] text-white flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-gray-600">
                          দারাজ অ্যাফিলিয়েট প্রোমো কোড
                        </div>
                        <div className="font-mono text-sm md:text-base font-extrabold text-[#F85606] tracking-wider">
                          {effectiveAffiliateCode}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-white hover:bg-orange-100 text-[#F85606] border border-orange-200 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>কোড কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Product Description */}
                <div className="mt-4">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    পণ্যের বিবরণ (Description)
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {product.description}
                  </p>
                </div>

                {/* SEO Tags & Keywords */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#F85606]" />
                      <span>গুগল সার্চ ও রিলেটেড ট্যাগ:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map((tag, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (onSelectTag) {
                              onSelectTag(tag);
                              onClose();
                            }
                          }}
                          className="text-[11px] bg-white hover:bg-orange-50 text-gray-600 hover:text-[#F85606] px-2 py-0.5 rounded-full border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-gray-400" />
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Box */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
                {/* Primary Buy / Target Link button */}
                <button
                  onClick={handleBuyRedirect}
                  className="w-full py-3 px-4 bg-[#F85606] hover:bg-[#e04b03] text-white font-extrabold text-sm md:text-base rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>দারাজে এখনই অর্ডার করুন (অটো কোড অ্যাপ্লাই)</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="col-span-2 py-2.5 px-3 bg-[#0F136D] hover:bg-[#1a1f8f] text-white font-bold text-xs md:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>কার্টে যোগ করুন</span>
                  </button>

                  <button
                    onClick={() => onToggleLike(product)}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      isLiked
                        ? 'border-red-300 bg-red-50 text-red-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isLiked ? 'পছন্দ' : 'লাইক'}</span>
                  </button>
                </div>

                {/* Share Link button */}
                <button
                  onClick={handleShare}
                  className="py-2 text-xs font-semibold text-gray-600 hover:text-[#F85606] bg-gray-50 hover:bg-orange-50 border border-gray-200 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#F85606]" />
                  <span>{copied ? 'দারাজ ডিল ফরম্যাটে কপি হয়েছে!' : 'দারাজ ডিল ফরম্যাটে বন্ধুদের শেয়ার করুন (ক্লিক করুন)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
