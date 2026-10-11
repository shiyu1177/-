import { TCMNode, TCMRelation, TCMGraphData, TCMCategory } from '../types/tcm';

// Rich domain dictionary of TCM entities
interface EntityRule {
  keyword: string;
  category: TCMCategory;
  classificationCategory: string;
  thematicGroup: string;
  description: string;
  nature?: string;
  meridianTropism?: string;
}

const TCM_DICTIONARY: EntityRule[] = [
  // 方剂
  { keyword: '桂枝汤', category: 'formula', classificationCategory: '解表剂·辛温解表', thematicGroup: '营卫调和', description: '群方之冠，解肌发表，调和营卫，主治太阳中风表虚证。' },
  { keyword: '麻黄汤', category: 'formula', classificationCategory: '解表剂·辛温解表', thematicGroup: '发汗平喘', description: '辛温发汗重剂，发汗解表，宣肺平喘，专治风寒表实无汗。' },
  { keyword: '葛根汤', category: 'formula', classificationCategory: '解表剂·辛温解表', thematicGroup: '解肌舒筋', description: '解肌发表，生津舒筋，治太阳中风项背强几几、无汗恶风。' },
  { keyword: '小青龙汤', category: 'formula', classificationCategory: '解表剂·辛温解表', thematicGroup: '温化水饮', description: '解表散寒，温肺化饮，治外感风寒兼内停水饮咳喘。' },
  { keyword: '大承气汤', category: 'formula', classificationCategory: '泻下剂·寒下', thematicGroup: '阳明腑实', description: '峻下热结，急下存阴，治阳明腑实痞满燥实坚。' },
  { keyword: '小柴胡汤', category: 'formula', classificationCategory: '和解剂·和解少阳', thematicGroup: '少阳枢机', description: '和解少阳，透达少阳郁热，主治往来寒热、胸胁苦满。' },
  { keyword: '四君子汤', category: 'formula', classificationCategory: '补益剂·益气', thematicGroup: '健脾培土', description: '益气健脾，和胃渗湿，为补气第一基础名方。' },
  { keyword: '四物汤', category: 'formula', classificationCategory: '补益剂·补血', thematicGroup: '养血活血', description: '补血和血，调经化瘀，为妇科与血家第一基础名方。' },
  { keyword: '补中益气汤', category: 'formula', classificationCategory: '补益剂·补气升阳', thematicGroup: '甘温除热', description: '补中益气，升阳举陷，调治脾胃气虚与中气下陷。' },
  { keyword: '银翘散', category: 'formula', classificationCategory: '解表剂·辛凉解表', thematicGroup: '辛凉透表', description: '辛凉平剂，辛凉透表，清热解毒，治温病初起发热微恶寒。' },
  { keyword: '桑菊饮', category: 'formula', classificationCategory: '解表剂·辛凉解表', thematicGroup: '宣肺止咳', description: '辛凉轻剂，疏风清热，宣肺止咳，治风温咳嗽初起。' },
  { keyword: '白虎汤', category: 'formula', classificationCategory: '清热剂·清气分热', thematicGroup: '清泄胃热', description: '清热生津，消渴除烦，治气分大热、大渴、大汗、脉洪大。' },
  { keyword: '归脾汤', category: 'formula', classificationCategory: '补益剂·气血双补', thematicGroup: '心脾同调', description: '益气补血，健脾养心，治心脾两虚、气不摄血。' },
  { keyword: '六味地黄丸', category: 'formula', classificationCategory: '补益剂·滋补肝肾', thematicGroup: '三补三泻', description: '滋补肝肾，三补三泻，治腰膝酸软、头晕耳鸣、骨蒸潮热。' },

  // 中药
  { keyword: '桂枝', category: 'herb', classificationCategory: '辛温解表药', thematicGroup: '通阳解肌', description: '发汗解肌，温通经脉，助阳化气。', nature: '辛、甘，温', meridianTropism: '心、肺、膀胱经' },
  { keyword: '白芍', category: 'herb', classificationCategory: '补血药', thematicGroup: '敛阴柔肝', description: '养血调经，敛阴止汗，柔肝止痛，平抑肝阳。', nature: '苦、酸，微寒', meridianTropism: '肝、脾经' },
  { keyword: '麻黄', category: 'herb', classificationCategory: '辛温解表药', thematicGroup: '宣发皮毛', description: '发汗解表，宣肺平喘，利水消肿。', nature: '辛、微苦，温', meridianTropism: '肺、膀胱经' },
  { keyword: '生姜', category: 'herb', classificationCategory: '辛温解表药', thematicGroup: '温中止呕', description: '解表散寒，温中止呕，化痰止咳，解鱼蟹毒。', nature: '辛，微温', meridianTropism: '肺、脾、胃经' },
  { keyword: '大枣', category: 'herb', classificationCategory: '补虚药·补气', thematicGroup: '培补中焦', description: '补中益气，养血安神，缓和药性。', nature: '甘，温', meridianTropism: '脾、胃、心经' },
  { keyword: '甘草', category: 'herb', classificationCategory: '补虚药·补气', thematicGroup: '调和百药', description: '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。', nature: '甘，平', meridianTropism: '心、肺、脾、胃经' },
  { keyword: '杏仁', category: 'herb', classificationCategory: '止咳平喘药', thematicGroup: '降气平喘', description: '降气止咳平喘，润肠通便。', nature: '苦，微温', meridianTropism: '肺、大肠经' },
  { keyword: '黄芪', category: 'herb', classificationCategory: '补气药', thematicGroup: '益气升阳', description: '补气升阳，固表止汗，托毒排脓，利水消肿。', nature: '甘，微温', meridianTropism: '肺、脾经' },
  { keyword: '人参', category: 'herb', classificationCategory: '补气药', thematicGroup: '大补元气', description: '大补元气，复脉固脱，补脾益肺，生津养血，安神益智。', nature: '甘、微苦，微温', meridianTropism: '脾、肺、心、肾经' },
  { keyword: '白术', category: 'herb', classificationCategory: '补气健脾药', thematicGroup: '健脾燥湿', description: '健脾益气，燥湿利水，止汗，安胎。', nature: '苦、甘，温', meridianTropism: '脾、胃经' },
  { keyword: '茯苓', category: 'herb', classificationCategory: '利水渗湿药', thematicGroup: '利湿宁心', description: '利水渗湿，健脾，宁心。', nature: '甘、淡，平', meridianTropism: '心、脾、肺、肾经' },
  { keyword: '当归', category: 'herb', classificationCategory: '补血药', thematicGroup: '补血活血', description: '补血活血，调经止痛，润肠通便。', nature: '甘、辛，温', meridianTropism: '肝、心、脾经' },
  { keyword: '柴胡', category: 'herb', classificationCategory: '辛凉解表药', thematicGroup: '疏肝解郁', description: '疏散退热，疏肝解郁，升举阳气。', nature: '苦、辛，微寒', meridianTropism: '肝、胆、心包经' },
  { keyword: '金银花', category: 'herb', classificationCategory: '清热解毒药', thematicGroup: '芳香透表', description: '清热解毒，疏散风热。', nature: '甘，寒', meridianTropism: '肺、心、胃经' },
  { keyword: '连翘', category: 'herb', classificationCategory: '清热解毒药', thematicGroup: '透热清心', description: '清热解毒，消肿散结，疏散风热。', nature: '苦，微寒', meridianTropism: '心、肺、胆经' },
  { keyword: '石膏', category: 'herb', classificationCategory: '清热泻火药', thematicGroup: '清热泻火', description: '清热泻火，除烦止渴，煅用敛疮生肌。', nature: '辛、甘，大寒', meridianTropism: '肺、胃经' },

  // 证候
  { keyword: '太阳中风', category: 'syndrome', classificationCategory: '六经·太阳表虚', thematicGroup: '营卫不和', description: '风邪外袭，卫强营弱，腠理疏松之表虚证。' },
  { keyword: '太阳伤寒', category: 'syndrome', classificationCategory: '六经·太阳表实', thematicGroup: '风寒闭表', description: '寒邪袭表，卫阳被郁，毛窍闭塞无汗之表实证。' },
  { keyword: '少阳病', category: 'syndrome', classificationCategory: '六经·少阳半表半里', thematicGroup: '枢机不利', description: '邪在半表半里，少阳枢机失调，往来寒热。' },
  { keyword: '阳明病', category: 'syndrome', classificationCategory: '六经·阳明里实热', thematicGroup: '燥结热盛', description: '邪热入里化燥，阳明热盛或燥结内停。' },
  { keyword: '脾胃虚弱', category: 'syndrome', classificationCategory: '脏腑辨证·脾胃', thematicGroup: '脾虚失运', description: '中焦脾胃运化无权，食少便溏，神疲乏力。' },
  { keyword: '气血亏虚', category: 'syndrome', classificationCategory: '气血津液辨证', thematicGroup: '气血失荣', description: '气虚与血虚并见，面色无华，心悸失眠，脉细弱。' },
  { keyword: '卫分证', category: 'syndrome', classificationCategory: '卫气营血辨证·表', thematicGroup: '温邪初起', description: '温热病邪袭表，肺卫失和。' },
  { keyword: '气分证', category: 'syndrome', classificationCategory: '卫气营血辨证·里', thematicGroup: '热盛伤津', description: '热入气分，里热蒸腾，壮热大渴。' },

  // 症状
  { keyword: '发热', category: 'symptom', classificationCategory: '问诊·寒热', thematicGroup: '正邪交争', description: '体温升高，阳气抗邪于外之征象。' },
  { keyword: '恶寒', category: 'symptom', classificationCategory: '问诊·寒热', thematicGroup: '卫阳受郁', description: '怕冷，虽加衣覆被不能缓解。' },
  { keyword: '恶风', category: 'symptom', classificationCategory: '问诊·寒热', thematicGroup: '营卫疏松', description: '遇风觉冷，避风即缓。' },
  { keyword: '汗出', category: 'symptom', classificationCategory: '问诊·出汗', thematicGroup: '腠理不固', description: '营阴失守，腠理开泄而自汗。' },
  { keyword: '头痛', category: 'symptom', classificationCategory: '问诊·头身', thematicGroup: '经气阻滞', description: '头部经脉不通或不荣而痛。' },
  { keyword: '项强', category: 'symptom', classificationCategory: '问诊·头身', thematicGroup: '经脉挛急', description: '项背肌肉牵引拘急不适。' },
  { keyword: '干呕', category: 'symptom', classificationCategory: '问诊·消化', thematicGroup: '胃气上逆', description: '有声无物之呕逆，胃气失和。' },
  { keyword: '脉浮', category: 'symptom', classificationCategory: '切诊·脉象', thematicGroup: '邪客在表', description: '轻按即得，重按稍减而不空，主表证。' },
  { keyword: '脉缓', category: 'symptom', classificationCategory: '切诊·脉象', thematicGroup: '营阴不足', description: '往来和缓，指下宽缓，主营弱。' },
  { keyword: '脉紧', category: 'symptom', classificationCategory: '切诊·脉象', thematicGroup: '寒邪凝滞', description: '如转索牵绳，主寒主痛。' },

  // 治法
  { keyword: '解肌发表', category: 'method', classificationCategory: '汗法·透表', thematicGroup: '调和营卫', description: '宣通肌表腠理，透散风热或表虚之邪。' },
  { keyword: '发汗解表', category: 'method', classificationCategory: '汗法·开腠', thematicGroup: '发汗散寒', description: '开泄毛窍玄府，大汗以散外寒。' },
  { keyword: '调和营卫', category: 'method', classificationCategory: '和法·和表', thematicGroup: '营卫调和', description: '辛甘化阳、酸甘化阴，协同营卫。' },
  { keyword: '健脾益气', category: 'method', classificationCategory: '补法·健脾', thematicGroup: '培补后天', description: '补益脾胃元气，增进运化水谷之功。' },
  { keyword: '清热解毒', category: 'method', classificationCategory: '清法·泻火', thematicGroup: '清瘟败毒', description: '针对火热瘟毒邪气，直折其势。' },

  // 病机
  { keyword: '营卫不和', category: 'pathology', classificationCategory: '气血病机', thematicGroup: '营卫失调', description: '卫气浮盛于外，营阴不能内守。' },
  { keyword: '风寒束表', category: 'pathology', classificationCategory: '六淫病机', thematicGroup: '寒凝腠闭', description: '寒性收引致毛窍郁闭，卫阳被困。' },
  { keyword: '脾虚湿盛', category: 'pathology', classificationCategory: '脏腑病机', thematicGroup: '运化失职', description: '脾气不足，不能运化水湿，湿浊内停。' },

  // 经络脏腑
  { keyword: '膀胱经', category: 'meridian', classificationCategory: '十二经脉', thematicGroup: '表卫经脉', description: '足太阳膀胱经，总领一身之表。' },
  { keyword: '肺经', category: 'meridian', classificationCategory: '十二经脉', thematicGroup: '主气司卫', description: '手太阴肺经，主皮毛，司呼吸。' },
  { keyword: '脾', category: 'meridian', classificationCategory: '五脏系统', thematicGroup: '后天之本', description: '主运化，主统血，在体合肌肉。' },
  { keyword: '胃', category: 'meridian', classificationCategory: '六腑系统', thematicGroup: '水谷之海', description: '主受纳腐熟，其气以下行为顺。' },

  // 理论
  { keyword: '六经辨证', category: 'theory', classificationCategory: '辨证纲领', thematicGroup: '伤寒总纲', description: '仲景将外感疾病演变划分为三阳三阴六个阶段。' },
  { keyword: '阴阳学说', category: 'theory', classificationCategory: '哲学总纲', thematicGroup: '生命本质', description: '对立统一，互根互用，阴平阳秘。' },
  { keyword: '五行生克', category: 'theory', classificationCategory: '运化体系', thematicGroup: '生克制化', description: '木火土金水，资生相助与相克制约。' }
];

