import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Increase body parser limit for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure data and uploads directory exist
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

const DB_FILE = path.join(DATA_DIR, 'db.json');

// Interface definitions
export interface Product {
  id: string;
  name: string;
  category: string;
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

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  variation?: string;
  customNotes?: string;
  image?: string;
}

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
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number | null;
  total: number;
  status:
    | 'Enquiry received'
    | 'Awaiting shipping confirmation'
    | 'Awaiting payment'
    | 'Confirmed'
    | 'In production'
    | 'Shipped'
    | 'Completed'
    | 'Cancelled';
  paymentStatus: 'Pending verification' | 'Payment link shared' | 'Paid & verified';
  shippingTracking?: string;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

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
  status:
    | 'Enquiry Received'
    | 'Reviewed'
    | 'Quotation Sent'
    | 'Confirmed'
    | 'In Production'
    | 'Completed'
    | 'Archived';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  adminPassHash: string;
  products: Product[];
  orders: Order[];
  enquiries: CustomEnquiry[];
  settings: {
    whatsappNumber: string;
    instagramHandle: string;
    contactEmail: string;
    studioLocation: string;
  };
}

// Initial seed data
const DEFAULT_PASS = 'karunya2026';
const defaultHash = crypto.createHash('sha256').update(DEFAULT_PASS).digest('hex');

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'The Heirloom Rose Brooch & Pin',
    category: 'Crochet creations',
    shortDescription: 'Multi-layered artisanal sculpted rose in deep burgundy and warm alabaster cotton.',
    detailedDescription: 'Hand-crocheted petal by petal using premium mercerised Egyptian cotton. Featuring sculpted layered petals in Karunya burgundy with delicate tea-rose undertones, mounted with a tarnished antique-brass locking pin. Each piece requires over six hours of meticulous needle craft.',
    price: 1850,
    mainImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: '100% Mercerised Egyptian Cotton Thread, Brass Pin Backing',
    dimensions: 'Approx 8.5 cm diameter',
    variations: ['Deep Burgundy & Alabaster', 'Dusty Rose & Cream', 'Antique Gold & Espresso'],
    customisationAvailable: true,
    status: 'ready-made',
    availability: 'in-stock',
    estimatedProductionTime: 'Ships within 48 hours',
    shippingNotes: 'Calculated separately prior to dispatch based on delivery pincode.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Texture Study No. 4 — Impasto in Ochre & Carmine',
    category: 'Art and paintings',
    shortDescription: 'Original high-relief sculptural oil on Italian stretched canvas.',
    detailedDescription: 'A heavy sculptural palette-knife composition exploring physical topography and raw pigment density. Deep carmine burgundy veining fractures through layered warm clay and raw travertine ochre, dusted with subtle flecks of 22k composition gold leaf. Signed and dated by Mahek.',
    price: 8500,
    mainImage: '/src/assets/images/category_textured_art_1793124079272.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: 'Heavy Body Artist Oils, Texture Medium, 22K Composition Gold Leaf on Linen Canvas',
    dimensions: '30 cm × 40 cm (12" × 16")',
    variations: ['Original 1-of-1 Canvas'],
    customisationAvailable: false,
    status: 'ready-made',
    availability: 'in-stock',
    estimatedProductionTime: 'Ships in bespoke timber-crated packaging in 3 business days',
    shippingNotes: 'Art freight calculated and verified prior to advance settlement.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Sculpted Travertine & Gold Leaf Catchall',
    category: 'Handmade décor and trays',
    shortDescription: 'Raw organic-edged decorative stone tray with gilded brass contouring.',
    detailedDescription: 'Hand-shaped from artisanal mineral composite and raw crushed travertine, cured with an earthy mineral wash and edged in hand-gilded antique leaf. Beautifully weighted for holding cherished objects, candles, or vanity treasures.',
    price: 2400,
    mainImage: '/src/assets/images/category_decor_trays_1793124079957.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: 'Artisanal Mineral Clay, Crushed Travertine, Antique Gold Leaf, Organic Beeswax Seal',
    dimensions: '22 cm × 17 cm × 3.5 cm',
    variations: ['Raw Terracotta & Gilded Edge', 'Obsidian Stone & Brass', 'Alabaster Stone & Rose Gold'],
    customisationAvailable: true,
    status: 'ready-made',
    availability: 'in-stock',
    estimatedProductionTime: 'Ships within 48 hours',
    shippingNotes: 'Dispatched in shock-absorbent protective packaging.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Everlasting Botanical Dahlia & Peony Flora',
    category: 'Bouquets and floral gifts',
    shortDescription: 'A permanent arrangement of hand-crocheted sculptural blooms and foliage.',
    detailedDescription: 'A masterwork arrangement composed of one giant blooming dahlia, two tea roses, hand-knitted olive eucalyptus sprigs, and delicate jasmine stars wrapped in raw linen and wax-sealed parchment.',
    price: 3600,
    mainImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: 'Organic Combed Cotton, Flexible Wire Stems, Italian Raw Linen Wrap',
    dimensions: 'Height approx 38 cm, Bouquet span 24 cm',
    variations: ['Burgundy & Dusty Rose', 'Ivory Alabaster & Sage', 'Autumn Amber & Terracotta'],
    customisationAvailable: true,
    status: 'made-to-order',
    availability: 'made-to-order',
    estimatedProductionTime: '5–7 business days creation time',
    shippingNotes: 'Ships in sturdy reinforced cylindrical presentation casing.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Artisanal Heritage Knit Cardigan — Atelier Edition',
    category: 'Wearables',
    shortDescription: 'Substantial chunky woollen knit cardigan with hand-sculpted organic horn buttons.',
    detailedDescription: 'Handcrafted on manual wooden needles using 100% fine Merino-alpaca blend yarn. Features an oversized luxury drape, drop shoulders, deep ribbing, and custom horn buttons. Designed to be a lifelong heirloom garment.',
    price: 9200,
    mainImage: '/src/assets/images/hero_atelier_creations_1793124077093.jpg',
    additionalImages: ['/src/assets/images/category_crochet_couture_1793124077750.jpg'],
    materials: '70% Fine Australian Merino Wool, 30% Baby Alpaca, Horn Buttons',
    dimensions: 'Available in Size 1 (XS-M relaxed) and Size 2 (L-XXL oversized)',
    variations: ['Size 1 / Natural Oatmeal', 'Size 1 / Deep Carmine Burgundy', 'Size 2 / Natural Oatmeal', 'Size 2 / Deep Carmine Burgundy'],
    customisationAvailable: true,
    status: 'made-to-order',
    availability: 'made-to-order',
    estimatedProductionTime: '12–14 business days hand-knit lead time',
    shippingNotes: 'Dispatched via insured express courier.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Collectible Atelier Moonflower Bear',
    category: 'Plushies and stuffed toys',
    shortDescription: 'One-of-a-kind handcrafted sculptural soft collectible bear in vintage textured weave.',
    detailedDescription: 'Individually sculpted and stitched by Mahek. Features traditional disc-jointed arms and legs, glass eyes, hand-embroidered nose and claws, and an embroidered burgundy velvet collar. A serious collector piece rather than a generic factory plush.',
    price: 3400,
    mainImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: 'Vintage Textured Bouclé & Mohair, German Glass Eyes, Wood Fiber & Cotton Fill',
    dimensions: 'Standing 26 cm (Sitting 19 cm)',
    variations: ['Classic Champagne Teddy', 'Burgundy Velvet Edition'],
    customisationAvailable: true,
    status: 'ready-made',
    availability: 'in-stock',
    estimatedProductionTime: 'Ships within 48 hours',
    shippingNotes: 'Packaged in a dedicated keepsake dustbag and gift carton.',
    isFeatured: false,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    name: 'Deckle-Edge Cotton Journal with Rose Wax Seal',
    category: 'Books, writing and stationery',
    shortDescription: 'Hand-bound 150gsm handmade rag paper journal with leather wrap tie.',
    detailedDescription: 'Hand-sewn using historical long-stitch binding with 160 pages of recycled cotton rag paper suitable for fountain pens, gouache, and ink sketches. Finished with an authentic burgundy wax seal bearing the Karunya rose insignia.',
    price: 1650,
    mainImage: '/src/assets/images/category_decor_trays_1793124079957.jpg',
    additionalImages: ['/src/assets/images/hero_atelier_creations_1793124077093.jpg'],
    materials: '100% Recycled Cotton Rag Paper (150 gsm), Waxed Linen Thread, Vegetable Tanned Leather',
    dimensions: 'A5 format (15 cm × 21 cm)',
    variations: ['Raw Tan Leather', 'Burgundy Wine Leather'],
    customisationAvailable: true,
    status: 'ready-made',
    availability: 'in-stock',
    estimatedProductionTime: 'Ships within 48 hours',
    shippingNotes: 'Includes archival packaging.',
    isFeatured: false,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    name: 'Personalised Botanical Shadowbox Frame',
    category: 'Personalised gifts and other creative pieces',
    shortDescription: 'Bespoke hand-crocheted birth-flower composition in solid wood shadowbox with calligraphy.',
    detailedDescription: 'A completely bespoke keepsake crafted to celebrate weddings, anniversaries, or special milestones. Mahek sculpts the recipient’s birth flower or favourite botanical in fine cotton thread and sets it in an archival deep shadowbox with hand-lettered gold or ink calligraphy.',
    price: 4200,
    mainImage: '/src/assets/images/category_textured_art_1793124079272.jpg',
    additionalImages: ['/src/assets/images/category_crochet_couture_1793124077750.jpg'],
    materials: 'Mercerised Cotton, Acid-Free Museum Matting, Solid Teak Wood Frame, Museum Glass',
    dimensions: '20 cm × 25 cm × 4.5 cm depth',
    variations: ['Single Bloom Study', 'Duo Botanical Keepsake'],
    customisationAvailable: true,
    status: 'made-to-order',
    availability: 'made-to-order',
    estimatedProductionTime: '7–10 days bespoke craftsmanship',
    shippingNotes: 'Carefully crated with reinforced corners for courier transit.',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to read and write database
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      adminPassHash: defaultHash,
      products: INITIAL_PRODUCTS,
      orders: [],
      enquiries: [],
      settings: {
        whatsappNumber: '',
        instagramHandle: '',
        contactEmail: '',
        studioLocation: 'Ahmedabad / Mumbai, India',
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      adminPassHash: defaultHash,
      products: INITIAL_PRODUCTS,
      orders: [],
      enquiries: [],
      settings: {
        whatsappNumber: '',
        instagramHandle: '',
        contactEmail: '',
        studioLocation: 'Ahmedabad / Mumbai, India',
      },
    };
  }
}

