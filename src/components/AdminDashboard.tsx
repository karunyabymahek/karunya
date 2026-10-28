import React, { useState, useEffect } from 'react';
import { Product, Order, CustomEnquiry, StudioSettings, ProductCategory, OrderStatus, EnquiryStatus } from '../types';
import { CATEGORIES } from './CategoryNav';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  Eye,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onRefreshProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'enquiries' | 'settings'>('overview');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<CustomEnquiry[]>([]);
  const [settings, setSettings] = useState<StudioSettings>({
    whatsappNumber: '',
    instagramHandle: '',
    contactEmail: '',
    studioLocation: '',
  });

  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Settings State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resProd, resOrd, resEnq, resSet] = await Promise.all([
        fetch('/api/products', { headers: authHeaders }),
        fetch('/api/orders', { headers: authHeaders }),
        fetch('/api/enquiries', { headers: authHeaders }),
        fetch('/api/settings'),
      ]);

      if (resProd.ok) setProducts(await resProd.json());
      if (resOrd.ok) setOrders(await resOrd.json());
      if (resEnq.ok) setEnquiries(await resEnq.json());
      if (resSet.ok) setSettings(await resSet.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [token]);

  // Product Actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const url = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingProduct),
      });

      if (!res.ok) throw new Error('Failed to save product');

      showFeedback(isNewProduct ? 'Product created successfully' : 'Product updated');
      setEditingProduct(null);
      loadAllData();
      onRefreshProducts();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the atelier catalogue?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showFeedback('Product deleted');
        loadAllData();
        onRefreshProducts();
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setImageUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ dataUrl }),
        });
        const data = await res.json();
        if (data.url) {
          setEditingProduct({ ...editingProduct, mainImage: data.url });
        }
      } catch (err) {
        alert('Upload failed');
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Order Actions
  const handleUpdateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        showFeedback('Order updated');
        loadAllData();
      }
    } catch (err) {
      alert('Failed to update order');
    }
  };

  // Enquiry Actions
  const handleUpdateEnquiry = async (enquiryId: string, updates: Partial<CustomEnquiry>) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        showFeedback('Enquiry updated');
        loadAllData();
      }
    } catch (err) {
      alert('Failed to update enquiry');
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showFeedback('Studio settings updated');
      }
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update passcode');
      showFeedback('Passcode updated securely');
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      setPassError(err.message);
    }
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Enquiry received' || o.status === 'Awaiting payment' || o.status === 'Awaiting shipping confirmation'
  ).length;

  const pendingEnquiriesCount = enquiries.filter(
    (e) => e.status === 'Enquiry Received' || e.status === 'Reviewed'
  ).length;

  return (
    <div className="min-h-screen bg-[#F5EFE9] text-[#1E1114] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#1E1114] text-[#F5EFE9] py-4 px-6 sm:px-8 border-b border-[#5A0F26]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-editorial text-2xl uppercase tracking-wider text-[#F5EFE9]">
            Karunya
          </span>
          <span className="text-xs uppercase tracking-widest text-[#C48A8C] font-mono border-l border-[#F5EFE9]/20 pl-3">
            Private Atelier Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          {feedbackMsg && (
            <span className="text-xs text-[#C5A059] font-medium animate-pulse">
              {feedbackMsg}
            </span>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#F5EFE9]/20 text-[#F5EFE9] text-xs uppercase tracking-wider hover:bg-[#5A0F26] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Studio</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1E1114]/15">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catalogue ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#C48A8C] text-[#1E1114] font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Briefs ({enquiries.length})</span>
            {pendingEnquiriesCount > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#C5A059] text-[#1E1114] font-bold">
                {pendingEnquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#5A0F26] text-[#F5EFE9] font-medium'
                : 'text-[#1E1114]/70 hover:text-[#5A0F26]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Studio Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Metric Strips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-[#EAE3DB]/50 border border-[#1E1114]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#1E1114]/60">
                  Published Creations
                </span>
                <p className="font-mono text-3xl font-semibold text-[#5A0F26] tabular-nums">
                  {products.filter((p) => p.isPublished).length}
                </p>
                <span className="text-[11px] text-[#1E1114]/60">Total {products.length} in archive</span>
              </div>

              <div className="p-5 bg-[#EAE3DB]/50 border border-[#1E1114]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#1E1114]/60">
                  Orders Awaiting Action
                </span>
                <p className="font-mono text-3xl font-semibold text-[#5A0F26] tabular-nums">
                  {pendingOrdersCount}
                </p>
                <span className="text-[11px] text-[#1E1114]/60">Awaiting shipping or advance settlement</span>
              </div>

              <div className="p-5 bg-[#EAE3DB]/50 border border-[#1E1114]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#1E1114]/60">
                  New Custom Briefs
                </span>
                <p className="font-mono text-3xl font-semibold text-[#5A0F26] tabular-nums">
                  {pendingEnquiriesCount}
                </p>
                <span className="text-[11px] text-[#1E1114]/60">Bespoke commissions to review</span>
              </div>

              <div className="p-5 bg-[#EAE3DB]/50 border border-[#1E1114]/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#1E1114]/60">
                  Sold Out Creations
                </span>
                <p className="font-mono text-3xl font-semibold text-[#1E1114]/80 tabular-nums">
                  {products.filter((p) => p.availability === 'sold-out').length}
                </p>
                <span className="text-[11px] text-[#1E1114]/60">Marked as unavailable</span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders List */}
              <div className="p-6 bg-white border border-[#1E1114]/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E1114]/10">
                  <h3 className="font-editorial text-lg text-[#1E1114] font-medium">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#5A0F26] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#1E1114]/50 italic py-6 text-center">No orders logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((o) => (
                      <div key={o.id} className="p-3 bg-[#F5EFE9] border border-[#1E1114]/10 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-[#1E1114]">{o.customerName} ({o.city})</p>
                          <p className="font-mono text-[11px] text-[#5A0F26]">{o.orderNumber} · ₹{o.total.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-[#EAE3DB] text-[#1E1114]">
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Custom Enquiries */}
              <div className="p-6 bg-white border border-[#1E1114]/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E1114]/10">
                  <h3 className="font-editorial text-lg text-[#1E1114] font-medium">
                    Recent Custom Commission Briefs
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-[#5A0F26] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>
                {enquiries.length === 0 ? (
                  <p className="text-xs text-[#1E1114]/50 italic py-6 text-center">No custom enquiries received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.slice(0, 4).map((e) => (
                      <div key={e.id} className="p-3 bg-[#F5EFE9] border border-[#1E1114]/10 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-[#1E1114]">{e.customerName} · {e.category}</p>
                          <p className="font-mono text-[11px] text-[#5A0F26]">{e.enquiryNumber} · {e.budgetRange}</p>
                        </div>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-[#C5A059]/20 text-[#1E1114]">
                          {e.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOGUE */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-editorial text-2xl text-[#1E1114] font-medium">
                  Atelier Catalogue Management
                </h3>
                <p className="text-xs text-[#1E1114]/70">
                  Add, edit, change pricing, upload photography, or adjust availability across all 8 disciplines.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsNewProduct(true);
                  setEditingProduct({
                    name: '',
                    category: 'Crochet creations',
                    shortDescription: '',
                    detailedDescription: '',
                    price: 1500,
                    mainImage: '/src/assets/images/category_crochet_couture_1793124077750.jpg',
                    additionalImages: [],
                    materials: '',
                    dimensions: '',
                    variations: [],
                    customisationAvailable: true,
                    status: 'ready-made',
                    availability: 'in-stock',
                    estimatedProductionTime: 'Ships within 48 hours',
                    shippingNotes: 'Calculated separately prior to dispatch based on pincode.',
                    isFeatured: false,
                    isPublished: true,
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-wider font-medium hover:bg-[#3E0818] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Creation</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#1E1114]/15 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EAE3DB]/60 border-b border-[#1E1114]/15 text-[#1E1114]/70 uppercase tracking-wider text-[10px]">
                    <th className="p-3">Image</th>
                    <th className="p-3">Creation Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price (INR)</th>
                    <th className="p-3">Stock State</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3">Published</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1114]/10">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F5EFE9]/50 transition-colors">
                      <td className="p-3">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-12 h-14 object-cover border border-[#1E1114]/10"
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-editorial text-sm font-medium text-[#1E1114]">{p.name}</p>
                        <span className="font-mono text-[10px] text-[#1E1114]/50">ID: {p.id}</span>
                      </td>
                      <td className="p-3 text-[#1E1114]/80">{p.category}</td>
                      <td className="p-3 font-mono font-semibold text-[#5A0F26] tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                          p.availability === 'in-stock'
                            ? 'bg-green-100 text-green-800'
                            : p.availability === 'made-to-order'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {p.availability}
                        </span>
                      </td>
                      <td className="p-3">
                        {p.isFeatured ? (
                          <span className="text-[10px] text-[#C5A059] font-medium font-mono">YES</span>
                        ) : (
                          <span className="text-[10px] text-[#1E1114]/40 font-mono">NO</span>
                        )}
                      </td>
                      <td className="p-3">
                        {p.isPublished ? (
                          <span className="text-[10px] text-green-700 font-medium font-mono">LIVE</span>
                        ) : (
                          <span className="text-[10px] text-amber-700 font-medium font-mono">DRAFT</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setIsNewProduct(false);
                            setEditingProduct({ ...p });
                          }}
                          className="p-1.5 text-[#1E1114]/70 hover:text-[#5A0F26] cursor-pointer"
                          title="Edit creation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete creation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-editorial text-2xl text-[#1E1114] font-medium">
                Customer Order Requests
              </h3>
              <p className="text-xs text-[#1E1114]/70">
                Review addresses, calculate specific courier fees, update order status, and track advance payments.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#1E1114]/15 p-12 text-center text-xs text-[#1E1114]/60">
                No orders received yet. Once customers submit their bags, their requests will appear here.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-[#1E1114]/15 p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E1114]/10">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-semibold text-[#5A0F26]">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-[#1E1114]/60">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#1E1114] mt-0.5 font-medium">
                          Customer: {order.customerName} ({order.email})
                        </p>
                      </div>

                      {/* Direct WhatsApp Action Link */}
                      <a
                        href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          order.customerName
                        )},%20this%20is%20Mahek%20from%20Karunya.%20Regarding%20your%20order%20${order.orderNumber}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white text-xs font-medium rounded hover:bg-[#1EBE5D] transition-colors self-start"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp ({order.phone})</span>
                      </a>
                    </div>

                    {/* Delivery & Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Destination */}
                      <div className="p-4 bg-[#F5EFE9] space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#C48A8C] font-semibold">
                          Delivery Destination
                        </span>
                        <p className="font-medium text-[#1E1114]">{order.address}</p>
                        <p className="text-[#1E1114]/70">
                          {order.city}, {order.state} - {order.pincode}
                        </p>
                        {order.customerNotes && (
                          <p className="text-[11px] text-[#5A0F26] italic pt-1 border-t border-[#1E1114]/10">
                            Customer note: "{order.customerNotes}"
                          </p>
                        )}
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#C48A8C] font-semibold">
                          Ordered Items
                        </span>
                        <div className="space-y-1.5 divide-y divide-[#1E1114]/5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="pt-1.5 first:pt-0 flex justify-between">
                              <div>
                                <p className="font-medium text-[#1E1114]">{item.productName} × {item.quantity}</p>
                                {item.variation && <p className="text-[10px] text-[#C48A8C]">Edition: {item.variation}</p>}
                                {item.customNotes && <p className="text-[10px] text-[#1E1114]/60 italic">"{item.customNotes}"</p>}
                              </div>
                              <span className="font-mono tabular-nums font-semibold text-[#5A0F26]">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Financials & Status Adjustment Controls */}
                    <div className="pt-4 border-t border-[#1E1114]/10 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
                      {/* Subtotal & Shipping */}
                      <div>
                        <span className="block text-[10px] uppercase text-[#1E1114]/50 mb-1">
                          Subtotal / Shipping
                        </span>
                        <p className="font-mono tabular-nums">
                          Items: ₹{order.subtotal.toLocaleString('en-IN')}
                        </p>
                        <p className="font-mono tabular-nums text-[#5A0F26]">
                          Shipping: {order.shippingCharge !== null ? `₹${order.shippingCharge}` : 'Unconfirmed'}
                        </p>
                      </div>

                      {/* Shipping Charge Input */}
                      <div>
                        <label className="block text-[10px] uppercase text-[#1E1114]/60 mb-1">
                          Set Shipping Fee (₹)
                        </label>
                        <input
                          type="number"
                          defaultValue={order.shippingCharge || ''}
                          onBlur={(e) => {
                            const val = e.target.value ? Number(e.target.value) : null;
                            handleUpdateOrder(order.id, { shippingCharge: val });
                          }}
                          placeholder="e.g. 150"
                          className="w-full px-2 py-1.5 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                        />
                      </div>

                      {/* Status Dropdown */}
                      <div>
                        <label className="block text-[10px] uppercase text-[#1E1114]/60 mb-1">
                          Order Status
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrder(order.id, { status: e.target.value as OrderStatus })}
                          className="w-full px-2 py-1.5 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                        >
                          <option value="Enquiry received">Enquiry received</option>
                          <option value="Awaiting shipping confirmation">Awaiting shipping confirmation</option>
                          <option value="Awaiting payment">Awaiting payment</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In production">In production</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Payment Status Dropdown */}
                      <div>
                        <label className="block text-[10px] uppercase text-[#1E1114]/60 mb-1">
                          Payment Verification
                        </label>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            handleUpdateOrder(order.id, {
                              paymentStatus: e.target.value as any,
                            })
                          }
                          className="w-full px-2 py-1.5 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                        >
                          <option value="Pending verification">Pending verification</option>
                          <option value="Payment link shared">Payment link shared</option>
                          <option value="Paid & verified">Paid & verified</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CUSTOM ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-editorial text-2xl text-[#1E1114] font-medium">
                Custom Commission Briefs
              </h3>
              <p className="text-xs text-[#1E1114]/70">
                Review submitted ideas, specifications, uploaded inspiration files, and record internal studio notes.
              </p>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white border border-[#1E1114]/15 p-12 text-center text-xs text-[#1E1114]/60">
                No bespoke commission briefs received yet.
              </div>
            ) : (
              <div className="space-y-6">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border border-[#1E1114]/15 p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E1114]/10">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-semibold text-[#5A0F26]">
                            {enq.enquiryNumber}
                          </span>
                          <span className="text-xs text-[#1E1114]/60">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#1E1114] font-medium mt-0.5">
                          {enq.customerName} · Category: <span className="text-[#5A0F26]">{enq.category}</span>
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          enq.customerName
                        )},%20this%20is%20Mahek%20from%20Karunya.%20Regarding%20your%20bespoke%20brief%20${enq.enquiryNumber}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white text-xs font-medium rounded hover:bg-[#1EBE5D] transition-colors self-start"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Discuss on WhatsApp ({enq.phone})</span>
                      </a>
                    </div>

                    {/* Brief Narrative */}
                    <div className="p-4 bg-[#F5EFE9] border border-[#1E1114]/10 text-xs space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#C48A8C] font-semibold">
                        Client Concept & Story
                      </span>
                      <p className="text-[#1E1114] leading-relaxed whitespace-pre-wrap">
                        {enq.description}
                      </p>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="block text-[10px] uppercase text-[#1E1114]/50">Occasion</span>
                        <span className="font-medium">{enq.occasion || 'Personal'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#1E1114]/50">Dimensions / Sizes</span>
                        <span className="font-medium">{enq.specifications || 'As discussed'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#1E1114]/50">Colors & Materials</span>
                        <span className="font-medium">{enq.preferredColours} {enq.materialsPreference && `· ${enq.materialsPreference}`}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-[#1E1114]/50">Target Budget</span>
                        <span className="font-mono font-semibold text-[#5A0F26]">{enq.budgetRange}</span>
                      </div>
                    </div>

                    {/* Reference Images */}
                    {enq.referenceImages && enq.referenceImages.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#C48A8C] font-semibold">
                          Client Reference Files ({enq.referenceImages.length})
                        </span>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {enq.referenceImages.map((imgUrl, i) => (
                            <a
                              key={i}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-20 h-20 border border-[#1E1114]/20 overflow-hidden shrink-0 group block"
                            >
                              <img src={imgUrl} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status & Studio Notes */}
                    <div className="pt-4 border-t border-[#1E1114]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase text-[#1E1114]/60 mb-1">
                          Enquiry Status
                        </label>
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiry(enq.id, { status: e.target.value as EnquiryStatus })}
                          className="w-full px-2 py-1.5 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                        >
                          <option value="Enquiry Received">Enquiry Received</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Quotation Sent">Quotation Sent</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Production">In Production</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase text-[#1E1114]/60 mb-1">
                          Private Studio Notes (Internal)
                        </label>
                        <input
                          type="text"
                          defaultValue={enq.adminNotes || ''}
                          onBlur={(e) => handleUpdateEnquiry(enq.id, { adminNotes: e.target.value })}
                          placeholder="e.g. Yarn swatches sent on WhatsApp, quote ₹4,500 accepted."
                          className="w-full px-2 py-1.5 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STUDIO SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white border border-[#1E1114]/15 p-8 space-y-8 animate-in fade-in duration-200">
            <div>
              <h3 className="font-editorial text-2xl text-[#1E1114] font-medium">
                Atelier Coordinates & Security
              </h3>
              <p className="text-xs text-[#1E1114]/70">
                Update your live WhatsApp, Instagram, and email links, or change your master passcode.
              </p>
            </div>

            {/* Public Links Form */}
            <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
              <h4 className="font-editorial text-lg text-[#5A0F26] font-medium border-b border-[#1E1114]/10 pb-2">
                Public Atelier Contact Links
              </h4>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Studio WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={settings.instagramHandle}
                  onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                  placeholder="e.g. karunyabymahek"
                  className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="mahek@karunya.atelier"
                  className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Studio City / Base
                </label>
                <input
                  type="text"
                  value={settings.studioLocation}
                  onChange={(e) => setSettings({ ...settings, studioLocation: e.target.value })}
                  placeholder="Ahmedabad / Mumbai, India"
                  className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-wider font-medium hover:bg-[#3E0818] transition-colors"
              >
                Save Atelier Settings
              </button>
            </form>

            {/* Change Passcode Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-6 border-t border-[#1E1114]/10">
              <h4 className="font-editorial text-lg text-[#5A0F26] font-medium border-b border-[#1E1114]/10 pb-2">
                Change Studio Access Passcode
              </h4>

              {passError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200">
                  {passError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Current Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    New Passcode (min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F5EFE9] border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E1114] text-[#F5EFE9] text-xs uppercase tracking-wider font-medium hover:bg-[#5A0F26] transition-colors"
              >
                Update Passcode
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PRODUCT EDITOR MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-3xl bg-[#F5EFE9] border border-[#1E1114]/20 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#1E1114]/60 hover:text-[#5A0F26]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-editorial text-2xl text-[#1E1114] font-medium mb-6">
              {isNewProduct ? 'Add New Atelier Creation' : `Edit: ${editingProduct.name}`}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Creation Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'Crochet creations'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Compare & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Availability Status
                  </label>
                  <select
                    value={editingProduct.availability || 'in-stock'}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, availability: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  >
                    <option value="in-stock">In Stock (Ready)</option>
                    <option value="made-to-order">Made to Order</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Production Mode
                  </label>
                  <select
                    value={editingProduct.status || 'ready-made'}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  >
                    <option value="ready-made">Ready Made</option>
                    <option value="made-to-order">Made to Order</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Detailed Atelier Narrative & Specifications
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.detailedDescription || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, detailedDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              {/* Materials & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Materials Used
                  </label>
                  <input
                    type="text"
                    value={editingProduct.materials || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, materials: e.target.value })
                    }
                    placeholder="e.g. 100% Mercerised Cotton, Brass Pin"
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                    Dimensions / Size
                  </label>
                  <input
                    type="text"
                    value={editingProduct.dimensions || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                    }
                    placeholder="e.g. 20 cm × 25 cm"
                    className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                </div>
              </div>

              {/* Variations (Comma separated) */}
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Variations / Editions (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingProduct.variations ? editingProduct.variations.join(', ') : ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      variations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Carmine Burgundy, Dusty Rose, Raw Alabaster"
                  className="w-full px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                />
              </div>

              {/* Image upload / URL */}
              <div className="space-y-2 p-3 bg-[#EAE3DB]/50 border border-[#1E1114]/10">
                <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
                  Main Photograph (URL or File Upload)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={editingProduct.mainImage || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mainImage: e.target.value })
                    }
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
                  />
                  <label className="px-4 py-2 bg-[#5A0F26] text-white cursor-pointer hover:bg-[#3E0818] transition-colors shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{imageUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                </div>
                {editingProduct.mainImage && (
                  <img
                    src={editingProduct.mainImage}
                    alt="Preview"
                    className="w-20 h-24 object-cover border border-[#1E1114]/20 mt-2"
                  />
                )}
              </div>

              {/* Checkboxes: Featured & Published */}
              <div className="flex items-center gap-8 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                    className="text-[#5A0F26]"
                  />
                  <span className="font-medium text-[#1E1114]">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished !== false}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isPublished: e.target.checked })
                    }
                    className="text-[#5A0F26]"
                  />
                  <span className="font-medium text-[#1E1114]">Published in Live Catalogue</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E1114]/10">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 border border-[#1E1114]/20 text-[#1E1114] hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A0F26] text-[#F5EFE9] uppercase tracking-wider font-medium hover:bg-[#3E0818]"
                >
                  Save Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
