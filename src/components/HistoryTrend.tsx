import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { SimulationResult } from '../../shared/types.js';
import { formatNumber, formatPercentage } from '../../shared/monteCarlo.js';

interface Props {
  simulations: SimulationResult[];
}

export default function HistoryTrend({ simulations }: Props) {
  const data = useMemo(() => {
    return [...simulations]
      .reverse()
      .map((sim, idx) => ({
        name: sim.runName || `#${idx + 1}`,
        mean: sim.mean,
        lossProb: +(sim.lossProbability * 100).toFixed(1),
        p90: sim.percentiles.p95,
        p10: sim.percentiles.p5,
        iterations: sim.iterations,
        timestamp: sim.timestamp,
      }));
  }, [simulations]);

  if (simulations.length < 2) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-monte-accent" />
          历史趋势
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-monte-muted text-sm">
          <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
          <p>至少需要 2 次模拟才能展示趋势</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-monte-accent" />
        历史趋势
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={(v) => formatNumber(v, 0)}
              width={55}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={(v) => `${v}%`}
              width={45}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#E2E8F0',
                fontSize: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
              formatter={(value: number, name: string) => {
                if (name === '亏损概率') return [`${formatNumber(value, 1)}%`, name];
                return [formatNumber(value, 2), name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="mean"
              name="均值"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4, fill: '#6366F1' }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="p90"
              name="P95"
              stroke="#10B981"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: '#10B981' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="lossProb"
              name="亏损概率"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 4, fill: '#EF4444' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
