import React, { useMemo } from 'react';
import { TCMNode, TCMRelation } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';
import {
  X,
  Scale,
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface NodeComparisonPanelProps {
  nodeA: TCMNode;
  nodeB: TCMNode;
  relations: TCMRelation[];
  onClose: () => void;
  onSelectSingleNode: (node: TCMNode) => void;
  onStartPathTrace?: (startId: string, endId: string) => void;
}

export const NodeComparisonPanel: React.FC<NodeComparisonPanelProps> = ({
  nodeA,
  nodeB,
  relations,
  onClose,
  onSelectSingleNode,
  onStartPathTrace,
}) => {
  const catA = CATEGORY_MAP[nodeA.category] || CATEGORY_MAP.theory;
  const catB = CATEGORY_MAP[nodeB.category] || CATEGORY_MAP.theory;

  // Direct relationship between Node A and Node B
  const directRelation = useMemo(() => {
    return relations.find(
      r =>
        (r.source === nodeA.id && r.target === nodeB.id) ||
        (r.source === nodeB.id && r.target === nodeA.id)
    );
  }, [nodeA, nodeB, relations]);

  // Differential diagnosis analysis between A and B
  const comparisonInsights = useMemo(() => {
    const insights: {
      type: string;
      title: string;
      content: string;
      isComplementary?: boolean;
    }[] = [];

    // 1. Nature & Flavor (四气五味)
    const natureA = nodeA.properties?.nature || '';
    const natureB = nodeB.properties?.nature || '';
    if (natureA || natureB) {
      let analysis = '';
      if (natureA.includes('温') && natureB.includes('寒')) {
        analysis = '二者寒温异趋，常可相反相成。温药制寒药之凝滞，寒药制温药之燥热（如麻黄配石膏、桂枝配芍药）。';
      } else if ((natureA.includes('辛') && natureB.includes('酸')) || (natureA.includes('酸') && natureB.includes('辛'))) {
        analysis = '辛散与酸收并用，成“一散一敛”之绝妙法度。辛以开腠解肌，酸以敛阴和营，散不伤正，收不留邪。';
      } else if (natureA.includes('温') && natureB.includes('温')) {
        analysis = '二者同属温性，同气相求，气味相投，合用能增强温经散寒、助阳通脉之功。';
      } else if (natureA.includes('甘') && natureB.includes('甘')) {
        analysis = '二者皆味甘，甘能补虚和中、缓急止痛，共奏滋养培本之力。';
      } else {
        analysis = `【${nodeA.name}】性味为「${natureA || '未详'}」，【${nodeB.name}】性味为「${natureB || '未详'}」，气味互补调和。`;
      }
      insights.push({
        type: 'nature',
        title: '性味气血取向差异',
        content: analysis,
        isComplementary: true,
      });
    }

    // 2. Meridian Tropism (归经)
    const tropismA = nodeA.properties?.meridianTropism || '';
    const tropismB = nodeB.properties?.meridianTropism || '';
    if (tropismA || tropismB) {
      let analysis = '';
      if (tropismA === tropismB && tropismA) {
        analysis = `二者同归【${tropismA}】，药力直达同脏腑经络，靶向性强，有相须相长之协同。`;
      } else {
        analysis = `【${nodeA.name}】引经入【${tropismA || '脏腑'}】，【${nodeB.name}】引经入【${tropismB || '脏腑'}】。二者归经互涉，可兼顾不同脏腑经络，调停表里。`;
      }
      insights.push({
        type: 'tropism',
        title: '经络脏腑靶向对比',
        content: analysis,
      });
    }

    // 3. Category / Syndrome Pathology (病理与类别差异)
    if (nodeA.category === nodeB.category) {
      insights.push({
        type: 'category',
        title: `同类实体鉴别要点 (${catA.label})`,
        content: `二者同属【${catA.label}】范畴，但在临床指征上：【${nodeA.name}】侧重于“${nodeA.description.slice(0, 32)}...”，而【${nodeB.name}】侧重于“${nodeB.description.slice(0, 32)}...”。临证需审因辨机，切中病机要害。`,
      });
    } else {
      insights.push({
        type: 'category',
        title: '跨门类理法方药协同',
        content: `【${nodeA.name}】属【${catA.label}】，【${nodeB.name}】属【${catB.label}】。二者分属不同知识层阶，贯穿了“知其证、明治法、施方药”的理法方药传导链条。`,
      });
    }

    return insights;
  }, [nodeA, nodeB, catA, catB]);

  return (
    <div className="absolute top-20 right-6 w-[420px] max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl z-30 flex flex-col text-slate-200 animate-slide-left scrollbar-thin scrollbar-thumb-slate-700">
      {/* Header Banner */}
      <div className="p-5 pb-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-serif flex items-center gap-1.5">
                <span>中医知识点属性对比</span>
                <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ctrl/Cmd 选中
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                双节点性味归经、病机表里与配伍鉴别
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="退出对比模式"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 text-xs">
        {/* Dual Node Cards Header */}
        <div className="grid grid-cols-2 gap-3 relative">
          {/* Node A Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${catA.twBg} ${catA.twColor} border ${catA.twBorder}`}>
                  {catA.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">甲</span>
              </div>
              <h4 className="font-bold text-white text-sm font-serif truncate" title={nodeA.name}>
                {nodeA.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {nodeA.description}
              </p>
            </div>
            <button
              onClick={() => onSelectSingleNode(nodeA)}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 pt-1"
            >
              <span>聚焦单项</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Node B Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${catB.twBg} ${catB.twColor} border ${catB.twBorder}`}>
                  {catB.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">乙</span>
              </div>
              <h4 className="font-bold text-white text-sm font-serif truncate" title={nodeB.name}>
                {nodeB.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {nodeB.description}
              </p>
            </div>
            <button
              onClick={() => onSelectSingleNode(nodeB)}
              className="text-[10px] text-rose-400 hover:underline flex items-center gap-1 pt-1"
            >
              <span>聚焦单项</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Center VS Indicator */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center font-bold text-[10px] text-cyan-300 shadow-md">
            VS
          </div>
        </div>

        {/* Existing Direct Relation between Node A and Node B */}
        {directRelation ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>典籍现有明确关联：{directRelation.relationType}</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              {directRelation.description}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>当前图谱无显式直接连线，属隐性脉络。</span>
            </div>
          </div>
        )}

        {/* Detailed Property Comparison Table */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            核心性味归经与病理属性对照
          </h4>

          <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800 bg-slate-950/60">
            {/* 四气五味 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">四气五味</span>
              <span className="text-emerald-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.properties?.nature || '—'}
              </span>
              <span className="text-emerald-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.properties?.nature || '—'}
              </span>
            </div>

            {/* 药力归经 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">药力归经</span>
              <span className="text-blue-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.properties?.meridianTropism || '—'}
              </span>
              <span className="text-blue-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.properties?.meridianTropism || '—'}
              </span>
            </div>

            {/* 配伍角色 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">配伍角色</span>
              <span className="text-rose-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.properties?.compositionRole || '—'}
              </span>
              <span className="text-rose-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.properties?.compositionRole || '—'}
              </span>
            </div>

            {/* 八纲表里 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">八纲辨证</span>
              <span className="text-amber-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.properties?.syndromeType || '—'}
              </span>
              <span className="text-amber-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.properties?.syndromeType || '—'}
              </span>
            </div>

            {/* 脏腑所主 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">脏腑经络</span>
              <span className="text-cyan-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.properties?.organAffiliation || '—'}
              </span>
              <span className="text-cyan-300 font-medium text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.properties?.organAffiliation || '—'}
              </span>
            </div>

            {/* 分类大类 */}
            <div className="grid grid-cols-5 p-2.5 items-center">
              <span className="text-slate-400 font-medium text-[11px] col-span-1">分类大纲</span>
              <span className="text-slate-200 text-[11px] col-span-2 text-center truncate px-1">
                {nodeA.classificationCategory || '—'}
              </span>
              <span className="text-slate-200 text-[11px] col-span-2 text-center truncate px-1">
                {nodeB.classificationCategory || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Differential Analysis Insights */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            临证鉴别与病机配伍透视
          </h4>
          <div className="space-y-2">
            {comparisonInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1"
              >
                <span className="font-semibold text-amber-300 text-xs block">
                  {insight.title}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Path Tracer Between A and B */}
        {onStartPathTrace && (
          <button
            onClick={() => onStartPathTrace(nodeA.id, nodeB.id)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Compass className="w-4 h-4" />
            推演「{nodeA.name}」与「{nodeB.name}」间的辨证路径
          </button>
        )}
      </div>
    </div>
  );
};
