import React, { useState } from 'react';
import { TCMGraphData, PresetBook } from '../types/tcm';
import { PRESET_BOOKS } from '../data/presetBooks';
import { extractKnowledgeLocally } from '../utils/tcmRuleExtractor';
import { X, UploadCloud, BookOpen, Sparkles, Loader2, FileText, CheckCircle2 } from 'lucide-react';

interface ImportBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGraph: (data: TCMGraphData) => void;
}

export const ImportBookModal: React.FC<ImportBookModalProps> = ({
  isOpen,
  onClose,
  onApplyGraph,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [bookTitle, setBookTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [userInstructions, setUserInstructions] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState('');
  const [previewData, setPreviewData] = useState<TCMGraphData | null>(null);

  if (!isOpen) return null;

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetBook) => {
    onApplyGraph(preset.graphData);
    onClose();
  };

  // Handle File Upload (.txt, .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomText(content);
      }
    };
    reader.readAsText(file);
  };

  // Run Knowledge Extraction
  const handleExtract = async () => {
    if (!customText.trim()) return;

    setIsExtracting(true);
    setExtractProgress('正在阅读典籍篇目，识别人体脏腑、经络与药理语境...');

    try {
      const response = await fetch('/api/extract-tcm-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookTitle || '中医典籍选录',
          text: customText,
          userInstructions,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          setPreviewData(json.data);
          setIsExtracting(false);
          return;
        }
      }

      // If server returned 503 or failed, fallback smoothly to domain rule extractor
      setExtractProgress('切换至内置中医药典籍本体规则库解析...');
      await new Promise(resolve => setTimeout(resolve, 600));
      const localResult = extractKnowledgeLocally(bookTitle || '中医典籍选录', customText);
      setPreviewData(localResult);
    } catch (err) {
      console.warn('Network extraction failed, using built-in TCM engine:', err);
      const localResult = extractKnowledgeLocally(bookTitle || '中医典籍选录', customText);
      setPreviewData(localResult);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyCustom = () => {
    if (previewData) {
      onApplyGraph(previewData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                导入典籍 · 智能提取中医三维知识图谱
              </h3>
              <p className="text-xs text-slate-400">
                支持导入经典医著、现代论述或自定义医案，通过AI与中医本体库自动构建分类/主题/关系多维图谱
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 pt-2 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'presets'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            历代传世中医医典精选 ({PRESET_BOOKS.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            导入自定义书籍/章节与AI提取
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'presets' ? (
            /* Presets View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_BOOKS.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850/60 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-medium">
                        {book.category}
                      </span>
                      <span className="text-[11px] text-amber-400/90 font-serif">
                        {book.dynasty} · {book.author}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-serif group-hover:text-cyan-300 transition-colors">
                      {book.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-serif italic line-clamp-2">
                      “{book.sampleText.slice(0, 100)}...”
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>知识点: <b className="text-cyan-300">{book.graphData.nodes.length}</b></span>
                      <span>关联数: <b className="text-emerald-300">{book.graphData.relations.length}</b></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPreset(book)}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-750 hover:from-cyan-600 hover:to-blue-600 text-white font-medium text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 group-hover:border-transparent"
                  >
                    <span>载入本典并生成三维图谱</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Custom Import View */
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    典籍 / 书目名称
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="例如：《金匮要略 · 脏腑经络篇》或《脾胃论》"
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    上传文件 (.txt, .md)
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-950/70 border border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-xl text-xs text-slate-300 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>选择本地中医书目文本</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>待提取中医书籍章节文本</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {customText.length} 字符
                  </span>
                </label>
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="在此粘贴中医古籍条文、方论、经穴循行或现代临床辨证讲义..."
                  className="w-full p-3 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-serif leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  自定义提取侧重要求（可选）
                </label>
                <input
                  type="text"
                  value={userInstructions}
                  onChange={(e) => setUserInstructions(e.target.value)}
                  placeholder="例如：侧重提取方药君臣佐使配伍，以及太阳经与阳明经传变关系"
                  className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Extract Action Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleExtract}
                  disabled={isExtracting || !customText.trim()}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-medium text-xs flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{extractProgress || '正在智能提取知识组织拓扑...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>开始智能提取知识点与多维关系</span>
                    </>
                  )}
                </button>

                {previewData && (
                  <button
                    onClick={handleApplyCustom}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>确认并将知识图谱载入三维画布</span>
                  </button>
                )}
              </div>

              {/* Extracted Preview */}
              {previewData && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      知识图谱构建完成预览: {previewData.bookTitle}
                    </span>
                    <span className="text-xs text-emerald-300 font-mono">
                      提取实体: {previewData.nodes.length} 个 | 语义关系: {previewData.relations.length} 条
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {previewData.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {previewData.nodes.map((node) => (
                      <span
                        key={node.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {node.name} ({node.category})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
