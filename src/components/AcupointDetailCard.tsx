import React, { useState } from 'react';
import { Acupoint, Meridian } from '../types/meridian';
import { TCMNode, TCMRelation } from '../types/tcm';
import {
  X,
  Compass,
  AlertTriangle,
  BookOpen,
  Sparkles,
  PlusCircle,
  Check,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AcupointDetailCardProps {
  acupoint: Acupoint | null;
  meridian: Meridian | null;
  onClose: () => void;
  onImportToGraph?: (node: TCMNode, relation?: TCMRelation) => void;
}

export const AcupointDetailCard: React.FC<AcupointDetailCardProps> = ({
  acupoint,
  meridian,
  onClose,
  onImportToGraph,
}) => {
  const [hasImported, setHasImported] = useState(false);

  if (!acupoint || !meridian) return null;

  const handleImport = () => {
    if (!onImportToGraph) return;

    // Convert Acupoint into TCMNode for knowledge graph integration
    const acupointNode: TCMNode = {
      id: `acupoint-${acupoint.code.toLowerCase().replace('-', '_')}`,
      name: `${acupoint.name}穴`,
      category: 'method', // 针灸治法 / 经络腧穴
      classificationCategory: `经络腧穴 · ${acupoint.meridianName}`,
      thematicGroup: `${meridian.shortName}辨治与经络循行`,
      description: `${acupoint.meridianName}核心腧穴（${acupoint.code}）。功效：${acupoint.actions}。主治：${acupoint.indications}`,
      originalQuotes: acupoint.classicalVerse || `《灵枢·经脉》：“${acupoint.meridianName}所生病者，刺${acupoint.name}。”`,
      importance: 8,
      properties: {
        nature: acupoint.categoryTags.join(' · '),
        meridianTropism: acupoint.meridianName,
        actions: acupoint.actions,
        indications: acupoint.indications,
        dosageUsage: acupoint.needling,
        precautions: acupoint.location,
        diagnosticPoints: `穴位定位：${acupoint.location}`,
      }
    };

    // Create relation linking to the meridian
    const relation: TCMRelation = {
      source: `acupoint-${acupoint.code.toLowerCase().replace('-', '_')}`,
      target: `meridian-${meridian.code.toLowerCase()}`,
      relationType: '归经',
      dimension: 'classification',
      description: `【${acupoint.name}】隶属于【${meridian.name}】，为本经${acupoint.categoryTags.join('兼')}`,
      weight: 4
    };

    onImportToGraph(acupointNode, relation);
    setHasImported(true);
    setTimeout(() => setHasImported(false), 2500);
  };

  return (
    <div className="absolute top-20 right-6 w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-30 flex flex-col text-slate-200 animate-slide-left scrollbar-thin scrollbar-thumb-slate-700">
      {/* Header Banner */}
      <div className="relative p-5 pb-4 border-b border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-10">
          {/* Classical Seal glyph */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-xl font-bold shadow-lg shrink-0"
            style={{
              backgroundColor: `${meridian.color}25`,
              color: meridian.color,
              border: `2px solid ${meridian.color}60`
            }}
          >
            穴
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  color: meridian.color,
                  borderColor: `${meridian.color}50`,
                  backgroundColor: `${meridian.color}15`
                }}
              >
                {acupoint.meridianName}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {acupoint.code}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-wide mt-1 font-serif flex items-center gap-2">
              <span>{acupoint.name}</span>
              <span className="text-xs text-slate-400 font-sans font-normal">
                {acupoint.pinyin}
              </span>
            </h3>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {acupoint.categoryTags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-amber-500/30"
            >
              {tag}
            </span>
          ))}
          {acupoint.fivePhase && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-emerald-500/30">
              五行: {acupoint.fivePhase}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4 text-xs">
        {/* Core Actions (核心功效) */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-serif">
            <Activity className="w-3.5 h-3.5" />
            【核心经脉穴位功效】
          </span>
          <p className="text-emerald-200/90 font-medium leading-relaxed text-xs">
            {acupoint.actions}
          </p>
        </div>

        {/* Indications (主治病证) */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            【临床辨证主治病证】
          </span>
          <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            {acupoint.indications}
          </p>
        </div>

        {/* Anatomical Location (解剖与定位) */}
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-400" />
            【人体解剖定位与取穴法】
          </span>
          <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
            {acupoint.location}
          </p>
        </div>

        {/* Needling method & Cautions (刺灸方法与禁忌) */}
        <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-rose-200/90 text-[11px]">
          <span className="font-semibold text-rose-300 flex items-center gap-1 text-[10px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            【针刺操作手法与安全禁忌】
          </span>
          <p className="leading-relaxed">
            {acupoint.needling}
          </p>
        </div>

        {/* Classical Verse Citation */}
        {acupoint.classicalVerse && (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-400" />
              【经典针灸歌赋文献印证】
            </span>
            <div className="bg-amber-950/20 border-l-2 border-amber-500/60 p-2.5 rounded-r-xl text-amber-200 font-serif text-[11px] leading-relaxed italic">
              {acupoint.classicalVerse}
            </div>
          </div>
        )}

        {/* Meridian Context Quick Jump */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">所属经脉巡行走向</span>
            <span className="text-xs font-bold text-white font-serif">{meridian.name}</span>
            <span className="text-[10px] text-cyan-300 block">{meridian.flowDirection}</span>
          </div>
          <span
            className="w-3 h-3 rounded-full shadow"
            style={{ backgroundColor: meridian.color }}
          />
        </div>

        {/* Button to import this Acupoint into TCM Knowledge Graph */}
        {onImportToGraph && (
          <button
            onClick={handleImport}
            disabled={hasImported}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 hover:from-emerald-500 hover:via-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {hasImported ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>已成功织入当前三维知识图谱！</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>将「{acupoint.name}」导入并关联至知识图谱</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
