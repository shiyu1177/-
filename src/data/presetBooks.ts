import { PresetBook } from '../types/tcm';

export const PRESET_BOOKS: PresetBook[] = [
  {
    id: 'shanghan-taiyang',
    title: '《伤寒杂病论 · 太阳病篇》',
    author: '张仲景',
    dynasty: '东汉',
    category: '六经辨证 · 伤寒医圣',
    coverBadge: '伤寒群方之冠',
    description: '仲景确立六经辨证大纲之开篇，辨太阳中风、太阳伤寒表证机理，立桂枝汤调和营卫、麻黄汤发汗宣肺等万世法门。',
    sampleText: `太阳之为病，脉浮，头项强痛而恶寒。
太阳病，发热，汗出，恶风，脉缓者，名为中风。
太阳中风，阳浮而阴弱，阳浮者热自发，阴弱者汗自出，啬啬恶寒，淅淅恶风，翕翕发热，鼻鸣干呕者，桂枝汤主之。
桂枝汤方：桂枝三两（去皮），芍药三两，甘草二两（炙），生姜三两（切），大枣十二枚（擘）。
太阳病，或已发热，或未发热，必恶寒，体痛，呕逆，脉阴阳俱紧者，名为伤寒。
伤寒一日，太阳受之，脉若静者，为传，颇欲吐，若躁烦，脉数急者，为传也。
伤寒表不解，心下有水气，干呕，发热而咳，或渴，或利，或噎，或小便不利、少腹满，或喘者，小青龙汤主之。`,
    graphData: {
      bookTitle: '《伤寒杂病论 · 太阳病篇》',
      dynasty: '东汉',
      author: '张仲景',
      summary: '太阳病为六经辨证之首，主一身之表。本篇以桂枝汤、麻黄汤为枢纽，详辨太阳中风表虚与太阳伤寒表实之病因病机、主症脉象与君臣配伍法度。',
      nodes: [
        {
          id: 'node-taiyang-doctrine',
          name: '太阳病纲领',
          category: 'theory',
          classificationCategory: '六经辨证体系',
          thematicGroup: '六经总纲',
          description: '太阳主一身之表，统摄卫气，外邪袭人，太阳首当其冲。纲领脉症为“脉浮，头项强痛而恶寒”。',
          originalQuotes: '太阳之为病，脉浮，头项强痛而恶寒。',
          importance: 10,
          properties: { organAffiliation: '足太阳膀胱经/手太阳小肠经', syndromeType: '表证' }
        },
        {
          id: 'node-zhongfeng-syndrome',
          name: '太阳中风证',
          category: 'syndrome',
          classificationCategory: '太阳表证',
          thematicGroup: '营卫失和传变',
          description: '风邪外袭，卫阳浮盛而营阴失守之表虚证。病机关键在于卫强营弱、腠理疏松。',
          originalQuotes: '太阳病，发热，汗出，恶风，脉缓者，名为中风。',
          importance: 9,
          properties: {
            syndromeType: '表虚证',
            organAffiliation: '肌表营卫 / 足太阳膀胱经',
            diagnosticPoints: '恶风、发热、汗出、脉浮缓四联主症。兼见鼻鸣干呕。',
            therapeuticMethod: '解肌发表，调和营卫',
            treatsFormulas: ['桂枝汤', '桂枝加葛根汤', '桂枝加厚朴杏子汤'],
            pathogenesisAnalysis: '风性开泄，腠理不固，卫阳抗邪浮盛于外则发热，营阴不能内守外泄为汗，卫强营弱，阴阳失和。'
          }
        },
        {
          id: 'node-shanghan-syndrome',
          name: '太阳伤寒证',
          category: 'syndrome',
          classificationCategory: '太阳表证',
          thematicGroup: '寒邪闭表传变',
          description: '寒邪袭表，卫阳被遏，营阴郁滞，腠理闭塞无汗之表实证。',
          originalQuotes: '太阳病，或已发热，或未发热，必恶寒，体痛，呕逆，脉阴阳俱紧者，名为伤寒。',
          importance: 9,
          properties: {
            syndromeType: '表实证',
            organAffiliation: '皮毛玄府 / 足太阳膀胱经',
            diagnosticPoints: '恶寒无汗、头项强痛、骨节剧痛、咳逆脉浮紧。',
            therapeuticMethod: '发汗解表，宣肺平喘',
            treatsFormulas: ['麻黄汤', '大青龙汤'],
            pathogenesisAnalysis: '寒邪凝闭皮毛玄府，卫阳被遏不得透达，营阴郁滞血行拘急，故身疼无汗而脉浮紧。'
          }
        },
        {
          id: 'node-guizhitang',
          name: '桂枝汤',
          category: 'formula',
          classificationCategory: '辛温解表剂',
          thematicGroup: '调和营卫论',
          description: '仲景群方之祖，滋阴和阳，解肌发表，调和营卫，主治太阳中风表虚证。',
          originalQuotes: '太阳中风，阳浮而阴弱...啬啬恶寒，淅淅恶风，翕翕发热，鼻鸣干呕者，桂枝汤主之。',
          importance: 10,
          properties: {
            sourceBook: '伤寒杂病论',
            nature: '辛温甘润',
            actions: '解肌发表，调和营卫',
            indications: '外感风寒表虚证。头痛发热，汗出恶风，鼻鸣干呕，苔薄白，脉浮缓。亦治杂病营卫不和者。',
            dosageUsage: '水煎服。服已须臾，啜热稀粥一升余以助药力，温覆令一时许，遍身微似有汗者益佳，不可令如水流漓。',
            precautions: '表实无汗之伤寒证、温病初起表热重者及内有湿热宿食、脉浮紧者禁用。禁生冷、粘腻、肉面、五辛、酒酪。',
            variations: '项背强几几加葛根；兼咳喘加苦杏仁、厚朴；胸满去芍药；兼里急腹痛倍芍药加饴糖（小建中汤）。',
            compositionList: [
              { herbName: '桂枝', role: '君', dosage: '三两（9g）', action: '温经通阳，发汗解肌，温散肌表风邪' },
              { herbName: '白芍', role: '臣', dosage: '三两（9g）', action: '益阴敛营，与桂枝一散一收，调和营卫' },
              { herbName: '生姜', role: '佐', dosage: '三两（9g）', action: '辛散助桂枝解肌，降逆止呕以和胃氣' },
              { herbName: '大枣', role: '佐', dosage: '十二枚（3枚）', action: '甘温补脾和中，助芍药和营生津' },
              { herbName: '炙甘草', role: '使', dosage: '二两（6g）', action: '甘温益气，调和百药，辛甘化阳、酸甘化阴' }
            ]
          }
        },
        {
          id: 'node-mahuangtang',
          name: '麻黄汤',
          category: 'formula',
          classificationCategory: '辛温解表剂',
          thematicGroup: '宣肺平喘发汗',
          description: '开腠理，透毛窍，发汗解表，宣肺平喘，专治太阳伤寒恶寒无汗体痛脉紧。',
          originalQuotes: '太阳病，头痛发热，身疼腰痛，骨节疼痛，恶风无汗而喘者，麻黄汤主之。',
          importance: 9,
          properties: {
            sourceBook: '伤寒杂病论',
            nature: '辛温雄烈',
            actions: '发汗解表，宣肺平喘',
            indications: '太阳伤寒表实证。恶寒无汗，头疼身痛，骨节酸楚，咳逆喘急，脉阴阳俱紧。',
            dosageUsage: '水煎服。温覆取微汗，汗出周身即止后服，切忌过汗伤阳。',
            precautions: '疮家、衄家、亡血家、咽干口燥、心悸、体虚自汗盗汗者严禁使用。',
            variations: '兼内热烦躁者加大黄、生石膏（大青龙汤）；兼胸满腹胀加厚朴、枳实。',
            compositionList: [
              { herbName: '麻黄', role: '君', dosage: '三两（9g）', action: '开泄腠理，透达毛窍，发汗平喘' },
              { herbName: '桂枝', role: '臣', dosage: '二两（6g）', action: '温经散寒，解肌通阳，助麻黄宣阳开腠' },
              { herbName: '苦杏仁', role: '佐', dosage: '七十个（9g）', action: '降利肺气，止咳平喘，与麻黄一升一降' },
              { herbName: '炙甘草', role: '使', dosage: '一两（3g）', action: '缓急和中，调和诸药，制麻黄过汗伤正' }
            ]
          }
        },
        {
          id: 'node-guizhi',
          name: '桂枝',
          category: 'herb',
          classificationCategory: '辛温解表药',
          thematicGroup: '调和营卫论',
          description: '味辛甘性温，温通经脉，助阳化气，散寒解肌。在桂枝汤中为君药。',
          originalQuotes: '桂枝三两，去皮。',
          importance: 9,
          properties: {
            nature: '辛、甘，温',
            meridianTropism: '归心、肺、膀胱经',
            compositionRole: '君药/臣药',
            actions: '发汗解肌，温通经脉，助阳化气，平冲降逆',
            indications: '风寒表证、胸痹心痛、脘腹冷痛、经闭痛经、风寒湿痹、痰饮水肿、心悸奔豚。',
            dosageUsage: '煎服，3～10g。',
            precautions: '温热病、阴虚阳亢、血热妄行出血者及孕妇忌服或慎服。'
          }
        },
        {
          id: 'node-shaoyao',
          name: '白芍',
          category: 'herb',
          classificationCategory: '补血敛阴药',
          thematicGroup: '调和营卫论',
          description: '苦酸微寒，养血敛阴，益阴和营。与桂枝配伍，一散一收，相得益彰。',
          originalQuotes: '芍药三两。',
          importance: 8,
          properties: {
            nature: '苦、酸，微寒',
            meridianTropism: '归肝、脾经',
            compositionRole: '臣药/佐药',
            actions: '养血敛阴，柔肝止痛，平抑肝阳',
            indications: '头痛眩晕、胁痛腹痛、四肢挛急疼痛、血虚萎黄、自汗盗汗、月经不调。',
            dosageUsage: '煎服，6～15g。大剂量缓急止痛可至30g。',
            precautions: '反藜芦。虚寒性腹痛泄泻者慎服。'
          }
        },
        {
          id: 'node-shengjiang',
          name: '生姜',
          category: 'herb',
          classificationCategory: '辛温解表药',
          thematicGroup: '调和营卫论',
          description: '辛温发散，助桂枝辛散肌表，降逆止呕以安胃气。',
          originalQuotes: '生姜三两，切。',
          importance: 7,
          properties: { nature: '辛，微温', meridianTropism: '肺、脾、胃经', compositionRole: '佐药' }
        },
        {
          id: 'node-dazao',
          name: '大枣',
          category: 'herb',
          classificationCategory: '补益药',
          thematicGroup: '调和营卫论',
          description: '甘温益气，补脾和中，助芍药和营滋阴。生姜大枣合用升腾中焦脾胃之气。',
          originalQuotes: '大枣十二枚，擘。',
          importance: 7,
          properties: { nature: '甘，温', meridianTropism: '脾、胃经', compositionRole: '佐药' }
        },
        {
          id: 'node-gancao',
          name: '炙甘草',
          category: 'herb',
          classificationCategory: '补脾益气药',
          thematicGroup: '调和营卫论',
          description: '甘温益气，调和诸药，合桂枝辛甘化阳，合白芍酸甘化阴。',
          originalQuotes: '甘草二两，炙。',
          importance: 8,
          properties: { nature: '甘，平/温', meridianTropism: '脾、胃、心、肺经', compositionRole: '使药' }
        },
        {
          id: 'node-mahuang',
          name: '麻黄',
          category: 'herb',
          classificationCategory: '发汗解表药',
          thematicGroup: '宣肺平喘发汗',
          description: '辛微苦温，升发透达，开腠理，宣肺气，通达一身皮毛，为发汗第一要药。',
          originalQuotes: '麻黄三两，去节。',
          importance: 9,
          properties: { nature: '辛、微苦，温', meridianTropism: '肺、膀胱经', compositionRole: '君药' }
        },
        {
          id: 'node-xingren',
          name: '苦杏仁',
          category: 'herb',
          classificationCategory: '止咳平喘药',
          thematicGroup: '宣肺平喘发汗',
          description: '苦微温，降利肺气而平喘逆，与麻黄一升一降，利气肃肺。',
          originalQuotes: '杏仁七十个，去皮尖。',
          importance: 8,
          properties: { nature: '苦，微温', meridianTropism: '肺、大肠经', compositionRole: '佐药' }
        },
        {
          id: 'node-fa-re',
          name: '发热',
          category: 'symptom',
          classificationCategory: '外感四诊表象',
          thematicGroup: '正邪交争',
          description: '体温升高或自发烘热感，阳气抗邪于表，正邪交争之反映。',
          originalQuotes: '阳浮者热自发。',
          importance: 8,
        },
        {
          id: 'node-han-chu',
          name: '汗出',
          category: 'symptom',
          classificationCategory: '外感四诊表象',
          thematicGroup: '营卫失和传变',
          description: '腠理不固，营阴外越，汗自渗出，区别于太阳伤寒无汗之关键。',
          originalQuotes: '阴弱者汗自出。',
          importance: 8,
        },
        {
          id: 'node-mai-fu-huan',
          name: '脉浮缓',
          category: 'symptom',
          classificationCategory: '脉象辨证',
          thematicGroup: '营卫失和传变',
          description: '浮主邪在表，缓主营阴弱不胜风，指下浮按轻泛，重按柔软和缓。',
          originalQuotes: '太阳病...脉缓者，名为中风。',
          importance: 8,
        },
        {
          id: 'node-mai-fu-jin',
          name: '脉浮紧',
          category: 'symptom',
          classificationCategory: '脉象辨证',
          thematicGroup: '寒邪闭表传变',
          description: '浮为表邪在经，紧如牵绳转索，主寒邪敛束肌表血脉。',
          originalQuotes: '脉阴阳俱紧者，名为伤寒。',
          importance: 8,
        },
        {
          id: 'node-jieji-fabiao',
          name: '解肌发表',
          category: 'method',
          classificationCategory: '八法·汗法',
          thematicGroup: '调和营卫论',
          description: '透达肌肉腠理之风邪，使邪从肌表微汗而解，不使大汗伤正。',
          originalQuotes: '温覆微干，微汗出，病差。',
          importance: 9,
        },
        {
          id: 'node-tiaohe-yingwei',
          name: '调和营卫',
          category: 'method',
          classificationCategory: '八法·和法',
          thematicGroup: '调和营卫论',
          description: '通过辛甘化阳、酸甘化阴，复卫阳于表，固营阴于里，营卫协和则汗自止。',
          originalQuotes: '卫气和，营气乃通。',
          importance: 10,
        },
        {
          id: 'node-fahan-jiebie',
          name: '发汗宣肺',
          category: 'method',
          classificationCategory: '八法·汗法',
          thematicGroup: '宣肺平喘发汗',
          description: '大开玄府，通调水道，宣畅肺经郁遏之寒邪，逐寒透表。',
          originalQuotes: '发其汗，宣其阳。',
          importance: 8,
        },
        {
          id: 'node-weiqiang-yingruo',
          name: '卫强营弱',
          category: 'pathology',
          classificationCategory: '病理机制',
          thematicGroup: '营卫失和传变',
          description: '卫阳受风邪激惹抗邪于外而亢奋（卫强），营阴不能内守而汗泄受损（营弱）。',
          originalQuotes: '阳浮而阴弱，阳浮者热自发，阴弱者汗自出。',
          importance: 9,
        },
        {
          id: 'node-hanxie-shutiao',
          name: '风寒束表',
          category: 'pathology',
          classificationCategory: '病理机制',
          thematicGroup: '寒邪闭表传变',
          description: '寒凝主收引，毛窍玄府尽闭，卫阳内闭不得越，营阴拘急不得舒。',
          originalQuotes: '寒气客于经络，凝滞不通。',
          importance: 9,
        },
        {
          id: 'node-tai-yang-jing',
          name: '足太阳膀胱经',
          category: 'meridian',
          classificationCategory: '十二经络',
          thematicGroup: '经络循行传变',
          description: '总督周身之表，从头走足，其经脉起于目内眦，络脑循背下足小趾。',
          originalQuotes: '太阳经受之，其经循项背。',
          importance: 9,
          properties: { organAffiliation: '膀胱', nature: '寒水之经' }
        },
        {
          id: 'node-feijing',
          name: '手太阴肺经',
          category: 'meridian',
          classificationCategory: '十二经络',
          thematicGroup: '肺主皮毛',
          description: '肺主气，司呼吸，外合皮毛，主宣发肃降，开窍于鼻。',
          originalQuotes: '肺主一身之表，皮毛之府。',
          importance: 8,
          properties: { organAffiliation: '肺', nature: '燥金之气' }
        }
      ],
      relations: [
        // 关系法 (Relational Method)
        {
          source: 'node-guizhitang',
          target: 'node-zhongfeng-syndrome',
          relationType: '主治',
          dimension: 'relational',
          description: '桂枝汤专治太阳中风表虚证，解肌发表，调和营卫。',
          weight: 5
        },
        {
          source: 'node-mahuangtang',
          target: 'node-shanghan-syndrome',
          relationType: '主治',
          dimension: 'relational',
          description: '麻黄汤专治太阳伤寒表实证，发汗散寒，宣肺平喘。',
          weight: 5
        },
        {
          source: 'node-guizhitang',
          target: 'node-guizhi',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '桂枝辛温，入心肺膀胱经，解肌通阳为君。',
          weight: 5
        },
        {
          source: 'node-guizhitang',
          target: 'node-shaoyao',
          relationType: '配伍·臣药',
          dimension: 'relational',
          description: '芍药酸苦微寒，敛阴和营，与桂枝一散一敛相辅相成。',
          weight: 4
        },
        {
          source: 'node-guizhitang',
          target: 'node-shengjiang',
          relationType: '配伍·佐药',
          dimension: 'relational',
          description: '生姜辛散，助桂枝解肌散邪，温胃降逆。',
          weight: 3
        },
        {
          source: 'node-guizhitang',
          target: 'node-dazao',
          relationType: '配伍·佐药',
          dimension: 'relational',
          description: '大枣甘温，补脾胃生津液，助芍药和营。',
          weight: 3
        },
        {
          source: 'node-guizhitang',
          target: 'node-gancao',
          relationType: '配伍·使药',
          dimension: 'relational',
          description: '炙甘草调和诸药，辛甘化阳、酸甘化阴。',
          weight: 4
        },
        {
          source: 'node-mahuangtang',
          target: 'node-mahuang',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '麻黄开腠发汗，开泄玄府为君。',
          weight: 5
        },
        {
          source: 'node-mahuangtang',
          target: 'node-xingren',
          relationType: '配伍·佐药',
          dimension: 'relational',
          description: '杏仁宣降肺气，与麻黄一升一降以平喘咳。',
          weight: 4
        },
        {
          source: 'node-guizhitang',
          target: 'node-tiaohe-yingwei',
          relationType: '体现治法',
          dimension: 'relational',
          description: '桂枝汤全方结构严谨，是调和营卫大法的代表方剂。',
          weight: 5
        },
        {
          source: 'node-guizhitang',
          target: 'node-jieji-fabiao',
          relationType: '体现治法',
          dimension: 'relational',
          description: '通过微发汗达到解肌透表之功。',
          weight: 4
        },
        {
          source: 'node-mahuangtang',
          target: 'node-fahan-jiebie',
          relationType: '体现治法',
          dimension: 'relational',
          description: '麻黄汤开腠理，体现大汗解表宣肺治法。',
          weight: 4
        },
        {
          source: 'node-weiqiang-yingruo',
          target: 'node-zhongfeng-syndrome',
          relationType: '病机导致',
          dimension: 'relational',
          description: '风邪外袭导致卫外之气亢盛而营阴不守，形成太阳中风。',
          weight: 5
        },
        {
          source: 'node-hanxie-shutiao',
          target: 'node-shanghan-syndrome',
          relationType: '病机导致',
          dimension: 'relational',
          description: '寒邪凝聚闭塞玄府皮毛，形成太阳伤寒表实。',
          weight: 5
        },
        {
          source: 'node-zhongfeng-syndrome',
          target: 'node-han-chu',
          relationType: '表现为症状',
          dimension: 'relational',
          description: '太阳中风特征性表现为汗出（营阴不能自主外越）。',
          weight: 5
        },
        {
          source: 'node-zhongfeng-syndrome',
          target: 'node-fa-re',
          relationType: '表现为症状',
          dimension: 'relational',
          description: '阳浮卫盛，正邪相争发为翕翕发热。',
          weight: 4
        },
        {
          source: 'node-zhongfeng-syndrome',
          target: 'node-mai-fu-huan',
          relationType: '特征脉象',
          dimension: 'relational',
          description: '太阳中风脉浮而缓，浮主表邪，缓主营虚。',
          weight: 4
        },
        {
          source: 'node-shanghan-syndrome',
          target: 'node-mai-fu-jin',
          relationType: '特征脉象',
          dimension: 'relational',
          description: '寒凝血脉紧束，故脉见浮紧如转索。',
          weight: 4
        },
        {
          source: 'node-guizhi',
          target: 'node-tai-yang-jing',
          relationType: '药力归经',
          dimension: 'relational',
          description: '桂枝循足太阳膀胱经通阳化气，散寒透表。',
          weight: 4
        },
        {
          source: 'node-mahuang',
          target: 'node-feijing',
          relationType: '药力归经',
          dimension: 'relational',
          description: '麻黄直入肺经，开通肺气，宣泄皮毛。',
          weight: 4
        },
        // 分类法 (Classification Method)
        {
          source: 'node-zhongfeng-syndrome',
          target: 'node-taiyang-doctrine',
          relationType: '属于大类',
          dimension: 'classification',
          description: '太阳中风为六经辨证之太阳病表虚分支亚类。',
          weight: 4
        },
        {
          source: 'node-shanghan-syndrome',
          target: 'node-taiyang-doctrine',
          relationType: '属于大类',
          dimension: 'classification',
          description: '太阳伤寒为六经辨证之太阳病表实分支亚类。',
          weight: 4
        },
        {
          source: 'node-guizhi',
          target: 'node-guizhitang',
          relationType: '组成成分',
          dimension: 'classification',
          description: '中药归入方剂配方体系。',
          weight: 3
        },
        {
          source: 'node-shaoyao',
          target: 'node-guizhitang',
          relationType: '组成成分',
          dimension: 'classification',
          description: '中药归入方剂配方体系。',
          weight: 3
        },
        // 主题法 (Thematic Method)
        {
          source: 'node-guizhitang',
          target: 'node-weiqiang-yingruo',
          relationType: '主题脉络',
          dimension: 'thematic',
          description: '共同围绕“调和营卫”与“平息卫强营弱”核心命题展开。',
          weight: 4
        },
        {
          source: 'node-mahuangtang',
          target: 'node-hanxie-shutiao',
          relationType: '主题脉络',
          dimension: 'thematic',
          description: '共同围绕“辛温解表、宣肺发汗祛寒”大主题展开。',
          weight: 4
        },
        {
          source: 'node-tai-yang-jing',
          target: 'node-feijing',
          relationType: '经络表里/经气呼应',
          dimension: 'relational',
          description: '肺主皮毛司卫气，太阳主一身肌表，二者在外感表证中表里相济。',
          weight: 4
        }
      ]
    }
  },
  {
    id: 'neijing-yinyang',
    title: '《黄帝内经 · 素问 · 阴阳应象大论》',
    author: '岐伯 / 黄帝',
    dynasty: '先秦/汉',
    category: '内经医典 · 阴阳五行',
    coverBadge: '中医理论渊薮',
    description: '阐释“阴阳者，天地之道也，万物之纲纪”之至理。系统论述五行配属五脏、五味、五志及阴平阳秘之生克消长治病法式。',
    sampleText: `阴阳者，天地之道也，万物之纲纪，变化之父母，生杀之本始，神明之府也，治病必求于本。
故积阳为天，积阴为地。阴静阳躁，阳生阴长，阳杀阴藏。
阳化气，阴成形。寒极生热，热极生寒。
清阳出上窍，浊阴出下窍；清阳发腠理，浊阴走五脏；清阳实四肢，浊阴归六腑。
水为阴，火为阳；阳为气，阴为味。味归形，形归气，气归精，精归化。
喜怒伤气，寒暑伤形。暴怒伤阴，暴喜伤阳。
治病之法，善诊者，察色按脉，先别阴阳；审清浊，而知部分；视喘息，听声音，而知所苦。`,
    graphData: {
      bookTitle: '《黄帝内经 · 素问 · 阴阳应象大论》',
      dynasty: '先秦/汉',
      author: '岐黄问对',
      summary: '本大论阐发阴阳五行为万物纲纪与中医治病之根本法则，贯通天人相应、脏腑生克、气味阴阳与诊法精要。',
      nodes: [
        {
          id: 'node-yinyang-doctrine',
          name: '阴阳之道',
          category: 'theory',
          classificationCategory: '中医哲学纲领',
          thematicGroup: '天地纲纪',
          description: '万物生成、变化与毁灭的根本总则。阴阳互根互用、对立统一，乃天地万物与人体生命的枢纽。',
          originalQuotes: '阴阳者，天地之道也，万物之纲纪，变化之父母。',
          importance: 10,
        },
        {
          id: 'node-zhibing-qiuben',
          name: '治病必求于本',
          category: 'method',
          classificationCategory: '治疗大则',
          thematicGroup: '治本思想',
          description: '一切临床诊治必从阴阳失衡的根本病源着手，不治其表而求其本。',
          originalQuotes: '治病必求于本。',
          importance: 10,
        },
        {
          id: 'node-yang-hua-qi',
          name: '阳化气·阴成形',
          category: 'theory',
          classificationCategory: '气化理论',
          thematicGroup: '形气转化',
          description: '阳主升发、温煦与功能气化；阴主凝聚、濡养与构成形体。形气相生，生生不息。',
          originalQuotes: '阳化气，阴成形。',
          importance: 9,
        },
        {
          id: 'node-wuxing-wood',
          name: '木 (肝·怒·酸)',
          category: 'theory',
          classificationCategory: '五行归类·东方',
          thematicGroup: '五行生克',
          description: '东方生风，风生木，木生酸，酸生肝，肝生筋，在志为怒。主条达疏泄。',
          originalQuotes: '东方生风，风生木，木生酸，酸生肝。',
          importance: 9,
        },
        {
          id: 'node-wuxing-fire',
          name: '火 (心·喜·苦)',
          category: 'theory',
          classificationCategory: '五行归类·南方',
          thematicGroup: '五行生克',
          description: '南方生热，热生火，火生苦，苦生心，心生血，在志为喜。主温煦血脉。',
          originalQuotes: '南方生热，热生火，火生苦，苦生心。',
          importance: 9,
        },
        {
          id: 'node-wuxing-earth',
          name: '土 (脾·思·甘)',
          category: 'theory',
          classificationCategory: '五行归类·中央',
          thematicGroup: '五行生克',
          description: '中央生湿，湿生土，土生甘，甘生脾，脾生肉，在志为思。为后天之本。',
          originalQuotes: '中央生湿，湿生土，土生甘，甘生脾。',
          importance: 9,
        },
        {
          id: 'node-wuxing-metal',
          name: '金 (肺·忧·辛)',
          category: 'theory',
          classificationCategory: '五行归类·西方',
          thematicGroup: '五行生克',
          description: '西方生燥，燥生金，金生辛，辛生肺，肺生皮毛，在志为忧。主清肃降下。',
          originalQuotes: '西方生燥，燥生金，金生辛，辛生肺。',
          importance: 9,
        },
        {
          id: 'node-wuxing-water',
          name: '水 (肾·恐·咸)',
          category: 'theory',
          classificationCategory: '五行归类·北方',
          thematicGroup: '五行生克',
          description: '北方生寒，寒生水，水生咸，咸生肾，肾生骨髓，在志为恐。为主水封藏之本。',
          originalQuotes: '北方生寒，寒生水，水生咸，咸生肾。',
          importance: 9,
        },
        {
          id: 'node-organ-gan',
          name: '肝脏 (疏泄藏血)',
          category: 'meridian',
          classificationCategory: '五脏系统',
          thematicGroup: '五脏应象',
          description: '将军之官，谋虑出焉。喜条达而恶抑郁，主藏血，开窍于目。',
          importance: 9,
        },
        {
          id: 'node-organ-xin',
          name: '心脏 (君主之官)',
          category: 'meridian',
          classificationCategory: '五脏系统',
          thematicGroup: '五脏应象',
          description: '君主之官，神明出焉。主周身血脉，主神明，开窍于舌。',
          importance: 9,
        },
        {
          id: 'node-organ-pi',
          name: '脾脏 (谏议之官)',
          category: 'meridian',
          classificationCategory: '五脏系统',
          thematicGroup: '五脏应象',
          description: '仓廪之官，五味出焉。主运化水谷精微，主统血，在体合肌肉。',
          importance: 9,
        },
        {
          id: 'node-organ-fei',
          name: '肺脏 (相傅之官)',
          category: 'meridian',
          classificationCategory: '五脏系统',
          thematicGroup: '五脏应象',
          description: '相傅之官，治节出焉。主一身之气，通调水道，外合皮毛。',
          importance: 9,
        },
        {
          id: 'node-organ-shen',
          name: '肾脏 (作强之官)',
          category: 'meridian',
          classificationCategory: '五脏系统',
          thematicGroup: '五脏应象',
          description: '作强之官，伎巧出焉。藏先天之精，主骨生髓，为元阴元阳之根。',
          importance: 9,
        },
        {
          id: 'node-qingyang-shangqiao',
          name: '清阳出上窍',
          category: 'pathology',
          classificationCategory: '升降出入理论',
          thematicGroup: '形气升降',
          description: '清灵之阳气升腾，濡养头面七窍，使耳聪目明、精神充沛。',
          originalQuotes: '清阳出上窍，浊阴出下窍。',
          importance: 8,
        },
        {
          id: 'node-zhuoyin-xiaqiao',
          name: '浊阴出下窍',
          category: 'pathology',
          classificationCategory: '升降出入理论',
          thematicGroup: '形气升降',
          description: '水谷化生之糟粕浊阴趋下排泄，使二便调和畅通。',
          originalQuotes: '清阳发腠理，浊阴走五脏。',
          importance: 8,
        },
        {
          id: 'node-yang-sheng-re',
          name: '阳胜则热',
          category: 'syndrome',
          classificationCategory: '八纲辨证·热证',
          thematicGroup: '阴阳消长病变',
          description: '阳邪偏亢导致阳热过甚，伤耗津液，表现为面赤身热口渴脉数。',
          originalQuotes: '阳胜则热，阴胜则寒。',
          importance: 8,
        },
        {
          id: 'node-yin-sheng-han',
          name: '阴胜则寒',
          category: 'syndrome',
          classificationCategory: '八纲辨证·寒证',
          thematicGroup: '阴阳消长病变',
          description: '阴寒偏盛阻遏阳气温煦，表现为形寒肢冷踡卧脉沉迟。',
          originalQuotes: '阴胜则寒。',
          importance: 8,
        }
      ],
      relations: [
        // 五行相生关系 (Relational)
        {
          source: 'node-wuxing-wood',
          target: 'node-wuxing-fire',
          relationType: '五行相生 (木生火)',
          dimension: 'relational',
          description: '木性温暖，伏火其中，故木生火；肝木资生心火。',
          weight: 5
        },
        {
          source: 'node-wuxing-fire',
          target: 'node-wuxing-earth',
          relationType: '五行相生 (火生土)',
          dimension: 'relational',
          description: '火能焚木为灰烬，灰即土也；心火温养脾土。',
          weight: 5
        },
        {
          source: 'node-wuxing-earth',
          target: 'node-wuxing-metal',
          relationType: '五行相生 (土生金)',
          dimension: 'relational',
          description: '金石蕴结于山岳土石之中；脾土化生气血充养肺金。',
          weight: 5
        },
        {
          source: 'node-wuxing-metal',
          target: 'node-wuxing-water',
          relationType: '五行相生 (金生水)',
          dimension: 'relational',
          description: '金气温润流溢出水，肺金清肃下行滋生肾水。',
          weight: 5
        },
        {
          source: 'node-wuxing-water',
          target: 'node-wuxing-wood',
          relationType: '五行相生 (水生木)',
          dimension: 'relational',
          description: '水能滋灌草木条达生长；肾水涵养肝木。',
          weight: 5
        },
        // 五行与五脏归属 (Classification)
        {
          source: 'node-organ-gan',
          target: 'node-wuxing-wood',
          relationType: '五行同属 (肝属于木)',
          dimension: 'classification',
          description: '肝在五行属木，具升发柔和条达之性。',
          weight: 5
        },
        {
          source: 'node-organ-xin',
          target: 'node-wuxing-fire',
          relationType: '五行同属 (心属于火)',
          dimension: 'classification',
          description: '心在五行属火，具温煦上行明达之性。',
          weight: 5
        },
        {
          source: 'node-organ-pi',
          target: 'node-wuxing-earth',
          relationType: '五行同属 (脾属于土)',
          dimension: 'classification',
          description: '脾在五行属土，具敦厚承载运化之性。',
          weight: 5
        },
        {
          source: 'node-organ-fei',
          target: 'node-wuxing-metal',
          relationType: '五行同属 (肺属于金)',
          dimension: 'classification',
          description: '肺在五行属金，具清肃敛降坚刚之性。',
          weight: 5
        },
        {
          source: 'node-organ-shen',
          target: 'node-wuxing-water',
          relationType: '五行同属 (肾属于水)',
          dimension: 'classification',
          description: '肾在五行属水，具滋润封藏潜降之性。',
          weight: 5
        },
        // 阴阳统帅关系 (Thematic & Relational)
        {
          source: 'node-zhibing-qiuben',
          target: 'node-yinyang-doctrine',
          relationType: '理论根源',
          dimension: 'thematic',
          description: '治病求本之“本”，即为体内阴阳失调之本元。',
          weight: 5
        },
        {
          source: 'node-yang-sheng-re',
          target: 'node-yinyang-doctrine',
          relationType: '阴阳偏颇表象',
          dimension: 'thematic',
          description: '热证本质为阳气偏亢或阴液不能制阳。',
          weight: 4
        },
        {
          source: 'node-yin-sheng-han',
          target: 'node-yinyang-doctrine',
          relationType: '阴阳偏颇表象',
          dimension: 'thematic',
          description: '寒证本质为阴邪独盛或阳气虚损不能抗寒。',
          weight: 4
        },
        {
          source: 'node-qingyang-shangqiao',
          target: 'node-yang-hua-qi',
          relationType: '气化升降体现',
          dimension: 'relational',
          description: '清阳之气升发充盈上窍，体现阳主气化之用。',
          weight: 4
        },
        {
          source: 'node-zhuoyin-xiaqiao',
          target: 'node-yang-hua-qi',
          relationType: '形质趋下体现',
          dimension: 'relational',
          description: '浊阴重浊沉降归于下窍，体现阴主成形归聚。',
          weight: 4
        }
      ]
    }
  },
  {
    id: 'bencao-herb-pairs',
    title: '《本草纲目 · 草部药性配伍》',
    author: '李时珍',
    dynasty: '明代',
    category: '本草精微 · 药对法度',
    coverBadge: '东方药物巨典',
    description: '辑录补气生血、培土生金之本草上药，深研黄芪人参甘温益气、当归熟地补血濡养之七情配伍奥秘。',
    sampleText: `人参，甘微苦平。补五脏，安精神，定魂魄，止惊悸，除邪气，明目开心益智。久服轻身延年。
黄芪，甘微温。补诸虚不足，益元气，壮脾胃，升清阳，固表止汗，排脓托疮。
当归，甘辛温。主咳逆上气，温疟寒热，妇人漏下绝子，诸恶疮疡金疮。补血活血，调经止痛。
熟地黄，甘微温。填骨髓，长肌肉，生精血，补五脏内伤不足，通血脉，利耳目，黑发须。
四君子汤：人参、白术、茯苓、甘草。益气健脾，和中化湿。
补中益气汤：黄芪、人参、白术、炙甘草、当归、陈皮、升麻、柴胡。调补脾胃，升举阳气。`,
    graphData: {
      bookTitle: '《本草纲目 · 草部药性配伍》',
      dynasty: '明代',
      author: '李时珍',
      summary: '本草纲目以格物穷理为旨，阐释中药气味升降、脏腑归经及七情配伍（相须、相使、相畏、相恶），示补气健脾与生血固元之至理。',
      nodes: [
        {
          id: 'node-renshen',
          name: '人参',
          category: 'herb',
          classificationCategory: '补气药·上品',
          thematicGroup: '大补元气',
          description: '甘微苦微温，大补元气，复脉固脱，补脾益肺，生津养血，安神益智。',
          originalQuotes: '人参，补五脏，安精神，定魂魄。久服轻身延年。',
          importance: 10,
          properties: { nature: '甘、微苦，微温', meridianTropism: '脾、肺、心、肾经', compositionRole: '君药' }
        },
        {
          id: 'node-huangqi',
          name: '黄芪',
          category: 'herb',
          classificationCategory: '补气药·上品',
          thematicGroup: '升阳固表',
          description: '甘温，补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓。',
          originalQuotes: '黄芪，补诸虚不足，益元气，壮脾胃，升清阳。',
          importance: 10,
          properties: { nature: '甘，微温', meridianTropism: '肺、脾经', compositionRole: '君药' }
        },
        {
          id: 'node-danggui',
          name: '当归',
          category: 'herb',
          classificationCategory: '补血药',
          thematicGroup: '气血同治',
          description: '甘辛温，补血活血，调经止痛，润肠通便。血家之圣药，气中之血药。',
          originalQuotes: '当归，补血活血，调经止痛。',
          importance: 9,
          properties: { nature: '甘、辛，温', meridianTropism: '肝、心、脾经', compositionRole: '臣药/君药' }
        },
        {
          id: 'node-shudihuang',
          name: '熟地黄',
          category: 'herb',
          classificationCategory: '补血滋阴药',
          thematicGroup: '滋阴填髓',
          description: '甘微温，补血滋阴，益精填髓。质润味厚，为补肾阴、滋真阴之第一要药。',
          originalQuotes: '熟地黄，填骨髓，生精血，通血脉。',
          importance: 9,
          properties: { nature: '甘，微温', meridianTropism: '肝、肾经', compositionRole: '君药' }
        },
        {
          id: 'node-baizhu',
          name: '白术',
          category: 'herb',
          classificationCategory: '补气健脾药',
          thematicGroup: '培土生金',
          description: '苦甘温，健脾益气，燥湿利水，止汗安胎。脾虚湿盛之良相。',
          originalQuotes: '白术，苦甘温，健脾燥湿。',
          importance: 8,
          properties: { nature: '苦、甘，温', meridianTropism: '脾、胃经', compositionRole: '臣药' }
        },
        {
          id: 'node-fuling',
          name: '茯苓',
          category: 'herb',
          classificationCategory: '利水渗湿药',
          thematicGroup: '培土生金',
          description: '甘淡平，利水渗湿，健脾和胃，宁心安神。补而不滞，利而不峻。',
          originalQuotes: '茯苓，利水渗湿，健脾宁心。',
          importance: 8,
          properties: { nature: '甘、淡，平', meridianTropism: '心、脾、肺、肾经', compositionRole: '佐药' }
        },
        {
          id: 'node-buzhong-yiqi-tang',
          name: '补中益气汤',
          category: 'formula',
          classificationCategory: '补益剂·补气升阳',
          thematicGroup: '甘温除热·升提元气',
          description: '李东垣创制，以黄芪为人参甘温大补为君，佐升麻柴胡引清气上升，治脾胃虚损中气下陷。',
          originalQuotes: '补中益气汤，调补脾胃，升举清阳。',
          importance: 10,
        },
        {
          id: 'node-sijunzitang',
          name: '四君子汤',
          category: 'formula',
          classificationCategory: '补益剂·益气健脾',
          thematicGroup: '培补后天',
          description: '人参白术茯苓甘草，平淡之中建奇功，为后世一切益气健脾方剂之母方。',
          originalQuotes: '四君子汤，益气健脾，和中健胃。',
          importance: 9,
        },
        {
          id: 'node-piwei-qixu',
          name: '脾胃气虚证',
          category: 'syndrome',
          classificationCategory: '脏腑辨证·脾胃病',
          thematicGroup: '脾胃元气论',
          description: '脾气亏虚，运化失职，症见食少纳呆、便溏神疲、肢体怠惰、面色萎黄、脉虚缓。',
          importance: 9,
        },
        {
          id: 'node-zhongqi-xiaxian',
          name: '中气下陷证',
          category: 'syndrome',
          classificationCategory: '脏腑辨证·脾胃病',
          thematicGroup: '甘温除热·升提元气',
          description: '脾虚清阳不能上升反向下陷，症见脱肛、子宫脱垂、久泻久痢、少腹坠胀。',
          importance: 8,
        },
        {
          id: 'node-jianpi-yiqi',
          name: '健脾益气',
          category: 'method',
          classificationCategory: '治法·补法',
          thematicGroup: '培补后天',
          description: '滋培脾土，扶助中焦生化之源，恢复脾升胃降之机。',
          importance: 9,
        },
        {
          id: 'node-shengyang-jutian',
          name: '升阳举陷',
          category: 'method',
          classificationCategory: '治法·补法',
          thematicGroup: '甘温除热·升提元气',
          description: '升提下陷之清阳之气，使清气出上窍，元气归位。',
          importance: 9,
        }
      ],
      relations: [
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-huangqi',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '黄芪重用甘温升补为君，大补脾肺之气并升清阳。',
          weight: 5
        },
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-renshen',
          relationType: '配伍·臣药',
          dimension: 'relational',
          description: '人参辅黄芪益气固元，培补后天之本。',
          weight: 4
        },
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-baizhu',
          relationType: '配伍·臣药',
          dimension: 'relational',
          description: '白术健脾燥湿，助黄芪人参培土生金。',
          weight: 4
        },
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-danggui',
          relationType: '配伍·佐药',
          dimension: 'relational',
          description: '当归养血和营，使气有所附，防阳亢化燥。',
          weight: 4
        },
        {
          source: 'node-sijunzitang',
          target: 'node-renshen',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '四君子汤以人参为君，大补元气。',
          weight: 5
        },
        {
          source: 'node-sijunzitang',
          target: 'node-baizhu',
          relationType: '配伍·臣药',
          dimension: 'relational',
          description: '白术苦温健脾燥湿为臣。',
          weight: 4
        },
        {
          source: 'node-sijunzitang',
          target: 'node-fuling',
          relationType: '配伍·佐药',
          dimension: 'relational',
          description: '茯苓甘淡渗湿健脾为佐。',
          weight: 4
        },
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-zhongqi-xiaxian',
          relationType: '主治',
          dimension: 'relational',
          description: '补中益气汤为主治中气下陷、清阳不升之经方神剂。',
          weight: 5
        },
        {
          source: 'node-sijunzitang',
          target: 'node-piwei-qixu',
          relationType: '主治',
          dimension: 'relational',
          description: '四君子汤主治脾胃气虚、食少便溏、倦怠乏力。',
          weight: 5
        },
        {
          source: 'node-huangqi',
          target: 'node-danggui',
          relationType: '名医相配·相须相使',
          dimension: 'relational',
          description: '黄芪合当归（当归补血汤法），有气能生血、气行血行之妙。',
          weight: 5
        },
        {
          source: 'node-danggui',
          target: 'node-shudihuang',
          relationType: '名医相配·相须',
          dimension: 'relational',
          description: '当归活血化瘀，熟地滋阴养血，二药同用动静结合补而不滞。',
          weight: 5
        },
        {
          source: 'node-buzhong-yiqi-tang',
          target: 'node-shengyang-jutian',
          relationType: '体现治法',
          dimension: 'thematic',
          description: '补中益气汤集中体现了升阳举陷之精义。',
          weight: 4
        },
        {
          source: 'node-sijunzitang',
          target: 'node-jianpi-yiqi',
          relationType: '体现治法',
          dimension: 'thematic',
          description: '四君子汤为健脾益气之基础宗方。',
          weight: 4
        }
      ]
    }
  },
  {
    id: 'wenbing-tiaobian',
    title: '《温病条辨 · 卫气营血与上焦篇》',
    author: '吴鞠通',
    dynasty: '清代',
    category: '温病学派 · 三焦辨证',
    coverBadge: '温病集大成',
    description: '立三焦为纲、卫气营血为目。辨析温邪上受首先犯肺、逆传心包之传变脉络，创制银翘散辛凉平剂与清宫汤透热清心之法。',
    sampleText: `温病者，有风温、有温热、有温疫、有温毒、有暑温、有湿温、有秋燥、有冬温、有温疟。
凡病温者，始于上焦，在手太阴。
太阴风温，但咳，身不甚热，微渴者，桑菊饮主之。
太阴风温，初起但热，微恶风寒而渴者，辛凉平剂银翘散主之。
银翘散方：连翘一两，银花一两，苦桔梗六钱，薄荷六钱，竹叶四钱，生甘草五钱，荆芥穗四钱，淡豆豉五钱，牛蒡子六钱。
温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。
热入营血，斑疹隐隐，舌绛唇焦，神昏谵语。`,
    graphData: {
      bookTitle: '《温病条辨 · 卫气营血与上焦篇》',
      dynasty: '清代',
      author: '吴鞠通',
      summary: '温病学派开创温邪始于上焦手太阴、沿卫气营血逐步内陷深伏之辨证体系，善用辛凉轻清透邪法。',
      nodes: [
        {
          id: 'node-wenbing-doctrine',
          name: '卫气营血辨证',
          category: 'theory',
          classificationCategory: '温病辨证体系',
          thematicGroup: '温邪传变大纲',
          description: '叶天士与吴鞠通创立，揭示温热病邪由浅入深（卫分受邪 -> 气分化热 -> 营分伤阴 -> 血分动血）的发展阶段。',
          originalQuotes: '温邪上受，首先犯肺，逆传心包。肺主气属卫，心主血属营。',
          importance: 10,
        },
        {
          id: 'node-weifen-syndrome',
          name: '卫分证',
          category: 'syndrome',
          classificationCategory: '卫气营血·表证',
          thematicGroup: '温邪初起',
          description: '温热病邪袭于肌表，肺卫失和，症见发热微恶风寒、头痛、口微渴、舌边尖红。',
          importance: 9,
        },
        {
          id: 'node-qifen-syndrome',
          name: '气分证',
          category: 'syndrome',
          classificationCategory: '卫气营血·里热',
          thematicGroup: '里热炽盛',
          description: '邪入气分，正邪剧争，表现为四大主症：大热、大渴、大汗、脉洪大。',
          importance: 9,
        },
        {
          id: 'node-yingfen-syndrome',
          name: '营分证',
          category: 'syndrome',
          classificationCategory: '卫气营血·深伏',
          thematicGroup: '热陷心营',
          description: '热邪深陷心营，灼伤营阴，症见身热夜甚、神烦谵语、斑疹隐隐、舌绛无苔。',
          importance: 9,
        },
        {
          id: 'node-yinqiaosan',
          name: '银翘散',
          category: 'formula',
          classificationCategory: '辛凉解表剂',
          thematicGroup: '辛凉透表',
          description: '吴鞠通所创“辛凉平剂”，清热解毒，辛凉透表，为太阴温病初起卫分证第一名方。',
          originalQuotes: '太阴风温，初起但热，微恶风寒而渴者，辛凉平剂银翘散主之。',
          importance: 10,
        },
        {
          id: 'node-sangjuyin',
          name: '桑菊饮',
          category: 'formula',
          classificationCategory: '辛凉解表剂',
          thematicGroup: '宣肺止咳',
          description: '吴鞠通所创“辛凉轻剂”，宣肺止咳，清热宣透，主治风温初起咳嗽微热。',
          originalQuotes: '太阴风温，但咳，身不甚热，微渴者，桑菊饮主之。',
          importance: 9,
        },
        {
          id: 'node-jinyinhua',
          name: '金银花',
          category: 'herb',
          classificationCategory: '清热解毒药',
          thematicGroup: '清热透表',
          description: '甘寒气芳香，甘寒清热而不伤胃，芳香透达而可祛邪，解表清里。',
          importance: 9,
          properties: { nature: '甘，寒', meridianTropism: '肺、心、胃经', compositionRole: '君药' }
        },
        {
          id: 'node-lianqiao',
          name: '连翘',
          category: 'herb',
          classificationCategory: '清热解毒药',
          thematicGroup: '清热透表',
          description: '苦微寒，清心泄热，透表达邪，散结消肿，为疮家圣药与透热神品。',
          importance: 9,
          properties: { nature: '苦，微寒', meridianTropism: '心、肺、胆经', compositionRole: '君药' }
        },
        {
          id: 'node-bohe',
          name: '薄荷',
          category: 'herb',
          classificationCategory: '辛凉解表药',
          thematicGroup: '辛凉透表',
          description: '辛凉轻清，宣散风热，清头目，利咽喉，透疹。',
          importance: 8,
          properties: { nature: '辛，凉', meridianTropism: '肺、肝经', compositionRole: '佐药' }
        },
        {
          id: 'node-xinliang-toubiao',
          name: '辛凉透表',
          category: 'method',
          classificationCategory: '治法·汗法',
          thematicGroup: '辛凉透表',
          description: '以辛凉之品宣发腠理，透热出表，不用辛温以免助热劫阴。',
          importance: 9,
        },
        {
          id: 'node-qingre-jiedu',
          name: '清热解毒',
          category: 'method',
          classificationCategory: '治法·清法',
          thematicGroup: '辛凉透表',
          description: '清除体内火毒热毒，泻火熄炎，护卫阴津。',
          importance: 9,
        }
      ],
      relations: [
        {
          source: 'node-yinqiaosan',
          target: 'node-weifen-syndrome',
          relationType: '主治',
          dimension: 'relational',
          description: '银翘散主治太阴风温初起卫分证。',
          weight: 5
        },
        {
          source: 'node-yinqiaosan',
          target: 'node-jinyinhua',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '金银花芳香透热，清热解毒为君。',
          weight: 5
        },
        {
          source: 'node-yinqiaosan',
          target: 'node-lianqiao',
          relationType: '配伍·君药',
          dimension: 'relational',
          description: '连翘苦寒清透，与银花相须为用，共建辛凉解毒大功。',
          weight: 5
        },
        {
          source: 'node-yinqiaosan',
          target: 'node-bohe',
          relationType: '配伍·臣药',
          dimension: 'relational',
          description: '薄荷辛凉轻清，透发肌表风热。',
          weight: 4
        },
        {
          source: 'node-yinqiaosan',
          target: 'node-xinliang-toubiao',
          relationType: '体现治法',
          dimension: 'relational',
          description: '银翘散充分体现辛凉透表之治疗大法。',
          weight: 5
        },
        {
          source: 'node-weifen-syndrome',
          target: 'node-qifen-syndrome',
          relationType: '病机传变 (顺传)',
          dimension: 'thematic',
          description: '卫分之邪未解，顺传入里，化热转入气分。',
          weight: 4
        },
        {
          source: 'node-qifen-syndrome',
          target: 'node-yingfen-syndrome',
          relationType: '病机传变 (内陷)',
          dimension: 'thematic',
          description: '气分热盛进一步灼伤营阴，内陷营分。',
          weight: 4
        },
        {
          source: 'node-weifen-syndrome',
          target: 'node-wenbing-doctrine',
          relationType: '属于大类',
          dimension: 'classification',
          description: '卫分证属于卫气营血四阶段之首端。',
          weight: 4
        }
      ]
    }
  }
];