export function extractKnowledgeLocally(title: string, text: string): TCMGraphData {
  const foundEntities: TCMNode[] = [];
  const addedIds = new Set<string>();

  // Find matching entities in text
  for (const item of TCM_DICTIONARY) {
    if (text.includes(item.keyword) || title.includes(item.keyword)) {
      const id = `node-${encodeURIComponent(item.keyword)}`;
      if (!addedIds.has(id)) {
        addedIds.add(id);

        // Find citation quote in text
        let quote = '';
        const idx = text.indexOf(item.keyword);
        if (idx !== -1) {
          const start = Math.max(0, idx - 15);
          const end = Math.min(text.length, idx + item.keyword.length + 20);
          quote = text.slice(start, end).replace(/\n/g, ' ').trim();
        }

        foundEntities.push({
          id,
          name: item.keyword,
          category: item.category,
          classificationCategory: item.classificationCategory,
          thematicGroup: item.thematicGroup,
          description: item.description,
          originalQuotes: quote || undefined,
          importance: item.category === 'formula' || item.category === 'theory' ? 9 : 8,
          properties: {
            nature: item.nature,
            meridianTropism: item.meridianTropism
          }
        });
      }
    }
  }

  // If fewer than 4 matched, inject core related nodes from context or classical defaults
  if (foundEntities.length < 5) {
    const defaults = TCM_DICTIONARY.slice(0, 8);
    for (const item of defaults) {
      const id = `node-${encodeURIComponent(item.keyword)}`;
      if (!addedIds.has(id)) {
        addedIds.add(id);
        foundEntities.push({
          id,
          name: item.keyword,
          category: item.category,
          classificationCategory: item.classificationCategory,
          thematicGroup: item.thematicGroup,
          description: item.description,
          importance: 8,
          properties: {
            nature: item.nature,
            meridianTropism: item.meridianTropism
          }
        });
      }
    }
  }

  // Automatically derive relations among found entities
  const relations: TCMRelation[] = [];
  const entityMap = new Map(foundEntities.map(e => [e.name, e]));

  // Common pairing rules
  const pairingRules: Array<{
    src: string;
    tgt: string;
    type: string;
    dim: 'classification' | 'thematic' | 'relational';
    desc: string;
    weight: number;
  }> = [
    { src: '桂枝汤', tgt: '太阳中风', type: '主治', dim: 'relational', desc: '桂枝汤为治太阳中风表虚之第一主方。', weight: 5 },
    { src: '麻黄汤', tgt: '太阳伤寒', type: '主治', dim: 'relational', desc: '麻黄汤为治太阳伤寒表实无汗之主方。', weight: 5 },
    { src: '桂枝汤', tgt: '桂枝', type: '配伍·君药', dim: 'relational', desc: '桂枝温经散寒，解肌和营为君。', weight: 5 },
    { src: '桂枝汤', tgt: '白芍', type: '配伍·臣药', dim: 'relational', desc: '白芍益阴和营，一散一敛为臣。', weight: 4 },
    { src: '桂枝汤', tgt: '生姜', type: '配伍·佐药', dim: 'relational', desc: '生姜发散风寒，降逆和胃。', weight: 3 },
    { src: '桂枝汤', tgt: '大枣', type: '配伍·佐药', dim: 'relational', desc: '大枣补脾益气，助芍药和营。', weight: 3 },
    { src: '桂枝汤', tgt: '甘草', type: '配伍·使药', dim: 'relational', desc: '甘草调和诸药，合桂枝辛甘化阳。', weight: 4 },
    { src: '麻黄汤', tgt: '麻黄', type: '配伍·君药', dim: 'relational', desc: '麻黄发汗解表，开泄皮毛为君。', weight: 5 },
    { src: '麻黄汤', tgt: '杏仁', type: '配伍·佐药', dim: 'relational', desc: '杏仁宣降肺气，与麻黄合宣降平喘。', weight: 4 },
    { src: '桂枝汤', tgt: '解肌发表', type: '体现治法', dim: 'relational', desc: '桂枝汤体现解肌发表调和营卫大法。', weight: 4 },
    { src: '桂枝汤', tgt: '调和营卫', type: '体现治法', dim: 'relational', desc: '桂枝合芍药生姜大枣大和营卫。', weight: 5 },
    { src: '四君子汤', tgt: '人参', type: '配伍·君药', dim: 'relational', desc: '人参大补元气为君。', weight: 5 },
    { src: '四君子汤', tgt: '白术', type: '配伍·臣药', dim: 'relational', desc: '白术健脾燥湿为臣。', weight: 4 },
    { src: '四君子汤', tgt: '茯苓', type: '配伍·佐药', dim: 'relational', desc: '茯苓渗湿健脾宁心。', weight: 4 },
    { src: '四君子汤', tgt: '甘草', type: '配伍·使药', dim: 'relational', desc: '甘草和中调药。', weight: 3 },
    { src: '四君子汤', tgt: '健脾益气', type: '体现治法', dim: 'relational', desc: '四君子汤为健脾益气基础宗方。', weight: 5 },
    { src: '银翘散', tgt: '金银花', type: '配伍·君药', dim: 'relational', desc: '金银花芳香透热，清热解毒。', weight: 5 },
    { src: '银翘散', tgt: '连翘', type: '配伍·君药', dim: 'relational', desc: '连翘透热清心，化结散毒。', weight: 5 },
    { src: '银翘散', tgt: '卫分证', type: '主治', dim: 'relational', desc: '银翘散主治太阴风温卫分初起。', weight: 5 },
    { src: '太阳中风', tgt: '汗出', type: '表现为症状', dim: 'relational', desc: '太阳中风特征为主症汗出。', weight: 5 },
    { src: '太阳中风', tgt: '发热', type: '表现为症状', dim: 'relational', desc: '阳浮卫盛，翕翕发热。', weight: 4 },
    { src: '太阳中风', tgt: '恶风', type: '表现为症状', dim: 'relational', desc: '卫阳不固，啬啬恶风。', weight: 4 },
    { src: '太阳中风', tgt: '脉缓', type: '特征脉象', dim: 'relational', desc: '营阴失守，脉见浮缓。', weight: 4 },
    { src: '太阳伤寒', tgt: '脉紧', type: '特征脉象', dim: 'relational', desc: '寒邪凝聚，脉见浮紧。', weight: 4 },
    { src: '太阳伤寒', tgt: '恶寒', type: '表现为症状', dim: 'relational', desc: '寒邪闭表，恶寒无汗。', weight: 5 },
    { src: '营卫不和', tgt: '太阳中风', type: '病机导致', dim: 'relational', desc: '卫强营弱，发为太阳中风。', weight: 5 },
    { src: '风寒束表', tgt: '太阳伤寒', type: '病机导致', dim: 'relational', desc: '风寒凝表，发为太阳伤寒。', weight: 5 },
    { src: '桂枝', tgt: '膀胱经', type: '归经', dim: 'relational', desc: '桂枝循足太阳膀胱经通阳。', weight: 4 },
    { src: '麻黄', tgt: '肺经', type: '归经', dim: 'relational', desc: '麻黄直入肺经宣肺透毛。', weight: 4 },
    { src: '太阳中风', tgt: '六经辨证', type: '属于大类', dim: 'classification', desc: '属于仲景六经辨证太阳病范畴。', weight: 4 },
    { src: '太阳伤寒', tgt: '六经辨证', type: '属于大类', dim: 'classification', desc: '属于仲景六经辨证太阳病范畴。', weight: 4 },
    { src: '脾胃虚弱', tgt: '脾', type: '脏腑归属', dim: 'classification', desc: '脾胃虚弱病位在脾胃。', weight: 5 },
    { src: '人参', tgt: '黄芪', type: '相须相使', dim: 'relational', desc: '二药合用，大补元气升清阳。', weight: 5 },
  ];

  for (const rule of pairingRules) {
    const srcNode = entityMap.get(rule.src);
    const tgtNode = entityMap.get(rule.tgt);
    if (srcNode && tgtNode) {
      relations.push({
        source: srcNode.id,
        target: tgtNode.id,
        relationType: rule.type,
        dimension: rule.dim,
        description: rule.desc,
        weight: rule.weight
      });
    }
  }

  // Cross-link nodes that share the same thematicGroup or classificationCategory
  const groupMap = new Map<string, TCMNode[]>();
  for (const node of foundEntities) {
    if (node.thematicGroup) {
      const list = groupMap.get(node.thematicGroup) || [];
      list.push(node);
      groupMap.set(node.thematicGroup, list);
    }
  }

  for (const [groupName, nodes] of groupMap.entries()) {
    if (nodes.length >= 2) {
      for (let i = 0; i < Math.min(nodes.length - 1, 3); i++) {
        const n1 = nodes[i];
        const n2 = nodes[i + 1];
        const alreadyLinked = relations.some(
          r => (r.source === n1.id && r.target === n2.id) || (r.source === n2.id && r.target === n1.id)
        );
        if (!alreadyLinked) {
          relations.push({
            source: n1.id,
            target: n2.id,
            relationType: '同主题脉络',
            dimension: 'thematic',
            description: `二者在医理上同属【${groupName}】辨证研讨主线。`,
            weight: 3
          });
        }
      }
    }
  }

  return {
    bookTitle: title || '导入中医典籍知识提炼',
    summary: `从所导文本中解析提炼出 ${foundEntities.length} 个中医核心知识实体与 ${relations.length} 组多维中医关系网，涵盖方剂配伍、四诊征象、脏腑归经及辨证治则。`,
    nodes: foundEntities,
    relations
  };
}

