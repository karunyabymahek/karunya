import React from 'react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORIES: {
  id: ProductCategory;
  title: string;
  tagline: string;
  previewImage: string;
  description: string;
}[] = [
  {
    id: 'Crochet creations',
    title: 'Crochet Couture',
    tagline: 'Sculptural Flora & Keepsakes',
    previewImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    description: 'Fine mercerised cotton botanicals, delicate rose brooches, heirloom rakhis, and tactile accessories.',
  },
  {
    id: 'Art and paintings',
    title: 'Art & Paintings',
    tagline: 'Impasto Canvas & Texture',
    previewImage: '/src/assets/images/category_textured_art_1793124079272.jpg',
    description: 'Original textured canvases, heavy palette-knife impasto studies, sculptural reliefs, and fine portraits.',
  },
  {
    id: 'Bouquets and floral gifts',
    title: 'Botanical Bouquets',
    tagline: 'Everlasting Stems & Stems',
    previewImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    description: 'Permanent botanical arrangements tied in raw linen, hand-knitted dahlias, peonies, and wild eucalyptus.',
  },
  {
    id: 'Handmade décor and trays',
    title: 'Décor & Trays',
    tagline: 'Sculpted Stone & Brass',
    previewImage: '/src/assets/images/category_decor_trays_1793124079957.jpg',
    description: 'Hand-formed mineral composite trays, raw travertine edges, organic leaf gilding, and artisanal vessels.',
  },
  {
    id: 'Wearables',
    title: 'Wearables',
    tagline: 'Heirloom Knitwear & Collars',
    previewImage: '/src/assets/images/hero_atelier_creations_1793124077093.jpg',
    description: 'Chunky merino cardigans, hand-crocheted vintage collars, and tailored textile garments.',
  },
  {
    id: 'Plushies and stuffed toys',
    title: 'Collectible Plushies',
    tagline: 'Artisanal Jointed Soft Sculpture',
    previewImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    description: 'Individually sculpted heirloom mohair bears, hand-embroidered details, and velvet-collared companions.',
  },
  {
    id: 'Books, writing and stationery',
    title: 'Stationery & Journals',
    tagline: 'Cotton Rag & Wax Seals',
    previewImage: '/src/assets/images/category_decor_trays_1793124079957.jpg',
    description: 'Deckle-edge handmade cotton paper journals, long-stitch bindings, and signature wax seal impressions.',
  },
  {
    id: 'Personalised gifts and other creative pieces',
    title: 'Personalised Pieces',
    tagline: 'Shadowboxes & Monograms',
    previewImage: '/src/assets/images/category_textured_art_1793124079272.jpg',
    description: 'Bespoke milestone tributes, custom birth-flower shadowboxes, and intimate commissioned keepsakes.',
  },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-20 px-6 sm:px-8 max-w-7xl mx-auto border-t border-[#1E1114]/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C48A8C] font-semibold block mb-2">
            The Eight Disciplines
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#1E1114] tracking-tight font-medium">
            Curated Categories
          </h2>
        </div>
        <p className="text-sm text-[#1E1114]/70 max-w-md font-light leading-relaxed">
          Each medium explores tactile expression under one unified luxury house. Select a
          discipline to focus the atelier collection.
        </p>
      </div>

      {/* Filter Tabs Bar (Horizontal clean scrollable bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#1E1114]/10">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer focus:outline-none ${
            selectedCategory === 'all'
              ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
              : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
          }`}
        >
          All Disciplines
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer focus:outline-none ${
              selectedCategory === cat.id
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Visual Editorial Category Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group cursor-pointer p-5 transition-all duration-300 border ${
                isSelected
                  ? 'border-[#5A0F26] bg-[#5A0F26]/5 shadow-[0_8px_30px_rgba(90,15,38,0.06)]'
                  : 'border-[#1E1114]/10 bg-transparent hover:border-[#5A0F26]/40 hover:bg-[#F5EFE9]'
              }`}
            >
              {/* Category Image */}
              <div className="overflow-hidden aspect-[4/3] bg-[#EAE3DB] mb-4 relative">
                <img
                  src={cat.previewImage}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 text-[9px] font-mono tracking-widest px-2 py-0.5 bg-[#1E1114]/80 text-[#F5EFE9]">
                  0{idx + 1}
                </span>
              </div>

              {/* Category Metadata */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C48A8C] font-medium">
                  {cat.tagline}
                </p>
                <h3 className="font-editorial text-xl text-[#1E1114] group-hover:text-[#5A0F26] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#1E1114]/70 font-light line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* View Action Link */}
              <div className="pt-3 mt-3 border-t border-[#1E1114]/10 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#5A0F26]">
                <span>Filter Category</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
