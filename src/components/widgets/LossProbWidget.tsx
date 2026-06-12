import { AlertTriangle, Sparkles, Info } from 'lucide-react';
import type { SimulationResult } from '../../../shared/types.js';
import { formatNumber, formatPercentage } from '../../../shared/monteCarlo.js';

interface Props {
  sim: SimulationResult;
}

function getRiskLevel(lossProbability: number) {
  if (lossProbability < 0.1) return { level: '低风险', color: 'text-monte-safe', bg: 'bg-monte-safe/15', border: 'border-monte-safe/40', icon: Sparkles };
  if (lossProbability < 0.3) return { level: '中低风险', color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', icon: Info };
  if (lossProbability < 0.5) return { level: '中等风险', color: 'text-monte-warn', bg: 'bg-monte-warn/15', border: 'border-monte-warn/40', icon: AlertTriangle };
  return { level: '高风险', color: 'text-monte-danger', bg: 'bg-monte-danger/15', border: 'border-monte-danger/40', icon: AlertTriangle };
}

export default function LossProbWidget({ sim }: Props) {
  const risk = getRiskLevel(sim.lossProbability);
  const RiskIcon = risk.icon;

  return (
    <div className={`card border-2 ${risk.border}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2.5 rounded-xl ${risk.bg}`}>
          <RiskIcon className={`w-6 h-6 ${risk.color}`} />
        </div>
        <div>
          <div className="text-sm text-monte-muted mb-0.5">风险评估</div>
          <div className={`text-xl font-bold ${risk.color}`}>{risk.level}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-monte-danger/15 to-transparent border border-monte-danger/30">
          <div className="text-xs text-monte-muted uppercase tracking-wider mb-1">亏损概率</div>
          <div className="text-3xl font-bold font-mono text-monte-danger">{formatPercentage(sim.lossProbability)}</div>
          <div className="text-xs text-monte-muted mt-1">低于阈值 {formatNumber(sim.threshold, 0)}</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-monte-safe/15 to-transparent border border-monte-safe/30">
          <div className="text-xs text-monte-muted uppercase tracking-wider mb-1">盈利概率</div>
          <div className="text-3xl font-bold font-mono text-monte-safe">{formatPercentage(1 - sim.lossProbability)}</div>
          <div className="text-xs text-monte-muted mt-1">高于阈值 {formatNumber(sim.threshold, 0)}</div>
        </div>
      </div>
    </div>
  );
}