// Local fallback engine for inferring latent TCM pathological and pharmacological relations
export function inferLatentRelationsLocally(
  currentNode: TCMNode,
  candidateNodes: TCMNode[],
  existingRelations: TCMRelation[]
): {
  reasoningSummary: string;
  inferredRelations: TCMRelation[];
  newLatentNodes?: TCMNode[];
} {
  const existingPairSet = new Set<string>();
  existingRelations.forEach(r => {
    existingPairSet.add(`${r.source}->${r.target}`);
    existingPairSet.add(`${r.target}->${r.source}`);
  });

  const inferredRelations: TCMRelation[] = [];
  const newLatentNodes: TCMNode[] = [];

  // 1. Zang-fu / Meridian Interior-Exterior Correlation (脏腑表里与经络络属)
  const interiorExteriorPairs: [string, string, string][] = [
    ['肺', '大肠', '手太阴肺经与手阳明大肠经表里相合，肺气肃降则大肠传导有度'],
    ['脾', '胃', '脾主运化升清，胃主受纳降浊，纳运相依，升降相因'],
    ['心', '小肠', '心火下移小肠，清心利水'],
    ['肝', '胆', '肝胆互为表里，肝之疏泄与胆之贮泄胆汁互为协同'],
    ['肾', '膀胱', '肾阳温化水液，膀胱气化司决渎'],
    ['太阳', '少阴', '太阳少阴表里互通，寒热真假相涉'],
    ['太阴', '阳明', '太阴湿土与阳明燥土相济'],
  ];

  for (const [z1, z2, desc] of interiorExteriorPairs) {
    const isCurrentMatched = currentNode.name.includes(z1) || (currentNode.properties?.organAffiliation && currentNode.properties.organAffiliation.includes(z1));
    if (isCurrentMatched) {
      const matchCandidate = candidateNodes.find(c =>
        c.id !== currentNode.id && (c.name.includes(z2) || (c.properties?.organAffiliation && c.properties.organAffiliation.includes(z2)))
      );
      if (matchCandidate && !existingPairSet.has(`${currentNode.id}->${matchCandidate.id}`)) {
        inferredRelations.push({
          source: currentNode.id,
          target: matchCandidate.id,
          relationType: '脏腑表里同调',
          dimension: 'relational',
          description: desc,
          weight: 4
        });
        existingPairSet.add(`${currentNode.id}->${matchCandidate.id}`);
      }
    }
  }

  // 2. Herb Yin-Yang & Qi-Blood Complementarity (药物升降浮沉与气血同治)
  if (currentNode.category === 'herb') {
    candidateNodes.forEach(c => {
      if (c.id === currentNode.id) return;
      if (existingPairSet.has(`${currentNode.id}->${c.id}`)) return;

      // 桂枝与芍药 / 白芍 (一散一敛)
      if (
        (currentNode.name.includes('桂枝') && c.name.includes('芍')) ||
        (currentNode.name.includes('芍') && c.name.includes('桂枝'))
      ) {
        inferredRelations.push({
          source: currentNode.id,
          target: c.id,
          relationType: '散敛互济·营卫协调',
          dimension: 'relational',
          description: '桂枝辛甘发散以温卫阳，白芍酸苦甘微寒以敛营阴，一开一合，散不伤正，收不留邪。',
          weight: 5
        });
        existingPairSet.add(`${currentNode.id}->${c.id}`);
      }

      // 麻黄与杏仁 (一升一降)
      if (
        (currentNode.name.includes('麻黄') && c.name.includes('杏仁')) ||
        (currentNode.name.includes('杏仁') && c.name.includes('麻黄'))
      ) {
        inferredRelations.push({
          source: currentNode.id,
          target: c.id,
          relationType: '升降宣肃·肺气协调',
          dimension: 'relational',
          description: '麻黄轻清上浮宣肺开腠，杏仁沉降下气降利气机，一宣一降，宣畅胸肺肺气。',
          weight: 5
        });
        existingPairSet.add(`${currentNode.id}->${c.id}`);
      }

      // 人参/黄芪与当归 (气血互根)
      if (
        ((currentNode.name.includes('黄芪') || currentNode.name.includes('人参')) && c.name.includes('当归')) ||
        (currentNode.name.includes('当归') && (c.name.includes('黄芪') || c.name.includes('人参')))
      ) {
        inferredRelations.push({
          source: currentNode.id,
          target: c.id,
          relationType: '气血互根·阳生阴长',
          dimension: 'relational',
          description: '有形之血不能自生，生于无形之气；黄芪人参大补元气以生血，当归养血以载气。',
          weight: 5
        });
        existingPairSet.add(`${currentNode.id}->${c.id}`);
      }
    });
  }

  // 3. Syndrome -> Pathology Transmission (证候与病机深层演变)
  if (currentNode.category === 'syndrome' || currentNode.category === 'pathology') {
    candidateNodes.forEach(c => {
      if (c.id === currentNode.id || existingPairSet.has(`${currentNode.id}->${c.id}`)) return;
      if (c.category === 'pathology' || c.category === 'syndrome') {
        inferredRelations.push({
          source: currentNode.id,
          target: c.id,
          relationType: '深层病机传变链',
          dimension: 'thematic',
          description: `【${currentNode.name}】在病程迁延或正邪消长过程中，容易循经或由表及里演变转化为【${c.name}】。`,
          weight: 4
        });
        existingPairSet.add(`${currentNode.id}->${c.id}`);
      }
    });
  }

  // If none inferred by specific rules, link 2 most relevant by category or theme
  if (inferredRelations.length === 0) {
    const candidates = candidateNodes.filter(c => c.id !== currentNode.id && !existingPairSet.has(`${currentNode.id}->${c.id}`)).slice(0, 3);
    candidates.forEach(c => {
      inferredRelations.push({
        source: currentNode.id,
        target: c.id,
        relationType: '医理潜在协同',
        dimension: 'relational',
        description: `在中医整体辨证体系中，【${currentNode.name}】与【${c.name}】在标本兼顾、同声相应层面存在未显露的医理协同互济。`,
        weight: 3
      });
      existingPairSet.add(`${currentNode.id}->${c.id}`);
    });
  }

  // Inject a latent bridging node if needed
  if (currentNode.category === 'syndrome' || currentNode.category === 'formula') {
    const latentNodeId = `latent-node-${Date.now()}`;
    const latentNode: TCMNode = {
      id: latentNodeId,
      name: `升降出入气机枢纽`,
      category: 'pathology',
      classificationCategory: '气机升降出入理论',
      thematicGroup: '天地阴阳气机运行',
      description: '《内经》云：“出入废则神机化灭，升降息则气立孤危”。此为维系本证候向方药转归之关键气机轴心。',
      importance: 8
    };
    newLatentNodes.push(latentNode);

    inferredRelations.push({
      source: currentNode.id,
      target: latentNodeId,
      relationType: '隐含气机机理',
      dimension: 'relational',
      description: `【${currentNode.name}】之内在演变深植于中焦与经络升降出入气机之斡旋。`,
      weight: 4
    });
  }

  return {
    reasoningSummary: `基于中医藏象学说、经络表里相络及升降出入气化原理，深度推演【${currentNode.name}】与图谱中其他知识实体的隐性病机传变及气味生克脉络。`,
    inferredRelations,
    newLatentNodes
  };
}

