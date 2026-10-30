import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QRToken } from '../types';
import { BillQRModal } from '../components/BillQRModal';
import {
  Eye,
  Copy,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const QRManagement: React.FC = () => {
  const { selectedBranchId } = useAuth();
  const [tokens, setTokens] = useState<QRToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTokenForBill, setSelectedTokenForBill] = useState<string | null>(null);

  const fetchTokens = async () => {
    setIsLoading(true);
    try {
      const res = await api.getQRTokens(
        selectedBranchId || undefined,
        statusFilter || undefined
      );
      setTokens(res);
    } catch (err: any) {
      console.error('Error fetching tokens:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [selectedBranchId, statusFilter]);

  const handleRevoke = async (tokenStr: string) => {
    if (!confirm('Are you sure you want to revoke this QR code? Guests will no longer be able to submit feedback.')) return;
    try {
      await api.revokeQRToken(tokenStr);
      fetchTokens();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyUrl = (tokenStr: string) => {
    const url = `${window.location.origin}/feedback/${tokenStr}`;
    navigator.clipboard.writeText(url);
    alert(`Copied URL: ${url}`);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            🏷️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                QR Code & Bill Slip Tokens
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{tokens.length} TOKENS</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Cryptographic bill review tokens, guest access tracking, printable table slips, and token revocation.
            </p>
          </div>
        </div>

        <button
          onClick={fetchTokens}
          className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs self-start sm:self-auto cursor-pointer hover:border-amber-400"
          title="Refresh Tokens"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {/* Filter Bar with Warm Ivory Styling */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#73533c] font-bold">Status Filter:</span>
          {['', 'active', 'used', 'expired', 'revoked'].map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-500/60 scale-105'
                    : 'bg-[#faf4ea] text-[#6d4c33] border border-[#ebdcc6] hover:bg-white hover:text-[#2b1d14] hover:-translate-y-0.5'
                }`}
              >
                {st === '' ? 'All Tokens' : st.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* QR Tokens Table */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_12px_rgba(66,46,32,0.04)] overflow-hidden">
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea] border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order Ref</th>
                <th className="py-3.5 px-4">Branch / Mess</th>
                <th className="py-3.5 px-4">Token String</th>
                <th className="py-3.5 px-4">QR Status</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9c7d66]">Loading QR references...</td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9c7d66]">No QR references found.</td>
                </tr>
              ) : (
                tokens.map((tk) => (
                  <tr key={tk.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-[#2b1d14]">
                      #{tk.order_number}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14]">
                      {tk.branch_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#73533c]">
                      {tk.token}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        tk.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                        tk.status === 'used' ? 'bg-amber-50 text-amber-900 border border-amber-300' :
                        tk.status === 'expired' ? 'bg-[#faf3e8] text-[#73533c] border border-[#ebdcc6]' :
                        'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]'
                      }`}>
                        {tk.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#73533c] font-medium">
                      {new Date(tk.expires_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedTokenForBill(tk.token)}
                        className="px-2.5 py-1 bg-[#24170f] hover:bg-amber-600 text-amber-50 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-amber-300" />
                        <span>Preview & Print</span>
                      </button>

                      <button
                        onClick={() => copyUrl(tk.token)}
                        className="px-2.5 py-1 bg-white border border-[#ebdcc6] text-[#6d4c33] rounded-xl text-[11px] hover:bg-[#faf4ea] hover:border-amber-400 font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                        title="Copy Feedback URL"
                      >
                        <Copy className="w-3 h-3" />
                      </button>

                      {tk.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(tk.token)}
                          className="px-2.5 py-1 bg-[#fde8e5] border border-[#f5b8af] text-[#b9220a] rounded-xl text-[11px] hover:bg-rose-100 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                          title="Revoke QR Code"
                        >
                          Revoke
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

      <BillQRModal
        token={selectedTokenForBill}
        onClose={() => setSelectedTokenForBill(null)}
      />
    </div>
  );
};
