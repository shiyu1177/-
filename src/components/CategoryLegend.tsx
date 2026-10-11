import React from 'react';
import { TCMNode, TCMCategory } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';
import { Layers } from 'lucide-react';

interface CategoryLegendProps {
  nodes: TCMNode[];
  selectedCategory: TCMCategory | null;
  onSelectCategory: (cat: TCMCategory | null) => void;
}

export const CategoryLegend: React.FC<CategoryLegendProps> = ({
  nodes,
  selectedCategory,
  onSelectCategory,
}) => {
  const counts = React.useMemo(() => {
    const cMap: Record<string, number> = {};
    nodes.forEach(n => {
      cMap[n.category] = (cMap[n.category] || 0) + 1;
    });
    return cMap;
  }, [nodes]);

  const categories = Object.keys(CATEGORY_MAP) as TCMCategory[];

  return (
    <div className="absolute bottom-5 right-6 z-20 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-3 rounded-2xl shadow-2xl text-xs space-y-2 max-w-xs">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400">
        <span className="font-semibold text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          中医实体图例索引
        </span>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-[10px] text-cyan-400 hover:underline"
          >
            重置筛选
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {categories.map(catKey => {
          const catMeta = CATEGORY_MAP[catKey];
          const count = counts[catKey] || 0;
          const isSelected = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => onSelectCategory(isSelected ? null : catKey)}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-all text-[11px] ${
                isSelected
                  ? 'bg-slate-800 ring-1 ring-cyan-500 font-bold text-white'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: catMeta.color }}
                />
                <span className="truncate">{catMeta.label}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1 py-0.2 rounded ml-1">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
