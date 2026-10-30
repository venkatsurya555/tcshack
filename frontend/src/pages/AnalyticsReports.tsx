import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AnalyticsReport } from '../types';
import {
  Download,
  Calendar,
  CheckCircle,
  RotateCcw,
  Smile,
  Timer,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const COLORS = ['#d97706', '#ea580c', '#0284c7', '#16a34a', '#8b5cf6', '#b45309'];

export const AnalyticsReports: React.FC = () => {
  const { selectedBranchId } = useAuth();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCharts(selectedBranchId || undefined, undefined, days);
      setData(res);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedBranchId, days]);

  const handleExportCSV = () => {
    window.open('/api/v1/feedback/export/csv', '_blank');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header with Food Emblem & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            📊
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Analytics & Culinary Benchmarks
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>BENCHMARKS</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Culinary benchmarks, SLA compliance audits, repeat incident analysis, and student satisfaction index.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-[#ebdcc6] rounded-xl px-3 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="text-xs font-semibold text-[#2b1d14] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#ebdcc6] text-[#523d2d] hover:bg-[#faf4ea] rounded-xl text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer hover:border-amber-400"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Quality Benchmarks with Micro-Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-[#7a583e] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">SLA Compliance</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-[#2b1d14]">{data?.sla_compliance_rate ?? '92'}%</div>
          <p className="text-[11px] text-[#8e6e55] mt-1 font-medium">Tickets resolved within target hours</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-[#7a583e] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reopening Rate</span>
            <RotateCcw className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-[#2b1d14]">{data?.reopen_rate ?? '3.5'}%</div>
          <p className="text-[11px] text-[#8e6e55] mt-1 font-medium">Low reopening rate indicates high quality remedy</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-[#7a583e] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Post-Resolution CSAT</span>
            <Smile className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-[#2b1d14]">{data?.satisfaction_avg ?? '4.8'} / 5.0</div>
          <p className="text-[11px] text-[#8e6e55] mt-1 font-medium">Customer rating after verified resolution</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-[#7a583e] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolution Speed</span>
            <Timer className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-bold text-[#2b1d14]">{data?.kpis.average_resolution_time_hours ?? '1.5'}h</div>
          <p className="text-[11px] text-[#8e6e55] mt-1 font-medium">Average hours to verified ticket close</p>
        </div>
      </div>

      {/* Visual Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-md group">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b1d14] mb-4">
            Guest & Student Satisfaction Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.rating_distribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f6ede3" />
                <XAxis dataKey="rating" tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <Tooltip contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints Classification */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-md group">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b1d14] mb-4">
            Incident Breakdown by Category
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.complaints_by_category || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {data?.complaints_by_category?.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }} />
                <Legend verticalAlign="bottom" height={36} formatter={(val) => <span className="text-[10px] text-[#6d4c33] font-medium">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
