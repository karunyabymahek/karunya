import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ArtistStoryProps {
  onCustomOrder: () => void;
}

export const ArtistStory: React.FC<ArtistStoryProps> = ({ onCustomOrder }) => {
  return (
    <section id="artist" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-[#1E1114]/10">
      {/* 1. The Artist Behind the Work */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Atmospheric Art Direction Studio Portrait / Composition */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[3/4] bg-[#EAE3DB] overflow-hidden border border-[#1E1114]/15 shadow-[0_12px_40px_rgba(30,17,20,0.06)]">
            <img
              src="/src/assets/images/category_crochet_couture_1793124077750.jpg"
              alt="Atelier workspace and tactile materials by Mahek"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Caption */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#1E1114]/90 via-[#1E1114]/40 to-transparent text-[#F5EFE9]">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C]">The Maker</p>
              <h3 className="font-editorial text-2xl font-medium">Mahek</h3>
              <p className="text-xs text-[#F5EFE9]/70 font-light mt-0.5">
                Founder, Multidisciplinary Artist & Creative Director
              </p>
            </div>
          </div>
          {/* Subtle Accent Frame */}
          <div className="hidden sm:block absolute -bottom-4 -left-4 w-32 h-32 border border-[#5A0F26]/30 -z-10" />
        </div>

        {/* Right: Personal & Confident Artist Prose */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#C48A8C] font-semibold block">
              The Creative Mind
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#1E1114] font-medium leading-tight">
              One Creative House, Infinite Tactile Forms.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#1E1114]/80 font-light leading-relaxed">
            Karunya was founded by Mahek not as a conventional craft store, but as a deliberate
            luxury atelier where distinct tactile disciplines unite under a single aesthetic philosophy.
          </p>

          <p className="text-sm sm:text-base text-[#1E1114]/80 font-light leading-relaxed">
            From millimeter-precise crochet needlework that turns Egyptian cotton into everlasting
            sculptural flora, to heavy palette-knife impasto paintings layered with mineral pigments
            and antique leaf, each work is an exploration of patience, form, and unhurried individuality.
          </p>

          {/* Pillars Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#1E1114]/10 text-xs">
            <div>
              <span className="font-editorial text-base text-[#5A0F26] block font-medium mb-1">
                Zero Mass Production
              </span>
              <p className="text-[#1E1114]/70 font-light leading-relaxed">
                Every stem, canvas, tray, and garment is fashioned individually without industrial shortcuts.
              </p>
            </div>
            <div>
              <span className="font-editorial text-base text-[#5A0F26] block font-medium mb-1">
                Material Authenticity
              </span>
              <p className="text-[#1E1114]/70 font-light leading-relaxed">
                Raw travertine, combed mercerised threads, Australian merino, and heavy body pigments.
              </p>
            </div>
            <div>
              <span className="font-editorial text-base text-[#5A0F26] block font-medium mb-1">
                Direct Dialogue
              </span>
              <p className="text-[#1E1114]/70 font-light leading-relaxed">
                Personal consultation with Mahek for all bespoke commissions, colorways, and sizes.
              </p>
            </div>
          </div>

          {/* Commission CTA */}
          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={onCustomOrder}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discuss a Custom Commission</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Behind The Making Section */}
      <div className="mt-24 pt-16 border-t border-[#1E1114]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#C48A8C] font-semibold block mb-2">
              Atelier Archive
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-[#1E1114] font-medium">
              Behind the Making
            </h3>
          </div>
          <p className="text-xs text-[#1E1114]/60 max-w-md font-light mt-2 md:mt-0">
            A glimpse into the tactile rhythm, raw materials, and precision that define Karunya creations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group border border-[#1E1114]/10 p-5 bg-[#EAE3DB]/30 space-y-4">
            <div className="aspect-[4/3] bg-[#EAE3DB] overflow-hidden">
              <img
                src="/src/assets/images/category_crochet_couture_1793124077750.jpg"
                alt="Intricate thread needlework"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C48A8C] font-semibold">
                Study 01 · Fiber & Form
              </p>
              <h4 className="font-editorial text-lg text-[#1E1114]">Sculpting with the Needle</h4>
              <p className="text-xs text-[#1E1114]/70 font-light leading-relaxed">
                Rather than flat patterns, petals are hand-sculpted in concentric micro-ribs to capture the organic gravity of blooming flora.
              </p>
            </div>
          </div>

          <div className="group border border-[#1E1114]/10 p-5 bg-[#EAE3DB]/30 space-y-4">
            <div className="aspect-[4/3] bg-[#EAE3DB] overflow-hidden">
              <img
                src="/src/assets/images/category_textured_art_1793124079272.jpg"
                alt="Palette knife impasto technique"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C48A8C] font-semibold">
                Study 02 · Mineral Pigments
              </p>
              <h4 className="font-editorial text-lg text-[#1E1114]">Heavy Relief Topography</h4>
              <p className="text-xs text-[#1E1114]/70 font-light leading-relaxed">
                Heavy body oils blended with textured mineral medium, applied with flexible steel knives and hand-applied antique metal leaf.
              </p>
            </div>
          </div>

          <div className="group border border-[#1E1114]/10 p-5 bg-[#EAE3DB]/30 space-y-4">
            <div className="aspect-[4/3] bg-[#EAE3DB] overflow-hidden">
              <img
                src="/src/assets/images/category_decor_trays_1793124079957.jpg"
                alt="Organic tray casting and mineral seal"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#C48A8C] font-semibold">
                Study 03 · Stone & Flame
              </p>
              <h4 className="font-editorial text-lg text-[#1E1114]">Organic Mineral Objects</h4>
              <p className="text-xs text-[#1E1114]/70 font-light leading-relaxed">
                Hand-cured mineral composite platters with broken travertine silhouettes, sealed with pure beeswax for a soft satin patina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
