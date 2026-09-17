import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  Mail,
  Send,
  Facebook,
  Lock,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pb-16 md:pb-6 text-gray-600 text-xs">
      {/* 4 Pillars Trust Bar */}
      <div className="bg-[#FAF9F8] border-b border-gray-200 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F85606] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">সারা দেশে হোম ডেলিভারি</h4>
              <p className="text-[11px] text-gray-500">সবচেয়ে দ্রুত ও নিরাপদ শিপিং</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F85606] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">১০০% আসল প্রোডাক্ট</h4>
              <p className="text-[11px] text-gray-500">জেনুইন ও যাচাইকৃত কালেকশন</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F85606] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">৭ দিনের সহজ রিটার্ন</h4>
              <p className="text-[11px] text-gray-500">ঝামেলাহীন রিটার্ন ও রিফান্ড</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F85606] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-[11px] text-gray-500">সবসময় আপনার পাশে</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Customer Care */}
        <div id="contact">
          <h4 className="font-bold text-gray-900 text-sm mb-3 text-[#0F136D]">কাস্টমার কেয়ার</h4>
          <ul className="space-y-2 text-gray-500">
            <li><a href="#contact" className="hover:underline">হেল্প সেন্টার ও প্রায়শই জিজ্ঞাসিত প্রশ্ন</a></li>
            <li><a href="#contact" className="hover:underline">কিভাবে অর্ডার করবেন</a></li>
            <li><a href="#contact" className="hover:underline">রিটার্ন ও রিফান্ড পলিসি</a></li>
            <li><a href="#contact" className="hover:underline">টার্মস ও কন্ডিশনস</a></li>
          </ul>
        </div>

        {/* About Daraz Mall */}
        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-3 text-[#0F136D]">দারাজ বাংলাদেশ সম্পর্কে</h4>
          <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
            দারাজ বাংলাদেশ স্টাইল অনলাইন শপিং প্ল্যাটফর্ম। আধুনিক সার্চ ইঞ্জিন, এআই ট্যাগিং এবং শীর্ষস্থানীয় অফারসহ আপনার পছন্দের সব পণ্য এক জায়গায়।
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-700">পাসওয়ার্ড প্রোটেক্টেড এডমিন:</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#F85606] hover:underline font-bold flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> এডমিন লগইন
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-3 text-[#0F136D]">যোগাযোগের ঠিকানা</h4>
          <div className="space-y-2 text-gray-500">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{settings.contactPhone || '01941429881'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#F85606]" />
              <span>{settings.contactEmail || 'support@darazbd.com'}</span>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-4">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {settings.telegramUrl && (
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <h4 className="font-bold text-gray-900 text-sm mb-3 text-[#0F136D]">পেমেন্ট মেথড</h4>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-600">
            <span className="bg-pink-50 text-pink-700 px-2.5 py-1 rounded border border-pink-200">bKash</span>
            <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded border border-orange-200">Nagad</span>
            <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded border border-purple-200">Rocket</span>
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">Visa / Master</span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-100 pt-4 text-center text-gray-400 text-[11px]">
        © {new Date().getFullYear()} Daraz Bangladesh Style Online Shopping Mall. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
};
