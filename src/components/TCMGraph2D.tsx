import React from 'react';
import { TCMNode, TCMRelation, OrganizationDimension } from '../types/tcm';
import { CATEGORY_MAP, DIMENSION_INFO } from '../data/tcmConfig';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface TCMGraph2DProps {
  nodes: TCMNode[];
  relations: TCMRelation[];
  dimension: OrganizationDimension;
  selectedNodeId: string | null;
  onSelectNode: (node: TCMNode) => void;
}

export const TCMGraph2D: React.FC<TCMGraph2DProps> = ({
  nodes,
  relations,
  dimension,
  selectedNodeId,
  onSelectNode,
}) => {
  // Group nodes by Category (分类法)
  const categoryGroups = React.useMemo(() => {
    const map = new Map<string, TCMNode[]>();
    nodes.forEach(n => {
      const list = map.get(n.category) || [];
      list.push(n);
      map.set(n.category, list);
    });
    return map;
  }, [nodes]);

  // Group nodes by Thematic Group (主题法)
  const thematicGroups = React.useMemo(() => {
    const map = new Map<string, TCMNode[]>();
    nodes.forEach(n => {
      const theme = n.thematicGroup || '总论与基础辨析';
      const list = map.get(theme) || [];
      list.push(n);
      map.set(theme, list);
    });
    return map;
  }, [nodes]);

  return (
    <div className="w-full h-full overflow-y-auto p-8 pt-24 bg-slate-950 text-slate-200 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              二维结构矩阵视角
            </span>
            <h2 className="text-xl font-bold text-white font-serif">
              中医知识组织全景对照图
            </h2>
            <p className="text-xs text-slate-400">
              与三维立体星图互为镜像，直观展呈各门类上下位阶、主题脉络与实体拓扑。
            </p>
          </div>
          <div className="flex gap-4 text-xs font-mono text-slate-300">
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-center">
              <span className="block text-slate-400 text-[10px]">总节点数</span>
              <span className="text-base font-bold text-cyan-400">{nodes.length}</span>
            </div>
            <div className="bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-center">
              <span className="block text-slate-400 text-[10px]">语义关系</span>
              <span className="text-base font-bold text-emerald-400">{relations.length}</span>
            </div>
          </div>
        </div>

        {/* View by Category (分类法大纲) */}
        {(dimension === 'all' || dimension === 'classification') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span>🌲 分类法门类层级 (Classification Taxonomies)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from(categoryGroups.entries()).map(([catKey, catNodes]) => {
                const catMeta = CATEGORY_MAP[catKey as keyof typeof CATEGORY_MAP] || CATEGORY_MAP.theory;
                return (
                  <div
                    key={catKey}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="flex items-center gap-2 font-bold text-sm text-white font-serif">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: catMeta.color }}
                          />
                          {catMeta.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {catNodes.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                        {catMeta.desc}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {catNodes.map(node => (
                          <button
                            key={node.id}
                            onClick={() => onSelectNode(node)}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                              selectedNodeId === node.id
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                                : 'bg-slate-950/50 hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <span>{node.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View by Theme (主题法脉络) */}
        {(dimension === 'all' || dimension === 'thematic') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span>📜 主题法脉络链条 (Thematic Clusters)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(thematicGroups.entries()).map(([themeName, tNodes]) => (
                <div
                  key={themeName}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-white text-sm font-serif text-amber-300">
                      ◆ {themeName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {tNodes.length} 个实体
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tNodes.map(node => {
                      const catMeta = CATEGORY_MAP[node.category] || CATEGORY_MAP.theory;
                      return (
                        <button
                          key={node.id}
                          onClick={() => onSelectNode(node)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                            selectedNodeId === node.id
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                              : `${catMeta.twBg} ${catMeta.twColor} border-slate-800 hover:border-amber-400/40`
                          }`}
                        >
                          {node.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View by Relations (关系法关联矩阵) */}
        {(dimension === 'all' || dimension === 'relational') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <span>⚡ 语义逻辑关系索引 (Semantic Relations Table)</span>
            </h3>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">源实体 (Source)</th>
                      <th className="p-3">中医关系类型</th>
                      <th className="p-3">目标实体 (Target)</th>
                      <th className="p-3">知识组织维度</th>
                      <th className="p-3">中医医理解析</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {relations.slice(0, 40).map((rel, idx) => {
                      const srcNode = nodes.find(n => n.id === rel.source);
                      const tgtNode = nodes.find(n => n.id === rel.target);
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-medium text-white">
                            {srcNode ? (
                              <button
                                onClick={() => onSelectNode(srcNode)}
                                className="hover:text-cyan-400 underline decoration-dotted"
                              >
                                {srcNode.name}
                              </button>
                            ) : rel.source}
                          </td>
                          <td className="p-3 font-semibold text-cyan-300">
                            {rel.relationType}
                          </td>
                          <td className="p-3 font-medium text-white">
                            {tgtNode ? (
                              <button
                                onClick={() => onSelectNode(tgtNode)}
                                className="hover:text-cyan-400 underline decoration-dotted"
                              >
                                {tgtNode.name}
                              </button>
                            ) : rel.target}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {DIMENSION_INFO[rel.dimension]?.name || rel.dimension}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {rel.description}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
