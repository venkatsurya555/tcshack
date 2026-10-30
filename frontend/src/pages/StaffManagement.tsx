import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Department } from '../types';
import {
  Users2,
  Plus,
  Shield,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { user: currentUser, branches } = useAuth();
  const [staff, setStaff] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workload, setWorkload] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Staff Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('department_staff');
  const [deptId, setDeptId] = useState<number | ''>('');
  const [branchId, setBranchId] = useState<number | ''>('');

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const [staffList, deptList, workloadList] = await Promise.all([
        api.getStaff(),
        api.getDepartments(),
        api.getStaffWorkload(),
      ]);
      setStaff(staffList);
      setDepartments(deptList);
      setWorkload(workloadList);
      if (deptList.length > 0 && !deptId) {
        setDeptId(deptList[0].id);
      }
      if (branches.length > 0 && !branchId) {
        setBranchId(branches[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleToggleStatus = async (id: number) => {
    try {
      await api.toggleStaffStatus(id);
      fetchStaffData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStaff({
        username,
        full_name: fullName,
        email,
        password,
        role,
        department_id: deptId ? Number(deptId) : null,
        branch_id: branchId ? Number(branchId) : null,
        is_active: true
      });
      setIsAddOpen(false);
      setUsername('');
      setFullName('');
      setEmail('');
      fetchStaffData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const isSuperAdminOrManager = currentUser?.role === 'super_admin' || currentUser?.role === 'restaurant_manager';

  return (
    <div className="space-y-6 select-none">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            👥
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Staff & Department Directory
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>{staff.length} MEMBERS</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Role-based user directory, kitchen & mess department assignments, and active ticket distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isSuperAdminOrManager && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Staff Account</span>
            </button>
          )}

          <button
            onClick={fetchStaffData}
            className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer hover:border-amber-400"
            title="Refresh Staff"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Staff Directory Table with High-Readability & Tomato Scrollbar */}
      <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-[0_2px_12px_rgba(66,46,32,0.04)] overflow-hidden">
        <div className="overflow-x-auto tomato-sauce-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#faf4ea] border-b border-[#ebdcc6] text-[#7a583e] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Branch / Mess</th>
                <th className="py-3.5 px-4">Active Tickets</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] text-[#3d2a1b]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9c7d66]">Loading staff records...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9c7d66]">No staff members found.</td>
                </tr>
              ) : (
                staff.map((u) => {
                  const wl = workload.find((w) => w.id === u.id);
                  return (
                    <tr key={u.id} className="hover:bg-[#faf4ea]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center text-xs font-bold border border-amber-500/40">
                            {u.full_name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-[#2b1d14]">{u.full_name}</div>
                            <div className="text-[11px] text-[#8e6e55] font-mono">@{u.username} • {u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#faf3e8] text-amber-900 border border-amber-300">
                          <Shield className="w-3 h-3 text-amber-700" />
                          <span>{u.role.replace('_', ' ').toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2b1d14]">
                        {u.department_name || 'Management'}
                      </td>
                      <td className="py-3.5 px-4 text-[#73533c] font-semibold">
                        {u.branch_name || 'All Branches'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-amber-800 text-xs">
                          {wl?.active_tickets ?? 0} active
                        </span>
                        <span className="text-[10px] text-[#8e6e55] ml-1 font-medium">
                          ({wl?.total_assigned ?? 0} total)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.is_active ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]'
                        }`}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isSuperAdminOrManager && (
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className="px-2.5 py-1 text-[11px] font-bold border border-[#ebdcc6] bg-[#faf4ea] hover:bg-white text-[#6d4c33] rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ebdcc6] max-w-md w-full p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#ebdcc6] pb-3">
              <h3 className="text-sm font-bold text-[#2b1d14] font-retro uppercase">Create Staff Account</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-7 h-7 rounded-full bg-[#faf4ea] text-[#7a583e] hover:bg-[#ebdcc6] flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#73533c] font-bold block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Username:</label>
                  <input
                    type="text"
                    required
                    placeholder="ananya_service"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Password:</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#73533c] font-bold block mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="ananya@royalrasoi.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Role:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                  >
                    <option value="department_staff">Department Staff</option>
                    <option value="department_manager">Department Manager</option>
                    <option value="restaurant_manager">Restaurant Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#73533c] font-bold block mb-1">Department:</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#73533c] font-bold block mb-1">Assigned Branch / Mess:</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#faf6f0] border border-[#decbb3] rounded-xl text-[#2b1d14] font-semibold cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
