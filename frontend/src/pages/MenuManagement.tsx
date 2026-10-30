import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../types';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Star,
  Ticket,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const MenuManagement: React.FC = () => {
  const { selectedBranchId } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Add Item Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Starters');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('250');

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMenuItems(
        selectedBranchId || undefined,
        categoryFilter || undefined,
        search || undefined
      );
      setItems(res);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedBranchId, categoryFilter]);

  const handleToggleAvailability = async (id: number) => {
    try {
      await api.toggleMenuAvailability(id);
      fetchMenu();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;
    try {
      await api.createMenuItem({
        name: newName,
        category: newCategory,
        description: newDesc,
        price: parseFloat(newPrice),
        is_available: true,
        branch_id: selectedBranchId || undefined
      });
      setIsAddOpen(false);
      setNewName('');
      setNewDesc('');
      fetchMenu();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            🍛
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Menu & Recipe Intelligence
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{items.length} DISHES</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Multi-cuisine & mess meal catalog, dish ratings, student taste audits, and live availability.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>

          <button
            onClick={fetchMenu}
            className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer hover:border-amber-400"
            title="Refresh Menu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar with Warm Ivory Styling */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-amber-700/60 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search menu dish or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMenu()}
            className="w-full text-xs pl-9 pr-3 py-2 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] placeholder:text-[#9c7d66] focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['', 'Starters', 'Main Course', 'Biryani', 'Breads', 'Desserts', 'Beverages'].map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-500/60 scale-105'
                    : 'bg-[#faf4ea] text-[#6d4c33] border border-[#ebdcc6] hover:bg-white hover:text-[#2b1d14] hover:-translate-y-0.5'
                }`}
              >
                {cat === '' ? 'All Items' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Grid Cards with Micro-Elevation on Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 py-12 text-center text-[#9c7d66]">Loading dishes...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-[#9c7d66]">No menu items found.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 space-y-3 group ${
                item.is_available
                  ? 'bg-white border-[#ebdcc6] hover:-translate-y-1 hover:shadow-md hover:border-amber-400'
                  : 'bg-[#faf4ea]/60 border-[#decbb3] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#2b1d14] mt-1.5 font-retro">{item.name}</h3>
                </div>
                <div className="text-sm font-bold text-[#2b1d14] bg-[#faf4ea] px-2.5 py-1 rounded-xl border border-[#ebdcc6]">
                  ₹{item.price.toFixed(2)}
                </div>
              </div>

              <p className="text-xs text-[#73533c] line-clamp-2 font-medium">{item.description}</p>

              {/* Metrics Bar with High-Contrast Badges */}
              <div className="pt-3 border-t border-[#f3e9db] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-700 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{item.average_rating || 4.5}</span>
                  <span className="text-[10px] font-medium text-[#8e6e55]">({item.total_feedbacks || 0})</span>
                </div>

                <div className="flex items-center space-x-1 text-[#b9220a] font-bold text-[11px]">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{item.total_complaints || 0} issues</span>
                </div>

                <button
                  onClick={() => handleToggleAvailability(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs ${
                    item.is_available
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af] hover:bg-rose-100'
                  }`}
                  title="Toggle Item Availability"
                >
                  <span>{item.is_available ? 'Available' : 'Sold Out'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ebdcc6] max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#ebdcc6] pb-3">
              <h3 className="text-sm font-bold text-[#2b1d14] font-retro uppercase">Add Menu Item</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-7 h-7 rounded-full bg-[#faf4ea] text-[#7a583e] hover:bg-[#ebdcc6] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#73533c] font-bold block mb-1">Item Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mutton Ghee Roast / Paneer Butter Masala"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Biryani">Biryani</option>
                    <option value="Breads">Breads</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Price (₹):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#73533c] font-bold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, spice level, and culinary notes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-medium"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-[#ebdcc6] text-[#73533c] rounded-xl text-xs font-semibold hover:bg-[#faf4ea] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
