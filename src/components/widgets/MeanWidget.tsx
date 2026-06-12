import { BarChart2, TrendingUp, DollarSign, Sigma } from 'lucide-react';
import type { SimulationResult } from '../../../shared/types.js';
import { formatNumber, formatPercentage } from '../../../shared/monteCarlo.js';
import StatsCards from '../StatsCards';

interface Props {
  sim: SimulationResult;
}

export default function MeanWidget({ sim }: Props) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-indigo-400" />
        均值指标
      </h3>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/15 to-transparent border border-indigo-500/30">
          <div className="text-xs text-monte-muted uppercase tracking-wider mb-1">期望净现值</div>
          <div className={`text-2xl font-bold font-mono ${sim.mean >= 0 ? 'text-monte-safe' : 'text-monte-danger'}`}>
            {sim.mean >= 0 ? '+' : ''}{formatNumber(sim.mean)}
          </div>
          <div className="text-xs text-monte-muted mt-1">标准差 ±{formatNumber(sim.stdDev)}</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-monte-warn/15 to-transparent border border-monte-warn/30">
          <div className="text-xs text-monte-muted uppercase tracking-wider mb-1">95% VaR</div>
          <div className="text-2xl font-bold font-mono text-monte-warn">{formatNumber(sim.var95)}</div>
          <div className="text-xs text-monte-muted mt-1">最坏5%情景下的净值</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/15 to-transparent border border-purple-500/30">
          <div className="text-xs text-monte-muted uppercase tracking-wider mb-1">中位数</div>
          <div className="text-2xl font-bold font-mono text-purple-300">{formatNumber(sim.median)}</div>
          <div className="text-xs text-monte-muted mt-1">50% 概率结果高于此值</div>
        </div>
      </div>
      <StatsCards sim={sim} />
    </div>
  );
}
