import { useState, useRef, useCallback } from 'react';
import { X, GripVertical, Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  WIDGET_META,
  DEFAULT_LAYOUT,
  type WidgetKey,
  type WidgetConfig,
  type DashboardLayout,
} from '@/hooks/useDashboardConfig';

interface Props {
  layout: DashboardLayout;
  onToggle: (key: WidgetKey) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReset: () => void;
  onClose: () => void;
}

export default function DashboardSettings({ layout, onToggle, onReorder, onReset, onClose }: Props) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(layout.widgets);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => {
    dragIndex.current = idx;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIndex(idx);
  }, []);

  const handleDrop = useCallback((toIdx: number) => {
    const fromIdx = dragIndex.current;
    if (fromIdx !== null && fromIdx !== toIdx) {
      const arr = [...widgets];
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      setWidgets(arr);
      onReorder(fromIdx, toIdx);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  }, [widgets, onReorder]);

  const handleDragEnd = useCallback(() => {
    dragIndex.current = null;
    setDragOverIndex(null);
  }, []);

  const handleToggle = useCallback((key: WidgetKey) => {
    setWidgets(prev => prev.map(w => w.key === key ? { ...w, visible: !w.visible } : w));
    onToggle(key);
  }, [onToggle]);

  const handleReset = useCallback(() => {
    setWidgets(DEFAULT_LAYOUT.widgets);
    onReset();
  }, [onReset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-monte-muted hover:text-white hover:bg-monte-border transition-all">
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">仪表盘设置</h2>
        <p className="text-sm text-monte-muted mb-5">选择要显示的卡片，拖拽调整顺序</p>

        <div className="space-y-2">
          {widgets.map((w, idx) => {
            const meta = WIDGET_META[w.key];
            const isDragging = dragOverIndex === idx;
            return (
              <div
                key={w.key}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? 'border-monte-accent/60 bg-monte-accent/10'
                    : 'border-monte-border/50 bg-monte-bg/50 hover:border-monte-accent/30'
                } ${!w.visible ? 'opacity-50' : ''}`}
              >
                <GripVertical className="w-4 h-4 text-monte-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{meta.label}</div>
                  <div className="text-xs text-monte-muted truncate">{meta.description}</div>
                </div>
                <button
                  onClick={() => handleToggle(w.key)}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    w.visible
                      ? 'text-monte-accent hover:bg-monte-accent/15'
                      : 'text-monte-muted hover:bg-monte-border'
                  }`}
                  title={w.visible ? '隐藏' : '显示'}
                >
                  {w.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-monte-border">
          <button onClick={handleReset} className="btn-secondary text-sm py-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            恢复默认
          </button>
          <button onClick={onClose} className="btn-primary text-sm py-1.5">
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
