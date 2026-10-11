import React, { useState } from 'react';
import { OrganizationDimension, Graph3DLayout } from '../types/tcm';
import { DIMENSION_INFO, LAYOUT_INFO } from '../data/tcmConfig';
import { HelpCircle, Sparkles, Orbit, Grid } from 'lucide-react';

interface KnowledgeOrganizationBarProps {
  currentDimension: OrganizationDimension;
  onChangeDimension: (dim: OrganizationDimension) => void;
  currentLayout: Graph3DLayout;
  onChangeLayout: (layout: Graph3DLayout) => void;
}

export const KnowledgeOrganizationBar: React.FC<KnowledgeOrganizationBarProps> = ({
  currentDimension,
  onChangeDimension,
  currentLayout,
  onChangeLayout,
}) => {
  const [showDimensionHelp, setShowDimensionHelp] = useState(false);

  const dimensions: OrganizationDimension[] = ['all', 'classification', 'thematic', 'relational'];
  const layouts: Graph3DLayout[] = ['force', 'sphere_classification', 'thematic_rings', 'meridian_cube'];

  return (
    <div className="absolute top-20 left-6 z-20 flex flex-col gap-2 max-w-md">
      {/* Dimension Switcher (分类法 / 主题法 / 关系法 / 全景) */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-1.5 rounded-2xl shadow-2xl flex items-center gap-1">
        {dimensions.map(dim => {
          const info = DIMENSION_INFO[dim];
          const isActive = currentDimension === dim;
          return (
            <button
              key={dim}
              onClick={() => onChangeDimension(dim)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.name}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowDimensionHelp(!showDimensionHelp)}
          className={`p-2 rounded-xl transition-colors ${
            showDimensionHelp ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="中医药知识组织三大方法释义"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Layout Switcher */}
      <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl flex items-center gap-1 text-xs">
        <span className="text-[11px] text-slate-400 font-mono pl-2 pr-1 flex items-center gap-1">
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          三维拓扑:
        </span>
        {layouts.map(layoutKey => {
          const lInfo = LAYOUT_INFO[layoutKey];
          const isLActive = currentLayout === layoutKey;
          return (
            <button
              key={layoutKey}
              onClick={() => onChangeLayout(layoutKey)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                isLActive
                  ? 'bg-slate-800 text-cyan-300 font-medium border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
              }`}
              title={lInfo.desc}
            >
              {lInfo.name}
            </button>
          );
        })}
      </div>

      {/* Educational Explanation Box for Knowledge Organization */}
      {showDimensionHelp && (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-2xl shadow-2xl text-xs text-slate-300 space-y-3 animate-fade-in mt-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              中医知识组织方法论
            </span>
            <button
              onClick={() => setShowDimensionHelp(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-emerald-500/20">
              <div className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                <span>🌲 分类法 (Classification Method)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                按照中医门类上下位阶从属关系组织。如八纲分类（阴阳表里寒热虚实）、六经归类（太阳至厥阴）、脏腑经络系统、方剂功效大类（解表剂、清热剂）等。在三维空间中呈现同心天球层级。
              </p>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-amber-500/20">
              <div className="font-semibold text-amber-400 flex items-center gap-1 mb-1">
                <span>📜 主题法 (Thematic Method)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                以中医核心辨证命题或同卷医理研讨为轴心。如“营卫调和论”、“外感风寒化热传变”、“培土生金主线”等。围绕主题引力中心形成螺旋星环，跨越单纯分类壁垒。
              </p>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-rose-500/20">
              <div className="font-semibold text-rose-400 flex items-center gap-1 mb-1">
                <span>⚡ 关系法 (Relational Method)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                以精准的中医实体语义逻辑强关联。包括君臣佐使配伍、方药对证、治法落实、五行相生相克、药力归经引使等。在三维力导向中聚合出高度内聚的临床处方星簇。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
