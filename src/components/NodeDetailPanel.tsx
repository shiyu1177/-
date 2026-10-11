import React, { useState } from 'react';
import { TCMNode, TCMRelation } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';
import { inferLatentRelationsLocally } from '../utils/tcmRuleExtractor';
import { EditNodeModal } from './EditNodeModal';
import { LiteratureCitationSection } from './LiteratureCitationSection';
import {
  X,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  Share2,
  Compass,
  Loader2,
  CheckCircle2,
  Network,
  Scale,
  Edit3,
  AlertTriangle,
  Pill,
  HeartHandshake
} from 'lucide-react';

interface NodeDetailPanelProps {
  node: TCMNode | null;
  allNodes: TCMNode[];
  relations: TCMRelation[];
  bookTitle?: string;
  onClose: () => void;
  onSelectNode: (node: TCMNode) => void;
  onStartPathTrace?: (nodeId: string) => void;
  onUpdateGraph?: (newRelations: TCMRelation[], newNodes?: TCMNode[], summary?: string) => void;
  onUpdateNode?: (updatedNode: TCMNode) => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  allNodes,
  relations,
  bookTitle,
  onClose,
  onSelectNode,
  onStartPathTrace,
  onUpdateGraph,
  onUpdateNode,
}) => {
  const [isInferring, setIsInferring] = useState(false);
  const [inferenceSuccessMsg, setInferenceSuccessMsg] = useState<string | null>(null);
  const [inferenceSummary, setInferenceSummary] = useState<string | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);

  if (!node) return null;

  const catMeta = CATEGORY_MAP[node.category] || CATEGORY_MAP.theory;

  // Find all direct relations involving this node
  const directRelations = relations.filter(
    r => r.source === node.id || r.target === node.id
  );

  // Group connected nodes by relation dimension & role
  const connectedItems = directRelations.map(rel => {
    const isSource = rel.source === node.id;
    const otherId = isSource ? rel.target : rel.source;
    const otherNode = allNodes.find(n => n.id === otherId);
    return {
      relation: rel,
      otherNode,
      direction: isSource ? 'outgoing' : 'incoming',
    };
  }).filter(item => item.otherNode !== undefined);

  // Handle AI Inference of Latent TCM Relations
  const handleGenerateAssociationGraph = async () => {
    if (!node || isInferring) return;

    setIsInferring(true);
    setInferenceSuccessMsg(null);
    setInferenceSummary(null);

    try {
      const response = await fetch('/api/infer-node-relations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentNode: node,
          candidateNodes: allNodes.filter(n => n.id !== node.id),
          existingRelations: directRelations,
          bookTitle: bookTitle || '中医典籍',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const { inferredRelations, newLatentNodes, reasoningSummary } = json.data;
          if (onUpdateGraph && inferredRelations?.length) {
            onUpdateGraph(inferredRelations, newLatentNodes, reasoningSummary);
            setInferenceSuccessMsg(`已成功推演并织入 ${inferredRelations.length} 条隐含中医病机关系！`);
            setInferenceSummary(reasoningSummary);
          }
          setIsInferring(false);
          return;
        }
      }

      // Fallback locally
      const localResult = inferLatentRelationsLocally(node, allNodes, relations);
      if (onUpdateGraph && localResult.inferredRelations.length) {
        onUpdateGraph(
          localResult.inferredRelations,
          localResult.newLatentNodes,
          localResult.reasoningSummary
        );
        setInferenceSuccessMsg(`已通过中医藏象规则库推演新增 ${localResult.inferredRelations.length} 条隐含病机关联！`);
        setInferenceSummary(localResult.reasoningSummary);
      }
    } catch (err) {
      console.warn('AI relation inference request failed, executing local fallback:', err);
      const localResult = inferLatentRelationsLocally(node, allNodes, relations);
      if (onUpdateGraph && localResult.inferredRelations.length) {
        onUpdateGraph(
          localResult.inferredRelations,
          localResult.newLatentNodes,
          localResult.reasoningSummary
        );
        setInferenceSuccessMsg(`已通过中医藏象规则库推演新增 ${localResult.inferredRelations.length} 条隐含病机关联！`);
        setInferenceSummary(localResult.reasoningSummary);
      }
    } finally {
      setIsInferring(false);
    }
  };

  // Role tag color mapping for 君臣佐使
  const getRoleBadgeStyle = (role: string) => {
    if (role.includes('君')) return 'bg-rose-950 text-rose-300 border-rose-500/50';
    if (role.includes('臣')) return 'bg-amber-950 text-amber-300 border-amber-500/50';
    if (role.includes('佐')) return 'bg-cyan-950 text-cyan-300 border-cyan-500/50';
    return 'bg-blue-950 text-blue-300 border-blue-500/50'; // 使
  };

  return (
    <>
      <div className="absolute top-20 right-6 w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-30 flex flex-col text-slate-200 animate-slide-left scrollbar-thin scrollbar-thumb-slate-700">
        {/* Header Banner */}
        <div className="relative p-5 pb-4 border-b border-slate-800">
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <button
              onClick={() => setIsEditingModalOpen(true)}
              className="px-2 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 flex items-center gap-1 transition-colors"
              title="编辑或AI补全本节点中医属性"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑属性</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="关闭卡片"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 pr-24">
            {/* Classical Seal Badge */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-xl font-bold shadow-lg shrink-0"
              style={{
                backgroundColor: `${catMeta.color}25`,
                color: catMeta.color,
                border: `2px solid ${catMeta.color}60`
              }}
            >
              {catMeta.glyph}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${catMeta.twBg} ${catMeta.twColor} border ${catMeta.twBorder}`}>
                  {catMeta.label}
                </span>
                {node.importance && (
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/30">
                    权重 {node.importance}/10
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide mt-1 font-serif truncate" title={node.name}>
                {node.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 text-sm">
          {/* Multi-Selection Comparison Shortcut Hint */}
          <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-slate-300 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>按住 <kbd className="px-1 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] border border-slate-700">Ctrl</kbd> 或 <kbd className="px-1 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] border border-slate-700">Cmd</kbd> 点击图谱中另一节点，开启详细属性对比。</span>
          </div>

          {/* Core TCM Description / Definition */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              中医药理释义与核心定义
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {node.description}
            </p>
          </div>

          {/* ============================================================ */}
          {/* CATEGORY 1: 经典方剂 (Formula) 专属配伍与君臣佐使清单 */}
          {/* ============================================================ */}
          {node.category === 'formula' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/70 border border-rose-500/30">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 font-serif">
                <Compass className="w-4 h-4 text-rose-400" />
                方剂配伍 · 君臣佐使法度
              </h4>

              {/* Composition List */}
              {node.properties?.compositionList && node.properties.compositionList.length > 0 ? (
                <div className="space-y-1.5">
                  {node.properties.compositionList.map((item, idx) => {
                    // Match herb in graph if possible
                    const matchedHerbNode = allNodes.find(n => n.name === item.herbName);
                    return (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(item.role)}`}>
                              {item.role}药
                            </span>
                            <span
                              onClick={() => matchedHerbNode && onSelectNode(matchedHerbNode)}
                              className={`font-bold text-white text-xs ${matchedHerbNode ? 'hover:text-cyan-300 cursor-pointer underline decoration-dotted' : ''}`}
                            >
                              {item.herbName}
                            </span>
                            {item.dosage && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({item.dosage})
                              </span>
                            )}
                          </div>
                          {item.action && (
                            <p className="text-[11px] text-slate-300">
                              {item.action}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>暂未录入君臣佐使清单</span>
                  <button
                    onClick={() => setIsEditingModalOpen(true)}
                    className="text-cyan-400 hover:underline"
                  >
                    点击补充
                  </button>
                </div>
              )}

              {/* Actions & Indications */}
              {node.properties?.actions && (
                <div className="text-xs pt-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【功用治法】</span>
                  <span className="text-emerald-300 font-medium">{node.properties.actions}</span>
                </div>
              )}
              {node.properties?.indications && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【主治病证】</span>
                  <span className="text-slate-200">{node.properties.indications}</span>
                </div>
              )}
              {node.properties?.variations && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【加减化裁】</span>
                  <span className="text-slate-300 text-[11px]">{node.properties.variations}</span>
                </div>
              )}
              {node.properties?.dosageUsage && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【煎服法】</span>
                  <span className="text-slate-300 text-[11px]">{node.properties.dosageUsage}</span>
                </div>
              )}
              {node.properties?.precautions && (
                <div className="text-xs p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300/90 text-[11px]">
                  <span className="font-semibold block text-rose-300">⚠️ 服用禁忌与注意事项：</span>
                  {node.properties.precautions}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* CATEGORY 2: 证候证型 (Syndrome) 专属推荐治方与辨治 */}
          {/* ============================================================ */}
          {node.category === 'syndrome' && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-serif">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                证候临床辨治 · 对应首选经典治方
              </h4>

              {/* Recommended formulas */}
              {node.properties?.treatsFormulas && node.properties.treatsFormulas.length > 0 ? (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">【推荐治疗名方】</span>
                  <div className="flex flex-wrap gap-1.5">
                    {node.properties.treatsFormulas.map((fName, idx) => {
                      const matchedFormula = allNodes.find(n => n.name === fName);
                      return (
                        <button
                          key={idx}
                          onClick={() => matchedFormula && onSelectNode(matchedFormula)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                            matchedFormula
                              ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 cursor-pointer'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                          title={matchedFormula ? '点击飞跃至该方剂图谱' : '经典治方'}
                        >
                          <Pill className="w-3 h-3 text-rose-400" />
                          <span>{fName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>暂未关联治方</span>
                  <button
                    onClick={() => setIsEditingModalOpen(true)}
                    className="text-cyan-400 hover:underline"
                  >
                    点击补充对应治方
                  </button>
                </div>
              )}

              {/* Diagnostic key points & therapeutic method */}
              {node.properties?.diagnosticPoints && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【核心辨证要点】</span>
                  <span className="text-amber-300 font-medium">{node.properties.diagnosticPoints}</span>
                </div>
              )}
              {node.properties?.therapeuticMethod && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【对应治则治法】</span>
                  <span className="text-cyan-300 font-medium">{node.properties.therapeuticMethod}</span>
                </div>
              )}
              {node.properties?.pathogenesisAnalysis && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【深层病机演变】</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {node.properties.pathogenesisAnalysis}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* CATEGORY 3: 本草中药 (Herb) 专属性味归经、功效与注意事项 */}
          {/* ============================================================ */}
          {(node.category === 'herb' || (node.properties?.nature && node.category !== 'formula')) && (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 font-serif">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                本草药性 · 性味归经与功效禁忌
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {node.properties?.nature && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">四气五味</span>
                    <span className="text-emerald-300 font-medium">{node.properties.nature}</span>
                  </div>
                )}
                {node.properties?.meridianTropism && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">药力归经</span>
                    <span className="text-blue-300 font-medium">{node.properties.meridianTropism}</span>
                  </div>
                )}
                {node.properties?.compositionRole && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 col-span-2">
                    <span className="text-slate-400 block text-[10px]">配伍位次</span>
                    <span className="text-rose-300 font-medium">{node.properties.compositionRole}</span>
                  </div>
                )}
              </div>

              {node.properties?.actions && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【核心中药功效】</span>
                  <span className="text-emerald-300 font-medium">{node.properties.actions}</span>
                </div>
              )}
              {node.properties?.indications && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【临床主治病证】</span>
                  <span className="text-slate-200">{node.properties.indications}</span>
                </div>
              )}
              {node.properties?.dosageUsage && (
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">【用法用量】</span>
                  <span className="text-slate-300 text-[11px]">{node.properties.dosageUsage}</span>
                </div>
              )}
              {node.properties?.precautions && (
                <div className="text-xs p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300/90 text-[11px]">
                  <span className="font-semibold block text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    注意事项与配伍禁忌：
                  </span>
                  {node.properties.precautions}
                </div>
              )}
            </div>
          )}

          {/* Original Quotes from Classical Books */}
          {node.originalQuotes && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                典籍出处原文印证
              </h4>
              <div className="relative bg-amber-950/20 border-l-2 border-amber-500/60 p-3 rounded-r-xl text-amber-200/90 font-serif italic text-xs leading-relaxed">
                “{node.originalQuotes}”
              </div>
            </div>
          )}

          {/* Authoritative TCM Literature Citations & Modern Research Review (关联文献引用) */}
          <LiteratureCitationSection
            node={node}
            bookTitle={bookTitle}
            onUpdateNode={onUpdateNode}
          />

          {/* AI Latent TCM Relation Discovery / 生成知识关联图 */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 p-3.5 rounded-xl border border-cyan-500/30 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
                <Network className="w-4 h-4 text-cyan-400" />
                AI 中医病机深度推演
              </span>
              <span className="text-[10px] text-cyan-300/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                知识拓扑增强
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              深入探寻「{node.name}」与周边节点在五行生克、脏腑表里、气血升降及隐性配伍中的隐含病机纽带。
            </p>

            <button
              onClick={handleGenerateAssociationGraph}
              disabled={isInferring}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-cyan-600 hover:from-amber-500 hover:via-rose-500 hover:to-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              title="利用AI推理当前知识点与图谱其他实体的深层中医病机关系并织入三维图谱"
            >
              {isInferring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>正在深度推理隐含中医病机关系...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>生成知识关联图 · 织入新脉络</span>
                </>
              )}
            </button>

            {/* Inference Result Feedback */}
            {inferenceSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{inferenceSuccessMsg}</span>
                </div>
                {inferenceSummary && (
                  <p className="text-slate-300 text-[10px] leading-relaxed bg-slate-950/60 p-2 rounded border border-emerald-500/10">
                    {inferenceSummary}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Connected Knowledge Network (Click to Jump) */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              关联知识点网络 ({connectedItems.length})
            </h4>
            {connectedItems.length === 0 ? (
              <p className="text-xs text-slate-500 italic">暂无直接相连知识点</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {connectedItems.map((item, idx) => {
                  const targetNode = item.otherNode!;
                  const targetCat = CATEGORY_MAP[targetNode.category] || CATEGORY_MAP.theory;
                  return (
                    <button
                      key={`${item.relation.source}-${item.relation.target}-${idx}`}
                      onClick={() => onSelectNode(targetNode)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/40 transition-all group flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: targetCat.color }}
                          />
                          <span className="font-medium text-white text-xs group-hover:text-cyan-300 transition-colors">
                            {targetNode.name}
                          </span>
                          <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700">
                            {item.relation.relationType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.relation.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-1 transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Path Tracer Shortcut Button */}
          {onStartPathTrace && (
            <button
              onClick={() => onStartPathTrace(node.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Compass className="w-4 h-4" />
              以「{node.name}」为起点推演辨证路径
            </button>
          )}
        </div>
      </div>

      {/* Edit Node Attributes Modal */}
      {isEditingModalOpen && (
        <EditNodeModal
          isOpen={isEditingModalOpen}
          onClose={() => setIsEditingModalOpen(false)}
          node={node}
          bookTitle={bookTitle}
          onSaveNode={(updated) => {
            if (onUpdateNode) {
              onUpdateNode(updated);
            }
          }}
        />
      )}
    </>
  );
};
