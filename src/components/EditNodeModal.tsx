import React, { useState } from 'react';
import { TCMNode } from '../types/tcm';
import { CATEGORY_MAP } from '../data/tcmConfig';
import { enrichNodeLocally } from '../utils/tcmRuleExtractor';
import {
  X,
  Sparkles,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Compass,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: TCMNode;
  bookTitle?: string;
  onSaveNode: (updatedNode: TCMNode) => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  onClose,
  node,
  bookTitle,
  onSaveNode,
}) => {
  const [description, setDescription] = useState(node.description || '');
  const [originalQuotes, setOriginalQuotes] = useState(node.originalQuotes || '');
  const [nature, setNature] = useState(node.properties?.nature || '');
  const [meridianTropism, setMeridianTropism] = useState(node.properties?.meridianTropism || '');
  const [compositionRole, setCompositionRole] = useState(node.properties?.compositionRole || '');
  const [syndromeType, setSyndromeType] = useState(node.properties?.syndromeType || '');
  const [organAffiliation, setOrganAffiliation] = useState(node.properties?.organAffiliation || '');
  const [actions, setActions] = useState(node.properties?.actions || '');
  const [indications, setIndications] = useState(node.properties?.indications || '');
  const [diagnosticPoints, setDiagnosticPoints] = useState(node.properties?.diagnosticPoints || '');
  const [therapeuticMethod, setTherapeuticMethod] = useState(node.properties?.therapeuticMethod || '');
  const [dosageUsage, setDosageUsage] = useState(node.properties?.dosageUsage || '');
  const [precautions, setPrecautions] = useState(node.properties?.precautions || '');
  const [treatsFormulas, setTreatsFormulas] = useState(
    (node.properties?.treatsFormulas || []).join('、')
  );
  const [compositionList, setCompositionList] = useState(
    node.properties?.compositionList || []
  );

  const [isAIEnriching, setIsAIEnriching] = useState(false);
  const [enrichStatus, setEnrichStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const catMeta = CATEGORY_MAP[node.category] || CATEGORY_MAP.theory;

  // Add composition item
  const handleAddHerb = () => {
    setCompositionList([
      ...compositionList,
      { herbName: '', role: '臣', dosage: '', action: '' }
    ]);
  };

  const handleRemoveHerb = (idx: number) => {
    setCompositionList(compositionList.filter((_, i) => i !== idx));
  };

  const handleUpdateHerb = (idx: number, field: string, value: string) => {
    const updated = [...compositionList];
    updated[idx] = { ...updated[idx], [field]: value };
    setCompositionList(updated);
  };

  // AI Auto-enrich
  const handleAIEnrich = async () => {
    setIsAIEnriching(true);
    setEnrichStatus('正在调阅中医药典籍规范，AI深度生成临床释义...');

    try {
      const res = await fetch('/api/enrich-node-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node, bookTitle }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (d.detailedDefinition) setDescription(d.detailedDefinition);
          if (d.nature) setNature(d.nature);
          if (d.meridianTropism) setMeridianTropism(d.meridianTropism);
          if (d.compositionRole) setCompositionRole(d.compositionRole);
          if (d.syndromeType) setSyndromeType(d.syndromeType);
          if (d.organAffiliation) setOrganAffiliation(d.organAffiliation);
          if (d.actions) setActions(d.actions);
          if (d.indications) setIndications(d.indications);
          if (d.diagnosticPoints) setDiagnosticPoints(d.diagnosticPoints);
          if (d.therapeuticMethod) setTherapeuticMethod(d.therapeuticMethod);
          if (d.dosageUsage) setDosageUsage(d.dosageUsage);
          if (d.precautions) setPrecautions(d.precautions);
          if (d.treatsFormulas?.length) setTreatsFormulas(d.treatsFormulas.join('、'));
          if (d.compositionList?.length) setCompositionList(d.compositionList);

          setEnrichStatus('AI 中医药典规范补全完成！');
          setIsAIEnriching(false);
          return;
        }
      }

      // Local fallback
      const local = enrichNodeLocally(node);
      if (local.detailedDefinition) setDescription(local.detailedDefinition);
      if (local.properties?.nature) setNature(local.properties.nature);
      if (local.properties?.meridianTropism) setMeridianTropism(local.properties.meridianTropism);
      if (local.properties?.compositionRole) setCompositionRole(local.properties.compositionRole);
      if (local.properties?.syndromeType) setSyndromeType(local.properties.syndromeType);
      if (local.properties?.organAffiliation) setOrganAffiliation(local.properties.organAffiliation);
      if (local.properties?.actions) setActions(local.properties.actions);
      if (local.properties?.indications) setIndications(local.properties.indications);
      if (local.properties?.diagnosticPoints) setDiagnosticPoints(local.properties.diagnosticPoints);
      if (local.properties?.therapeuticMethod) setTherapeuticMethod(local.properties.therapeuticMethod);
      if (local.properties?.dosageUsage) setDosageUsage(local.properties.dosageUsage);
      if (local.properties?.precautions) setPrecautions(local.properties.precautions);
      if (local.properties?.treatsFormulas?.length) setTreatsFormulas(local.properties.treatsFormulas.join('、'));
      if (local.properties?.compositionList?.length) setCompositionList(local.properties.compositionList);

      setEnrichStatus('已从内置中医名著数据库一键补全！');
    } catch (err) {
      console.warn('Enrich failed:', err);
      const local = enrichNodeLocally(node);
      if (local.detailedDefinition) setDescription(local.detailedDefinition);
      if (local.properties?.nature) setNature(local.properties.nature);
      if (local.properties?.meridianTropism) setMeridianTropism(local.properties.meridianTropism);
      if (local.properties?.actions) setActions(local.properties.actions);
      setEnrichStatus('已从内置中医名著数据库补全！');
    } finally {
      setIsAIEnriching(false);
    }
  };

  const handleSave = () => {
    const updatedNode: TCMNode = {
      ...node,
      description,
      originalQuotes: originalQuotes || undefined,
      properties: {
        ...node.properties,
        nature: nature || undefined,
        meridianTropism: meridianTropism || undefined,
        compositionRole: compositionRole || undefined,
        syndromeType: syndromeType || undefined,
        organAffiliation: organAffiliation || undefined,
        actions: actions || undefined,
        indications: indications || undefined,
        diagnosticPoints: diagnosticPoints || undefined,
        therapeuticMethod: therapeuticMethod || undefined,
        dosageUsage: dosageUsage || undefined,
        precautions: precautions || undefined,
        treatsFormulas: treatsFormulas
          ? treatsFormulas.split(/[、,，\s]+/).filter(Boolean)
          : undefined,
        compositionList: compositionList.length > 0 ? compositionList : undefined,
      }
    };
    onSaveNode(updatedNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold shadow-md"
              style={{
                backgroundColor: `${catMeta.color}25`,
                color: catMeta.color,
                border: `1.5px solid ${catMeta.color}60`
              }}
            >
              {catMeta.glyph}
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                <span>编辑 / 导入「{node.name}」中医临床属性</span>
                <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full ${catMeta.twBg} ${catMeta.twColor} border ${catMeta.twBorder}`}>
                  {catMeta.label}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                录入精准的证候定义、治方、君臣佐使配伍、中药性味归经、功效与禁忌
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

        {/* Toolbar: AI Auto Fill Button */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>智能辅助：可一键调用中医大模型自动补全本节点的标准临床信息</span>
          </div>
          <button
            onClick={handleAIEnrich}
            disabled={isAIEnriching}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-medium flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
          >
            {isAIEnriching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>AI 一键补全临床属性</span>
              </>
            )}
          </button>
        </div>

        {enrichStatus && (
          <div className="px-6 py-2 bg-emerald-950/40 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{enrichStatus}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Detailed Definition */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              权威专业释义 / 核心定义
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入该知识点的权威中医定义与核心病理内涵..."
              className="w-full p-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-serif"
            />
          </div>

          {/* Category-Specific Form Section */}
          {node.category === 'formula' && (
            /* 方剂专属：君臣佐使配伍清单 */
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-rose-500/20">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                  <Compass className="w-4 h-4 text-rose-400" />
                  方剂配伍 · 君臣佐使组成清单
                </span>
                <button
                  onClick={handleAddHerb}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加中药组成</span>
                </button>
              </div>

              {compositionList.length === 0 ? (
                <p className="text-slate-500 italic py-2">
                  暂未录入君臣佐使药味，可点击上方「AI一键补全」或手动添加。
                </p>
              ) : (
                <div className="space-y-2">
                  {compositionList.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 items-center"
                    >
                      <input
                        type="text"
                        value={item.herbName}
                        onChange={(e) => handleUpdateHerb(idx, 'herbName', e.target.value)}
                        placeholder="药名 (如: 桂枝)"
                        className="col-span-3 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                      />
                      <select
                        value={item.role}
                        onChange={(e) => handleUpdateHerb(idx, 'role', e.target.value)}
                        className="col-span-2 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-rose-300 font-bold"
                      >
                        <option value="君">君药</option>
                        <option value="臣">臣药</option>
                        <option value="佐">佐药</option>
                        <option value="使">使药</option>
                      </select>
                      <input
                        type="text"
                        value={item.dosage || ''}
                        onChange={(e) => handleUpdateHerb(idx, 'dosage', e.target.value)}
                        placeholder="剂量 (如: 三两)"
                        className="col-span-2 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={item.action || ''}
                        onChange={(e) => handleUpdateHerb(idx, 'action', e.target.value)}
                        placeholder="配伍意义 (如: 解肌发表温卫)"
                        className="col-span-4 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300"
                      />
                      <button
                        onClick={() => handleRemoveHerb(idx)}
                        className="col-span-1 p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 mb-1">功用治法</label>
                  <input
                    type="text"
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    placeholder="如：解肌发表，调和营卫"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">临床主治病证</label>
                  <input
                    type="text"
                    value={indications}
                    onChange={(e) => setIndications(e.target.value)}
                    placeholder="如：太阳中风表虚证、发热自汗"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 证候证型专属：治疗方剂与辨证要点 */}
          {node.category === 'syndrome' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-amber-500/20">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs pb-1 border-b border-slate-800">
                <Compass className="w-4 h-4 text-amber-400" />
                证候临床辨治 · 对应治方与治则
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">推荐治疗经典方剂 (用顿号隔开)</label>
                  <input
                    type="text"
                    value={treatsFormulas}
                    onChange={(e) => setTreatsFormulas(e.target.value)}
                    placeholder="如：桂枝汤、桂枝加葛根汤"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">对应治则治法</label>
                  <input
                    type="text"
                    value={therapeuticMethod}
                    onChange={(e) => setTherapeuticMethod(e.target.value)}
                    placeholder="如：解肌发表，调和营卫"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium text-cyan-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">辨证要点 (舌苔脉象核心指征)</label>
                <input
                  type="text"
                  value={diagnosticPoints}
                  onChange={(e) => setDiagnosticPoints(e.target.value)}
                  placeholder="如：发热、恶风、汗出、脉浮缓四联主症"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* 本草中药专属：性味归经与功效 */}
          {(node.category === 'herb' || nature || meridianTropism) && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs pb-1 border-b border-slate-800">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                本草药性 · 性味归经与功效禁忌
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">四气五味</label>
                  <input
                    type="text"
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    placeholder="如：辛、甘，温"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">药力归经</label>
                  <input
                    type="text"
                    value={meridianTropism}
                    onChange={(e) => setMeridianTropism(e.target.value)}
                    placeholder="如：归心、肺、膀胱经"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-blue-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">核心中药功效</label>
                <input
                  type="text"
                  value={actions}
                  onChange={(e) => setActions(e.target.value)}
                  placeholder="如：发汗解肌，温通经脉，助阳化气"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* 通用属性：用法煎服法与注意事项禁忌 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">
                用法用量 / 煎服法
              </label>
              <textarea
                rows={2}
                value={dosageUsage}
                onChange={(e) => setDosageUsage(e.target.value)}
                placeholder="如：水煎服，啜热稀粥以助药力，温覆微汗..."
                className="w-full p-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-rose-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                注意事项与配伍禁忌
              </label>
              <textarea
                rows={2}
                value={precautions}
                onChange={(e) => setPrecautions(e.target.value)}
                placeholder="如：温病表热、表实无汗及阴虚火旺者禁用..."
                className="w-full p-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Original Quotes */}
          <div>
            <label className="block font-semibold text-slate-400 mb-1">
              典籍出处经文原文
            </label>
            <input
              type="text"
              value={originalQuotes}
              onChange={(e) => setOriginalQuotes(e.target.value)}
              placeholder="如：太阳中风，阳浮而阴弱...啬啬恶寒，淅淅恶风..."
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-amber-200 font-serif"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>保存并更新图谱</span>
          </button>
        </div>
      </div>
    </div>
  );
};
