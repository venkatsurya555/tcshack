import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AnalyticsReport } from '../types';
import { KPICard } from '../components/KPICard';
import {
  MessageSquareQuote,
  Star,
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Timer,
  Filter,
  RefreshCw,
  TrendingUp,
  BarChart2,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

// Warm Appetizing Food & Hospitality Palette
const COLORS = ['#d97706', '#ea580c', '#0284c7', '#16a34a', '#8b5cf6', '#b45309'];

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { selectedBranchId } = useAuth();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getCharts(selectedBranchId || undefined, undefined, days);
      setData(res);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedBranchId, days]);

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      {/* Quick Access Hero Card for Evaluators & Diners */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-3 border border-amber-500/50">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/30 flex items-center justify-center text-2xl shrink-0 border border-amber-300/40">
            🍔
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-wide">
                Interactive Food & Mess Review Portal
              </h3>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Revolving Emojis Active
              </span>
            </div>
            <p className="text-xs text-amber-100/90 mt-0.5">
              Experience the animated burger review card, orbital emoji animations, and tomato sauce rating slider.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/theme-preview"
            className="px-4 py-2 bg-white text-amber-950 font-bold rounded-xl text-xs hover:bg-amber-50 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center space-x-1.5"
          >
            <span>Open Customer Review Theme</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>

      {/* Page Header with Food Icon, Warm Hospitality Badge, & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#faf3e8] border border-[#e8d7c0] flex items-center justify-center text-2xl shadow-xs animate-admin-steam">
            🍽️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Operations & Hospitality Dashboard
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>LIVE TELEMETRY</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Real-time multi-cuisine restaurant & student mess feedback, taste QA, and SLA resolution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-[#ebdcc6] rounded-xl px-3 py-1.5 shadow-2xs transition-colors hover:border-amber-400">
            <Filter className="w-3.5 h-3.5 text-amber-700" />
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="text-xs font-semibold text-[#3d2b1f] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>

          <button
            onClick={fetchDashboardData}
            className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer hover:border-amber-400"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 9 Core KPI Cards with Warm Food Palette and Subtle Lift */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <KPICard
          title="Total Feedback"
          value={kpis?.total_feedback ?? '...'}
          subtitle="Customer & Student submissions"
          icon={<MessageSquareQuote className="w-5 h-5" />}
          trend={{ value: '14%', isPositive: true }}
          onClick={() => navigate('/feedback')}
        />

        <KPICard
          title="Average Customer Rating"
          value={`${kpis?.average_customer_rating ?? '...'} / 5.0`}
          subtitle="Calculated across all item ratings"
          icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
          variant="amber"
          trend={{ value: '0.3 pts', isPositive: true }}
          onClick={() => navigate('/feedback')}
        />

        <KPICard
          title="Total Complaints"
          value={kpis?.total_complaints ?? '...'}
          subtitle="Escalated ticket records"
          icon={<Ticket className="w-5 h-5" />}
          variant="amber"
          onClick={() => navigate('/complaints')}
        />

        <KPICard
          title="Open Complaints"
          value={kpis?.open_complaints ?? '...'}
          subtitle="New, Assigned & In Review"
          icon={<AlertCircle className="w-5 h-5" />}
          variant="amber"
          onClick={() => navigate('/complaints')}
        />

        <KPICard
          title="In Progress"
          value={kpis?.in_progress_complaints ?? '...'}
          subtitle="Under department investigation"
          icon={<Clock className="w-5 h-5" />}
          variant="default"
          onClick={() => navigate('/complaints')}
        />

        <KPICard
          title="Resolved Complaints"
          value={kpis?.resolved_complaints ?? '...'}
          subtitle="Verified by restaurant/mess managers"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="emerald"
          trend={{ value: '100% verified', isPositive: true }}
          onClick={() => navigate('/complaints')}
        />

        <KPICard
          title="Overdue Complaints"
          value={kpis?.overdue_complaints ?? '...'}
          subtitle="Exceeded SLA target deadline"
          icon={<AlertTriangle className="w-5 h-5" />}
          variant="rose"
          onClick={() => navigate('/complaints?filter=overdue')}
        />

        <KPICard
          title="Resolution Rate"
          value={`${kpis?.resolution_rate ?? '...'}%`}
          subtitle="Total resolved vs raised"
          icon={<Percent className="w-5 h-5" />}
          variant="emerald"
          onClick={() => navigate('/analytics')}
        />

        <KPICard
          title="Avg Resolution Time"
          value={`${kpis?.average_resolution_time_hours ?? '...'} hrs`}
          subtitle="Target: under 2.5 hrs"
          icon={<Timer className="w-5 h-5" />}
          variant="teal"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Interactive Visualizations Grid with Warm Borders & Hover Lift */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Feedback Volume & Rating Over Time */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Feedback Volume Trend
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Daily customer & student submissions</p>
            </div>
            <TrendingUp className="w-4 h-4 text-amber-600 transition-transform group-hover:scale-120" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.feedback_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f6ede3" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="feedback_count" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" name="Feedbacks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Rating Distribution (1 - 5 Stars) */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Item Rating Distribution
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Breakdown from 1 to 5 stars</p>
            </div>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 transition-transform group-hover:rotate-12" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.rating_distribution || []} layout="vertical" margin={{ top: 10, right: 20, left: 25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f6ede3" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <YAxis dataKey="rating" type="category" tick={{ fontSize: 11, fill: '#3d2a1b', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Ratings Count">
                  {data?.rating_distribution?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.stars >= 4 ? '#16a34a' : entry.stars === 3 ? '#d97706' : '#ea3a1e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Complaints by Department */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Complaints by Department
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Automated routing volume</p>
            </div>
            <BarChart2 className="w-4 h-4 text-amber-700 transition-transform group-hover:scale-120" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.complaints_by_department || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f6ede3" />
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} name="Ticket Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Complaints by Issue Category */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Complaints by Category
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Classification distribution</p>
            </div>
            <Ticket className="w-4 h-4 text-amber-700 transition-transform group-hover:scale-120" />
          </div>
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
                <Tooltip
                  contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-[10px] text-[#6d4c33] font-medium">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Most Frequently Reported Menu Items */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Top Reported Menu Items
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Items requiring kitchen recipe or mess audit</p>
            </div>
            <Ticket className="w-4 h-4 text-rose-500" />
          </div>
          <div className="space-y-3">
            {data?.top_reported_items?.length === 0 ? (
              <p className="text-xs text-[#a48871] py-6 text-center">No item complaints recorded.</p>
            ) : (
              data?.top_reported_items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#faf4ea] border border-[#ebdcc6] hover:scale-[1.01] transition-transform">
                  <div className="flex items-center space-x-3">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#2d1e13]">{item.item_name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af]">
                    {item.complaint_count} issues
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Resolution Time Trends */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebdcc6] shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 hover:shadow-[0_6px_18px_rgba(66,46,32,0.08)] group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2d1e13]">
                Resolution Time Trends (Hours)
              </h3>
              <p className="text-[11px] text-[#7c5a40]">Target vs Actual weekly performance</p>
            </div>
            <Timer className="w-4 h-4 text-amber-700 transition-transform group-hover:scale-120" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.resolution_time_trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f6ede3" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7a5a42' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#261a12', border: '1px solid #4d3728', color: '#fff', borderRadius: '10px', fontSize: '11px' }}
                />
                <Legend formatter={(val) => <span className="text-[10px] text-[#6d4c33] font-medium">{val}</span>} />
                <Line type="monotone" dataKey="target_hours" stroke="#bca490" strokeDasharray="5 5" name="SLA Target (h)" />
                <Line type="monotone" dataKey="actual_hours" stroke="#d97706" strokeWidth={2.5} name="Actual Avg (h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
