import React, { useState } from 'react';
import { TCMGraphData } from '../types/tcm';
import { X, Download, Copy, Check, FileJson, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  graphData: TCMGraphData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  graphData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(graphData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graphData.bookTitle.replace(/[《》\s]/g, '')}_知识图谱.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${graphData.bookTitle} · 中医知识图谱分析报告\n\n`;
    md += `**时代与作者**：${graphData.dynasty || '古典'} · ${graphData.author || '历代名医'}\n\n`;
    md += `## 一、核心宗旨与研讨概要\n${graphData.summary}\n\n`;
    md += `## 二、提取知识实体 (${graphData.nodes.length} 个)\n\n`;
    graphData.nodes.forEach((n, idx) => {
      md += `### ${idx + 1}. ${n.name} [${n.category}]\n`;
      md += `- **释义**：${n.description}\n`;
      if (n.classificationCategory) md += `- **分类归属**：${n.classificationCategory}\n`;
      if (n.thematicGroup) md += `- **所属主题**：${n.thematicGroup}\n`;
      if (n.originalQuotes) md += `- **经文原文**：“${n.originalQuotes}”\n`;
      md += `\n`;
    });
    md += `## 三、多维语义关系组织 (${graphData.relations.length} 条)\n\n`;
    graphData.relations.forEach((r, idx) => {
      const src = graphData.nodes.find(n => n.id === r.source)?.name || r.source;
      const tgt = graphData.nodes.find(n => n.id === r.target)?.name || r.target;
      md += `${idx + 1}. **${src}** --[${r.relationType} / ${r.dimension}]--> **${tgt}**：${r.description}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graphData.bookTitle.replace(/[《》\s]/g, '')}_知识报告.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">导出中医知识图谱数据与报告</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          导出当前典籍《{graphData.bookTitle}》构建的全部知识实体与分类法/主题法/关系法三维关系网。
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between"
          >
            <FileJson className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-bold text-white text-xs block">导出 JSON 图谱数据</span>
              <span className="text-[11px] text-slate-400">完整节点坐标与多维关系数组</span>
            </div>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex flex-col justify-between"
          >
            <FileText className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-bold text-white text-xs block">导出 Markdown 学术报告</span>
              <span className="text-[11px] text-slate-400">结构化排版的中医药辨证分析</span>
            </div>
          </button>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 flex items-center gap-1.5 border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制JSON至剪贴板' : '复制图谱JSON'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
