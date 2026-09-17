import React from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, ExternalLink, Tag } from 'lucide-react';
import { CartItem } from '../types';
import { executeDarazAffiliateBuy, buildDarazAffiliateUrl } from '../lib/affiliate';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  defaultAffiliateCode?: string;
  onNotify?: (msg: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  defaultAffiliateCode,
  onNotify,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Checkout first item or all
    const first = cartItems[0];
    const code = first.product.affiliateCode || defaultAffiliateCode;
    executeDarazAffiliateBuy(first.product.targetUrl, code, onNotify);

    if (cartItems.length > 1) {
      if (onNotify) {
        onNotify(`দারাজে ${cartItems.length}টি পণ্যের প্রথমটি ওপেন হয়েছে। অন্যান্য পণ্যগুলোও সহজে অর্ডার করতে পারবেন!`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#F85606]" />
            <h2 className="font-bold text-gray-800 text-base">আপনার শপিং ব্যাগ ({cartItems.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="overflow-y-auto p-4 flex-1 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">আপনার শপিং কার্ট খালি আছে</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                দারাজের সেরা ডিসকাউন্ট এবং হট ডিলগুলো দেখতে প্রোডাক্ট ব্রাউজ করুন।
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#F85606] text-white text-xs font-bold rounded-lg hover:bg-[#e04b03]"
              >
                শপিং শুরু করুন
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="py-3.5 flex items-center gap-3">
                <img
                  src={item.product.images[0] || '/placeholder.png'}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {item.product.title}
                  </h4>
                  <div className="text-xs font-bold text-[#F85606] mt-0.5">
                    ৳ {item.product.price.toLocaleString('en-IN')}
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, -1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, 1)}
                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-gray-800">
                    ৳ {(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  {item.product.targetUrl && (
                    <button
                      onClick={() =>
                        executeDarazAffiliateBuy(
                          item.product.targetUrl,
                          item.product.affiliateCode || defaultAffiliateCode,
                          onNotify
                        )
                      }
                      className="text-[11px] font-bold text-[#F85606] hover:underline flex items-center gap-1 justify-end mt-1 cursor-pointer"
                    >
                      <span>দারাজে কিনুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">সর্বমোট মূল্য (Subtotal):</span>
              <span className="text-base font-extrabold text-[#F85606]">
                ৳ {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onClearCart}
                className="py-2.5 px-3 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                সব খালি করুন
              </button>
              <button
                onClick={handleCheckout}
                className="py-2.5 px-3 bg-[#F85606] hover:bg-[#e04b03] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <span>দারাজে অর্ডার করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
