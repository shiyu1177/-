import { TCMCategory, OrganizationDimension, Graph3DLayout } from '../types/tcm';

export interface CategoryMeta {
  label: string;
  enLabel: string;
  color: string;      // Hex color for Three.js
  twColor: string;    // Tailwind CSS text color
  twBg: string;       // Tailwind CSS background badge
  twBorder: string;   // Tailwind border
  desc: string;
  glyph: string;
}

export const CATEGORY_MAP: Record<TCMCategory, CategoryMeta> = {
  syndrome: {
    label: '证候证型',
    enLabel: 'Syndrome',
    color: '#f59e0b', // Amber Gold
    twColor: 'text-amber-400',
    twBg: 'bg-amber-950/40',
    twBorder: 'border-amber-500/30',
    desc: '机体在疾病发展过程中某一阶段的病理概括（八纲、脏腑、六经、卫气营血）',
    glyph: '证',
  },
  formula: {
    label: '经典方剂',
    enLabel: 'Formula',
    color: '#ef4444', // Cinnabar Red
    twColor: 'text-rose-400',
    twBg: 'bg-rose-950/40',
    twBorder: 'border-rose-500/30',
    desc: '依照辨证论治原则与君臣佐使法度组合配伍的中医处方',
    glyph: '方',
  },
  herb: {
    label: '本草中药',
    enLabel: 'Herb',
    color: '#10b981', // Jade Green
    twColor: 'text-emerald-400',
    twBg: 'bg-emerald-950/40',
    twBorder: 'border-emerald-500/30',
    desc: '具有特定性味、归经、升降浮沉及相须相使配伍属性的中药饮片',
    glyph: '药',
  },
  symptom: {
    label: '症状体征',
    enLabel: 'Symptom',
    color: '#fb923c', // Coral Orange
    twColor: 'text-orange-400',
    twBg: 'bg-orange-950/40',
    twBorder: 'border-orange-500/30',
    desc: '患者主观感知之疾苦（问诊）及医者望闻切所得之客观表象（脉象、舌象）',
    glyph: '症',
  },
  pathology: {
    label: '病因病机',
    enLabel: 'Pathology',
    color: '#a855f7', // Amethyst Purple
    twColor: 'text-purple-400',
    twBg: 'bg-purple-950/40',
    twBorder: 'border-purple-500/30',
    desc: '疾病发生、演变机理，如邪正相搏、阴阳失调、气机阻滞、津液代谢失常',
    glyph: '机',
  },
  method: {
    label: '治则治法',
    enLabel: 'Method',
    color: '#06b6d4', // Cyan
    twColor: 'text-cyan-400',
    twBg: 'bg-cyan-950/40',
    twBorder: 'border-cyan-500/30',
    desc: '针对特定病机确立的治疗大纲，如解肌发表、调和营卫、急下存阴',
    glyph: '法',
  },
  meridian: {
    label: '脏腑经络',
    enLabel: 'Meridian & Zangfu',
    color: '#3b82f6', // Indigo Blue
    twColor: 'text-blue-400',
    twBg: 'bg-blue-950/40',
    twBorder: 'border-blue-500/30',
    desc: '运行气血、联络脏腑肢节之通路网络及五脏六腑功能实体系统',
    glyph: '经',
  },
  theory: {
    label: '中医经旨',
    enLabel: 'Core Doctrine',
    color: '#e2e8f0', // Silver White / Imperial Celestial
    twColor: 'text-slate-200',
    twBg: 'bg-slate-800/60',
    twBorder: 'border-slate-400/30',
    desc: '阴阳五行、天人相应、治未病、六经传变等中医药理论核心范式',
    glyph: '论',
  },
};

export const DIMENSION_INFO: Record<OrganizationDimension, {
  name: string;
  title: string;
  description: string;
  icon: string;
  methods: string[];
}> = {
  all: {
    name: '全景融合',
    title: '全景综合图谱 (Holistic Graph)',
    description: '融合分类层次、主题聚类与因果配伍关系的完整立体中医认知网络。',
    icon: '🌐',
    methods: ['层级归类', '主题研讨', '配伍脉络', '立体拓扑'],
  },
  classification: {
    name: '分类法',
    title: '分类法组织 (Classification Method)',
    description: '按中医门类层级划分：如脏腑系统、六经归经、八纲属性、中药功用大类、方剂治剂大类等上下位从属组织。',
    icon: '🌲',
    methods: ['脏腑分类法', '六经/八纲分类法', '药效大类分类法', '方剂功用归类'],
  },
  thematic: {
    name: '主题法',
    title: '主题法组织 (Thematic Method)',
    description: '按辨证论治核心命题组织：围绕某一医理主题（如“营卫调和”、“外感风寒发散”、“水火既济”）串联跨类目知识点。',
    icon: '📜',
    methods: ['传变主题链', '经典名章论述题', '治病求本主线', '标本缓急主题'],
  },
  relational: {
    name: '关系法',
    title: '关系法组织 (Relational Method)',
    description: '按实体语义逻辑精确连接：君臣佐使配伍相使、方药对证、病机导向治法、药力归经、五行相生相克。',
    icon: '⚡',
    methods: ['方剂配伍关系 (君臣佐使)', '治法对应病机', '方药主治对症', '引经报使关联'],
  },
};

export const LAYOUT_INFO: Record<Graph3DLayout, {
  name: string;
  tag: string;
  desc: string;
}> = {
  force: {
    name: '三维力导向',
    tag: '拓扑平衡',
    desc: '基于物理引力与弹簧排斥模型，紧密相关节点自然聚拢形成临床辨证星丛。',
  },
  sphere_classification: {
    name: '分类同心天球',
    tag: '层级星体',
    desc: '将知识点按分类法分层投射在同心环形轨道上，清晰呈现大类与子实体的上下位秩序。',
  },
  thematic_rings: {
    name: '主题旋转星环',
    tag: '主题脉络',
    desc: '围绕辨证论治核心主题形成空间立体环绕，生动展现同卷主题研讨与演变。',
  },
  meridian_cube: {
    name: '脏腑经络空间',
    tag: '天地立体',
    desc: '按照人体上中下三焦、表里阴阳构建三维空间坐标系，直观透视病邪传变层次。',
  },
};
