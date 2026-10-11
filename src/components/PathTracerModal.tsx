import React, { useState, useEffect } from 'react';
import { TCMNode, TCMRelation } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';
import { X, Compass, Play, RotateCcw, ArrowRight, Sparkles, Check } from 'lucide-react';

interface PathTracerModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: TCMNode[];
  relations: TCMRelation[];
  initialStartNodeId?: string | null;
  onHighlightPath: (nodeIds: string[]) => void;
  onSelectNode: (node: TCMNode) => void;
}

export const PathTracerModal: React.FC<PathTracerModalProps> = ({
  isOpen,
  onClose,
  nodes,
  relations,
  initialStartNodeId,
  onHighlightPath,
  onSelectNode,
}) => {
  const [startNodeId, setStartNodeId] = useState<string>('');
  const [endNodeId, setEndNodeId] = useState<string>('');
  const [foundPaths, setFoundPaths] = useState<string[][]>([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const [playingStep, setPlayingStep] = useState<number>(-1);

  // Set initial start node if provided
  useEffect(() => {
    if (initialStartNodeId && nodes.some(n => n.id === initialStartNodeId)) {
      setStartNodeId(initialStartNodeId);
    } else if (nodes.length > 0 && !startNodeId) {
      // Default to a symptom or syndrome if available
      const sym = nodes.find(n => n.category === 'symptom' || n.category === 'syndrome');
      if (sym) setStartNodeId(sym.id);
    }

    if (nodes.length > 0 && !endNodeId) {
      // Default to a herb or formula
      const herb = nodes.find(n => n.category === 'herb' || n.category === 'formula');
      if (herb) setEndNodeId(herb.id);
    }
  }, [initialStartNodeId, nodes]);

  // Compute graph paths using BFS
  const findPathsBetweenNodes = (startId: string, endId: string, maxDepth = 5): string[][] => {
    if (!startId || !endId || startId === endId) return [];

    // Build adjacency list (bidirectional for traversal)
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    relations.forEach(r => {
      adj.get(r.source)?.push(r.target);
      adj.get(r.target)?.push(r.source);
    });

    const results: string[][] = [];
    const queue: Array<{ current: string; path: string[] }> = [{ current: startId, path: [startId] }];

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (path.length > maxDepth) continue;

      if (current === endId) {
        results.push(path);
        if (results.length >= 3) break;
        continue;
      }

      const neighbors = adj.get(current) || [];
      for (const neighbor of neighbors) {
        if (!path.includes(neighbor)) {
          queue.push({ current: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return results;
  };

  const handleCompute = () => {
    if (!startNodeId || !endNodeId) return;
    const paths = findPathsBetweenNodes(startNodeId, endNodeId);
    setFoundPaths(paths);
    setSelectedPathIndex(0);
    if (paths.length > 0) {
      onHighlightPath(paths[0]);
    } else {
      onHighlightPath([]);
    }
  };

  useEffect(() => {
    if (isOpen && startNodeId && endNodeId) {
      handleCompute();
    }
  }, [isOpen, startNodeId, endNodeId]);

  // Step player animation
  useEffect(() => {
    let timer: any;
    if (playingStep >= 0 && foundPaths[selectedPathIndex]) {
      const currentPath = foundPaths[selectedPathIndex];
      const targetId = currentPath[playingStep];
      const targetNode = nodes.find(n => n.id === targetId);
      if (targetNode) {
        onSelectNode(targetNode);
      }
      onHighlightPath(currentPath.slice(0, playingStep + 1));

      if (playingStep < currentPath.length - 1) {
        timer = setTimeout(() => {
          setPlayingStep(prev => prev + 1);
        }, 1500);
      } else {
        // finished
        timer = setTimeout(() => {
          setPlayingStep(-1);
          onHighlightPath(currentPath);
        }, 1200);
      }
    }
    return () => clearTimeout(timer);
  }, [playingStep, foundPaths, selectedPathIndex]);

  if (!isOpen) return null;

  const currentPath = foundPaths[selectedPathIndex] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                中医辨证论治 · 知识脉络路径推演
              </h3>
              <p className="text-xs text-slate-400">
                以症状为起端，逆溯病机、对验证型、确立治法、选定方药，在三维图谱中点亮传变链
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onHighlightPath([]);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Start / End Node Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              辨证源头起点 (如症状、证型)
            </label>
            <select
              value={startNodeId}
              onChange={(e) => setStartNodeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{CATEGORY_MAP[n.category]?.label || n.category}] {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              论治归宿终点 (如本草、方剂、经脉)
            </label>
            <select
              value={endNodeId}
              onChange={(e) => setEndNodeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{CATEGORY_MAP[n.category]?.label || n.category}] {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Found Paths Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              推理推演链路 ({foundPaths.length} 条有效路径)
            </span>
            {currentPath.length > 0 && (
              <button
                onClick={() => setPlayingStep(0)}
                disabled={playingStep >= 0}
                className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>三维镜头动态漫游演播</span>
              </button>
            )}
          </div>

          {foundPaths.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500">
              当前起点与终点在所选文献篇幅中无直接推导跳板，可尝试更换节点。
            </div>
          ) : (
            <div className="space-y-3">
              {foundPaths.map((path, pIdx) => {
                const isSelected = selectedPathIndex === pIdx;
                return (
                  <div
                    key={pIdx}
                    onClick={() => {
                      setSelectedPathIndex(pIdx);
                      onHighlightPath(path);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-cyan-500 shadow-md'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center flex-wrap gap-2">
                      {path.map((nodeId, idx) => {
                        const n = nodes.find(x => x.id === nodeId);
                        if (!n) return null;
                        const catMeta = CATEGORY_MAP[n.category] || CATEGORY_MAP.theory;
                        const isCurrentActive = playingStep === idx;
                        return (
                          <React.Fragment key={nodeId}>
                            <span
                              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                                isCurrentActive
                                  ? 'bg-amber-400 text-slate-950 scale-110 font-bold shadow-lg ring-2 ring-amber-300'
                                  : `${catMeta.twBg} ${catMeta.twColor} border ${catMeta.twBorder}`
                              }`}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: catMeta.color }}
                              />
                              {n.name}
                            </span>
                            {idx < path.length - 1 && (
                              <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onHighlightPath([]);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800"
          >
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
