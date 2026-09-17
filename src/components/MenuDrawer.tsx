import React from 'react';
import {
  X,
  Shield,
  Phone,
  Mail,
  Send,
  Facebook,
  ExternalLink,
  Flame,
  ShoppingBag,
  HelpCircle,
  KeyRound,
  Grid,
} from 'lucide-react';
import { SiteSettings } from '../types';
import { PRODUCT_CATEGORIES } from '../data/initialData';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenAdmin,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-[#F85606] to-[#ff6b21] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-[#F85606] font-extrabold flex items-center justify-center text-xl shadow-xs">
              d
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-none">daraz.com.bd</h3>
              <p className="text-[10px] text-white/80 mt-0.5">মেনু ও নেভিগেশন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {/* Quick Shortcuts */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              শপিং শর্টকাট
            </span>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <a
                href="#flash-sale"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-[#F85606] transition-colors"
              >
                <Flame className="w-4 h-4 text-[#F85606]" />
                <span>হট ফ্ল্যাশ সেল</span>
              </a>
              <a
                href="#all-products"
                onClick={onClose}
                className="flex items-center gap-2.5 p-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-[#F85606] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#0F136D]" />
                <span>সকল প্রোডাক্ট ব্রাউজ</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              ক্যাটাগরি সমূহ
            </span>
            <div className="grid grid-cols-1 gap-1">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 hover:text-[#F85606] flex items-center justify-between"
                >
                  <span>{cat}</span>
                  <Grid className="w-3 h-3 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Menu Links added by Admin */}
          {settings.customMenuLinks && settings.customMenuLinks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                অন্যান্য লিংক
              </span>
              <div className="flex flex-col gap-1">
                {settings.customMenuLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social Channels Configured by Admin */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              সোশ্যাল মিডিয়া ও সাপোর্ট
            </span>
            <div className="flex flex-col gap-1.5 text-xs">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>ফেসবুক পেজ</span>
                </a>
              )}
              {settings.telegramUrl && (
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-sky-500 hover:bg-sky-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>টেলিগ্রাম চ্যানেল</span>
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপ: {settings.whatsappNumber}</span>
                </a>
              )}
              {settings.contactEmail && (
                <div className="flex items-center gap-2.5 p-2 rounded-lg text-gray-600 text-[11px]">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{settings.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Admin Access Portal Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              id="drawer-admin-btn"
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>এডমিন প্যানেলে লগইন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
