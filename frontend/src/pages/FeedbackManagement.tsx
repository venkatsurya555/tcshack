import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FeedbackRecord } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TicketDetailModal } from '../components/TicketDetailModal';
import {
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const FeedbackManagement: React.FC = () => {
  const { selectedBranchId } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Modal
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getFeedbacks({
        search: search || undefined,
        branch_id: selectedBranchId || undefined,
        rating: ratingFilter !== '' ? Number(ratingFilter) : undefined,
        category: categoryFilter || undefined,
      });
      setFeedbacks(res);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [selectedBranchId, ratingFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeedbacks();
  };

  const handleExportCSV = () => {
    window.open('/api/v1/feedback/export/csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            💬
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Feedback & Review Logs
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{feedbacks.length} ENTRIES</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Real-time dish & meal ratings, student/guest taste notes, and automated ticket routing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#ebdcc6] text-[#523d2d] hover:bg-[#faf4ea] rounded-xl text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-amber-400"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchFeedbacks}
            className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer hover:border-amber-400"
            title="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Controls Bar with Warm Parchment Aesthetic */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700/60 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search feedback ID, order #, dish name, comment, or guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] placeholder:text-[#9c7d66] focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-[#73533c] font-semibold">
            <span>Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : '')}
              className="text-xs font-semibold text-[#2b1d14] bg-[#faf6f0] border border-[#decbb3] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="">All Ratings (1 - 5)</option>
              <option value="5">5 Stars (Praise)</option>
              <option value="4">4 Stars (Good)</option>
              <option value="3">3 Stars (Average)</option>
              <option value="2">2 Stars (Issue)</option>
              <option value="1">1 Star (Critical)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-[#73533c] font-semibold">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold text-[#2b1d14] bg-[#faf6f0] border border-[#decbb3] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Food Quality">Food Quality</option>
              <option value="Food Temperature">Food Temperature</option>
              <option value="Taste and Freshness">Taste and Freshness</option>
              <option value="Portion Size">Portion Size</option>
              <option value="Missing or Incorrect Item">Missing or Incorrect Item</option>
              <option value="Packaging">Packaging</option>
              <option value="Staff Behaviour">Staff Behaviour</option>
              <option value="Service Delay">Service Delay</option>
              <option value="Billing and Payment">Billing and Payment</option>
              <option value="Delivery">Delivery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Readability Minimalist Feedback Table */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_12px_rgba(66,46,32,0.04)] overflow-hidden">
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea] border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Feedback ID</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Order / Venue</th>
                <th className="py-3.5 px-4">Dish / Meal Item</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Taste & Customer Note</th>
                <th className="py-3.5 px-4">Issue Category</th>
                <th className="py-3.5 px-4">Assigned Dept</th>
                <th className="py-3.5 px-4">Ticket Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#9c7d66]">
                    Loading feedback entries...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#9c7d66]">
                    No matching feedback records found.
                  </td>
                </tr>
              ) : (
                feedbacks.map((f) => (
                  <tr key={f.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14] font-mono">
                      {f.feedback_number}
                    </td>
                    <td className="py-3.5 px-4 text-[#73533c] text-[11px] font-medium">
                      {new Date(f.date_time).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">#{f.order_number}</div>
                      <div className="text-[10px] text-[#8e6e55]">{f.branch_name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14]">
                      {f.item_name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <span className={`font-bold text-xs ${
                          f.rating >= 4 ? 'text-emerald-700' : f.rating === 3 ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          {f.rating}★
                        </span>
                        <div className="flex text-[11px] text-amber-500">
                          {'★'.repeat(f.rating)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-[#4d3627] text-[11px] font-medium">
                        {f.customer_comment || <span className="italic text-[#a48871]">No comment</span>}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        f.rating >= 4
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-300'
                      }`}>
                        {f.issue_category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#523a28]">
                      {f.assigned_department ? (
                        <span className="font-semibold text-[#2b1d14] bg-[#faf3e8] px-2 py-0.5 rounded-md border border-[#ebdcc6]">
                          {f.assigned_department}
                        </span>
                      ) : (
                        <span className="text-[#a48871] text-[11px]">None (Positive)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {f.has_complaint && f.ticket_status ? (
                        <StatusBadge status={f.ticket_status} />
                      ) : (
                        <span className="text-emerald-700 text-[11px] font-bold flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Praise</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {f.has_complaint && f.ticket_id ? (
                        <button
                          onClick={() => setSelectedTicketId(f.ticket_id || null)}
                          className="px-2.5 py-1 bg-[#24170f] hover:bg-amber-600 text-amber-50 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3 text-amber-300" />
                        </button>
                      ) : (
                        <span className="text-[#bba390] text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Management Modal */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onRefresh={fetchFeedbacks}
      />
    </div>
  );
};
