import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!policyAccepted) {
      setError('Please review and accept the atelier terms and payment policies to proceed.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        customerNotes,
        policyAccepted,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          variation: i.selectedVariation,
          customNotes: i.customNotes,
          image: i.product.mainImage,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order request');
      }

      setCompletedOrderNumber(data.orderNumber);
      onOrderSuccess(data.orderNumber);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your order request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#F5EFE9] border border-[#1E1114]/15 shadow-2xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#1E1114]/70 hover:text-[#5A0F26] transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrderNumber ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-[#5A0F26]/10 text-[#5A0F26] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold">
                Order Request Recorded
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E1114] font-medium">
                Thank You, {customerName}
              </h2>
              <p className="font-mono text-sm tracking-wider text-[#5A0F26] font-semibold">
                REFERENCE: #{completedOrderNumber}
              </p>
            </div>

            <div className="p-6 bg-[#EAE3DB]/60 border border-[#1E1114]/10 text-left text-xs text-[#1E1114]/80 space-y-3">
              <p className="font-medium text-[#1E1114]">
                Next Steps for Order Confirmation:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-light">
                <li>
                  Mahek will verify the courier feasibility and compute the exact shipping fee for <strong>{city}, {pincode}</strong>.
                </li>
                <li>
                  You will receive a direct message via WhatsApp / Email (<strong>{phone}</strong> / <strong>{email}</strong>) with the complete invoice and secure UPI / Bank payment QR.
                </li>
                <li>
                  Upon receipt of full advance payment, your handcrafted creations will be carefully prepared and dispatched.
                </li>
              </ol>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-colors"
            >
              Return to Atelier
            </button>
          </div>
        ) : (
          /* Order Request Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold block">
                Atelier Order Request
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1114] font-medium">
                Delivery & Contact Information
              </h2>
              <p className="text-xs text-[#1E1114]/70 mt-1 font-light">
                Please provide accurate contact details so Mahek can confirm shipping charges and share advance payment instructions.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Order Summary Recap Strip */}
            <div className="p-4 bg-[#EAE3DB]/50 border border-[#1E1114]/10 flex items-center justify-between text-xs">
              <span className="text-[#1E1114]/70">
                {items.length} {items.length === 1 ? 'Creation' : 'Creations'} in Bag
              </span>
              <span className="font-mono font-semibold text-[#5A0F26] text-sm tabular-nums">
                Subtotal: ₹{subtotal.toLocaleString('en-IN')} (+ Shipping)
              </span>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Street Address / House No. / Landmark *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / Studio / House, Street, Area"
                className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="400001"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Delivery or Packaging Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Mention any delivery timing preferences, gift wrapping requests, or gate codes."
                className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
              />
            </div>

            {/* Stated Business Policies & Agreement */}
            <div className="p-4 bg-[#5A0F26]/5 border border-[#5A0F26]/20 space-y-3">
              <h4 className="font-editorial text-sm font-medium text-[#5A0F26]">
                Stated Atelier Policies (Please Review)
              </h4>
              <ul className="text-[11px] text-[#1E1114]/75 space-y-1 font-light list-disc list-inside">
                <li><strong>No Cash on Delivery:</strong> Orders proceed solely upon verified advance payment.</li>
                <li><strong>Shipping:</strong> Delivery charges are calculated specifically for your pincode and added to your final invoice.</li>
                <li><strong>All Sales Final:</strong> Due to the handcrafted, limited-run nature of our work, no cancellations, returns, or exchanges are accepted.</li>
              </ul>
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-0.5 rounded-none text-[#5A0F26] focus:ring-[#5A0F26]"
                />
                <span className="text-xs font-medium text-[#1E1114]">
                  I agree to the atelier policies and understand advance settlement will be arranged directly with Mahek.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-all shadow-[0_4px_20px_rgba(90,15,38,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order Request...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