function writeDb(data: DatabaseSchema): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// In-memory active admin sessions
const activeSessions = new Set<string>();

// Middleware to verify admin token
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.substring(7);
  if (!activeSessions.has(token)) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }
  next();
}

// ===================== API ROUTES =====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Karunya by Mahek', timestamp: new Date().toISOString() });
});

// Admin Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password required' });
    return;
  }
  const db = readDb();
  const inputHash = crypto.createHash('sha256').update(password.trim()).digest('hex');
  if (inputHash !== db.adminPassHash) {
    res.status(401).json({ error: 'Invalid administrator password' });
    return;
  }
  const sessionToken = crypto.randomBytes(32).toString('hex');
  activeSessions.add(sessionToken);
  res.json({ success: true, token: sessionToken, message: 'Authentication successful' });
});

// Admin Auth: Verify
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ valid: false });
    return;
  }
  const token = authHeader.substring(7);
  if (activeSessions.has(token)) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

// Admin Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

// Admin: Update Password
app.post('/api/auth/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' });
    return;
  }
  const db = readDb();
  const currentHash = crypto.createHash('sha256').update(currentPassword.trim()).digest('hex');
  if (currentHash !== db.adminPassHash) {
    res.status(401).json({ error: 'Current password is incorrect' });
    return;
  }
  db.adminPassHash = crypto.createHash('sha256').update(newPassword.trim()).digest('hex');
  writeDb(db);
  res.json({ success: true, message: 'Password updated securely' });
});

