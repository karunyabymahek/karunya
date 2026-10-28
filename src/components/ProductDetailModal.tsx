import React, { useState } from 'react';
import { Product } from '../types';
import { X, Sparkles, Check, Clock, Truck, ShieldAlert, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variation?: string, customNotes?: string) => void;
  onRequestCustomization: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onRequestCustomization,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);
  const [selectedVariation, setSelectedVariation] = useState<string>(
    product.variations && product.variations.length > 0 ? product.variations[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);

  const allImages = [product.mainImage, ...(product.additionalImages || [])].filter(Boolean);
  const isAvailable = product.availability !== 'sold-out';

  const handleAdd = () => {
    if (!isAvailable) return;
    onAddToCart(product, quantity, selectedVariation, customNotes);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#F5EFE9] border border-[#1E1114]/15 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#F5EFE9]/90 hover:bg-[#5A0F26] hover:text-[#F5EFE9] text-[#1E1114] transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 bg-[#EAE3DB] p-6 flex flex-col justify-between">
            {/* Main Stage Image */}
            <div className="aspect-square w-full overflow-hidden relative shadow-sm border border-[#1E1114]/10 bg-white/50">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-[#1E1114]/80 text-[#F5EFE9] text-[10px] uppercase font-mono tracking-widest px-2.5 py-1">
                {product.status === 'made-to-order' ? 'Handcrafted to Order' : 'Ready Piece'}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#5A0F26] scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Craftsmanship Note */}
            <div className="mt-6 pt-4 border-t border-[#1E1114]/10 text-xs text-[#1E1114]/70 space-y-1">
              <p className="font-editorial text-sm italic text-[#5A0F26]">
                Created in Mahek's Atelier
              </p>
              <p className="font-light text-[11px] leading-relaxed">
                Every piece is executed with authentic, non-mechanised craftsmanship. Subtle variations in texture and pigment verify hand execution.
              </p>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#C48A8C] mb-2">
                <span>{product.category}</span>
                <span className="font-mono text-[10px]">REF: {product.id}</span>
              </div>

              {/* Title */}
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1114] font-medium leading-tight mb-3">
                {product.name}
              </h2>

              {/* Price & Compare */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-[#1E1114]/10">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#5A0F26] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-mono text-sm text-[#1E1114]/40 line-through tabular-nums">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#1E1114]/60 uppercase tracking-widest ml-auto">
                  + Shipping
                </span>
              </div>

              {/* Detailed Description */}
              <div className="py-4 space-y-4 text-xs sm:text-sm text-[#1E1114]/80 leading-relaxed font-light">
                <p>{product.detailedDescription || product.shortDescription}</p>

                {/* Technical Specifications */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#EAE3DB]/50 border border-[#1E1114]/5 text-xs">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#1E1114]/50">
                      Materials
                    </span>
                    <span className="font-medium text-[#1E1114]">{product.materials || 'Pure cotton / mixed media'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#1E1114]/50">
                      Dimensions / Span
                    </span>
                    <span className="font-medium text-[#1E1114]">{product.dimensions || 'Atelier standard'}</span>
                  </div>
                </div>

                {/* Variations Selector */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                      Select Variation / Edition:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variations.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariation(v)}
                          className={`px-3 py-1.5 text-xs transition-all cursor-pointer ${
                            selectedVariation === v
                              ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium shadow-sm'
                              : 'bg-white/80 border border-[#1E1114]/15 text-[#1E1114] hover:border-[#5A0F26]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Custom Inscription/Notes */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Gift Note / Custom Request:
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g., Include handwritten calligraphy note for Ananya"
                    className="w-full px-3 py-2 text-xs bg-white/70 border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Delivery & Timeline Notice */}
              <div className="space-y-2 pt-2 pb-4 text-xs text-[#1E1114]/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#C48A8C]" />
                  <span>Timeline: {product.estimatedProductionTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#C48A8C]" />
                  <span>Shipping: {product.shippingNotes}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5A0F26]">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">Advance payment only · No COD · No cancellations or returns</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="space-y-3 pt-4 border-t border-[#1E1114]/10">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                {isAvailable && (
                  <div className="flex items-center border border-[#1E1114]/20 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3 text-xs hover:bg-[#F5EFE9] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-3 text-xs font-mono font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3 text-xs hover:bg-[#F5EFE9] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!isAvailable}
                  className={`flex-1 py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isAddedFeedback
                      ? 'bg-[#2F5233] text-white'
                      : isAvailable
                      ? 'bg-[#5A0F26] text-[#F5EFE9] hover:bg-[#3E0818] shadow-[0_4px_20px_rgba(90,15,38,0.2)]'
                      : 'bg-[#1E1114]/20 text-[#1E1114]/40 cursor-not-allowed'
                  }`}
                >
                  {isAddedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : isAvailable ? (
                    <span>Add to Shopping Bag</span>
                  ) : (
                    <span>Currently Unavailable</span>
                  )}
                </button>
              </div>

              {/* Bespoke Commission Alternative */}
              {product.customisationAvailable && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestCustomization(product);
                  }}
                  className="w-full py-2.5 px-4 border border-[#C48A8C] text-[#5A0F26] text-[11px] uppercase tracking-wider font-medium hover:bg-[#C48A8C]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Custom Adaptation of this Piece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
