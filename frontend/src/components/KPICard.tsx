import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'teal';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'emerald':
        return 'border-[#cce8d5] hover:border-emerald-500';
      case 'amber':
        return 'border-[#f2ddb8] hover:border-amber-500';
      case 'rose':
        return 'border-[#f5cec8] hover:border-rose-500';
      case 'teal':
        return 'border-[#cae8e4] hover:border-teal-500';
      default:
        return 'border-[#ebdcc6] hover:border-amber-400';
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/70';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border border-amber-300/80';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border border-rose-200/70';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border border-teal-200/70';
      default:
        return 'bg-[#faf3e8] text-[#6e4e37] border border-[#e8d7c0]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 shadow-[0_2px_8px_rgba(66,46,32,0.04)] transition-all duration-300 group ${getBorderColor()} ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(66,46,32,0.08)]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a583e]">
          {title}
        </span>
        <div className={`p-2 rounded-xl transition-transform duration-200 group-hover:scale-110 shadow-2xs ${getIconBg()}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-[#2b1d14]">{value}</div>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-[#826149] font-medium">{subtitle}</p>}
    </div>
  );
};
