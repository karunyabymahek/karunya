import React from 'react';
import { Logo } from './Logo';
import { StudioSettings } from '../types';
import { Sparkles, ArrowUpRight, Instagram, MessageCircle, Mail } from 'lucide-react';

interface FooterProps {
  settings: StudioSettings;
  onExplore: () => void;
  onCustomOrder: () => void;
  onSelectCategory: (category: string) => void;
  onOpenPolicy: (policyKey: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onExplore,
  onCustomOrder,
  onSelectCategory,
  onOpenPolicy,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#1E1114] text-[#F5EFE9] pt-20 pb-12 border-t border-[#5A0F26]/30">
      {/* 1. Closing Campaign Statement & Signature Moment */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 border-b border-[#F5EFE9]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C48A8C] font-semibold block">
              The Atelier Signature
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F5EFE9] leading-[1.1]">
              A universe where quiet artistry meets intentional, expressive craft.
            </h2>
            {/* The Brand Signature — Playful & Recognisable Moment */}
            <div className="pt-2">
              <span className="inline-block font-editorial italic text-xl sm:text-2xl text-[#C48A8C]">
                “Hello, my Calm Chaos Baby 🌻”
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#721532] transition-colors text-center cursor-pointer"
            >
              Explore Full Collection
            </button>
            <button
              onClick={onCustomOrder}
              className="px-6 py-3.5 border border-[#F5EFE9]/25 text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F5EFE9]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Commission Custom Piece</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Structured Footer Links */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-[#F5EFE9]/10 text-xs text-[#F5EFE9]/70 font-light">
        {/* Brand identity column */}
        <div className="lg:col-span-4 space-y-4">
          <Logo size="md" variant="cream" />
          <p className="max-w-sm text-xs text-[#F5EFE9]/60 leading-relaxed pt-2">
            Karunya by Mahek is an independent, multidisciplinary handmade art house. Sculptural crochet flora, heavy impasto canvases, bespoke stone décor, and collectible creations crafted with authentic human dedication.
          </p>
          <div className="pt-2 text-[11px] text-[#C48A8C] font-mono">
            {settings.studioLocation || 'Ahmedabad / Mumbai, India'}
          </div>
        </div>

        {/* Categories column */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-editorial text-sm uppercase tracking-widest text-[#F5EFE9] font-medium">
            The Disciplines
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onSelectCategory('Crochet creations')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Crochet Creations & Flora
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Art and paintings')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Art, Canvas & Paintings
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Bouquets and floral gifts')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Bouquets & Floral Gifts
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Handmade décor and trays')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Handmade Décor & Trays
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Wearables')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Wearables & Heirloom Knits
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Plushies and stuffed toys')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Plushies & Soft Sculpture
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectCategory('Books, writing and stationery')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Stationery & Hand-Bound Books
              </button>
            </li>
          </ul>
        </div>

        {/* Policies column */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-editorial text-sm uppercase tracking-widest text-[#F5EFE9] font-medium">
            Atelier Policies
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onOpenPolicy('shipping')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Shipping & Delivery Fee
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('payment')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Advance Payment (No COD)
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('returns')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Cancellations & Final Sale
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('privacy')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Privacy & Data Security
              </button>
            </li>
            <li>
              <button
                onClick={() => onOpenPolicy('terms')}
                className="hover:text-[#F5EFE9] transition-colors cursor-pointer"
              >
                Terms of Atelier Service
              </button>
            </li>
          </ul>
        </div>

        {/* Studio Contact / Social Coordinates */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-editorial text-sm uppercase tracking-widest text-[#F5EFE9] font-medium">
            Direct Studio
          </h4>
          <div className="space-y-2.5">
            {settings.instagramHandle ? (
              <a
                href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#C48A8C] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@{settings.instagramHandle.replace('@', '')}</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-[#F5EFE9]/40">
                <Instagram className="w-3.5 h-3.5" />
                <span className="italic">Instagram (Set in Admin)</span>
              </div>
            )}

            {settings.whatsappNumber ? (
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#C48A8C] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-[#F5EFE9]/40">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="italic">WhatsApp (Set in Admin)</span>
              </div>
            )}

            {settings.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 hover:text-[#C48A8C] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{settings.contactEmail}</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-[#F5EFE9]/40">
                <Mail className="w-3.5 h-3.5" />
                <span className="italic">Email (Set in Admin)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Admin Access */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EFE9]/40 gap-4">
        <p>© {new Date().getFullYear()} Karunya by Mahek. All rights reserved. Handcrafted in India.</p>
        <div className="flex items-center gap-6">
          <span className="text-[11px] tracking-widest uppercase">
            No COD · Advance Settlement · Final Sale
          </span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-[#C48A8C] transition-colors text-[11px] uppercase tracking-wider underline underline-offset-4 cursor-pointer"
          >
            Studio Admin
          </button>
        </div>
      </div>
    </footer>
  );
};