// Settings: Get (Public / Admin)
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings);
});

// Settings: Update (Admin only)
app.put('/api/settings', requireAdmin, (req, res) => {
  const db = readDb();
  const { whatsappNumber, instagramHandle, contactEmail, studioLocation } = req.body;
  db.settings = {
    whatsappNumber: whatsappNumber !== undefined ? String(whatsappNumber).trim() : db.settings.whatsappNumber,
    instagramHandle: instagramHandle !== undefined ? String(instagramHandle).trim() : db.settings.instagramHandle,
    contactEmail: contactEmail !== undefined ? String(contactEmail).trim() : db.settings.contactEmail,
    studioLocation: studioLocation !== undefined ? String(studioLocation).trim() : db.settings.studioLocation,
  };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Products: List
app.get('/api/products', (req, res) => {
  const db = readDb();
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : '';
  const isAdmin = token && activeSessions.has(token);

  // Normal visitors only see published products
  const products = isAdmin ? db.products : db.products.filter((p) => p.isPublished);
  res.json(products);
});

// Products: Get Single
app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// Products: Create (Admin)
app.post('/api/products', requireAdmin, (req, res) => {
  const db = readDb();
  const newProduct: Product = {
    id: `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: req.body.name || 'Untitled Creation',
    category: req.body.category || 'Crochet creations',
    shortDescription: req.body.shortDescription || '',
    detailedDescription: req.body.detailedDescription || '',
    price: Number(req.body.price) || 0,
    compareAtPrice: req.body.compareAtPrice ? Number(req.body.compareAtPrice) : undefined,
    mainImage: req.body.mainImage || '/src/assets/images/category_crochet_couture_1793124077750.jpg',
    additionalImages: Array.isArray(req.body.additionalImages) ? req.body.additionalImages : [],
    materials: req.body.materials || '',
    dimensions: req.body.dimensions || '',
    variations: Array.isArray(req.body.variations) ? req.body.variations : [],
    customisationAvailable: Boolean(req.body.customisationAvailable),
    status: req.body.status === 'made-to-order' ? 'made-to-order' : 'ready-made',
    availability: req.body.availability || 'in-stock',
    estimatedProductionTime: req.body.estimatedProductionTime || 'Ships within 48 hours',
    shippingNotes: req.body.shippingNotes || 'Shipping calculated separately based on pincode.',
    isFeatured: Boolean(req.body.isFeatured),
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

// Products: Update (Admin)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updated;
  writeDb(db);
  res.json(updated);
});

// Products: Delete (Admin)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== req.params.id);
  if (db.products.length === initialLength) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  writeDb(db);
  res.json({ success: true, message: 'Product removed' });
});

// Orders: Create (Public checkout request)
app.post('/api/orders', (req, res) => {
  const { customerName, email, phone, address, city, state, pincode, items, customerNotes, policyAccepted } = req.body;

  if (!customerName || !email || !phone || !address || !city || !state || !pincode) {
    res.status(400).json({ error: 'Missing required customer delivery information.' });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Shopping bag is empty.' });
    return;
  }

  if (!policyAccepted) {
    res.status(400).json({ error: 'You must review and accept the store policy (No COD, advance payment, no returns).' });
    return;
  }

  const db = readDb();
  const orderNumber = `KBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let subtotal = 0;
  const processedItems: OrderItem[] = items.map((item: any) => {
    const itemPrice = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.quantity) || 1);
    subtotal += itemPrice * qty;
    return {
      productId: item.productId || 'item',
      productName: item.productName || 'Creation',
      price: itemPrice,
      quantity: qty,
      variation: item.variation || '',
      customNotes: item.customNotes || '',
      image: item.image || '',
    };
  });

  const newOrder: Order = {
    id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    orderNumber,
    customerName: customerName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    items: processedItems,
    subtotal,
    shippingCharge: null, // As specified: shipping is calculated and confirmed separately!
    total: subtotal,
    status: 'Enquiry received',
    paymentStatus: 'Pending verification',
    customerNotes: customerNotes ? customerNotes.trim() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  res.status(201).json({
    success: true,
    orderNumber: newOrder.orderNumber,
    order: newOrder,
    message: 'Your order request has been logged. Mahek will review the delivery address, calculate exact shipping, and contact you via WhatsApp or Email with advance payment details.',
  });
});

// Orders: List (Admin)
app.get('/api/orders', requireAdmin, (req, res) => {
  const db = readDb();
  res.json(db.orders);
});

// Orders: Update Status (Admin)
app.patch('/api/orders/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const existing = db.orders[index];
  const updated: Order = {
    ...existing,
    ...req.body,
    id: existing.id,
    orderNumber: existing.orderNumber,
    updatedAt: new Date().toISOString(),
  };

  // If shipping charge was updated, update total
  if (req.body.shippingCharge !== undefined) {
    const shipping = Number(req.body.shippingCharge) || 0;
    updated.shippingCharge = shipping;
    updated.total = updated.subtotal + shipping;
  }

  db.orders[index] = updated;
  writeDb(db);
  res.json(updated);
});

// Custom Enquiries: Create (Public custom commission form)
app.post('/api/enquiries', (req, res) => {
  const {
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
  } = req.body;

  if (!customerName || !email || !phone || !category || !description) {
    res.status(400).json({ error: 'Please fill in all mandatory custom commission fields.' });
    return;
  }

  if (!policyAccepted) {
    res.status(400).json({ error: 'You must review and agree to the custom commission policies.' });
    return;
  }

  const db = readDb();
  const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newEnquiry: CustomEnquiry = {
    id: `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    enquiryNumber,
    customerName: customerName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    category: category.trim(),
    description: description.trim(),
    occasion: (occasion || '').trim(),
    preferredColours: (preferredColours || '').trim(),
    specifications: (specifications || '').trim(),
    materialsPreference: (materialsPreference || '').trim(),
    quantity: Math.max(1, Number(quantity) || 1),
    budgetRange: (budgetRange || 'Flexible').trim(),
    requiredDate: (requiredDate || '').trim(),
    deliveryLocation: (deliveryLocation || '').trim(),
    referenceImages: Array.isArray(referenceImages) ? referenceImages : [],
    additionalNotes: additionalNotes ? additionalNotes.trim() : undefined,
    policyAccepted: true,
    status: 'Enquiry Received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  writeDb(db);

  res.status(201).json({
    success: true,
    enquiryNumber: newEnquiry.enquiryNumber,
    enquiry: newEnquiry,
    message: 'Your bespoke commission brief has been received. Mahek will personally review your concept, specifications, and reference images, then contact you with a formal quotation and timeline.',
  });
});

// Custom Enquiries: List (Admin)
app.get('/api/enquiries', requireAdmin, (req, res) => {
  const db = readDb();
  res.json(db.enquiries);
});

// Custom Enquiries: Update Status / Notes (Admin)
app.patch('/api/enquiries/:id', requireAdmin, (req, res) => {
  const db = readDb();
  const index = db.enquiries.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }

  const existing = db.enquiries[index];
  const updated: CustomEnquiry = {
    ...existing,
    ...req.body,
    id: existing.id,
    enquiryNumber: existing.enquiryNumber,
    updatedAt: new Date().toISOString(),
  };

  db.enquiries[index] = updated;
  writeDb(db);
  res.json(updated);
});

// File Upload: Base64 or Image (for product photography or customer reference images)
app.post('/api/upload', (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    res.status(400).json({ error: 'Valid image Data URL required' });
    return;
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: 'Malformed image data' });
      return;
    }
    const extension = matches[1].replace('jpeg', 'jpg');
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Limit upload to 8MB
    if (buffer.length > 8 * 1024 * 1024) {
      res.status(400).json({ error: 'Image size exceeds 8MB limit' });
      return;
    }

    const safeFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process image upload' });
  }
});

// Admin Stats Overview (Admin)
app.get('/api/admin/overview', requireAdmin, (req, res) => {
  const db = readDb();
  const totalProducts = db.products.length;
  const publishedProducts = db.products.filter((p) => p.isPublished).length;
  const outOfStockProducts = db.products.filter((p) => p.availability === 'sold-out').length;
  const pendingOrders = db.orders.filter(
    (o) => o.status === 'Enquiry received' || o.status === 'Awaiting payment' || o.status === 'Awaiting shipping confirmation'
  ).length;
  const pendingEnquiries = db.enquiries.filter(
    (e) => e.status === 'Enquiry Received' || e.status === 'Reviewed'
  ).length;

  res.json({
    totalProducts,
    publishedProducts,
    outOfStockProducts,
    pendingOrders,
    pendingEnquiries,
    recentOrders: db.orders.slice(0, 5),
    recentEnquiries: db.enquiries.slice(0, 5),
  });
});

// ===================== FRONTEND INTEGRATION =====================
async function setupFrontend() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[Vite Dev Server] Attached to Express on port ${PORT}`);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`[Production Server] Serving dist on port ${PORT}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> Karunya by Mahek atelier server running at http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
