export interface Acupoint {
  id: string;
  name: string;
  pinyin: string;
  code: string;               // 国际标准代号，如 LU-1, ST-36, LI-4, PC-6
  meridianId: string;         // 所属经脉ID
  meridianName: string;       // 所属经脉中文名
  categoryTags: string[];     // 穴性标签，如 ["原穴", "五输穴·输穴", "四总穴", "回阳九针穴"]
  position: [number, number, number]; // 人体3D模型坐标 [x, y, z]
  actions: string;            // 核心功效
  indications: string;        // 临床主治
  location: string;           // 解剖定位与简易取穴法
  needling: string;           // 刺灸方法与安全禁忌
  classicalVerse?: string;    // 古籍歌诀/名篇引用
  fivePhase?: string;         // 五行属性 (木/火/土/金/水)
  pointType?: string;         // 井/荥/输/经/合/原/络/郄/募/俞
}

export interface Meridian {
  id: string;
  name: string;               // 经脉全称，如 "手太阴肺经"
  shortName: string;          // 简称，如 "肺经"
  pinyin: string;
  code: string;               // 国际代号 LU, LI, ST, SP, HT, SI, BL, KI, PC, TE, GB, LR
  yinYang: '阴经' | '阳经';
  handFoot: '手经' | '足经';
  color: string;              // 经脉颜色 (Hex)
  twColor: string;
  flowDirection: string;      // 循行走向，如 "从胸走手"、"从手走头"、"从头走足"、"从足走腹胸"
  circulationOrder: number;   // 十二经脉子午流注巡行顺位 (1~12)
  timeSlot: string;           // 子午流注对应时辰，如 "寅时 (03:00 - 05:00)"
  interiorOrgan: string;      // 属脏/腑
  pairedOrgan: string;        // 络脏/腑
  startingPoint: string;      // 经脉起端
  terminatingPoint: string;   // 经脉止端
  pathwayDescription: string; // 详尽循行路线说明 (包括从哪走哪、体内脏腑络属与体表分支)
  keyIndications: string;     // 本经主治概要 (如 肺系疾病、胸痛、经脉所过病)
  acupoints: Acupoint[];      // 沿经核心穴位
  curvePoints: [number, number, number][]; // 3D循行样条曲线控制点 (沿人体表面)
}
