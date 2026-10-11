export type TCMCategory =
  | 'syndrome'   // 证候 / 证型
  | 'formula'    // 方剂
  | 'herb'       // 中药 / 饮片
  | 'symptom'    // 症状 / 脉象 / 舌象
  | 'pathology'  // 病因病机
  | 'method'     // 治法
  | 'meridian'   // 经络 / 脏腑
  | 'theory';    // 纲领 / 理论

export type OrganizationDimension =
  | 'all'            // 全景综合
  | 'classification' // 分类法 (层级分类、脏腑八纲、功用归属)
  | 'thematic'       // 主题法 (论治主题、传变脉络、同卷研讨)
  | 'relational';    // 关系法 (君臣佐使、主治对症、相生相克)

export type Graph3DLayout =
  | 'force'                  // 关系力导向 (动态引力拓扑)
  | 'sphere_classification'  // 分类同心天球 (分层宇宙星系)
  | 'thematic_rings'         // 主题环绕星环 (围绕核心研讨主题)
  | 'meridian_cube';         // 经络脏腑坐标系 (立体空间分层)

export interface TCMNode {
  id: string;
  name: string;
  category: TCMCategory;
  classificationCategory?: string; // 分类法大类 (如 "辛温解表药", "太阳病篇", "脾胃虚寒")
  thematicGroup?: string;           // 主题法归属 (如 "调和营卫", "发汗解表", "五行生克")
  description: string;
  originalQuotes?: string;          // 典籍出处原文
  importance?: number;              // 1 - 10
  properties?: {
    nature?: string;              // 四气五味 (中药)
    meridianTropism?: string;     // 归经
    compositionRole?: string;     // 君/臣/佐/使 (配伍地位)
    syndromeType?: string;        // 八纲属性 (寒/热/虚/实/表/里/阴/阳)
    organAffiliation?: string;    // 脏腑归属
    sourceBook?: string;          // 出处
    dosage?: string;              // 剂量
    contraindications?: string;   // 禁忌
    // 扩展中医临床专病专方与配伍详情
    compositionList?: Array<{     // 方剂配伍君臣佐使清单
      herbName: string;
      role: '君' | '臣' | '佐' | '使' | string;
      dosage?: string;
      action?: string;
    }>;
    treatsFormulas?: string[];    // 证候：治疗方剂推荐
    actions?: string;             // 中药/方剂：核心功效
    indications?: string;         // 方剂/中药：主治病证
    diagnosticPoints?: string;    // 证候/症状：辨证要点 (舌苔脉象体征)
    therapeuticMethod?: string;   // 证候/病机：推荐治则治法
    dosageUsage?: string;         // 用法用量与煎服法 (如：水煎温服，啜热稀粥)
    precautions?: string;         // 注意事项与临床禁忌
    pathogenesisAnalysis?: string;// 病机深度剖析
    variations?: string;          // 方剂加减化裁
    literatureData?: TCMLiteratureData; // 关联文献引用数据 (古籍原文摘录与现代研究综述)
  };
  // 3D coordinates & velocities for Three.js
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface TCMRelation {
  source: string; // node id
  target: string; // node id
  relationType: string; // 如 "主治", "配伍·君药", "配伍·臣药", "化裁", "归经", "引起症状", "体现治法", "属于大类", "相同主题"
  dimension: 'classification' | 'thematic' | 'relational';
  description: string;
  weight?: number; // 1 - 5
}

export interface TCMGraphData {
  bookTitle: string;
  dynasty?: string;
  author?: string;
  summary: string;
  nodes: TCMNode[];
  relations: TCMRelation[];
}

export interface PresetBook {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  category: string;
  coverBadge: string;
  description: string;
  sampleText: string;
  graphData: TCMGraphData;
}

export interface ClassicalCitation {
  sourceBook: string;            // 典籍名称，如《伤寒论》、《黄帝内经》
  dynastyAndAuthor: string;      // 朝代与医家，如 汉 · 张仲景
  chapter: string;               // 篇章卷次与条文，如 辨太阳病脉证并治上·第12条
  originalText: string;          // 古籍经文原文
  doctorCommentary?: string;     // 历代名家权威按语考证 (如 柯琴、成无己、张锡纯、李时珍)
  medicalSignificance: string;   // 经旨医理临床要义
}

export interface ModernResearchReview {
  topic: string;                 // 科研主题与机制方向
  chemicalBases?: string;        // 有效化学成分与药效物质基础
  pharmacologicalAction: string; // 现代药理机制与实验证据
  clinicalEvidence?: string;     // 临床循证医学适应证
  journalOrSource: string;       // 期刊来源或行业指南
  publicationYear?: string;      // 发表年份
}

export interface TCMLiteratureData {
  nodeName: string;
  classicalCitations: ClassicalCitation[];
  modernResearchReviews: ModernResearchReview[];
}
