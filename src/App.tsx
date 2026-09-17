import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  Banner,
  SiteSettings,
  CartItem,
  UserProfile,
} from './types';
import {
  loadProducts,
  loadBanners,
  loadSiteSettings,
  trackVisit,
  recordProductClick,
  loadUserProfile,
  saveUserProfile,
  addSearchTerm,
  loadUserCart,
  saveUserCart,
  loadUserWishlist,
  saveUserWishlist,
} from './lib/storage';
import { getSupabase } from './lib/supabase';
import { INITIAL_SITE_SETTINGS } from './data/initialData';

// Components
import { SEOHead } from './components/SEOHead';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FlashSale } from './components/FlashSale';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { MenuDrawer } from './components/MenuDrawer';
import { AdminPanel } from './components/AdminPanel';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

// Icons
import {
  Search,
  Filter,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  RefreshCw,
  TrendingUp,
  Tag,
  Database,
  ShieldCheck,
  PlusCircle,
  Share2,
} from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function App() {
  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সকল ক্যাটাগরি');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'popular'>('recommended');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // User & Cart States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);

  // Modals & Overlays
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('home');

  // Infinite Scroll Trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Function to refresh data from Supabase on demand
  const refreshData = async () => {
    setLoading(true);
    try {
      const [loadedProducts, loadedBanners, loadedSettings] = await Promise.all([
        loadProducts(),
        loadBanners(),
        loadSiteSettings(),
      ]);
      setProducts(loadedProducts);
      setBanners(loadedBanners);
      setSettings(loadedSettings);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Load & Deep Link Parsing
  useEffect(() => {
    async function init() {
      try {
        const [loadedProducts, loadedBanners, loadedSettings] = await Promise.all([
          loadProducts(),
          loadBanners(),
          loadSiteSettings(),
        ]);
        setProducts(loadedProducts);
        setBanners(loadedBanners);
        setSettings(loadedSettings);

        // Load stored user profile
        const storedUser = loadUserProfile();
        if (storedUser) {
          setCurrentUser(storedUser);
          if (storedUser.cart) setCart(storedUser.cart);
          if (storedUser.likedProductIds) setLikedProductIds(storedUser.likedProductIds);
        }

        // Track site visit for analytics
        trackVisit();

        // Check URL parameters for direct product deep linking (e.g. ?product=id or ?admin=true)
        const params = new URLSearchParams(window.location.search);
        const prodId = params.get('product');
        if (prodId) {
          const match = loadedProducts.find((p) => p.id === prodId);
          if (match) setActiveProduct(match);
        }
        if (params.get('search')) {
          setSearchQuery(params.get('search') || '');
        }
        if (params.get('admin') === 'true' || window.location.hash === '#admin') {
          setIsAdminOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }
    init();

    // Supabase Auth listener for real accounts
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u: UserProfile = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              'ইউজার',
            email: session.user.email || '',
            avatar:
              session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
            cart: loadUserCart(session.user.id),
            likedProductIds: loadUserWishlist(session.user.id),
          };
          setCurrentUser(u);
          saveUserProfile(u);
          if (u.cart?.length) setCart(u.cart);
          if (u.likedProductIds?.length) setLikedProductIds(u.likedProductIds);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u: UserProfile = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] ||
              'ইউজার',
            email: session.user.email || '',
            avatar:
              session.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
            cart: loadUserCart(session.user.id),
            likedProductIds: loadUserWishlist(session.user.id),
          };
          setCurrentUser(u);
          saveUserProfile(u);
          if (u.cart?.length) setCart(u.cart);
          if (u.likedProductIds?.length) setLikedProductIds(u.likedProductIds);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          saveUserProfile(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // 2. Sync active product with browser URL for SEO indexable links
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeProduct) {
      url.searchParams.set('product', activeProduct.id);
      window.history.replaceState({}, '', url.toString());
    } else {
      url.searchParams.delete('product');
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeProduct]);

  // 3. Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, 60));
        }
      },
      { threshold: 0.2 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [products]);

  // 4. Advanced Filter & Multi-Keyword Search Engine
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'সকল ক্যাটাগরি') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);

      list = list.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        // Check if any token matches title, description, category, or tags
        return tokens.some(
          (t) =>
            title.includes(t) ||
            desc.includes(t) ||
            cat.includes(t) ||
            tags.some((tag) => tag.includes(t))
        );
      });
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Products to render based on current scroll batch
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Liked products list for Wishlist modal
  const likedProducts = useMemo(() => {
    return products.filter((p) => likedProductIds.includes(p.id));
  }, [products, likedProductIds]);

  // Handlers
  const handleProductClick = (product: Product) => {
    recordProductClick(product.id);
    setActiveProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    // If not logged in, prompt user to sign in
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { productId: product.id, product, quantity: 1, addedAt: new Date().toISOString() }];
      }

      // Update current user
      if (currentUser) {
        const updatedUser = { ...currentUser, cart: updated };
        setCurrentUser(updatedUser);
        saveUserProfile(updatedUser);
        saveUserCart(currentUser.id, updated);
      }
      return updated;
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (currentUser) {
        const u = { ...currentUser, cart: updated };
        setCurrentUser(u);
        saveUserProfile(u);
        saveUserCart(currentUser.id, updated);
      }
      return updated;
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      if (currentUser) {
        const u = { ...currentUser, cart: updated };
        setCurrentUser(u);
        saveUserProfile(u);
        saveUserCart(currentUser.id, updated);
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    if (currentUser) {
      const u = { ...currentUser, cart: [] };
      setCurrentUser(u);
      saveUserProfile(u);
      saveUserCart(currentUser.id, []);
    }
  };

  const handleToggleLike = (product: Product) => {
    setLikedProductIds((prev) => {
      const exists = prev.includes(product.id);
      const updated = exists ? prev.filter((id) => id !== product.id) : [...prev, product.id];
      if (currentUser) {
        const u = { ...currentUser, likedProductIds: updated };
        setCurrentUser(u);
        saveUserProfile(u);
        saveUserWishlist(currentUser.id, updated);
      }
      return updated;
    });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveUserProfile(user);
    if (user.cart && user.cart.length > 0) setCart(user.cart);
    if (user.likedProductIds && user.likedProductIds.length > 0) {
      setLikedProductIds(user.likedProductIds);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Signout warning:', e);
      }
    }
    setCurrentUser(null);
    saveUserProfile(null);
    setCart([]);
    setLikedProductIds([]);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(ITEMS_PER_PAGE);
    if (q) addSearchTerm(q);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
    const el = document.getElementById('all-products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      {/* Dynamic SEO & OpenGraph & Schema.org JSON-LD */}
      <SEOHead
        settings={settings}
        activeProduct={activeProduct}
        searchQuery={searchQuery}
      />

      {/* Main Header & Search */}
      <Navbar
        settings={settings}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        cartCount={cartTotalCount}
        likedCount={likedProductIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
      />

      {/* Hero Event Banner & Categories Sidebar (Only on full view or home) */}
      {!searchQuery && (
        <HeroBanner
          banners={banners}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}

      {/* Flash Sale Countdown & Deals Strip */}
      {!searchQuery && selectedCategory === 'সকল ক্যাটাগরি' && (
        <FlashSale
          products={products}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleLike={handleToggleLike}
          isLiked={(id) => likedProductIds.includes(id)}
        />
      )}

      {/* Main Products Grid & Search Results Section */}
      <main id="all-products" className="max-w-7xl mx-auto px-4 mt-6 flex-1 w-full">
        {/* Section Header with Controls */}
        <div className="bg-white rounded-xl p-3 md:p-4 mb-4 border border-gray-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#F85606]" />
            <h2 className="font-extrabold text-sm md:text-base text-gray-900">
              {searchQuery
                ? `"${searchQuery}" এর জন্য ফলাফল (${filteredProducts.length} টি পণ্য পাওয়া গেছে)`
                : selectedCategory === 'সকল ক্যাটাগরি'
                ? 'সকল প্রোডাক্ট ও আজকের কালেকশন'
                : `${selectedCategory} (${filteredProducts.length})`}
            </h2>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 hidden sm:inline">সাজান:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs py-1.5 px-2.5 focus:outline-none bg-transparent cursor-pointer font-medium text-gray-700"
              >
                <option value="recommended">দারাজ প্রস্তাবিত</option>
                <option value="popular">সর্বাধিক জনপ্রিয় ও ক্লিক</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-3.5">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onToggleLike={handleToggleLike}
                isLiked={likedProductIds.includes(product.id)}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-200 shadow-xs flex flex-col items-center justify-center my-6 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Database className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>রিয়েল Supabase ডাটাবেস মোড সক্রিয়</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              সকল ডেমো ও ফেক ডাটা অপসারিত হয়েছে
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-2 max-w-md leading-relaxed">
              আপনার অনুরোধ অনুযায়ী সব ডেমো ডাটা ও ফেক অ্যাকাউন্ট মুছে ফেলা হয়েছে। এখন এই শপ সরাসরি আপনার আসল Supabase ডাটাবেস থেকে ডাটা লোড করে।
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-5 py-2.5 bg-[#F85606] hover:bg-[#e04b03] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>এডমিন প্যানেলে আসল প্রোডাক্ট যোগ করুন</span>
              </button>
              <button
                onClick={refreshData}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ডাটাবেস রিফ্রেশ করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs flex flex-col items-center justify-center my-6">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-800">কোন প্রোডাক্ট খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোন পণ্য পাওয়া যায়নি। দয়া করে অন্য কিওয়ার্ড বা ক্যাটাগরি দিয়ে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('সকল ক্যাটাগরি');
              }}
              className="mt-4 px-4 py-2 bg-[#F85606] text-white text-xs font-bold rounded-lg hover:bg-[#e04b03]"
            >
              সকল প্রোডাক্ট দেখুন
            </button>
          </div>
        )}

        {/* Infinite Loading Indicator / Sentinel */}
        {visibleCount < filteredProducts.length && (
          <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#F85606]" />
              <span>আরও প্রোডাক্ট লোড হচ্ছে... ({visibleCount} / {filteredProducts.length})</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={mobileTab}
        onSelectTab={(tab) => setMobileTab(tab)}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCategories={() => setIsMenuOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleLike={handleToggleLike}
        isLiked={activeProduct ? likedProductIds.includes(activeProduct.id) : false}
        onSelectTag={(tag) => handleSearchChange(tag)}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        likedProducts={likedProducts}
        onAddToCart={handleAddToCart}
        onRemoveLike={handleToggleLike}
        onProductClick={handleProductClick}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        cartItems={cart}
        likedCount={likedProductIds.length}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={handleCategorySelect}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
        banners={banners}
        onUpdateBanners={setBanners}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
