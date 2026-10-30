import React from 'react';

interface StatusBadgeProps {
  status: string;
  isOverdue?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isOverdue }) => {
  if (isOverdue && status !== 'Resolved' && status !== 'Closed') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fde8e5] text-[#b9220a] border border-[#f5b8af] shadow-2xs animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ea3a1e]" />
        <span>Overdue SLA</span>
      </span>
    );
  }

  const s = status.toLowerCase();

  if (s === 'resolved' || s === 'closed' || s === 'completed' || s === 'active') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>{status}</span>
      </span>
    );
  }

  if (s === 'resolved pending verification') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        <span>Pending Verification</span>
      </span>
    );
  }

  if (s === 'in progress' || s === 'assigned' || s === 'acknowledged') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>{status}</span>
      </span>
    );
  }

  if (s === 'new') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#faf3e8] text-amber-900 border border-amber-300 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
        <span>New Ticket</span>
      </span>
    );
  }

  if (s === 'reopened' || s === 'urgent' || s === 'critical') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f5ede1] text-[#634631] border border-[#e5d5bf]">
      <span>{status}</span>
    </span>
  );
};
