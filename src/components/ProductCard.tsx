import React from 'react';
import { Product } from '../types';
import { Sparkles, Eye, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const isAvailable = product.availability !== 'sold-out';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-[#F5EFE9] border border-[#1E1114]/10 hover:border-[#5A0F26]/40 transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/5] bg-[#EAE3DB] overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS fallback
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-[#EAE3DB]');
              const fallback = document.createElement('div');
              fallback.className = 'text-center p-6';
              fallback.innerHTML = `<span class="font-editorial text-xl italic text-[#5A0F26]">${product.name}</span><p class="text-xs text-[#1E1114]/50 mt-1 uppercase tracking-widest">Handmade Atelier Piece</p>`;
              target.parentElement.appendChild(fallback);
            }
          }}
        />

        {/* Status badges - clean text tags only */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.status === 'made-to-order' && (
            <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 bg-[#1E1114]/80 text-[#F5EFE9] backdrop-blur-xs">
              Made to Order
            </span>
          )}
          {product.availability === 'sold-out' && (
            <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 bg-[#5A0F26] text-[#F5EFE9]">
              Sold Out
            </span>
          )}
          {product.isFeatured && (
            <span className="text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 bg-[#C5A059] text-[#1E1114] font-medium">
              Featured Study
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#1E1114]/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex-1 py-2 px-3 bg-[#F5EFE9] text-[#1E1114] hover:bg-white text-[11px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          {isAvailable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              className="py-2 px-3 bg-[#5A0F26] text-[#F5EFE9] hover:bg-[#3E0818] text-[11px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1"
              title="Add to shopping bag"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1">
          {/* Category kicker */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#C48A8C]">
            <span>{product.category}</span>
            {product.customisationAvailable && (
              <span className="text-[10px] font-sans text-[#1E1114]/60 tracking-normal flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
                Bespoke
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-editorial text-lg sm:text-xl text-[#1E1114] group-hover:text-[#5A0F26] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#1E1114]/70 font-light line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Availability Row */}
        <div className="pt-3 border-t border-[#1E1114]/10 flex items-center justify-between text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-base font-semibold text-[#5A0F26]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-mono tabular-nums text-xs text-[#1E1114]/40 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#1E1114]/60 font-light">
            {product.availability === 'sold-out' ? (
              <span className="text-[#5A0F26] font-medium">Sold Out</span>
            ) : product.status === 'made-to-order' ? (
              <span>Handcrafted on Order</span>
            ) : (
              <span className="text-[#2F5233]">Ready to Dispatch</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
