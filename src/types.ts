export type ProductCategory =
  | 'Crochet creations'
  | 'Art and paintings'
  | 'Bouquets and floral gifts'
  | 'Handmade décor and trays'
  | 'Wearables'
  | 'Plushies and stuffed toys'
  | 'Books, writing and stationery'
  | 'Personalised gifts and other creative pieces';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  compareAtPrice?: number;
  mainImage: string;
  additionalImages: string[];
  materials: string;
  dimensions: string;
  variations: string[];
  customisationAvailable: boolean;
  status: 'ready-made' | 'made-to-order';
  availability: 'in-stock' | 'made-to-order' | 'sold-out';
  estimatedProductionTime: string;
  shippingNotes: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariation?: string;
  customNotes?: string;
}

export interface OrderItemPayload {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  variation?: string;
  customNotes?: string;
  image?: string;
}

export type OrderStatus =
  | 'Enquiry received'
  | 'Awaiting shipping confirmation'
  | 'Awaiting payment'
  | 'Confirmed'
  | 'In production'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItemPayload[];
  subtotal: number;
  shippingCharge: number | null;
  total: number;
  status: OrderStatus;
  paymentStatus: 'Pending verification' | 'Payment link shared' | 'Paid & verified';
  shippingTracking?: string;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus =
  | 'Enquiry Received'
  | 'Reviewed'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'In Production'
  | 'Completed'
  | 'Archived';

export interface CustomEnquiry {
  id: string;
  enquiryNumber: string;
  customerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  occasion: string;
  preferredColours: string;
  specifications: string;
  materialsPreference: string;
  quantity: number;
  budgetRange: string;
  requiredDate: string;
  deliveryLocation: string;
  referenceImages: string[];
  additionalNotes?: string;
  policyAccepted: boolean;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioSettings {
  whatsappNumber: string;
  instagramHandle: string;
  contactEmail: string;
  studioLocation: string;
}
