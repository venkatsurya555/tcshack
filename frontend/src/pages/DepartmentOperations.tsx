import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { TicketDetailModal } from '../components/TicketDetailModal';
import {
  Utensils,
  ConciergeBell,
  Receipt,
  Package,
  Bike,
  ShieldAlert,
  UserCheck,
  RefreshCw,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface DeptConfig {
  code: string;
  name: string;
  icon: any;
  description: string;
}

const DEPARTMENTS: DeptConfig[] = [
  { code: 'kitchen', name: 'Kitchen & Culinary', icon: Utensils, description: 'Food taste, preparation quality, temperature & recipes' },
  { code: 'service', name: 'Service & Hospitality', icon: ConciergeBell, description: 'Floor staff behavior, order delay & dining comfort' },
  { code: 'billing', name: 'Billing & Cashier', icon: Receipt, description: 'Invoice discrepancy, payment gateway & tax questions' },
  { code: 'packing', name: 'Packaging & Dispatch', icon: Package, description: 'Spillages, containers, tamper seals & cutlery' },
  { code: 'delivery', name: 'Delivery Operations', icon: Bike, description: 'Transit delays, rider coordination & packaging damage' },
  { code: 'management', name: 'Executive Management', icon: ShieldAlert, description: 'Cross-functional escalations & critical guest retention' },
];

export const DepartmentOperations: React.FC = () => {
  const { user, selectedBranchId } = useAuth();
  
  // Set default active tab based on user's department if staff, else Kitchen
  const [activeDeptCode, setActiveDeptCode] = useState<string>('kitchen');
  const [deptData, setDeptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.department_name) {
      const match = DEPARTMENTS.find((d) => user.department_name?.toLowerCase().includes(d.code));
      if (match) setActiveDeptCode(match.code);
    }
  }, [user]);

  const fetchDepartmentData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDepartmentOperations(activeDeptCode, selectedBranchId || undefined);
      setDeptData(res);
    } catch (err: any) {
      console.error('Error fetching department operations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [activeDeptCode, selectedBranchId]);

  const activeDept = DEPARTMENTS.find((d) => d.code === activeDeptCode) || DEPARTMENTS[0];
  const Icon = activeDept.icon;

  const metrics = deptData?.metrics;

  return (
    <div className="space-y-6">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            👨‍🍳
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Department Operations Dashboard
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{activeDept.name.toUpperCase()}</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Dedicated kitchen & mess department workspaces, staff queues, and targeted resolution pipelines.
            </p>
          </div>
        </div>

        <button
          onClick={fetchDepartmentData}
          className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs self-start sm:self-auto cursor-pointer hover:border-amber-400"
          title="Refresh Department"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {/* Department Selector Interactive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEPARTMENTS.map((dept) => {
          const DIcon = dept.icon;
          const isActive = activeDeptCode === dept.code;
          return (
            <button
              key={dept.code}
              onClick={() => setActiveDeptCode(dept.code)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-br from-[#291a11] to-[#1c120a] text-amber-50 border-2 border-amber-500 shadow-md scale-102 ring-2 ring-amber-500/20'
                  : 'bg-white text-[#6d4c33] border-[#ebdcc6] hover:border-amber-400 hover:bg-[#faf4ea] hover:-translate-y-0.5 shadow-2xs'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DIcon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-amber-700'}`} />
                <span className="text-xs font-bold truncate">{dept.name.split(' ')[0]}</span>
              </div>
              <div className={`text-[10px] mt-1 line-clamp-1 font-semibold ${isActive ? 'text-amber-200/80' : 'text-[#8c6d54]'}`}>
                {dept.code.toUpperCase()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Department Focus Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-800 shadow-2xs">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2b1d14] font-retro">{activeDept.name}</h3>
            <p className="text-xs text-[#73533c] font-medium">{activeDept.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-[#8e6e55] block text-[10px] uppercase font-bold">Standard SLA</span>
            <span className="font-bold text-[#2b1d14] text-sm">{deptData?.department?.sla_hours || 2} Hours</span>
          </div>
          <div>
            <span className="text-[#8e6e55] block text-[10px] uppercase font-bold">Avg Resolution</span>
            <span className="font-bold text-amber-700 text-sm">{metrics?.avg_resolution_time_hours || 0} Hours</span>
          </div>
          <div>
            <span className="text-[#8e6e55] block text-[10px] uppercase font-bold">Active Staff</span>
            <span className="font-bold text-[#2b1d14] text-sm">{deptData?.staff_workload?.length || 0} Members</span>
          </div>
        </div>
      </div>

      {/* 5 Department Operation Counters with Micro-Lift */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">New Queue</span>
          <div className="text-2xl font-bold text-amber-800 mt-1">{metrics?.new_count ?? 0}</div>
          <span className="text-[10px] text-[#a48871] font-medium">Awaiting dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">Assigned</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{metrics?.pending_ack_count ?? 0}</div>
          <span className="text-[10px] text-[#a48871] font-medium">Needs acknowledge</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">Investigating</span>
          <div className="text-2xl font-bold text-[#2b1d14] mt-1">{metrics?.in_progress_count ?? 0}</div>
          <span className="text-[10px] text-[#a48871] font-medium">Under remediation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">Pending Verification</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics?.pending_verification_count ?? 0}</div>
          <span className="text-[10px] text-[#a48871] font-medium">Manager review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#ebdcc6] shadow-2xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8e6e55]">Overdue SLA</span>
          <div className="text-2xl font-bold text-[#b9220a] mt-1">{metrics?.overdue_count ?? 0}</div>
          <span className="text-[10px] text-[#a48871] font-medium">Escalated breach</span>
        </div>
      </div>

      {/* Staff Workload Table */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ebdcc6] bg-[#faf4ea] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a583e]">
              Department Staff Workload
            </h4>
          </div>
          <span className="text-[11px] text-[#8e6e55] font-semibold">Active ticket distribution</span>
        </div>
        <div className="divide-y divide-[#f3e9db]">
          {deptData?.staff_workload?.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9c7d66]">
              No staff members explicitly registered under this department.
            </div>
          ) : (
            deptData?.staff_workload?.map((s: any) => (
              <div key={s.staff_id} className="p-4 flex items-center justify-between hover:bg-[#faf4ea]/70 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center text-xs font-bold border border-amber-500/40">
                    {s.full_name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2b1d14]">{s.full_name}</div>
                    <div className="text-[10px] text-[#8e6e55]">@{s.username}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs">
                  <div>
                    <span className="text-[#8e6e55] text-[10px] block font-semibold">Active:</span>
                    <span className="font-bold text-amber-700">{s.active_tickets}</span>
                  </div>
                  <div>
                    <span className="text-[#8e6e55] text-[10px] block font-semibold">Resolved:</span>
                    <span className="font-bold text-emerald-700">{s.total_tickets - s.active_tickets}</span>
                  </div>
                  <div>
                    <span className="text-[#8e6e55] text-[10px] block font-semibold">Total:</span>
                    <span className="font-bold text-[#2b1d14]">{s.total_tickets}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assigned Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.03)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#ebdcc6] bg-[#faf4ea] flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a583e]">
            {activeDept.name} Active Complaints Queue
          </h4>
          <span className="text-[11px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
            {deptData?.tickets?.length || 0} tickets
          </span>
        </div>
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea]/60 border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Dish & Issue</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA Deadline</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#9c7d66]">
                    Loading department tickets...
                  </td>
                </tr>
              ) : deptData?.tickets?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-emerald-700 font-medium">
                    No active tickets assigned to {activeDept.name}. Great job!
                  </td>
                </tr>
              ) : (
                deptData?.tickets?.map((t: any) => (
                  <tr key={t.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-[#2b1d14]">{t.ticket_number}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1d14]">{t.item_name}</div>
                      <div className="text-[10px] text-[#8e6e55] font-semibold">{t.issue_category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === 'Critical' ? 'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]' :
                        t.priority === 'High' ? 'bg-orange-100 text-orange-900 border border-orange-300' :
                        'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#2b1d14] font-medium">
                      {t.assigned_staff_name || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={t.status} isOverdue={t.is_overdue} />
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-[#73533c] font-medium">
                      {new Date(t.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
                        className="px-2.5 py-1 bg-[#24170f] hover:bg-amber-600 text-amber-50 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Inspect</span>
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

      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onRefresh={fetchDepartmentData}
      />
    </div>
  );
};
