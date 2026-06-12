import { Target, Info } from 'lucide-react';
import type { SimulationResult } from '../../../shared/types.js';
import { formatNumber } from '../../../shared/monteCarlo.js';

interface Props {
  sim: SimulationResult;
}

export default function P90Widget({ sim }: Props) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-emerald-400" />
        P90 分位数
      </h3>
      <div className="space-y-3">
        {[
          { k: 'p5', label: '5% 分位数 (悲观)', color: 'text-monte-danger', desc: '95% 概率结果高于此值' },
          { k: 'p25', label: '25% 分位数 (保守)', color: 'text-monte-warn', desc: '75% 概率结果高于此值' },
          { k: 'p50', label: '50% 分位数 (中位)', color: 'text-monte-accent', desc: '最可能的中位数结果' },
          { k: 'p75', label: '75% 分位数 (乐观)', color: 'text-emerald-400', desc: '25% 概率结果高于此值' },
          { k: 'p95', label: '95% 分位数 (最佳)', color: 'text-monte-safe', desc: '5% 概率结果高于此值' },
        ].map((p: any) => (
          <div key={p.k} className="flex items-center justify-between p-3 rounded-lg bg-monte-bg/50 border border-monte-border/50">
            <div className="flex-1">
              <div className={`text-sm font-medium ${p.color}`}>{p.label}</div>
              <div className="text-xs text-monte-muted">{p.desc}</div>
            </div>
            <div className={`text-2xl font-bold font-mono ${p.color}`}>
              {formatNumber((sim.percentiles as any)[p.k])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
