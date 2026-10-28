import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variation: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variation: string | undefined) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1E1114]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#F5EFE9] h-full shadow-2xl flex flex-col justify-between border-l border-[#1E1114]/15 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1E1114]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold block">
              Karunya Atelier
            </span>
            <h2 className="font-editorial text-2xl text-[#1E1114] font-medium">
              Your Shopping Bag
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#1E1114]/70 hover:text-[#5A0F26] transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <span className="font-editorial text-2xl italic text-[#1E1114]/50">
                Your bag is presently empty.
              </span>
              <p className="text-xs text-[#1E1114]/70 max-w-xs font-light">
                Explore our fine crochet couture, original textured canvases, or bespoke botanical keepsakes.
              </p>
              <button
                onClick={onContinueShopping}
                className="mt-4 px-6 py-3 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-widest font-medium hover:bg-[#3E0818] transition-colors cursor-pointer"
              >
                Discover Creations
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#1E1114]/10">
              {items.map((item, idx) => (
                <div key={`${item.productId}-${item.selectedVariation || ''}-${idx}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#EAE3DB] shrink-0 overflow-hidden border border-[#1E1114]/10">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-editorial text-base text-[#1E1114] leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.productId, item.selectedVariation)}
                          className="text-[#1E1114]/40 hover:text-[#5A0F26] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedVariation && (
                        <p className="text-[11px] text-[#C48A8C] mt-0.5">
                          Edition: {item.selectedVariation}
                        </p>
                      )}

                      {item.customNotes && (
                        <p className="text-[10px] text-[#1E1114]/60 italic mt-0.5 line-clamp-1">
                          Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#1E1114]/20 bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.selectedVariation, -1)}
                          className="px-2 py-1 text-xs hover:bg-[#F5EFE9] text-[#1E1114] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.productId, item.selectedVariation, 1)}
                          className="px-2 py-1 text-xs hover:bg-[#F5EFE9] text-[#1E1114] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-mono text-sm font-semibold text-[#5A0F26] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#1E1114]/10 bg-[#EAE3DB]/40 space-y-4">
            {/* Calculation Lines */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#1E1114]/80">
                <span>Creations Subtotal</span>
                <span className="font-mono font-semibold tabular-nums text-sm">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#1E1114]/60">
                <span>Shipping & Delivery Fee</span>
                <span className="italic text-[11px] text-[#5A0F26]">
                  Calculated upon address verification
                </span>
              </div>
              <p className="text-[11px] text-[#1E1114]/60 leading-normal pt-1">
                Shipping is determined strictly by delivery destination and parcel weight, then confirmed prior to advance settlement.
              </p>
            </div>

            {/* Mandatory Policy Pill Reminder */}
            <div className="p-3 bg-[#5A0F26]/5 border border-[#5A0F26]/20 text-[11px] text-[#5A0F26] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Atelier Policy:</strong> Full advance payment required · No cash on delivery · No cancellations, returns, or exchanges.
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 px-6 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-all shadow-[0_4px_20px_rgba(90,15,38,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Order Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
