import React, { useState, useEffect } from 'react';
import { TCMNode, TCMLiteratureData } from '../types/tcm';
import { searchAuthoritativeTCMLiterature } from '../data/tcmLiteratureDatabase';
import {
  BookOpen,
  FlaskConical,
  Search,
  Loader2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  BookmarkCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface LiteratureCitationSectionProps {
  node: TCMNode;
  bookTitle?: string;
  onUpdateNode?: (updatedNode: TCMNode) => void;
}

export const LiteratureCitationSection: React.FC<LiteratureCitationSectionProps> = ({
  node,
  bookTitle,
  onUpdateNode,
}) => {
  // Load cached literature data if already on node
  const [literatureData, setLiteratureData] = useState<TCMLiteratureData | null>(
    node.properties?.literatureData || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'classical' | 'modern'>('classical');
  const [copiedCitationIndex, setCopiedCitationIndex] = useState<number | null>(null);
  const [copiedReviewIndex, setCopiedReviewIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Sync state when selected node changes
  useEffect(() => {
    if (node.properties?.literatureData) {
      setLiteratureData(node.properties.literatureData);
    } else {
      // Auto-load instant authoritative literature for common entities or leave for manual click
      setLiteratureData(null);
    }
  }, [node.id, node.name]);

  // Execute Search in authoritative TCM databases
  const handleSearchLiterature = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/search-tcm-literature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node,
          bookTitle: bookTitle || '中医典籍',
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const result: TCMLiteratureData = json.data;
          setLiteratureData(result);
          if (onUpdateNode) {
            onUpdateNode({
              ...node,
              properties: {
                ...node.properties,
                literatureData: result,
              },
            });
          }
          setIsLoading(false);
          return;
        }
      }

      // Local authoritative database fallback
      const localResult = searchAuthoritativeTCMLiterature(node, bookTitle);
      setLiteratureData(localResult);
      if (onUpdateNode) {
        onUpdateNode({
          ...node,
          properties: {
            ...node.properties,
            literatureData: localResult,
          },
        });
      }
    } catch (err) {
      console.warn('Network search error, using local authoritative database:', err);
      const localResult = searchAuthoritativeTCMLiterature(node, bookTitle);
      setLiteratureData(localResult);
      if (onUpdateNode) {
        onUpdateNode({
          ...node,
          properties: {
            ...node.properties,
            literatureData: localResult,
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Copy citation text to clipboard
  const handleCopyCitation = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationIndex(idx);
    setTimeout(() => setCopiedCitationIndex(null), 2000);
  };

  const handleCopyReview = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedReviewIndex(idx);
    setTimeout(() => setCopiedReviewIndex(null), 2000);
  };

  return (
    <div className="rounded-xl bg-slate-950/80 border border-amber-500/30 overflow-hidden shadow-lg transition-all">
      {/* Section Header */}
      <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/30 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-serif text-xs border border-amber-500/30">
            典
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5 font-serif">
              关联文献引用与考证
            </h4>
            <span className="text-[10px] text-slate-400">
              古籍原文摘录 · 历代名家注疏 · 现代研究综述
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {literatureData && (
            <button
              onClick={handleSearchLiterature}
              disabled={isLoading}
              className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-[10px] flex items-center gap-1 transition-colors"
              title="重新检索匹配文献库"
            >
              <Search className="w-3 h-3" />
              <span>重新检索</span>
            </button>
          )}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? '折叠' : '展开'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3.5 space-y-3">
          {/* Initial State: Prompt to Search */}
          {!literatureData && !isLoading && (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-200">
                  检索权威中医文献与现代科研综述
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  一键在《中华医典》古籍经典库及中医药现代药理数据库中智能匹配「{node.name}」的原文出处、历代名医注疏及有效成分与作用机制。
                </p>
              </div>

              <button
                onClick={handleSearchLiterature}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 via-emerald-600 to-cyan-600 hover:from-amber-500 hover:via-emerald-500 hover:to-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>立即搜索权威中医药文献库</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-6 px-4 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-amber-200 font-medium">
                正在深度检索权威中医药数据库...
              </p>
              <p className="text-[10px] text-slate-400">
                比对考据《伤寒论》《黄帝内经》《神农本草经》原文与现代药理期刊综述
              </p>
            </div>
          )}

          {/* Loaded Literature Content */}
          {literatureData && !isLoading && (
            <div className="space-y-3">
              {/* Dual Tabs: 古籍原文 vs 现代研究 */}
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('classical')}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'classical'
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>古籍原文摘录</span>
                  <span className="text-[10px] px-1 rounded-full bg-slate-800 text-amber-300 font-mono">
                    {literatureData.classicalCitations.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('modern')}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'modern'
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>现代研究综述</span>
                  <span className="text-[10px] px-1 rounded-full bg-slate-800 text-emerald-300 font-mono">
                    {literatureData.modernResearchReviews.length}
                  </span>
                </button>
              </div>

              {/* ==================== TAB 1: 古籍原文摘录 ==================== */}
              {activeTab === 'classical' && (
                <div className="space-y-2.5">
                  {literatureData.classicalCitations.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      暂无古籍原文收录
                    </p>
                  ) : (
                    literatureData.classicalCitations.map((item, idx) => {
                      const citationFullText = `【${item.sourceBook}】${item.dynastyAndAuthor}（${item.chapter}）：\n“${item.originalText}”\n按语：${item.doctorCommentary || '无'}\n医理：${item.medicalSignificance}`;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2 text-xs"
                        >
                          {/* Citation Header */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 font-serif font-bold text-xs border border-amber-500/30">
                                {item.sourceBook}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {item.dynastyAndAuthor}
                              </span>
                            </div>

                            <button
                              onClick={() => handleCopyCitation(citationFullText, idx)}
                              className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750"
                              title="复制本条学术引文"
                            >
                              {copiedCitationIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>复制引文</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Chapter reference */}
                          <div className="text-[11px] font-mono text-amber-400/90">
                            【{item.chapter}】
                          </div>

                          {/* Original Text with Classical Typography */}
                          <div className="relative bg-amber-950/20 border-l-2 border-amber-500/70 p-2.5 rounded-r-lg text-amber-100 font-serif text-xs leading-relaxed italic">
                            “{item.originalText}”
                          </div>

                          {/* Doctor's Commentary */}
                          {item.doctorCommentary && (
                            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 space-y-1">
                              <span className="text-[10px] font-semibold text-rose-300 flex items-center gap-1">
                                <BookmarkCheck className="w-3 h-3" />
                                历代名家考证按语：
                              </span>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-serif">
                                {item.doctorCommentary}
                              </p>
                            </div>
                          )}

                          {/* Clinical Medical Significance */}
                          <div className="text-[11px] text-slate-300 leading-relaxed pt-0.5">
                            <span className="text-amber-400/90 font-medium">经旨要义：</span>
                            {item.medicalSignificance}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ==================== TAB 2: 现代研究综述 ==================== */}
              {activeTab === 'modern' && (
                <div className="space-y-2.5">
                  {literatureData.modernResearchReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      暂无现代药理研究收录
                    </p>
                  ) : (
                    literatureData.modernResearchReviews.map((item, idx) => {
                      const reviewFullText = `【现代研究综述】${item.topic}\n有效成分：${item.chemicalBases || '未注'}\n药理机制：${item.pharmacologicalAction}\n临床循证：${item.clinicalEvidence || '无'}\n来源：${item.journalOrSource} (${item.publicationYear || ''})`;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 text-xs"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5">
                            <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                              <FlaskConical className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{item.topic}</span>
                            </h5>

                            <button
                              onClick={() => handleCopyReview(reviewFullText, idx)}
                              className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-750 shrink-0"
                              title="复制本篇研究综述"
                            >
                              {copiedReviewIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">已复制</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>复制综述</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Chemical active bases */}
                          {item.chemicalBases && (
                            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px]">
                              <span className="text-emerald-300 font-semibold block text-[10px] uppercase">
                                【有效成分与物质基础】
                              </span>
                              <span className="text-slate-200">
                                {item.chemicalBases}
                              </span>
                            </div>
                          )}

                          {/* Pharmacological mechanisms */}
                          <div className="space-y-0.5">
                            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                              【现代药理机制与实验证据】
                            </span>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {item.pharmacologicalAction}
                            </p>
                          </div>

                          {/* Clinical evidence */}
                          {item.clinicalEvidence && (
                            <div className="space-y-0.5">
                              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                                【临床循证医学适应证】
                              </span>
                              <p className="text-[11px] text-cyan-200 leading-relaxed">
                                {item.clinicalEvidence}
                              </p>
                            </div>
                          )}

                          {/* Citation footer */}
                          <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-slate-500" />
                              {item.journalOrSource}
                            </span>
                            {item.publicationYear && (
                              <span className="text-amber-400/80">
                                {item.publicationYear} 年
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
