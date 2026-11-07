import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  glowColor?: string;
  badge?: {
    text: string;
    variant?: 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-400',
  glowColor = 'rgba(34, 197, 94, 0.15)',
  badge,
  onClick,
}) => {
  const badgeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  }[badge?.variant || 'emerald'];

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 border border-slate-800/80 ${
        onClick ? 'cursor-pointer hover:border-slate-700 hover:scale-[1.01]' : ''
      }`}
      style={{
        boxShadow: `0 4px 20px -2px ${glowColor}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight font-mono">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {badge && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeStyles}`}>
            {badge.text}
          </span>
          <span className="text-[11px] text-slate-400">Pure Decimal Precision</span>
        </div>
      )}
    </div>
  );
};
