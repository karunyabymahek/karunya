import React, { useState } from 'react';
import { X, Truck, CreditCard, RefreshCw, ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  initialPolicyKey?: string;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialPolicyKey = 'shipping',
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<string>(initialPolicyKey);

  const tabs = [
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'payment', label: 'Advance Payment (No COD)', icon: CreditCard },
    { id: 'returns', label: 'Returns & Cancellations', icon: RefreshCw },
    { id: 'privacy', label: 'Privacy & Data Protection', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#F5EFE9] border border-[#1E1114]/15 shadow-2xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#1E1114]/70 hover:text-[#5A0F26] transition-colors cursor-pointer"
          aria-label="Close policies"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold block">
            Atelier Standards
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1114] font-medium mb-6">
            Store & Studio Policies
          </h2>
        </div>

        {/* Policy Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#1E1114]/10 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                    : 'text-[#1E1114]/70 hover:text-[#5A0F26] hover:bg-[#EAE3DB]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-[#1E1114]/80 font-light leading-relaxed space-y-4">
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl text-[#5A0F26] font-medium">
                Shipping & Delivery Terms
              </h3>
              <p>
                <strong>Transparent, Non-Inflated Shipping:</strong> At Karunya by Mahek, shipping charges are not silently marked up or rolled into product prices. Shipping is calculated specifically based on your delivery pincode, parcel dimensions, and courier weight thresholds.
              </p>
              <p>
                <strong>Verification Prior to Payment:</strong> When you place an order request, our team verifies the delivery address and generates the exact shipping quote. You are informed of the courier amount before making your advance payment.
              </p>
              <p>
                <strong>Transit & Handling:</strong> All ready-made pieces are dispatched within 24–48 hours of payment verification. Bespoke or made-to-order creations follow the agreed production timeline (typically 5–14 business days). We pack each piece in protective archival crating or reinforced packaging to safeguard delicate crochet petals, canvases, and stone trays.
              </p>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl text-[#5A0F26] font-medium">
                Full Advance Payment Policy (Strictly No COD)
              </h3>
              <p>
                <strong>Why We Do Not Offer Cash on Delivery:</strong> Every item produced at Karunya is handmade by Mahek. We do not maintain bulk mass inventory. Due to the high cost of material sourcing, hours of specialized hand labor, and courier return risks, <strong>Cash on Delivery (COD) is strictly unavailable</strong>.
              </p>
              <p>
                <strong>Accepted Settlement Methods:</strong> We accept UPI (Google Pay, PhonePe, Paytm), IMPS/NEFT Direct Bank Transfer, and secure digital payment links. Once your order request or custom brief is verified, an official invoice with payment coordinates will be provided directly by Mahek.
              </p>
              <p>
                <strong>Dispatch Upon Receipt:</strong> Orders are scheduled for production and transit only after full advance settlement has cleared into our studio account.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl text-[#5A0F26] font-medium">
                Cancellations, Returns & Exchanges
              </h3>
              <p>
                <strong>All Sales Final:</strong> In accordance with the custom and artisanal nature of our atelier, <strong>we do not accept order cancellations, returns, or exchanges</strong> once an order has been confirmed and payment has been completed.
              </p>
              <p>
                <strong>Handcrafted Character:</strong> Each crochet stitch, brushstroke, stone contour, and hand-bound journal will display natural hand-crafted uniqueness. These are marks of authentic human artistry, not defects.
              </p>
              <p>
                <strong>Transit Damage Exception:</strong> While all sales are final, customer trust is paramount. In the unlikely event that your parcel arrives physically damaged during transit, please photograph the unopened parcel and damaged items within 24 hours of receipt and contact Mahek directly. We will review the case in good faith to provide an appropriate studio repair or replacement.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl text-[#5A0F26] font-medium">
                Privacy Notice & Data Minimisation
              </h3>
              <p>
                <strong>What We Collect:</strong> We collect only the essential personal information required to evaluate commissions and deliver your orders: your name, WhatsApp phone number, email address, delivery street address, and reference inspirations.
              </p>
              <p>
                <strong>Zero Commercial Data Selling:</strong> We never sell, rent, monetize, or disclose your contact details or address to third-party advertising networks. Your information is strictly utilized to process your order, communicate custom artwork details, and arrange secure courier transit.
              </p>
              <p>
                <strong>Inspiration Confidentiality:</strong> Any personal photos or milestone stories submitted for custom commissions remain strictly confidential and will never be published publicly without your explicit written consent.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="font-editorial text-xl text-[#5A0F26] font-medium">
                Terms of Atelier Service
              </h3>
              <p>
                <strong>Original Creations & Intellectual Property:</strong> All original designs, patterns, sculptural crochet forms, paintings, and imagery on this website are the intellectual property of Karunya by Mahek. Unauthorized reproduction, resale, or commercial duplication is prohibited.
              </p>
              <p>
                <strong>Pricing & Catalogue Adjustments:</strong> Product prices are listed in Indian Rupees (INR). We reserve the right to revise prices or retire limited edition runs as material availability changes.
              </p>
              <p>
                <strong>Bespoke Quotations:</strong> Custom commission quotes remain valid for 14 calendar days from issuance. Production slots are allocated on a first-confirmed, first-scheduled basis.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#1E1114]/10 flex items-center justify-between text-xs text-[#1E1114]/60">
          <span>Official Policies · Karunya by Mahek</span>
          <button
            onClick={onClose}
            className="text-[#5A0F26] font-medium hover:underline underline-offset-4 cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
