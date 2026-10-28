import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import heroAtelierImage from '../assets/images/hero_atelier_creations_1793124077093.jpg';

interface HeroProps {
  onExplore: () => void;
  onCustomOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onCustomOrder }) => {
  return (
    <section className="relative min-h-[auto] lg:min-h-[92vh] flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Top Editorial Kicker */}
      <div className="flex items-center justify-between gap-3 text-[9px] sm:text-xs tracking-[0.16em] sm:tracking-[0.25em] uppercase text-[#1E1114]/60 pt-3 sm:pt-4 pb-4 sm:pb-6 border-b border-[#1E1114]/10">
        <span>Atelier & Multidisciplinary House</span>
        <span>Independent Studio</span>
        <span className="hidden sm:inline">Handcrafted In India</span>
      </div>

      {/* Main Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-14 items-center my-auto py-6 sm:py-8">
        {/* Left Column: Bold Editorial Typography */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#C48A8C] font-semibold">
              The Digital Atelier
            </span>
            <h1
              className="font-editorial text-[2.65rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem] leading-[1.05] tracking-tight text-[#1E1114] font-medium"
              style={{ textWrap: 'balance' }}
            >
              Art, Beyond the <span className="italic font-normal text-[#5A0F26]">Ordinary.</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[#1E1114]/75 font-light leading-relaxed max-w-xl">
            A unified creative house by Mahek where sculptural crochet couture, high-relief oil
            canvases, botanical keepsakes, and collectible curiosities coexist in deliberate harmony.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onExplore}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-[#3E0818] hover:shadow-[0_8px_30px_rgba(90,15,38,0.25)] cursor-pointer"
            >
              <span>Explore Collection</span>
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>

            <button
              onClick={onCustomOrder}
              className="inline-flex items-center justify-center px-8 py-4 border border-[#5A0F26]/30 text-[#5A0F26] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:border-[#5A0F26] hover:bg-[#5A0F26]/5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 opacity-70" />
              <span>Commission Custom Piece</span>
            </button>
          </div>

          {/* Micro-policy trust notice */}
          <div className="pt-2 sm:pt-4 flex items-start gap-3 text-[10px] sm:text-xs leading-relaxed text-[#1E1114]/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C48A8C]" />
            <span>Full advance settlement required · No COD · Tailored with personal precision</span>
          </div>
        </div>

        {/* Right Column: Hero Visual Masterpiece */}
        <div className="lg:col-span-6 relative">
          <div className="relative group overflow-hidden bg-[#EAE3DB] shadow-[0_20px_60px_rgba(30,17,20,0.08)]">
            {/* The Authentic Atelier Still-Life */}
            <img
              src={heroAtelierImage}
              alt="Atelier creations by Mahek: handcrafted crochet rose, textured oil painting, and sculpted travertine tray"
              className="w-full h-[320px] xs:h-[360px] sm:h-[540px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              loading="eager"
            />

            {/* Subtle Editorial Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-[#1E1114]/85 via-[#1E1114]/40 to-transparent flex items-end justify-between text-[#F5EFE9]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C]">Atelier Still-Life</p>
                <p className="font-editorial text-lg italic">Texture, Thread & Stone</p>
              </div>
              <span className="text-[11px] font-mono tracking-widest text-[#F5EFE9]/70">
                100% HANDMADE
              </span>
            </div>
          </div>

          {/* Floating Subtle Corner Accent */}
          <div className="hidden sm:block absolute -top-4 -right-4 w-24 h-24 border border-[#C48A8C]/40 -z-10" />
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="pt-4 sm:pt-6 border-t border-[#1E1114]/10 flex items-center justify-between gap-3 text-xs text-[#1E1114]/50">
        <span className="font-mono text-[11px]">VOL. 2026 // ATELIER EDITION</span>
        <button
          onClick={onExplore}
          className="flex items-center gap-2 hover:text-[#5A0F26] transition-colors cursor-pointer group"
          aria-label="Scroll down to view collection"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll to Discover</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
        </button>
      </div>
    </section>
  );
};
