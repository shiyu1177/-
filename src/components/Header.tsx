import React, { useState } from 'react';
import { TCMNode, PresetBook } from '../types/tcm';
import { PRESET_BOOKS } from '../data/presetBooks';
import { CATEGORY_MAP } from '../data/tcmConfig';
import {
  BookOpen,
  Search,
  Compass,
  UploadCloud,
  Box,
  LayoutGrid,
  Download,
  Check,
  ChevronDown,
  Sparkles,
  Activity
} from 'lucide-react';

interface HeaderProps {
  currentBookTitle: string;
  nodes: TCMNode[];
  viewMode: '3d' | '2d' | 'meridian';
  onChangeViewMode: (mode: '3d' | '2d' | 'meridian') => void;
  onOpenImportModal: () => void;
  onOpenPathTracer: () => void;
  onSelectNode: (node: TCMNode) => void;
  onSelectPresetBook: (book: PresetBook) => void;
  onExportGraph: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBookTitle,
  nodes,
  viewMode,
  onChangeViewMode,
  onOpenImportModal,
  onOpenPathTracer,
  onSelectNode,
  onSelectPresetBook,
  onExportGraph,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  // Autocomplete matching nodes
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return nodes.filter(n =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [nodes, searchQuery]);

  return (
    <header className="absolute top-0 left-0 right-0 h-16 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 z-40 px-6 flex items-center justify-between">
      {/* Brand & Preset Book Selector */}
      <div className="flex items-center gap-4">
        {/* Seal Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-rose-700 to-amber-900 border border-amber-400/40 flex items-center justify-center text-amber-100 font-serif font-black text-lg shadow-lg">
            岐
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-serif flex items-center gap-1.5">
              <span>岐黄智枢</span>
              <span className="text-[10px] font-normal font-sans text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30">
                中医三维知识组织系统
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">
              分类法 · 主题法 · 关系法 · 空间图谱
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Active Book Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBookDropdown(!showBookDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/60 text-xs text-slate-200 transition-all font-serif"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="max-w-[160px] truncate font-medium">{currentBookTitle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showBookDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in font-sans">
              <div className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                选择经典医著篇目
              </div>
              {PRESET_BOOKS.map(book => (
                <button
                  key={book.id}
                  onClick={() => {
                    onSelectPresetBook(book);
                    setShowBookDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between ${
                    currentBookTitle === book.title
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate">{book.title}</span>
                  {currentBookTitle === book.title && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="relative hidden md:block w-72">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="搜索知识点 (如：桂枝、太阳中风、发热)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in max-h-72 overflow-y-auto">
            {searchResults.map(node => {
              const catMeta = CATEGORY_MAP[node.category] || CATEGORY_MAP.theory;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: catMeta.color }}
                    />
                    <span className="font-medium group-hover:text-cyan-300 transition-colors">
                      {node.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {catMeta.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Import Book Modal Trigger */}
        <button
          onClick={onOpenImportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs transition-all shadow-md"
          title="导入中医书籍或章节，自动提取知识图谱"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>导入典籍/AI提取</span>
        </button>

        {/* Path Tracer Button */}
        <button
          onClick={onOpenPathTracer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 font-medium text-xs transition-colors"
          title="开启中医辨证路径推演"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">辨证推演</span>
        </button>

        {/* View Mode Segmented Controls: 3D Graph, 2D Matrix, 3D Meridian Circulation */}
        <div className="flex rounded-xl bg-slate-900/90 border border-slate-700/80 p-0.5 text-xs shadow-md">
          <button
            onClick={() => onChangeViewMode('3d')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="三维空间知识星图"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D星图</span>
          </button>

          <button
            onClick={() => onChangeViewMode('2d')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              viewMode === '2d'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="二维分类与主题层次矩阵"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D矩阵</span>
          </button>

          <button
            onClick={() => onChangeViewMode('meridian')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
              viewMode === 'meridian'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
            title="3D人体十二经脉巡行与腧穴卡片"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline font-serif font-bold">3D经脉巡行</span>
          </button>
        </div>

        {/* Export Graph Button */}
        <button
          onClick={onExportGraph}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="导出图谱JSON数据与研讨报告"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
