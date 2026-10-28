import React, { useState, useEffect } from 'react';
import { Product, CartItem, StudioSettings, ProductCategory } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { ArtistStory } from './components/ArtistStory';
import { PolicyModal } from './components/PolicyModal';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Sparkles, ArrowRight, SlidersHorizontal, Check } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals & Navigation state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCustomOrderOpen, setIsCustomOrderOpen] = useState<boolean>(false);
  const [customOrderPreselect, setCustomOrderPreselect] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState<boolean>(false);
  const [policyKey, setPolicyKey] = useState<string>('shipping');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('kbm_admin_token');
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('kbm_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Studio Settings state
  const [settings, setSettings] = useState<StudioSettings>({
    whatsappNumber: '',
    instagramHandle: '',
    contactEmail: '',
    studioLocation: 'Ahmedabad / Mumbai, India',
  });

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kbm_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart:', e);
    }
  }, [cart]);

  // Load products & settings
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  // Cart actions
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    variation?: string,
    customNotes?: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.selectedVariation === variation
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (customNotes) updated[existingIdx].customNotes = customNotes;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity,
            selectedVariation: variation,
            customNotes,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to shopping bag.`);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variation: string | undefined,
    delta: number
  ) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.selectedVariation === variation) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, variation: string | undefined) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedVariation === variation)
      )
    );
  };

  // Filtered & Sorted Products
  const displayedProducts = products
    .filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: featured first, then new
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

  // Admin login handlers
  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    sessionStorage.setItem('kbm_admin_token', token);
    setIsAdminLoginOpen(false);
    showToast('Administrator authenticated. Welcome to Studio Console.');
  };

  const handleAdminLogout = () => {
    if (adminToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    sessionStorage.removeItem('kbm_admin_token');
    showToast('Logged out of Studio Console.');
  };

  // If admin is active, render full Admin Dashboard view
  if (adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
        onRefreshProducts={fetchProducts}
      />
    );
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5EFE9] text-[#1E1114] flex flex-col selection:bg-[#5A0F26] selection:text-[#F5EFE9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1114] text-[#F5EFE9] px-5 py-3 border border-[#C48A8C]/40 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-[#C5A059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Strict 3-zone Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCustomOrder={() => {
          setCustomOrderPreselect(null);
          setIsCustomOrderOpen(true);
        }}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onNavigateHome={() => setSelectedCategory('all')}
        onOpenPolicy={(key) => {
          setPolicyKey(key);
          setIsPolicyOpen(true);
        }}
      />

      {/* Campaign-style Hero Section */}
      <Hero
        onExplore={() => {
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onCustomOrder={() => {
          setCustomOrderPreselect(null);
          setIsCustomOrderOpen(true);
        }}
      />

      {/* Editorial House Introduction */}
      <section className="py-20 px-6 sm:px-8 max-w-5xl mx-auto text-center border-t border-[#1E1114]/10">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C48A8C] font-semibold block mb-3">
          The Manifesto
        </span>
        <h2 className="font-editorial text-2xl sm:text-4xl text-[#1E1114] font-light leading-snug tracking-tight mb-6">
          “We reject mass reproduction. Every creation is an intimate encounter with texture, color, and slow, deliberate human hands.”
        </h2>
        <div className="flex items-center justify-center gap-4 text-xs text-[#1E1114]/60 tracking-widest uppercase">
          <span>Crochet Couture</span>
          <span>·</span>
          <span>Fine Art & Canvas</span>
          <span>·</span>
          <span>Sculpted Décor</span>
          <span>·</span>
          <span>Bespoke Keepsakes</span>
        </div>
      </section>

      {/* All 8 Disciplines Visual Category Navigator */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* The Main Collection Grid Section */}
      <section id="collection" className="py-12 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-[#1E1114]/10">
        {/* Section Header with Filter / Sort Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#C48A8C] font-semibold block mb-2">
              Atelier Catalogue
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#1E1114] font-medium tracking-tight">
              {selectedCategory === 'all' ? 'All Handcrafted Creations' : selectedCategory}
            </h2>
          </div>

          {/* Sorter & Filter Indicator */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#1E1114]/60 hidden sm:inline">
              Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'Study' : 'Studies'}
            </span>

            <div className="flex items-center gap-2 border border-[#1E1114]/15 bg-white/70 px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5A0F26]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#1E1114] focus:outline-none cursor-pointer"
              >
                <option value="featured">Curated & Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-[#1E1114]/60 space-y-2">
            <span className="font-editorial text-2xl text-[#5A0F26] italic">
              Loading Atelier Archive...
            </span>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#1E1114]/20 p-12 bg-[#EAE3DB]/30 space-y-4">
            <h3 className="font-editorial text-2xl italic text-[#1E1114]/60">
              No creations currently listed under this discipline.
            </h3>
            <p className="text-xs text-[#1E1114]/70 max-w-sm mx-auto font-light">
              You may commission a bespoke piece in this category or view our other atelier disciplines.
            </p>
            <button
              onClick={() => {
                setCustomOrderPreselect(null);
                setIsCustomOrderOpen(true);
              }}
              className="px-6 py-3 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-widest font-medium hover:bg-[#3E0818] transition-colors"
            >
              Commission Bespoke Piece
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
                onQuickAdd={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        )}

        {/* View All / Reset Filter Action */}
        {selectedCategory !== 'all' && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#1E1114]/20 text-[#1E1114] text-xs uppercase tracking-widest hover:border-[#5A0F26] hover:text-[#5A0F26] transition-colors cursor-pointer"
            >
              <span>View All Disciplines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* The Artist Behind the Work & Behind The Making */}
      <ArtistStory
        onCustomOrder={() => {
          setCustomOrderPreselect(null);
          setIsCustomOrderOpen(true);
        }}
      />

      {/* Commission Callout Banner */}
      <section className="py-20 px-6 sm:px-8 bg-[#5A0F26] text-[#F5EFE9]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C48A8C] font-semibold block">
            Bespoke Commissions
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-[#F5EFE9]">
            Have an Idea Waiting to be Born into Thread, Canvas or Stone?
          </h2>
          <p className="text-sm sm:text-base text-[#F5EFE9]/80 font-light max-w-2xl mx-auto leading-relaxed">
            From heirloom bridal bouquets crafted to last lifetimes, to personalized birth-flower shadowboxes and textured art canvases tailored to your interiors.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setCustomOrderPreselect(null);
                setIsCustomOrderOpen(true);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F5EFE9] text-[#5A0F26] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.2)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Submit Custom Commission Brief</span>
            </button>
          </div>
        </div>
      </section>

      {/* Closing Footer with brand signature */}
      <Footer
        settings={settings}
        onExplore={() => {
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onCustomOrder={() => {
          setCustomOrderPreselect(null);
          setIsCustomOrderOpen(true);
        }}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenPolicy={(key) => {
          setPolicyKey(key);
          setIsPolicyOpen(true);
        }}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, variation, notes) => {
          handleAddToCart(prod, qty, variation, notes);
          setSelectedProduct(null);
        }}
        onRequestCustomization={(prod) => {
          setSelectedProduct(null);
          setCustomOrderPreselect(prod);
          setIsCustomOrderOpen(true);
        }}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          const el = document.getElementById('collection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderNum) => {
          setCart([]); // Clear cart upon successful order request logging
        }}
      />

      {/* 4. Custom Order Modal */}
      <CustomOrderModal
        isOpen={isCustomOrderOpen}
        preselectedProduct={customOrderPreselect}
        onClose={() => {
          setIsCustomOrderOpen(false);
          setCustomOrderPreselect(null);
        }}
        onSuccess={(enqNum) => {}}
      />

      {/* 5. Policy Modal */}
      <PolicyModal
        isOpen={isPolicyOpen}
        initialPolicyKey={policyKey}
        onClose={() => setIsPolicyOpen(false)}
      />

      {/* 6. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          setSelectedProduct(p);
        }}
      />

      {/* 7. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
