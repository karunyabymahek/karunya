import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Lock, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenCustomOrder: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (category: string) => void;
  onNavigateHome: () => void;
  onOpenPolicy: (policyKey: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenCustomOrder,
  onOpenAdmin,
  onSelectCategory,
  onNavigateHome,
  onOpenPolicy,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'home') {
      onNavigateHome();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F5EFE9]/95 backdrop-blur-md border-b border-[#1E1114]/10 shadow-[0_4px_24px_rgba(30,17,20,0.04)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-2 sm:gap-8">
          {/* Zone 1: Single Brand Lockup (Wordmark in display face) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#5A0F26] p-1 -m-1"
            aria-label="Karunya by Mahek Home"
          >
            <Logo size="sm" variant="burgundy" />
          </button>

          {/* Zone 2: 4-5 Concise Single-line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-[0.16em] text-[#1E1114]/80 font-medium">
            <button
              onClick={() => handleNavClick('collection')}
              className="hover:text-[#5A0F26] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none"
            >
              The Collection
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="hover:text-[#5A0F26] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none"
            >
              Categories
            </button>
            <button
              onClick={onOpenCustomOrder}
              className="hover:text-[#5A0F26] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none"
            >
              Custom Commissions
            </button>
            <button
              onClick={() => handleNavClick('artist')}
              className="hover:text-[#5A0F26] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none"
            >
              The Artist
            </button>
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-[#5A0F26] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer focus:outline-none"
            >
              Policies
            </button>
          </nav>

          {/* Zone 3: Actions — Search, Admin Lock & Primary Shopping Bag Trigger */}
          <div className="flex items-center gap-1 sm:gap-6 shrink-0">
            {/* Public search and shopping controls are hidden while sales are paused. */}

            {/* Discreet Admin Portal Entry */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#1E1114]/40 hover:text-[#5A0F26] transition-colors cursor-pointer focus:outline-none"
              title="Atelier Studio Management"
              aria-label="Private Studio Management"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1E1114] hover:text-[#5A0F26] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-[#F5EFE9] flex flex-col justify-between pt-24 pb-8 px-8 border-b border-[#1E1114]/10 animate-in fade-in duration-200">
          <div className="flex flex-col gap-6 mt-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold">
              Navigation
            </span>
            <button
              onClick={() => handleNavClick('collection')}
              className="text-2xl font-editorial text-left text-[#1E1114] hover:text-[#5A0F26] transition-colors py-1"
            >
              The Collection
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-2xl font-editorial text-left text-[#1E1114] hover:text-[#5A0F26] transition-colors py-1"
            >
              Explore 8 Categories
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCustomOrder();
              }}
              className="text-2xl font-editorial text-left text-[#5A0F26] hover:text-[#3E0818] transition-colors py-1 flex items-center justify-between"
            >
              <span>Custom Commissions</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleNavClick('artist')}
              className="text-2xl font-editorial text-left text-[#1E1114] hover:text-[#5A0F26] transition-colors py-1"
            >
              The Artist / Mahek
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPolicy('shipping');
              }}
              className="text-2xl font-editorial text-left text-[#1E1114] hover:text-[#5A0F26] transition-colors py-1"
            >
              Shipping & Store Policies
            </button>
          </div>

          <div className="pt-6 border-t border-[#1E1114]/10 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-[#1E1114]/70">
              <span>Studio: India (Worldwide Shipping by Enquiry)</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-[#5A0F26] font-medium underline underline-offset-4"
              >
                Admin Area
              </button>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-[#1E1114]/50">
              No COD · Advance Payment Only · Bespoke Artistry
            </p>
          </div>
        </div>
      )}
    </>
  );
};
