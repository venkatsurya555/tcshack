import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Order, MenuItem } from '../types';
import { BillQRModal } from '../components/BillQRModal';
import {
  ShoppingBag,
  Search,
  Plus,
  QrCode,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { selectedBranchId, branches } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuCatalog, setMenuCatalog] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [selectedTokenForBill, setSelectedTokenForBill] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Create Order Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('T-01');
  const [channel, setChannel] = useState('Dine-in');
  const [selectedBranchForNewOrder, setSelectedBranchForNewOrder] = useState<number>(branches[0]?.id || 1);
  const [orderItemsList, setOrderItemsList] = useState<{ menuItemId: number; name: string; qty: number; price: number }[]>([]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const [ordList, menuList] = await Promise.all([
        api.getOrders({
          search: search || undefined,
          branch_id: selectedBranchId || undefined,
        }),
        api.getMenuItems(),
      ]);
      setOrders(ordList);
      setMenuCatalog(menuList);
      if (menuList.length > 0 && orderItemsList.length === 0) {
        setOrderItemsList([
          { menuItemId: menuList[0].id, name: menuList[0].name, qty: 1, price: menuList[0].price },
        ]);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedBranchId]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || orderItemsList.length === 0) {
      alert('Please provide customer name and at least one item');
      return;
    }

    try {
      const payload = {
        branch_id: selectedBranchForNewOrder,
        customer_name: customerName,
        customer_phone: customerPhone || '9876543210',
        table_number: tableNumber,
        order_channel: channel,
        items: orderItemsList.map((i) => ({
          menu_item_id: i.menuItemId,
          item_name: i.name,
          quantity: i.qty,
          price_each: i.price,
        })),
      };

      const newOrd = await api.createOrder(payload);
      setIsCreateModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      await fetchOrders();
      if (newOrd.qr_token) {
        setSelectedTokenForBill(newOrd.qr_token);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addItemToNewOrder = (menuItem: MenuItem) => {
    setOrderItemsList((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        return prev.map((i) => (i.menuItemId === menuItem.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { menuItemId: menuItem.id, name: menuItem.name, qty: 1, price: menuItem.price }];
    });
  };

  const handleGenerateQR = async (orderId: number) => {
    try {
      const res = await api.generateOrderQR(orderId);
      await fetchOrders();
      setSelectedTokenForBill(res.token);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            🛍️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Order & POS Bill Management
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{orders.length} ORDERS</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Bill generation, POS itemization, and unique QR code assignment for reviews.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Demo Order</span>
          </button>

          <button
            onClick={fetchOrders}
            className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer hover:border-amber-400"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders Table with High-Readability & Tomato Scrollbar */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_12px_rgba(66,46,32,0.04)] overflow-hidden">
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea] border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Branch / Table</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Ordered Items</th>
                <th className="py-3.5 px-4">Bill Total</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">QR Code / Feedback</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9c7d66]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9c7d66]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14] font-mono">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">{ord.branch_name}</div>
                      <div className="text-[10px] text-[#8e6e55] font-semibold">
                        Table {ord.table_number || 'N/A'} • {ord.order_channel}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">{ord.customer_name}</div>
                      <div className="text-[10px] text-[#8e6e55]">{ord.customer_phone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        {ord.items.map((i) => (
                          <div key={i.id} className="text-[11px] text-[#4d3627] truncate font-medium">
                            {i.quantity}x {i.item_name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14]">
                      ₹{ord.bill_total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.feedback_submitted ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-900 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          <span>Awaiting Guest</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ord.qr_token ? (
                        <button
                          onClick={() => setSelectedTokenForBill(ord.qr_token || null)}
                          className="px-2.5 py-1 bg-[#24170f] hover:bg-amber-600 text-amber-50 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <QrCode className="w-3 h-3 text-amber-300" />
                          <span>View Bill QR</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGenerateQR(ord.id)}
                          className="px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Generate QR</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal with Warm Hospitality Styling */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ebdcc6] max-w-xl w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#ebdcc6] pb-3">
              <h3 className="text-sm font-bold text-[#2b1d14] font-retro tracking-wide">
                Create New Restaurant / Mess Order
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#faf4ea] text-[#7a583e] hover:bg-[#ebdcc6] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Customer / Student Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Phone Number / Token:</label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Branch / Mess:</label>
                  <select
                    value={selectedBranchForNewOrder}
                    onChange={(e) => setSelectedBranchForNewOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Table / Room:</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Channel:</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                  >
                    <option value="Dine-in">Dine-in</option>
                    <option value="Mess Hall">Mess Hall</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
              </div>

              {/* Quick Add From Menu */}
              <div>
                <label className="text-[#73533c] font-bold block mb-1">Quick Add Items from Menu Catalog:</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl tomato-sauce-scrollbar">
                  {menuCatalog.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => addItemToNewOrder(m)}
                      className="px-2.5 py-1 bg-white border border-[#ebdcc6] rounded-lg text-[11px] font-bold text-[#6d4c33] hover:border-amber-500 hover:text-amber-800 hover:bg-[#faf4ea] transition-all cursor-pointer"
                    >
                      + {m.name} (₹{m.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Items */}
              <div className="border border-[#ebdcc6] rounded-xl p-3 bg-[#faf4ea]/60 space-y-1.5">
                <span className="font-bold text-[11px] uppercase text-[#7a583e]">Order Items Summary:</span>
                {orderItemsList.map((itm, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-[#2b1d14] font-medium">
                    <span>{itm.qty}x {itm.name}</span>
                    <span className="font-bold">₹{(itm.qty * itm.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-[#ebdcc6] pt-1.5 flex justify-between font-bold text-xs text-[#2b1d14]">
                  <span>Total Amount:</span>
                  <span className="text-amber-800 text-sm">₹{orderItemsList.reduce((acc, i) => acc + i.qty * i.price, 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#ebdcc6] text-[#73533c] rounded-xl text-xs font-semibold hover:bg-[#faf4ea] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Create & Print QR Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill & QR Modal */}
      <BillQRModal
        token={selectedTokenForBill}
        onClose={() => setSelectedTokenForBill(null)}
      />
    </div>
  );
};
