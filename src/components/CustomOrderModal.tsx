import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { CATEGORIES } from './CategoryNav';
import { X, Sparkles, Upload, CheckCircle, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';

interface CustomOrderModalProps {
  isOpen: boolean;
  preselectedProduct?: Product | null;
  onClose: () => void;
  onSuccess: (enquiryNumber: string) => void;
}

export const CustomOrderModal: React.FC<CustomOrderModalProps> = ({
  isOpen,
  preselectedProduct,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ProductCategory | string>(
    preselectedProduct?.category || 'Crochet creations'
  );
  const [description, setDescription] = useState(
    preselectedProduct ? `Custom variation inspired by: ${preselectedProduct.name}` : ''
  );
  const [occasion, setOccasion] = useState('');
  const [preferredColours, setPreferredColours] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [materialsPreference, setMaterialsPreference] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [budgetRange, setBudgetRange] = useState('₹2,500 – ₹5,000');
  const [requiredDate, setRequiredDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // File upload state
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedEnquiryNumber, setCompletedEnquiryNumber] = useState<string | null>(null);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image formats (.jpg, .png, .webp) are supported.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('File size exceeds the 8MB limit.');
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setReferenceImages((prev) => [...prev, data.url]);
        } else {
          // If server upload had an issue, we can still attach the dataUrl preview
          setReferenceImages((prev) => [...prev, dataUrl]);
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError('Failed to upload image preview.');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!policyAccepted) {
      setError('Please review and agree to the custom commission policies.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName,
        email,
        phone,
        category,
        description,
        occasion,
        preferredColours,
        specifications,
        materialsPreference,
        quantity,
        budgetRange,
        requiredDate,
        deliveryLocation,
        referenceImages,
        additionalNotes,
        policyAccepted,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit custom commission enquiry.');
      }

      setCompletedEnquiryNumber(data.enquiryNumber);
      onSuccess(data.enquiryNumber);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your custom enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#F5EFE9] border border-[#1E1114]/15 shadow-2xl p-6 sm:p-10 my-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#1E1114]/70 hover:text-[#5A0F26] transition-colors cursor-pointer"
          aria-label="Close custom enquiry"
        >
          <X className="w-5 h-5" />
        </button>

        {completedEnquiryNumber ? (
          /* Confirmation State */
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-[#5A0F26]/10 text-[#5A0F26] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold">
                Commission Brief Recorded
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E1114] font-medium">
                Brief Logged for Mahek
              </h2>
              <p className="font-mono text-sm tracking-wider text-[#5A0F26] font-semibold">
                REFERENCE: #{completedEnquiryNumber}
              </p>
            </div>

            <div className="p-6 bg-[#EAE3DB]/60 border border-[#1E1114]/10 text-left text-xs text-[#1E1114]/80 space-y-3">
              <p className="font-medium text-[#1E1114]">
                The Bespoke Commission Process:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed font-light">
                <li>
                  Mahek will evaluate your narrative, dimensional requirements, and reference files.
                </li>
                <li>
                  You will be contacted via WhatsApp (<strong>{phone}</strong>) or Email (<strong>{email}</strong>) within 24–48 hours to discuss yarn/paint swatches and timeline.
                </li>
                <li>
                  A formal quote will be provided. Once advance settlement is completed, craftsmanship commences.
                </li>
              </ol>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-colors"
            >
              Close & Return to Atelier
            </button>
          </div>
        ) : (
          /* Custom Enquiry Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Bespoke Commission Studio</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1114] font-medium">
                Commission a One-of-a-Kind Creation
              </h2>
              <p className="text-xs text-[#1E1114]/70 mt-1 font-light leading-relaxed">
                Whether an heirloom bridal bouquet, a personal oil landscape, custom wearables, or character plush, Mahek accepts select commissions.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Category & Nature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Artistic Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.id})
                    </option>
                  ))}
                  <option value="Other bespoke vision">Other Bespoke Vision</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Occasion or Purpose (Optional)
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Wedding gift, Anniversary, Home interior gallery"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Concept & Story */}
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Description of the Requested Creation & Story *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your vision, aesthetic references, specific motifs, emotional significance, or desired feeling..."
                className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none leading-relaxed"
              />
            </div>

            {/* 3. Conditional Dimensions/Specifications & Preferred Colours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  {category === 'Wearables'
                    ? 'Size / Measurements (Chest, Length) *'
                    : category === 'Art and paintings'
                    ? 'Canvas Dimensions (e.g., 40x50 cm) *'
                    : 'Dimensions or Scale Specifications *'}
                </label>
                <input
                  type="text"
                  required
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder={
                    category === 'Wearables'
                      ? 'e.g. Oversized Medium, 42" chest'
                      : category === 'Art and paintings'
                      ? 'e.g. 18" x 24" stretched canvas'
                      : 'e.g. Approx 10-12 inches tall'
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Preferred Color Palette
                </label>
                <input
                  type="text"
                  value={preferredColours}
                  onChange={(e) => setPreferredColours(e.target.value)}
                  placeholder="e.g. Deep burgundy, blush rose, warm stone, gold leaf"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Materials, Quantity & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Materials Preference
                </label>
                <input
                  type="text"
                  value={materialsPreference}
                  onChange={(e) => setMaterialsPreference(e.target.value)}
                  placeholder="e.g. Egyptian cotton, Merino wool, Raw linen"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Target Budget (INR)
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                >
                  <option value="Under ₹2,000">Under ₹2,000</option>
                  <option value="₹2,000 – ₹4,000">₹2,000 – ₹4,000</option>
                  <option value="₹4,000 – ₹7,500">₹4,000 – ₹7,500</option>
                  <option value="₹7,500 – ₹15,000">₹7,500 – ₹15,000</option>
                  <option value="₹15,000+ (Masterpiece Study)">₹15,000+ (Masterpiece)</option>
                  <option value="Flexible based on craftsmanship">Flexible</option>
                </select>
              </div>
            </div>

            {/* 5. Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Required Delivery Date (if deadline exists)
                </label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Delivery City & State *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>
            </div>

            {/* 6. Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Name"
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
            </div>

            {/* 7. Reference Files Upload */}
            <div className="space-y-2 pt-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Reference Images or Inspiration (Max 8MB per file)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dashed border-[#1E1114]/30 hover:border-[#5A0F26] cursor-pointer text-xs transition-colors">
                  <Upload className="w-4 h-4 text-[#5A0F26]" />
                  <span>{uploadingImage ? 'Uploading image...' : 'Upload Reference Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {uploadError && <span className="text-xs text-red-600">{uploadError}</span>}
              </div>

              {referenceImages.length > 0 && (
                <div className="flex gap-3 pt-2 overflow-x-auto">
                  {referenceImages.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 border border-[#1E1114]/20 overflow-hidden shrink-0">
                      <img src={url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setReferenceImages(referenceImages.filter((_, idx) => idx !== i))}
                        className="absolute top-0 right-0 p-0.5 bg-[#5A0F26] text-white text-[9px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 8. Additional Notes */}
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                Additional Notes
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any special handling, preferred contact times, or confidentiality requirements."
                className="w-full px-3 py-2 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
              />
            </div>

            {/* 9. Policy Acceptance */}
            <div className="p-4 bg-[#5A0F26]/5 border border-[#5A0F26]/20 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-0.5 rounded-none text-[#5A0F26] focus:ring-[#5A0F26]"
                />
                <span className="text-xs font-medium text-[#1E1114]">
                  I understand that custom work requires formal quotation approval and full advance payment before production begins. Once commissioned, bespoke creations are non-refundable and cannot be cancelled or exchanged.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full py-4 px-6 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-all shadow-[0_4px_20px_rgba(90,15,38,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Commission Brief...</span>
                </>
              ) : (
                <>
                  <span>Submit Custom Commission Brief</span>
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