// Local clinical fallback for enriching detailed TCM properties
export function enrichNodeLocally(node: TCMNode): {
  detailedDefinition: string;
  properties: Partial<NonNullable<TCMNode['properties']>>;
} {
  const name = node.name;
  const category = node.category;

  if (name.includes('桂枝汤')) {
    return {
      detailedDefinition: '《伤寒论》群方之冠，辛温解表、滋阴和阳之代表方剂。解肌发表，调和营卫，主治太阳中风表虚证。',
      properties: {
        nature: '辛温甘润',
        actions: '解肌发表，调和营卫',
        indications: '太阳中风表虚证。恶风发热，汗出，头痛，鼻鸣干呕，苔薄白，脉浮缓。',
        dosageUsage: '水煎服。服已须臾，啜热稀粥一升余以助药力，温覆令一时许，遍身微似有汗者益佳。',
        precautions: '表实无汗之伤寒证、温病初起表热重者及内有湿热宿食者禁用。禁生冷、粘腻、肉面、五辛、酒酪。',
        variations: '项背强几几加葛根；咳喘者加苦杏仁、厚朴；胸满者去芍药；腹痛者倍芍药加饴糖（小建中汤）。',
        compositionList: [
          { herbName: '桂枝', role: '君', dosage: '三两（9g）', action: '温通经脉，解肌发表，温助卫阳' },
          { herbName: '白芍', role: '臣', dosage: '三两（9g）', action: '敛阴和营，益阴养血，与桂枝一散一敛' },
          { herbName: '生姜', role: '佐', dosage: '三两（9g）', action: '辛散助桂枝解肌，降逆止呕以和胃' },
          { herbName: '大枣', role: '佐', dosage: '十二枚（3枚）', action: '甘温补脾和中，助芍药和营生津' },
          { herbName: '炙甘草', role: '使', dosage: '二两（6g）', action: '甘温益气，调和百药，辛甘化阳、酸甘化阴' }
        ]
      }
    };
  }

  if (name.includes('麻黄汤')) {
    return {
      detailedDefinition: '《伤寒论》开腠发汗第一重剂。专为太阳伤寒寒邪闭表、卫阳被遏、腠理玄府闭塞无汗而设。',
      properties: {
        nature: '辛温雄烈',
        actions: '发汗解表，宣肺平喘',
        indications: '太阳伤寒表实证。恶寒无汗，体痛呕逆，头痛身疼，骨节疼痛，咳逆上气，脉浮紧。',
        dosageUsage: '水煎服。温覆微汗。不可大汗流漓以防亡阳脱水。',
        precautions: '疮家、衄家、亡血家、咽干口燥、心悸、体虚自汗盗汗者严禁使用。',
        variations: '兼内热烦躁者加大黄、生石膏（大青龙汤）；兼胸满腹胀者加厚朴、枳实。',
        compositionList: [
          { herbName: '麻黄', role: '君', dosage: '三两（9g）', action: '开泄腠理，透达毛窍，发汗平喘' },
          { herbName: '桂枝', role: '臣', dosage: '二两（6g）', action: '温经散寒，解肌通阳，助麻黄发汗' },
          { herbName: '苦杏仁', role: '佐', dosage: '七十个（9g）', action: '降利肺气，止咳平喘，与麻黄一升一降' },
          { herbName: '炙甘草', role: '使', dosage: '一两（3g）', action: '缓急和中，调和诸药，制麻黄过汗伤正' }
        ]
      }
    };
  }

  if (name.includes('中风') || name.includes('太阳中风')) {
    return {
      detailedDefinition: '风邪外袭肌表，致卫阳亢盛抗邪而发热，营阴失守外越而自汗，营卫失调之表虚证。',
      properties: {
        syndromeType: '表虚证',
        organAffiliation: '肌表营卫 / 足太阳膀胱经',
        diagnosticPoints: '发热、汗出、恶风、脉浮缓四联主症。鼻鸣干呕。',
        therapeuticMethod: '解肌发表，调和营卫',
        treatsFormulas: ['桂枝汤', '桂枝加葛根汤', '桂枝加厚朴杏子汤'],
        pathogenesisAnalysis: '风性疏泄开通，腠理开泄，故汗自出；卫阳浮于外而热自发；营弱阴虚则不能胜风而恶风。'
      }
    };
  }

  if (name.includes('伤寒') || name.includes('太阳伤寒')) {
    return {
      detailedDefinition: '寒邪凝闭皮毛肌腠，卫阳被遏，营阴郁滞，玄府闭塞无汗之表实证。',
      properties: {
        syndromeType: '表实证',
        organAffiliation: '皮毛玄府 / 足太阳膀胱经',
        diagnosticPoints: '恶寒无汗、身疼骨痛、咳喘、脉浮紧。',
        therapeuticMethod: '发汗解表，宣肺平喘',
        treatsFormulas: ['麻黄汤', '大青龙汤'],
        pathogenesisAnalysis: '寒性凝滞收引，卫阳郁遏不得宣通，毛窍紧束，故恶寒无汗且脉浮紧。'
      }
    };
  }

  if (name.includes('桂枝')) {
    return {
      detailedDefinition: '樟科植物肉桂的干燥嫩枝。辛甘温润，散肌表风寒，通血脉经络，化下焦水气。',
      properties: {
        nature: '辛、甘，温',
        meridianTropism: '归心、肺、膀胱经',
        compositionRole: '君药/臣药',
        actions: '发汗解肌，温通经脉，助阳化气，平冲降逆',
        indications: '风寒表虚表实、胸痹心痛、脘腹冷痛、痛经经闭、痰饮水肿、心悸奔豚。',
        dosageUsage: '水煎服，3～10g。',
        precautions: '温热病、阴虚阳亢火旺、血热妄行出血者及孕妇忌服或慎服。'
      }
    };
  }

  if (name.includes('白芍') || name.includes('芍药')) {
    return {
      detailedDefinition: '毛茛科植物芍药的干燥根。苦酸微寒，益阴敛营，柔肝止痛，平抑肝阳。',
      properties: {
        nature: '苦、酸，微寒',
        meridianTropism: '归肝、脾经',
        compositionRole: '臣药/佐药',
        actions: '养血敛阴，柔肝止痛，平抑肝阳',
        indications: '头痛眩晕、胁痛腹痛、四肢挛急疼痛、血虚萎黄、自汗盗汗、月经不调。',
        dosageUsage: '水煎服，6～15g。大剂量可达30g。',
        precautions: '反藜芦。虚寒性腹痛泄泻者慎服。'
      }
    };
  }

  if (name.includes('麻黄')) {
    return {
      detailedDefinition: '麻黄科草本植物。辛微苦温，开腠理透毛窍，为发汗利水宣肺平喘第一要药。',
      properties: {
        nature: '辛、微苦，温',
        meridianTropism: '归肺、膀胱经',
        compositionRole: '君药',
        actions: '发汗解表，宣肺平喘，利水消肿',
        indications: '外感风寒表实、咳逆哮喘、风水浮肿、风湿痹痛。',
        dosageUsage: '水煎服，2～9g。宜先煎去浮沫。蜜炙麻黄止咳平喘力专。',
        precautions: '凡表虚自汗、阴虚盗汗、虚喘及高血压失眠患者严忌使用。'
      }
    };
  }

  // Generic enrichment by category
  if (category === 'formula') {
    return {
      detailedDefinition: `经典名方【${name}】。依照君臣佐使法度组合配伍，立足脏腑阴阳失衡辨证施治。`,
      properties: {
        actions: node.description,
        indications: `主治相应证候与病因病机，调和气机升降。`,
        dosageUsage: '常规水煎温服，分早晚温服。',
        precautions: '需根据患者体质实热或阴虚状况辨证化裁，孕妇与体弱者遵医嘱。',
        compositionList: [
          { herbName: '主药饮片', role: '君', dosage: '常规量', action: '主攻核心病机' },
          { herbName: '辅药饮片', role: '臣', dosage: '常规量', action: '助君药增效' },
          { herbName: '佐制饮片', role: '佐', dosage: '少量', action: '制约偏性或反佐' },
          { herbName: '甘草/引经', role: '使', dosage: '适量', action: '调和百药，引药归经' }
        ]
      }
    };
  }

  if (category === 'herb') {
    return {
      detailedDefinition: `中药饮片【${name}】。具有特定四气五味、升降浮沉及脏腑经络趋向。`,
      properties: {
        nature: node.properties?.nature || '平，甘',
        meridianTropism: node.properties?.meridianTropism || '归脾、胃经',
        actions: node.description,
        dosageUsage: '常规煎服，3～10g。',
        precautions: '严格遵循十八反、十九畏配伍禁忌及妊娠禁忌。'
      }
    };
  }

  if (category === 'syndrome') {
    return {
      detailedDefinition: `中医证候【${name}】。机体在疾病演变某一特定阶段的整体病理概括。`,
      properties: {
        diagnosticPoints: '舌淡苔白或脉象特征性改变，兼见主症与兼症。',
        therapeuticMethod: '审因论治，扶正祛邪，恢复阴阳动态平衡。',
        treatsFormulas: ['对证经典方剂', '加减对症方'],
        pathogenesisAnalysis: node.description
      }
    };
  }

  return {
    detailedDefinition: node.description || `【${name}】在中医辨证论治体系中具有重要理论与临床枢纽价值。`,
    properties: {
      actions: node.description,
      therapeuticMethod: '治病求本，调整阴阳'
    }
  };
}


