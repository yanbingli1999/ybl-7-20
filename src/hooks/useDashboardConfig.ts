import { useState, useCallback, useEffect } from 'react';

export type WidgetKey = 'mean' | 'p90' | 'lossProb' | 'histogram' | 'sensitivity' | 'trend';

export interface WidgetConfig {
  key: WidgetKey;
  visible: boolean;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
}

export const WIDGET_META: Record<WidgetKey, { label: string; description: string }> = {
  mean: { label: '均值指标', description: '期望净现值、VaR95 等核心指标' },
  p90: { label: 'P90 分位数', description: '5%/95% 分位数与分位详情' },
  lossProb: { label: '亏损概率', description: '亏损概率与风险等级评估' },
  histogram: { label: '分布直方图', description: '蒙特卡洛模拟结果分布' },
  sensitivity: { label: '敏感性分析', description: '各变量对结果的影响贡献' },
  trend: { label: '历史趋势', description: '多次模拟的均值与风险趋势' },
};

export const DEFAULT_LAYOUT: DashboardLayout = {
  widgets: [
    { key: 'lossProb', visible: true },
    { key: 'mean', visible: true },
    { key: 'p90', visible: true },
    { key: 'histogram', visible: true },
    { key: 'sensitivity', visible: true },
    { key: 'trend', visible: true },
  ],
};

function getStorageKey(projectId: string) {
  return `dashboard-layout-${projectId}`;
}

function loadLayout(projectId: string): DashboardLayout {
  try {
    const raw = localStorage.getItem(getStorageKey(projectId));
    if (raw) {
      const parsed = JSON.parse(raw) as DashboardLayout;
      const allKeys = Object.keys(WIDGET_META) as WidgetKey[];
      const existingKeys = new Set(parsed.widgets.map(w => w.key));
      const widgets = parsed.widgets.filter(w => allKeys.includes(w.key));
      for (const k of allKeys) {
        if (!existingKeys.has(k)) {
          widgets.push({ key: k, visible: true });
        }
      }
      return { widgets };
    }
  } catch {}
  return DEFAULT_LAYOUT;
}

function saveLayout(projectId: string, layout: DashboardLayout) {
  localStorage.setItem(getStorageKey(projectId), JSON.stringify(layout));
}

export function useDashboardConfig(projectId: string) {
  const [layout, setLayoutState] = useState<DashboardLayout>(() => loadLayout(projectId));

  useEffect(() => {
    setLayoutState(loadLayout(projectId));
  }, [projectId]);

  const setLayout = useCallback((updater: (prev: DashboardLayout) => DashboardLayout) => {
    setLayoutState(prev => {
      const next = updater(prev);
      saveLayout(projectId, next);
      return next;
    });
  }, [projectId]);

  const toggleWidget = useCallback((key: WidgetKey) => {
    setLayout(prev => ({
      widgets: prev.widgets.map(w =>
        w.key === key ? { ...w, visible: !w.visible } : w
      ),
    }));
  }, [setLayout]);

  const reorderWidgets = useCallback((fromIndex: number, toIndex: number) => {
    setLayout(prev => {
      const arr = [...prev.widgets];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return { widgets: arr };
    });
  }, [setLayout]);

  const visibleWidgets = layout.widgets.filter(w => w.visible);

  return { layout, visibleWidgets, toggleWidget, reorderWidgets, setLayout };
}
