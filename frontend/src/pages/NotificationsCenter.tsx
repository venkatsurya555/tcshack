import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CustomerNotification } from '../types';
import {
  Bell,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Check,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsCenter: React.FC = () => {
  const { refreshNotificationsCount } = useAuth();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'adapter_logs'>('notifications');

  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const [notifList, logList] = await Promise.all([
        api.getNotifications(false),
        api.getDeliveryLogs(),
      ]);
      setNotifications(notifList);
      setDeliveryLogs(logList);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      await refreshNotificationsCount();
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
            🔔
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#2d1e13] tracking-tight font-retro">
                Customer & Student Notification Center
              </h2>
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>NOTIFICATIONS</span>
              </span>
            </div>
            <p className="text-xs text-[#73533c] font-medium">
              Real-time guest & mess notifications, lifecycle alerts, and simulated SMS/WhatsApp dispatch logs.
            </p>
          </div>
        </div>

        <button
          onClick={fetchNotifs}
          className="p-2 bg-white border border-[#ebdcc6] rounded-xl hover:bg-[#faf4ea] text-[#6d4c33] transition-all hover:scale-105 active:scale-95 shadow-2xs self-start sm:self-auto cursor-pointer hover:border-amber-400"
          title="Refresh Notifications"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
        </button>
      </div>

      {/* Tabs with Warm Amber Underline */}
      <div className="flex space-x-4 border-b border-[#ebdcc6]">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-[#8e6e55] hover:text-[#2b1d14]'
          }`}
        >
          Guest Notifications History ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('adapter_logs')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'adapter_logs'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-[#8e6e55] hover:text-[#2b1d14]'
          }`}
        >
          Mock SMS / WhatsApp Provider Logs ({deliveryLogs.length})
        </button>
      </div>

      {activeTab === 'notifications' ? (
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-[#9c7d66] text-xs">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-[#9c7d66] text-xs">No notifications recorded yet.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 hover:-translate-y-0.5 hover:shadow-xs ${
                  n.is_read
                    ? 'bg-white border-[#ebdcc6] text-[#3d2a1b]'
                    : 'bg-[#faf4ea] border-amber-300 text-[#2b1d14] shadow-2xs'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    n.event_type === 'resolved_verified' ? 'bg-emerald-100 text-emerald-800' :
                    n.event_type === 'ticket_created' ? 'bg-amber-100 text-amber-900' :
                    'bg-[#faf3e8] text-[#7a583e]'
                  }`}>
                    {n.event_type === 'resolved_verified' ? <ShieldCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#2b1d14]">{n.title}</span>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      <span className="text-[10px] px-2 py-0.5 bg-[#faf3e8] border border-[#ebdcc6] rounded-full text-[#7a583e] font-mono font-semibold">
                        {n.channel}
                      </span>
                    </div>

                    <p className="text-xs text-[#73533c] leading-relaxed max-w-2xl font-medium">{n.message}</p>

                    <div className="text-[10px] text-[#8e6e55] flex items-center space-x-3 pt-1 font-semibold">
                      <span>Recipient: {n.customer_name} ({n.customer_phone})</span>
                      <span>•</span>
                      <span>{new Date(n.created_at).toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-bold">{n.delivery_status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {n.ticket_number && (
                    <Link
                      to={`/track/${n.ticket_number}`}
                      target="_blank"
                      className="px-2.5 py-1 bg-white border border-[#ebdcc6] hover:bg-[#faf4ea] text-[#6d4c33] rounded-xl text-[11px] font-bold inline-flex items-center space-x-1 shadow-2xs transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3 h-3 text-amber-700" />
                    </Link>
                  )}

                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 text-[#8e6e55] hover:text-emerald-700 hover:bg-[#faf4ea] rounded-xl transition-colors cursor-pointer"
                      title="Mark Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#ebdcc6] shadow-2xs overflow-hidden">
          <div className="p-4 bg-[#faf4ea] border-b border-[#ebdcc6] text-xs text-[#73533c] font-medium">
            <span className="font-bold text-[#2b1d14]">Simulated Gateway Adapter:</span> Local notification adapter simulating real webhook responses from SMS/Email gateways.
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf4ea]/60 text-[#7a583e] font-bold uppercase text-[10px] tracking-wider border-b border-[#ebdcc6]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Adapter Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3e9db] font-mono text-[11px] text-[#2b1d14]">
              {deliveryLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#faf4ea]/60 transition-colors">
                  <td className="py-2.5 px-4 text-[#8e6e55] font-sans">{new Date(l.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 px-4 font-bold text-[#2b1d14]">{l.channel}</td>
                  <td className="py-2.5 px-4 text-[#73533c]">{l.recipient}</td>
                  <td className="py-2.5 px-4 text-emerald-800 font-bold">{l.status}</td>
                  <td className="py-2.5 px-4 text-[#8e6e55] truncate max-w-xs">{l.provider_response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
