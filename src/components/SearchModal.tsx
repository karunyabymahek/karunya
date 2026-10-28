import React, { useState } from 'react';
import { Product } from '../types';
import { X, Search, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  products,
  onClose,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materials?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-start justify-center p-4 pt-20 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#F5EFE9] border border-[#1E1114]/20 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1E1114]/60 hover:text-[#5A0F26]"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creations, flora, impasto canvases, materials..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] text-sm text-[#1E1114] placeholder:text-[#1E1114]/40 focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#1E1114]/40 absolute left-3.5 top-3.5" />
        </div>

        {/* Results */}
        {query.trim() === '' ? (
          <div className="text-xs text-[#1E1114]/60 space-y-2 py-4">
            <span className="font-editorial text-sm italic text-[#5A0F26] block">
              Suggested Explorations:
            </span>
            <div className="flex flex-wrap gap-2">
              {['Crochet rose', 'Impasto canvas', 'Travertine tray', 'Merino cardigan', 'Shadowbox', 'Journal'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-[#EAE3DB] hover:bg-[#5A0F26] hover:text-white transition-colors text-[11px]"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[#1E1114]/60 py-8 text-center italic">
            No creations found matching "{query}". Try another search term or commission a bespoke study.
          </p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider text-[#C48A8C] font-semibold">
              {filtered.length} {filtered.length === 1 ? 'Study Found' : 'Studies Found'}
            </span>
            <div className="divide-y divide-[#1E1114]/10">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 p-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-12 h-14 object-cover border border-[#1E1114]/10"
                    />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#C48A8C]">
                        {product.category}
                      </p>
                      <h4 className="font-editorial text-base text-[#1E1114] leading-snug">
                        {product.name}
                      </h4>
                      <p className="font-mono text-xs font-semibold text-[#5A0F26] tabular-nums mt-0.5">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <span className="text-[#5A0F26] text-xs flex items-center gap-1 font-medium">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
