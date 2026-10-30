import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ComplaintTicket, Department } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { TicketDetailModal } from '../components/TicketDetailModal';
import {
  Search,
  Clock,
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const ComplaintsManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { selectedBranchId } = useAuth();
  const [complaints, setComplaints] = useState<ComplaintTicket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusTab, setStatusTab] = useState<string>(searchParams.get('filter') === 'overdue' ? 'overdue' : 'all');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<number | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  // Modal
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const [tktList, deptList] = await Promise.all([
        api.getComplaints({
          search: search || undefined,
          status_filter: statusTab !== 'all' && statusTab !== 'overdue' ? statusTab : undefined,
          overdue_only: statusTab === 'overdue',
          department_id: departmentFilter !== '' ? Number(departmentFilter) : undefined,
          branch_id: selectedBranchId || undefined,
          priority: priorityFilter || undefined,
        }),
        api.getDepartments(),
      ]);
      setComplaints(tktList);
      setDepartments(deptList);
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedBranchId, statusTab, departmentFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  const overdueCount = complaints.filter((c) => c.is_overdue).length;

  return (
    <div className="space-y-6">
      {/* Page Header with Food Emblem & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            🎫
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Complaints & Tickets Management
              </h2>
              {overdueCount > 0 && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea3a1e]" />
                  <span>{overdueCount} OVERDUE</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              End-to-end dining & mess incident tracking, root cause investigation, SLA monitoring, and verification.
            </p>
          </div>
        </div>

        <button
          onClick={fetchComplaints}
          className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs self-start sm:self-auto cursor-pointer hover:border-amber-400"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {/* Interactive Status Filter Tabs with Amber Glow & Micro-Lift */}
      <div className="flex flex-wrap gap-2 border-b border-[#ebdcc6] pb-3">
        {[
          { key: 'all', label: 'All Tickets' },
          { key: 'overdue', label: 'Overdue SLA' },
          { key: 'New', label: 'New Tickets' },
          { key: 'In Progress', label: 'In Progress' },
          { key: 'Resolved Pending Verification', label: 'Pending Verification' },
          { key: 'Resolved', label: 'Resolved (Verified)' },
        ].map((tab) => {
          const isActive = statusTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-500/60 scale-105'
                  : 'bg-white border border-[#ebdcc6] text-[#6e4e37] hover:bg-[#faf4ea] hover:text-[#2b1d14] hover:-translate-y-0.5'
              }`}
            >
              {tab.label}
              {tab.key === 'overdue' && overdueCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-[#ea3a1e] text-white rounded-full text-[10px] font-bold">
                  {overdueCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Selectors Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="w-4 h-4 text-amber-700/60 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ticket #, guest/student, dish, order #, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] placeholder:text-[#9c7d66] focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-[#73533c] font-semibold">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value ? Number(e.target.value) : '')}
              className="text-xs font-semibold text-[#2b1d14] bg-[#faf6f0] border border-[#decbb3] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-[#73533c] font-semibold">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs font-semibold text-[#2b1d14] bg-[#faf6f0] border border-[#decbb3] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Readability Complaints Table */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_12px_rgba(66,46,32,0.04)] overflow-hidden">
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea] border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Order / Customer</th>
                <th className="py-3.5 px-4">Menu Item & Issue</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Department & Staff</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">SLA Deadline</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#9c7d66]">
                    Loading complaints...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#9c7d66]">
                    No complaint tickets found for selected criteria.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2b1d14] font-mono">
                      {c.ticket_number}
                    </td>
                    <td className="py-3.5 px-4 text-[#73533c] text-[11px] font-medium">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">#{c.order_number}</div>
                      <div className="text-[10px] text-[#8e6e55]">{c.customer_name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">{c.item_name || 'General Concern'}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-[#826149]">
                        {c.issue_category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.priority === 'Critical' ? 'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]' :
                        c.priority === 'High' ? 'bg-orange-100 text-orange-900 border border-orange-300' :
                        c.priority === 'Medium' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-[#faf3e8] text-[#6d4c33] border border-[#ebdcc6]'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">{c.department_name}</div>
                      <div className="text-[10px] text-[#8e6e55]">
                        {c.assigned_staff_name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} isOverdue={c.is_overdue} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`text-[11px] font-bold flex items-center space-x-1 ${
                        c.is_overdue ? 'text-[#b9220a]' : 'text-[#6d4c33]'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(c.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-[10px] text-[#8e6e55]">
                        {new Date(c.sla_deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicketId(c.id)}
                        className="px-2.5 py-1 bg-[#24170f] hover:bg-amber-600 text-amber-50 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Manage</span>
                        <ExternalLink className="w-3 h-3 text-amber-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Modal */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onRefresh={fetchComplaints}
      />
    </div>
  );
};
