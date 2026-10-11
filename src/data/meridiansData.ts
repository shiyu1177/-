import { Meridian } from '../types/meridian';

/**
 * 十二经脉与奇经八脉（任督二脉）人体三维巡行知识库
 * 经脉走向规程遵循《灵枢·经脉》：
 * - 手三阴经从胸走手
 * - 手三阳经从手走头
 * - 足三阳经从头走足
 * - 足三阴经从足走腹胸
 * 形成子午流注如环无端的循环网络
 */
export const MERIDIANS_DATA: Meridian[] = [
  // =========================================================================
  // 1. 手太阴肺经 (Lung Meridian, LU)
  // 循行：从胸走手，寅时 (03:00 - 05:00)
  // =========================================================================
  {
    id: 'meridian-lu',
    name: '手太阴肺经',
    shortName: '肺经',
    pinyin: 'Shǒu Tàiyīn Fèijīng',
    code: 'LU',
    yinYang: '阴经',
    handFoot: '手经',
    color: '#38bdf8', // 浅蓝/白（肺属金，金白，视觉以清冽青蓝表现）
    twColor: 'text-sky-400',
    flowDirection: '从胸走手（起于胸部中府，沿上肢内侧前缘下行，止于大拇指端少商）',
    circulationOrder: 1,
    timeSlot: '寅时 (03:00 - 05:00)',
    interiorOrgan: '属肺',
    pairedOrgan: '络大肠',
    startingPoint: '起于中焦，下络大肠，还循胃口，上膈属肺。出胸前壁外上方【中府穴】',
    terminatingPoint: '止于手拇指桡侧指甲根角处【少商穴】；支脉从列缺走向食指商阳',
    pathwayDescription: '《灵枢·经脉》：“肺手太阴之脉，起于中焦，下络大肠，还循胃口，上膈属肺。从肺系，横出腋下，下循臑内，行少阴、心主之前，下肘中，循臂内上骨下廉，入寸口，上鱼，循鱼际，出大指之端。其支者，从腕后直出次指内廉，出其端。”',
    keyIndications: '咳嗽、气喘、胸部胀满、咯血、咽喉肿痛、外感发热及上肢内侧前缘疼痛挛急。',
    curvePoints: [
      [3.8, 12.8, 2.8],    // 中府
      [4.2, 13.8, 2.5],    // 云门
      [5.2, 13.0, 1.2],    // 腋前转折
      [6.8, 10.5, 0.8],    // 天府
      [7.8, 8.2, 0.5],     // 侠白
      [8.6, 5.8, 0.3],     // 尺泽 (肘横纹)
      [9.5, 3.2, 0.2],     // 孔最
      [10.4, 0.8, 0.1],    // 列缺
      [10.8, -0.6, 0.1],   // 经渠
      [11.2, -1.8, 0.0],   // 太渊 (寸口)
      [11.8, -3.2, 0.0],   // 鱼际
      [12.4, -4.5, 0.0],   // 少商 (拇指末节)
    ],
    acupoints: [
      {
        id: 'point-lu1',
        name: '中府',
        pinyin: 'Zhōngfǔ',
        code: 'LU-1',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['肺之募穴', '手足太阴经交会穴'],
        position: [3.8, 12.8, 2.8],
        actions: '肃降肺气，宣通胸阳，止咳平喘，清热化痰',
        indications: '咳嗽、气喘、胸中烦满、胸痛、肩背痛、肺胀吐脓血',
        location: '胸前壁外上方，前正中线旁开6寸，平第1肋间隙，锁骨下窝外下方',
        needling: '向外斜刺或平刺0.5~0.8寸，不可向内深刺以防刺伤肺脏造成气胸',
        classicalVerse: '《针灸甲乙经》：“肺募也。手足太阴之会。治肺系急，胸中满而烦，咳唾浊涕。”',
        pointType: '募穴',
      },
      {
        id: 'point-lu5',
        name: '尺泽',
        pinyin: 'Chǐzé',
        code: 'LU-5',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['合水穴', '五输穴之合穴'],
        position: [8.6, 5.8, 0.3],
        actions: '清宣肺热，降逆下气，舒筋利节，滋阴润肺',
        indications: '咳嗽、气喘、咯血、潮热、咽喉肿痛、肘臂挛痛',
        location: '肘横纹上，肱二头肌腱桡侧凹陷中，微屈肘取之',
        needling: '直刺0.8~1.2寸，或点刺出血',
        classicalVerse: '《百症赋》：“咳嗽连声，肺俞须迎于尺泽。”',
        pointType: '合水穴',
        fivePhase: '水',
      },
      {
        id: 'point-lu6',
        name: '孔最',
        pinyin: 'Kǒngzuì',
        code: 'LU-6',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['郄穴', '急救要穴'],
        position: [9.5, 3.2, 0.2],
        actions: '润肺止血，清热解表，宣通气机',
        indications: '咯血、咳血、鼻衄、急性咳嗽哮喘、咽痛失音、肘臂挛痛',
        location: '前臂掌面桡侧，尺泽与太渊连线上，腕横纹上7寸处',
        needling: '直刺0.5~1寸',
        classicalVerse: '《针灸大成》：“主热病汗不出，咳逆，唾血，失音，咽肿痛痛。”',
        pointType: '郄穴',
      },
      {
        id: 'point-lu7',
        name: '列缺',
        pinyin: 'Lièquē',
        code: 'LU-7',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['络穴', '八脉交会穴（通任脉）', '四总穴之一'],
        position: [10.4, 0.8, 0.1],
        actions: '宣肺解表，通经活络，通调任脉，通调水道',
        indications: '偏正头痛、项强颈痛、咳嗽气喘、咽喉肿痛、口眼歪斜、牙痛',
        location: '前臂桡侧，桡骨茎突上方，腕横纹上1.5寸，两手虎口交叉食指尽处',
        needling: '向肘部斜刺0.5~0.8寸',
        classicalVerse: '《四总穴歌》：“头项寻列缺。”《兰江赋》：“列缺任脉行肺系。”',
        pointType: '络穴',
      },
      {
        id: 'point-lu9',
        name: '太渊',
        pinyin: 'Tàiyuān',
        code: 'LU-9',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['原穴', '八会穴之脉会', '五输穴之输土穴'],
        position: [11.2, -1.8, 0.0],
        actions: '宣肺化痰，调和气血，培土生金，补益肺气',
        indications: '咳嗽喘促、胸痛咳血、无脉症、腕臂痛、咽干音哑',
        location: '掌后腕横纹桡侧端，桡动脉搏动处（寸口）',
        needling: '避开桡动脉，直刺0.3~0.5寸',
        classicalVerse: '《难经·四十五难》：“脉会太渊。”《针灸甲乙经》：“肺气虚，脉不通，刺太渊。”',
        pointType: '原穴',
        fivePhase: '土',
      },
      {
        id: 'point-lu11',
        name: '少商',
        pinyin: 'Shàoshāng',
        code: 'LU-11',
        meridianId: 'meridian-lu',
        meridianName: '手太阴肺经',
        categoryTags: ['井木穴', '十三鬼穴之一'],
        position: [12.4, -4.5, 0.0],
        actions: '开窍醒神，清热利咽，泻火解毒',
        indications: '咽喉重度肿痛、乳蛾扁桃体炎、高热惊厥、中风昏迷、癫狂',
        location: '手拇指末节桡侧，指甲根角旁0.1寸',
        needling: '浅刺0.1寸或三棱针点刺放血',
        classicalVerse: '《通玄指要赋》：“少商唯针对乳蛾。”《千金方》：“鬼信少商。”',
        pointType: '井木穴',
        fivePhase: '木',
      }
    ]
  },

  // =========================================================================
  // 2. 手阳明大肠经 (Large Intestine Meridian, LI)
  // 循行：从手走头，卯时 (05:00 - 07:00)
  // =========================================================================
  {
    id: 'meridian-li',
    name: '手阳明大肠经',
    shortName: '大肠经',
    pinyin: 'Shǒu Yángmíng Dàchángjīng',
    code: 'LI',
    yinYang: '阳经',
    handFoot: '手经',
    color: '#fbbf24', // 暖金黄（大肠经多气多血，金白土黄生发）
    twColor: 'text-amber-400',
    flowDirection: '从手走头（起于食指端商阳，循上肢外侧前缘，上颈面颊，止于对侧鼻翼迎香）',
    circulationOrder: 2,
    timeSlot: '卯时 (05:00 - 07:00)',
    interiorOrgan: '属大肠',
    pairedOrgan: '络肺',
    startingPoint: '起于食指桡侧端【商阳穴】，接手太阴肺经支脉',
    terminatingPoint: '止于鼻翼旁【迎香穴】，并在此接足阳明胃经',
    pathwayDescription: '《灵枢·经脉》：“大肠手阳明之脉，起于大指次指之端，循指上廉，出合谷两骨之间，上入两筋之中，循臂上廉，入肘外廉，上臑外前廉，上肩，出髃骨之前廉，上出于柱骨之会上，下入缺盆，络肺，下膈，属大肠。其支者，从缺盆上颈，贯颊，入下齿中；还出挟口，交人中，左之右，右之左，上挟鼻孔。”',
    keyIndications: '头痛、面肿、齿痛、鼻衄、咽喉肿痛、腹痛腹泻、肠痈、便秘及经脉循行部位疼痛。',
    curvePoints: [
      [12.2, -4.2, 0.2],   // 商阳 (食指末端)
      [11.5, -2.8, 0.2],   // 二间/三间
      [10.8, -1.0, 0.4],   // 合谷
      [10.2, 0.5, 0.5],    // 阳溪
      [9.2, 3.8, 0.6],     // 手三里
      [8.2, 6.2, 0.7],     // 曲池 (肘横纹外侧)
      [7.2, 9.8, 0.9],     // 臂臑
      [6.0, 13.5, 1.2],    // 肩髃
      [4.2, 14.8, 1.0],    // 巨骨 / 颈根
      [2.8, 16.5, 1.2],    // 天鼎 / 扶突 (颈侧)
      [1.8, 18.2, 2.0],    // 下颌角大迎转折
      [0.9, 19.5, 3.2],    // 地仓旁颊部
      [0.2, 20.2, 3.8],    // 迎香 (鼻翼旁，左右交叉)
    ],
    acupoints: [
      {
        id: 'point-li1',
        name: '商阳',
        pinyin: 'Shāngyáng',
        code: 'LI-1',
        meridianId: 'meridian-li',
        meridianName: '手阳明大肠经',
        categoryTags: ['井金穴'],
        position: [12.2, -4.2, 0.2],
        actions: '宣肺解表，清热开窍，消肿利咽',
        indications: '急性扁桃体炎、咽喉肿痛、齿痛、高热热病汗不出、中风昏厥',
        location: '食指桡侧端，指甲根角旁0.1寸',
        needling: '浅刺0.1寸或点刺放血',
        classicalVerse: '《席弘赋》：“耳聋气闭听会取，更审商阳与少冲。”',
        pointType: '井金穴',
        fivePhase: '金',
      },
      {
        id: 'point-li4',
        name: '合谷',
        pinyin: 'Hégǔ',
        code: 'LI-4',
        meridianId: 'meridian-li',
        meridianName: '手阳明大肠经',
        categoryTags: ['原穴', '四总穴之一', '回阳九针穴'],
        position: [10.8, -1.0, 0.4],
        actions: '疏风解表，通络镇痛，镇惊熄风，清泻阳明',
        indications: '头痛目赤、牙齿疼痛、口眼歪斜、面瘫、发热恶寒、经闭滞产',
        location: '手背第1、2掌骨间，第2掌骨桡侧中点处（虎口饱满处）',
        needling: '直刺0.5~1寸。孕妇绝对禁针（下气堕胎）',
        classicalVerse: '《四总穴歌》：“面口合谷收。”《玉龙歌》：“头面诸疾合谷针。”',
        pointType: '原穴',
      },
      {
        id: 'point-li10',
        name: '手三里',
        pinyin: 'Shǒusānlǐ',
        code: 'LI-10',
        meridianId: 'meridian-li',
        meridianName: '手阳明大肠经',
        categoryTags: ['经穴'],
        position: [9.2, 3.8, 0.6],
        actions: '通经活络，调理肠胃，消肿止痛',
        indications: '手臂麻痛不遂、腹痛腹泻、齿痛、瘰疬、面肿',
        location: '前臂背面桡侧，阳溪与曲池连线上，曲池下2寸处',
        needling: '直刺0.8~1.2寸',
        classicalVerse: '《针灸甲乙经》：“肠腹时寒，手三里主之。”',
        pointType: '经穴',
      },
      {
        id: 'point-li11',
        name: '曲池',
        pinyin: 'Qūchí',
        code: 'LI-11',
        meridianId: 'meridian-li',
        meridianName: '手阳明大肠经',
        categoryTags: ['合土穴', '清热大穴'],
        position: [8.2, 6.2, 0.7],
        actions: '清热解表，凉血祛风，消肿止痒，调和气血，平肝降压',
        indications: '高热、高血压、荨麻疹湿疹皮肤病、手臂麻木挛急、咽痛牙痛、腹痛腹泻',
        location: '尺泽与肱骨外上髁连线中点，屈肘成直角时肘横纹外侧端凹陷中',
        needling: '直刺1~1.5寸',
        classicalVerse: '《通玄指要赋》：“曲池通耳目之荣。”《席弘赋》：“伤寒发热头颈强，曲池合谷取之善。”',
        pointType: '合土穴',
        fivePhase: '土',
      },
      {
        id: 'point-li20',
        name: '迎香',
        pinyin: 'Yíngxiāng',
        code: 'LI-20',
        meridianId: 'meridian-li',
        meridianName: '手阳明大肠经',
        categoryTags: ['手足阳明交会穴', '通鼻要穴'],
        position: [0.2, 20.2, 3.8],
        actions: '疏风解表，宣通鼻窍，通络止痛',
        indications: '鼻塞不通、流涕鼻衄、鼻渊鼻炎、面神经麻痹口角歪斜、胆道蛔虫症',
        location: '鼻翼外缘中点旁开0.5寸，鼻唇沟中',
        needling: '略向内上方斜刺或平刺0.3~0.5寸',
        classicalVerse: '《玉龙歌》：“鼻流清涕不可当，迎香穴内刺为良。”',
        pointType: '交会穴',
      }
    ]
  },

  // =========================================================================
  // 3. 足阳明胃经 (Stomach Meridian, ST)
  // 循行：从头走足，辰时 (07:00 - 09:00)
  // =========================================================================
  {
    id: 'meridian-st',
    name: '足阳明胃经',
    shortName: '胃经',
    pinyin: 'Zú Yángmíng Wèijīng',
    code: 'ST',
    yinYang: '阳经',
    handFoot: '足经',
    color: '#eab308', // 黄色（脾胃土，厚重金黄）
    twColor: 'text-yellow-400',
    flowDirection: '从头走足（起于鼻翼承泣/头维，循面颊下胸腹，沿下肢外侧前缘下行，止于足次趾端厉兑）',
    circulationOrder: 3,
    timeSlot: '辰时 (07:00 - 09:00)',
    interiorOrgan: '属胃',
    pairedOrgan: '络脾',
    startingPoint: '起于鼻翼迎香交会，上承泣、头维，下颊车、下关，入缺盆',
    terminatingPoint: '止于足第2趾外侧端【厉兑穴】；支脉从足三里下三阴交，足背分入大趾隐白',
    pathwayDescription: '《灵枢·经脉》：“胃足阳明之脉，起于鼻之交頞中，旁约太阳之脉，下循鼻外，入上齿中，还出挟口环唇，下交承浆，却循颐后下廉，出大迎，循颊车，上耳前，过客主人，循发际，至额颅。其支者，从大迎前，下人迎，循喉咙，入缺盆，下膈，属胃，络脾。其直者，从缺盆下乳内廉，下挟脐，入气街中。其支者，起于胃口，下循腹里，下至气街中而合。以下髀关，抵伏兔，下膝膑中，下循胫外廉，下足跗，入中指内间。其支者，下廉三寸而别，下入中指外间。其支者，别跗上，入大指间，出其端。”',
    keyIndications: '胃肠腹痛、腹胀便秘、嘈杂反酸、头面目齿疾患、热病神昏狂躁及下肢瘫痪。',
    curvePoints: [
      [0.6, 21.0, 3.6],    // 承泣
      [1.8, 19.5, 3.0],    // 颊车
      [2.8, 22.2, 2.2],    // 头维
      [2.2, 15.2, 2.0],    // 缺盆 (锁骨上窝)
      [2.4, 12.8, 3.2],    // 乳中/乳根平面
      [2.2, 9.8, 3.5],     // 不容/承满
      [2.0, 7.2, 3.4],     // 天枢 (脐旁2寸)
      [1.8, 4.2, 3.0],     // 大巨/水道/归来
      [2.8, 1.2, 2.2],     // 髀关 (腹股沟下)
      [3.0, -3.2, 1.8],    // 伏兔 (大腿前侧)
      [3.2, -6.8, 1.5],    // 梁丘 (膝上2寸)
      [3.2, -8.6, 1.4],    // 犊鼻 (外膝眼)
      [3.3, -11.5, 1.3],   // 足三里
      [3.4, -14.2, 1.2],   // 上巨虚/丰隆
      [3.2, -18.2, 1.0],   // 解溪 (足背踝横纹)
      [3.0, -21.0, 1.6],   // 内庭 (趾蹼间)
      [2.8, -22.5, 2.0],   // 厉兑 (次趾外侧)
    ],
    acupoints: [
      {
        id: 'point-st25',
        name: '天枢',
        pinyin: 'Tiānshū',
        code: 'ST-25',
        meridianId: 'meridian-st',
        meridianName: '足阳明胃经',
        categoryTags: ['大肠之募穴', '升降气机枢纽'],
        position: [2.0, 7.2, 3.4],
        actions: '疏调大肠，理气消滞，降逆和胃，清热化湿',
        indications: '腹胀、便秘、泄泻下痢、脐周疼痛、水肿、痛经月经不调',
        location: '腹中部，平脐中，前正中线旁开2寸',
        needling: '直刺1~1.5寸。不可过深防伤腹腔脏器',
        classicalVerse: '《针灸大成》：“大肠募，主奔豚泄利，胀满腹痛便秘。”',
        pointType: '募穴',
      },
      {
        id: 'point-st34',
        name: '梁丘',
        pinyin: 'Liángqiū',
        code: 'ST-34',
        meridianId: 'meridian-st',
        meridianName: '足阳明胃经',
        categoryTags: ['郄穴', '急腹症止痛要穴'],
        position: [3.2, -6.8, 1.5],
        actions: '和胃降逆，消肿止痛，化瘀通络',
        indications: '急性胃脘剧痛、胃痉挛、乳痈乳房胀痛、下肢不遂膝关节肿痛',
        location: '屈膝，大腿前面，髂前上棘与髌底外侧端连线上，髌底上2寸',
        needling: '直刺1~1.2寸',
        classicalVerse: '《备急千金要方》：“梁丘主胃中疼痛急积，不可忍。”',
        pointType: '郄穴',
      },
      {
        id: 'point-st36',
        name: '足三里',
        pinyin: 'Zúsānlǐ',
        code: 'ST-36',
        meridianId: 'meridian-st',
        meridianName: '足阳明胃经',
        categoryTags: ['合土穴', '胃之下合穴', '四总穴之一', '天下第一强壮长寿要穴'],
        position: [3.3, -11.5, 1.3],
        actions: '调理脾胃，大补元气，疏通经络，培补后天，祛病延年',
        indications: '胃痛呕吐、腹胀消化不良、便秘腹泻、心悸失眠、下肢痿痹、虚劳羸弱',
        location: '小腿前外侧，犊鼻下3寸，犊鼻与解溪连线上，胫骨前嵴外1横指',
        needling: '直刺1~2寸；常灸足三里胜吃老母鸡',
        classicalVerse: '《四总穴歌》：“肚腹三里留。”《千金要方》：“若要安，三里常不干。”',
        pointType: '下合穴/合穴',
        fivePhase: '土',
      },
      {
        id: 'point-st40',
        name: '丰隆',
        pinyin: 'Fēnglóng',
        code: 'ST-40',
        meridianId: 'meridian-st',
        meridianName: '足阳明胃经',
        categoryTags: ['络穴', '化痰第一圣穴'],
        position: [3.4, -14.2, 1.2],
        actions: '和胃化痰，健脾清热，通调肠腑，宁心安神',
        indications: '痰多咳嗽哮喘、眩晕、癫狂、高脂血症、肥胖、便秘、下肢痿痹',
        location: '小腿前外侧，外踝尖上8寸，条口外1寸，胫骨前嵴外2横指',
        needling: '直刺1~1.5寸',
        classicalVerse: '《玉龙歌》：“痰多宜向丰隆寻。”《百症赋》：“丰隆肺俞，痰嗽称奇。”',
        pointType: '络穴',
      },
      {
        id: 'point-st44',
        name: '内庭',
        pinyin: 'Nèitíng',
        code: 'ST-44',
        meridianId: 'meridian-st',
        meridianName: '足阳明胃经',
        categoryTags: ['荥水穴', '清胃火专穴'],
        position: [3.0, -21.0, 1.6],
        actions: '清热降逆，泻胃中火，消肿止痛，通降腑气',
        indications: '胃火牙痛、咽喉肿痛、口臭、吐酸嘈杂、热病汗不出、足背肿痛',
        location: '足背，第2、3趾间，趾蹼缘后方赤白肉际处',
        needling: '斜刺0.5~0.8寸',
        classicalVerse: '《通玄指要赋》：“内庭主牙疼与口热。”',
        pointType: '荥水穴',
        fivePhase: '水',
      }
    ]
  },

  // =========================================================================
  // 4. 足太阴脾经 (Spleen Meridian, SP)
  // 循行：从足走腹胸，巳时 (09:00 - 11:00)
  // =========================================================================
  {
    id: 'meridian-sp',
    name: '足太阴脾经',
    shortName: '脾经',
    pinyin: 'Zú Tàiyīn Píjīng',
    code: 'SP',
    yinYang: '阴经',
    handFoot: '足经',
    color: '#f97316', // 橙黄（坤土厚德，温暖脾阳）
    twColor: 'text-orange-400',
    flowDirection: '从足走腹胸（起于大脚趾隐白，沿下肢内侧前缘，上抵腹胁，止于大包）',
    circulationOrder: 4,
    timeSlot: '巳时 (09:00 - 11:00)',
    interiorOrgan: '属脾',
    pairedOrgan: '络胃',
    startingPoint: '起于足大趾内侧端【隐白穴】，沿足内侧缘上行',
    terminatingPoint: '止于侧胸腋下第6肋间隙【大包穴】；支脉注心中交手少阴心经',
    pathwayDescription: '《灵枢·经脉》：“脾足太阴之脉，起于大指之端，循指内侧白肉际，过核骨后，上内踝前廉，上踹内，循胫骨后，交出厥阴之前，上膝股内前廉，入腹，属脾，络胃，上膈，挟咽，连舌本，散舌下。其支者，复从胃，别上膈，注心中。”',
    keyIndications: '脾胃虚弱、食少腹胀便溏、水肿、黄疸、妇科月经崩漏、下肢内侧瘫软冷痛。',
    curvePoints: [
      [1.8, -23.0, 1.8],   // 隐白 (大趾内侧)
      [1.5, -21.5, 0.8],   // 大都/太白
      [1.4, -19.5, 0.2],   // 公孙
      [1.8, -17.5, -0.2],  // 商丘 (内踝前下方)
      [2.0, -14.2, -0.3],  // 三阴交 (内踝上3寸)
      [2.1, -11.0, -0.4],  // 漏谷/地机
      [2.2, -8.2, -0.2],   // 阴陵泉 (胫骨内侧髁下)
      [2.5, -5.2, 0.5],    // 血海 (髌骨内上2寸)
      [2.8, 1.5, 2.0],     // 冲门 (腹股沟)
      [3.2, 5.8, 2.8],     // 府舍/大横 (脐旁4寸)
      [3.6, 10.2, 2.2],    // 腹哀/食窦
      [4.2, 12.0, 1.0],    // 大包 (腋中线第6肋间)
    ],
    acupoints: [
      {
        id: 'point-sp1',
        name: '隐白',
        pinyin: 'Yǐnbái',
        code: 'SP-1',
        meridianId: 'meridian-sp',
        meridianName: '足太阴脾经',
        categoryTags: ['井木穴', '健脾统血第一穴'],
        position: [1.8, -23.0, 1.8],
        actions: '统摄气血，固崩止血，健脾温阳，宁神定志',
        indications: '功能性子宫出血崩漏、便血尿血吐血、腹胀小儿惊风、多梦癫狂',
        location: '足大趾末节内侧，距趾甲角旁0.1寸',
        needling: '浅刺0.1寸，止血首选温灸艾条15分钟',
        classicalVerse: '《医宗金鉴》：“妇人血崩梦鬼，隐白灸之皆愈。”',
        pointType: '井木穴',
        fivePhase: '木',
      },
      {
        id: 'point-sp4',
        name: '公孙',
        pinyin: 'Gōngsūn',
        code: 'SP-4',
        meridianId: 'meridian-sp',
        meridianName: '足太阴脾经',
        categoryTags: ['络穴', '八脉交会穴（通冲脉）'],
        position: [1.4, -19.5, 0.2],
        actions: '健脾和胃，宽胸化滞，通达冲脉，调经止痛',
        indications: '胃痛呕吐、心胸脘腹痞闷疼痛、腹胀腹泻、逆气上冲、月经不调',
        location: '足内侧缘，第1跖骨基底的前下方赤白肉际处',
        needling: '直刺0.6~1寸',
        classicalVerse: '《八脉八穴歌》：“公孙冲脉胃心胸。”《席弘赋》：“公孙能祛胃腹病。”',
        pointType: '络穴',
      },
      {
        id: 'point-sp6',
        name: '三阴交',
        pinyin: 'Sānyīnjiāo',
        code: 'SP-6',
        meridianId: 'meridian-sp',
        meridianName: '足太阴脾经',
        categoryTags: ['足三阴经交会穴', '妇科与血分圣穴'],
        position: [2.0, -14.2, -0.3],
        actions: '健脾益胃，调补肝肾，理气活血，统摄经水，养阴除烦',
        indications: '月经不调、痛经崩漏、带下不孕、遗精阳痿、小便不利、失眠神疲',
        location: '小腿内侧，内踝尖上3寸，胫骨内侧缘后际',
        needling: '直刺1~1.5寸。孕妇严禁针刺（行气滑胎）',
        classicalVerse: '《针灸聚英》：“脾肝肾三脉交会，主一切妇人血瘕月水不调。”',
        pointType: '交会穴',
      },
      {
        id: 'point-sp9',
        name: '阴陵泉',
        pinyin: 'Yīnlíngquán',
        code: 'SP-9',
        meridianId: 'meridian-sp',
        meridianName: '足太阴脾经',
        categoryTags: ['合水穴', '利水排湿要穴'],
        position: [2.2, -8.2, -0.2],
        actions: '温中健脾，通调水道，渗湿利水，舒筋活络',
        indications: '腹胀水肿、黄疸、小便不利尿闭、水泻痢疾、带下阴痒、膝关节痛',
        location: '小腿内侧，胫骨内侧髁下缘与胫骨内侧缘之间的凹陷中',
        needling: '直刺1~2寸',
        classicalVerse: '《百症赋》：“阴陵水分，消水肿之膨脝。”',
        pointType: '合水穴',
        fivePhase: '水',
      },
      {
        id: 'point-sp10',
        name: '血海',
        pinyin: 'Xuèhǎi',
        code: 'SP-10',
        meridianId: 'meridian-sp',
        meridianName: '足太阴脾经',
        categoryTags: ['血家要穴'],
        position: [2.5, -5.2, 0.5],
        actions: '化瘀生新，调经统血，凉血祛风，活血通经',
        indications: '月经不调、痛经经闭、湿疹风疹荨麻疹皮炎、股内侧痛',
        location: '大腿内侧，髌底内侧端上2寸，股内侧肌隆起处',
        needling: '直刺1~1.5寸',
        classicalVerse: '《胜玉歌》：“热疮湿毒血海清。”',
        pointType: '经穴',
      }
    ]
  },

  // =========================================================================
  // 5. 手少阴心经 (Heart Meridian, HT)
  // 循行：从胸走手，午时 (11:00 - 13:00)
  // =========================================================================
  {
    id: 'meridian-ht',
    name: '手少阴心经',
    shortName: '心经',
    pinyin: 'Shǒu Shàoyīn Xīnjīng',
    code: 'HT',
    yinYang: '阴经',
    handFoot: '手经',
    color: '#ef4444', // 赤红（心火所主，君主之官）
    twColor: 'text-red-500',
    flowDirection: '从胸走手（起于心中/腋窝极泉，沿上肢内侧后缘下行，止于小指端少冲）',
    circulationOrder: 5,
    timeSlot: '午时 (11:00 - 13:00)',
    interiorOrgan: '属心',
    pairedOrgan: '络小肠',
    startingPoint: '起于心中，出属心系，下膈络小肠。体表起于腋窝中央【极泉穴】',
    terminatingPoint: '止于手小指桡侧端【少冲穴】，并在手小指端接手太阳小肠经',
    pathwayDescription: '《灵枢·经脉》：“心手少阴之脉，起于心中，出属心系，下膈，络小肠。其支者，从心系，上挟咽，系目系。其直者，复从心系，却上肺，下出腋下，下循臑内后廉，行太阴、心主之后，下肘内，循臂内后廉，抵掌后锐骨之端，入掌内后廉，循小指之内，出其端。”',
    keyIndications: '心悸怔忡、心痛胸闷、失眠健忘、癫狂、昏迷发热、咽干上肢内侧后缘痉痛。',
    curvePoints: [
      [5.5, 12.0, 0.2],    // 极泉 (腋窝深处)
      [6.8, 9.5, -0.1],    // 青灵
      [7.8, 6.0, -0.3],    // 少海 (肘横纹内端)
      [8.8, 3.0, -0.4],    // 灵道
      [9.4, 1.2, -0.4],    // 通里/阴郄
      [10.0, -0.8, -0.5],  // 神门 (腕横纹尺侧)
      [10.8, -2.6, -0.5],  // 少府
      [11.5, -4.5, -0.5],  // 少冲 (小指桡侧端)
    ],
    acupoints: [
      {
        id: 'point-ht1',
        name: '极泉',
        pinyin: 'Jíquán',
        code: 'HT-1',
        meridianId: 'meridian-ht',
        meridianName: '手少阴心经',
        categoryTags: ['心经起穴'],
        position: [5.5, 12.0, 0.2],
        actions: '宽胸理气，通经活络，宁心安神',
        indications: '心痛胸痹、心悸怔忡、胁肋疼痛、瘰疬、肩臂挛痛',
        location: '腋窝正中，腋动脉搏动处',
        needling: '避开腋动脉，直刺或斜刺0.5~1寸',
        classicalVerse: '《铜人腧穴针灸图经》：“极泉主心痛干呕，烦渴目黄。”',
        pointType: '起穴',
      },
      {
        id: 'point-ht7',
        name: '神门',
        pinyin: 'Shénmén',
        code: 'HT-7',
        meridianId: 'meridian-ht',
        meridianName: '手少阴心经',
        categoryTags: ['原穴', '五输穴之输土穴', '宁心安神第一要穴'],
        position: [10.0, -0.8, -0.5],
        actions: '补心养血，宁心安神，清火息风，调神和胃',
        indications: '失眠多梦、心悸怔忡、健忘癫狂、胸胁痛、吐血呕血',
        location: '腕掌侧横纹尺侧端，尺侧腕屈肌腱桡侧凹陷中',
        needling: '直刺0.3~0.5寸',
        classicalVerse: '《玉龙歌》：“痴呆之症何穴医，神门独出世间稀。”',
        pointType: '原穴',
        fivePhase: '土',
      },
      {
        id: 'point-ht9',
        name: '少冲',
        pinyin: 'Shàochōng',
        code: 'HT-9',
        meridianId: 'meridian-ht',
        meridianName: '手少阴心经',
        categoryTags: ['井木穴'],
        position: [11.5, -4.5, -0.5],
        actions: '清心泻火，开窍醒神，凉血熄风',
        indications: '心悸心痛、热病神昏昏迷、胸胁痛、小儿惊风',
        location: '手小指末节桡侧，距指甲角旁0.1寸',
        needling: '浅刺0.1寸或点刺放血',
        classicalVerse: '《通玄指要赋》：“少冲除心内之虚烦。”',
        pointType: '井木穴',
        fivePhase: '木',
      }
    ]
  },

  // =========================================================================
  // 6. 手太阳小肠经 (Small Intestine Meridian, SI)
  // 循行：从手走头，未时 (13:00 - 15:00)
  // =========================================================================
  {
    id: 'meridian-si',
    name: '手太阳小肠经',
    shortName: '小肠经',
    pinyin: 'Shǒu Tàiyáng Xiǎochángjīng',
    code: 'SI',
    yinYang: '阳经',
    handFoot: '手经',
    color: '#f43f5e', // 玫瑰红（火府外发，太阳之阳）
    twColor: 'text-rose-400',
    flowDirection: '从手走头（起于小指端少泽，沿上肢外侧后缘上肩背，止于耳前听宫）',
    circulationOrder: 6,
    timeSlot: '未时 (13:00 - 15:00)',
    interiorOrgan: '属小肠',
    pairedOrgan: '络心',
    startingPoint: '起于小指尺侧端【少泽穴】，接手少阴心经',
    terminatingPoint: '止于耳屏前中点微前方【听宫穴】，交足太阳膀胱经',
    pathwayDescription: '《灵枢·经脉》：“小肠手太阳之脉，起于小指之端，循手外侧上腕，出踝中，直上循臂骨下廉，出肘内侧两骨之间，上循臑外后廉，出肩解，绕肩胛，交肩上，入缺盆，络心，循咽下膈，抵胃，属小肠。其支者，从缺盆循颈，上颊，至目锐眦，却入耳中。其支者，别颊上䪼，抵鼻，至目内眦，斜络于颧。”',
    keyIndications: '少腹痛、颈项肩臂外侧后缘剧痛、耳聋耳鸣目黄、颊肿咽痛。',
    curvePoints: [
      [11.8, -4.6, -0.7],  // 少泽
      [10.9, -2.8, -0.7],  // 前谷/后溪
      [10.1, -1.0, -0.7],  // 腕骨/阳谷
      [9.0, 2.5, -0.8],    // 养老/支正
      [7.8, 6.2, -0.8],    // 小海 (肘后鹰嘴与内上髁间)
      [6.4, 10.2, -0.9],   // 肩贞
      [4.8, 12.8, -1.8],   // 臑俞/天宗 (肩胛冈下窝)
      [3.8, 14.5, -1.2],   // 秉风/曲垣
      [2.6, 16.5, 0.4],    // 天窗 (颈外侧)
      [2.0, 18.5, 2.5],    // 颧髎 (目外眦直下)
      [1.6, 20.0, 1.8],    // 听宫 (耳屏前)
    ],
    acupoints: [
      {
        id: 'point-si3',
        name: '后溪',
        pinyin: 'Hòuxī',
        code: 'SI-3',
        meridianId: 'meridian-si',
        meridianName: '手太阳小肠经',
        categoryTags: ['输木穴', '八脉交会穴（通督脉）'],
        position: [10.9, -2.8, -0.7],
        actions: '清心泻火，疏通督脉，散风解表，利脊止痛',
        indications: '落枕颈项强痛、腰脊疼痛痛挛、头痛耳鸣、急性腰扭伤、盗汗癫狂',
        location: '微握拳，第5掌指关节尺侧近端横纹头赤白肉际处',
        needling: '直刺0.5~1寸',
        classicalVerse: '《八脉八穴歌》：“后溪督脉寻颈项。”《通玄指要赋》：“项强不能回顾，后溪刺之立效。”',
        pointType: '输木穴',
        fivePhase: '木',
      },
      {
        id: 'point-si11',
        name: '天宗',
        pinyin: 'Tiānzōng',
        code: 'SI-11',
        meridianId: 'meridian-si',
        meridianName: '手太阳小肠经',
        categoryTags: ['肩背要穴'],
        position: [4.8, 12.8, -1.8],
        actions: '疏散风寒，宽胸利气，通经活络，消肿散结',
        indications: '肩胛背痛、肩周炎五十肩、乳痈乳房胀痛、气喘气逆',
        location: '肩胛部，冈下窝中央凹陷处，天宗与曲垣等呈三角',
        needling: '直刺或斜刺0.5~1寸',
        classicalVerse: '《针灸甲乙经》：“肩重肘臂痛，不可举，天宗主之。”',
        pointType: '经穴',
      },
      {
        id: 'point-si19',
        name: '听宫',
        pinyin: 'Tīnggōng',
        code: 'SI-19',
        meridianId: 'meridian-si',
        meridianName: '手太阳小肠经',
        categoryTags: ['手足少阳、手太阳三经交会穴', '治耳要穴'],
        position: [1.6, 20.0, 1.8],
        actions: '开窍聪耳，清火散热，通络止痛',
        indications: '耳鸣、耳聋暴聋、中耳炎聤耳、齿痛、三叉神经痛',
        location: '耳屏正中前缘，下颌骨髁突后缘，张口时呈明显凹陷处',
        needling: '微张口直刺1~1.5寸',
        classicalVerse: '《百症赋》：“耳聋气闭，听会合于听宫。”',
        pointType: '交会穴',
      }
    ]
  },

  // =========================================================================
  // 7. 足太阳膀胱经 (Bladder Meridian, BL)
  // 循行：从头走足，申时 (15:00 - 17:00)
  // =========================================================================
  {
    id: 'meridian-bl',
    name: '足太阳膀胱经',
    shortName: '膀胱经',
    pinyin: 'Zú Tàiyáng Pángguāngjīng',
    code: 'BL',
    yinYang: '阳经',
    handFoot: '足经',
    color: '#0284c7', // 深海蓝（太阳寒水，水腑浩瀚，穴位最多，贯穿背脊）
    twColor: 'text-sky-500',
    flowDirection: '从头走足（起于目内眦睛明，过头顶下项背，夹脊直下臀腿后侧，止于小脚趾至阴）',
    circulationOrder: 7,
    timeSlot: '申时 (15:00 - 17:00)',
    interiorOrgan: '属膀胱',
    pairedOrgan: '络肾',
    startingPoint: '起于目内眦【睛明穴】，上行额部，交会于百会',
    terminatingPoint: '止于足小趾外侧端【至阴穴】，接足少阴肾经',
    pathwayDescription: '《灵枢·经脉》：“膀胱足太阳之脉，起于目内眦，上额，交巅。其支者，从巅至耳上角。其直者，从巅入络脑，还出别下项，循肩髆内，挟脊抵腰中，入循膂，络肾，属膀胱。其支者，从腰中，下挟脊，贯臀，入腘中。其支者，从肩髆内左右别下贯胛，挟脊内，过髀枢，循髀外后廉下合腘中，以下贯踹内，出外踝之后，循京骨至小指外侧。”',
    keyIndications: '全身外感风寒、头项痛、眼疾、背俞穴调节五脏六腑疾病、腰脊强痛、坐骨神经痛。',
    curvePoints: [
      [0.4, 21.6, 3.4],    // 睛明 (目内眦)
      [0.6, 22.8, 2.8],    // 攒竹
      [0.8, 24.0, 0.4],    // 通天/络却 (头顶)
      [1.2, 18.5, -2.5],   // 天柱 (后项发际)
      [1.5, 16.5, -3.2],   // 大杼 (第1胸椎旁开1.5寸)
      [1.5, 14.5, -3.3],   // 肺俞 (第3胸椎旁)
      [1.5, 12.8, -3.4],   // 心俞 (第5胸椎旁)
      [1.5, 11.0, -3.4],   // 膈俞 (第7胸椎旁)
      [1.5, 8.8, -3.4],    // 肝俞/脾俞
      [1.5, 6.2, -3.2],    // 肾俞 (第2腰椎旁)
      [1.5, 3.8, -3.0],    // 大肠俞
      [1.8, 1.2, -2.8],    // 次髎 (八髎穴之一)
      [2.2, -3.0, -2.2],   // 秩边/承扶 (臀横纹正中)
      [2.2, -8.6, -1.8],   // 委中 (腘窝正中横纹)
      [2.4, -13.8, -1.4],  // 承山 (小腿腓肠肌人字沟)
      [2.8, -19.5, -0.6],  // 昆仑 (外踝后缘凹陷)
      [2.9, -21.5, 0.6],   // 申脉 (外踝直下方)
      [2.6, -23.0, 2.0],   // 至阴 (小趾外侧端)
    ],
    acupoints: [
      {
        id: 'point-bl1',
        name: '睛明',
        pinyin: 'Jīngmíng',
        code: 'BL-1',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['手足太阳、足阳明、阴阳跷脉五脉交会穴', '眼疾第一要穴'],
        position: [0.4, 21.6, 3.4],
        actions: '祛风泄火，清热明日，疏通经络',
        indications: '目赤肿痛、视物模糊近视、白内障夜盲青光眼、迎风流泪、色盲',
        location: '目内眦角稍上方凹陷处',
        needling: '轻压眼球向外，垂直缓慢进针0.5~1寸，不提插捻转，出针后压迫防血肿',
        classicalVerse: '《百症赋》：“睛明贵在平刺消赤障。”',
        pointType: '交会穴',
      },
      {
        id: 'point-bl13',
        name: '肺俞',
        pinyin: 'Fèishū',
        code: 'BL-13',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['肺之背俞穴'],
        position: [1.5, 14.5, -3.3],
        actions: '调补肺气，清泄肺热，平喘止咳，和营宣透',
        indications: '咳嗽哮喘、吐血骨蒸潮热、盗汗自汗、外感发热恶寒、背痛',
        location: '第3胸椎棘突下，后正中线旁开1.5寸',
        needling: '向脊柱方向斜刺0.5~0.8寸，绝不可直刺深刺以防肺气胸',
        classicalVerse: '《针灸甲乙经》：“肺俞主肺气咳逆，上气喘满，背痛胸满。”',
        pointType: '背俞穴',
      },
      {
        id: 'point-bl23',
        name: '肾俞',
        pinyin: 'Shènshū',
        code: 'BL-23',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['肾之背俞穴', '补肾培本第一要穴'],
        position: [1.5, 6.2, -3.2],
        actions: '补肾益精，温阳化气，强健腰膝，聪耳明目',
        indications: '腰痛膝软、遗精阳痿早泄、水肿小便不利、耳鸣耳聋、哮喘虚喘',
        location: '第2腰椎棘突下，后正中线旁开1.5寸（平命门）',
        needling: '直刺或斜刺0.8~1.2寸',
        classicalVerse: '《玉龙歌》：“腰痛虚羸何穴益，神医全仗肾俞调。”',
        pointType: '背俞穴',
      },
      {
        id: 'point-bl40',
        name: '委中',
        pinyin: 'Wěizhōng',
        code: 'BL-40',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['合土穴', '膀胱之下合穴', '四总穴之一'],
        position: [2.2, -8.6, -1.8],
        actions: '舒筋活络，通利腰膝，清热凉血，活血化瘀',
        indications: '急性腰扭伤、慢性腰脊痛、下肢痿痹、丹毒发热、呕吐腹泻、中暑',
        location: '腘窝横纹正中，股二头肌腱与半腱肌腱正中处',
        needling: '直刺1~1.5寸，或三棱针点刺腘窝静脉放血',
        classicalVerse: '《四总穴歌》：“腰背委中求。”《杂病穴法歌》：“腰背痛兮找委中。”',
        pointType: '合土穴/下合穴',
        fivePhase: '土',
      },
      {
        id: 'point-bl57',
        name: '承山',
        pinyin: 'Chéngshān',
        code: 'BL-57',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['经穴', '治痔疮与腓肠肌痉挛专穴'],
        position: [2.4, -13.8, -1.4],
        actions: '舒筋活络，理气化瘀，清降肠热，通导大肠',
        indications: '腓肠肌转筋抽筋、小腿痉挛疼痛、痔疮肿痛出血、便秘、腰腿痛',
        location: '小腿后正中，腓肠肌两肌腹交角下人字纹尖端处，委中与昆仑连线中点',
        needling: '直刺1~2寸，酸胀感极强',
        classicalVerse: '《通玄指要赋》：“承山治转筋与痔疾。”',
        pointType: '经穴',
      },
      {
        id: 'point-bl67',
        name: '至阴',
        pinyin: 'Zhìyīn',
        code: 'BL-67',
        meridianId: 'meridian-bl',
        meridianName: '足太阳膀胱经',
        categoryTags: ['井金穴', '矫正胎位神穴'],
        position: [2.6, -23.0, 2.0],
        actions: '疏风散热，活血调胎，开窍通阳',
        indications: '胎位不正、难产滞产、头痛目痛、鼻塞鼻衄',
        location: '足小趾外侧，距趾甲角旁0.1寸',
        needling: '浅刺0.1寸；矫正胎位首选温和艾灸至阴穴15~20分钟',
        classicalVerse: '《医宗金鉴》：“至阴矫正妇人横产倒产第一神穴。”',
        pointType: '井金穴',
        fivePhase: '金',
      }
    ]
  },

  // =========================================================================
  // 8. 足少阴肾经 (Kidney Meridian, KI)
  // 循行：从足走腹胸，酉时 (17:00 - 19:00)
  // =========================================================================
  {
    id: 'meridian-ki',
    name: '足少阴肾经',
    shortName: '肾经',
    pinyin: 'Zú Shàoyīn Shènjīng',
    code: 'KI',
    yinYang: '阴经',
    handFoot: '足经',
    color: '#06b6d4', // 碧蓝/墨色（肾主水，封藏之本）
    twColor: 'text-cyan-400',
    flowDirection: '从足走腹胸（起于足心涌泉，循内踝后侧，上行下肢内侧后缘，过腹部止于胸部俞府）',
    circulationOrder: 8,
    timeSlot: '酉时 (17:00 - 19:00)',
    interiorOrgan: '属肾',
    pairedOrgan: '络膀胱',
    startingPoint: '起于足小趾下，斜走足底心【涌泉穴】，出于舟骨粗隆下',
    terminatingPoint: '止于锁骨下第1肋间隙【俞府穴】；支脉从肺出注胸中交手厥阴心包经',
    pathwayDescription: '《灵枢·经脉》：“肾足少阴之脉，起于小指之下，邪走足心，出于然谷之下，循内踝之后，别入跟中，以上踹内，出腘内廉，上股内后廉，贯脊属肾，络膀胱。其直者，从肾上贯肝膈，入肺中，循喉咙，挟舌本。其支者，从肺出，络心，注胸中。”',
    keyIndications: '生殖泌尿系统疾病、水肿小便失禁、虚劳精亏、耳鸣耳聋、咽喉肿痛、咳喘喘促。',
    curvePoints: [
      [1.4, -23.5, 0.4],   // 涌泉 (足心前1/3凹陷)
      [1.2, -21.0, 0.0],   // 然谷 (舟骨粗隆下)
      [1.4, -18.5, -0.6],  // 太溪 (内踝后缘凹陷)
      [1.5, -16.8, -0.7],  // 大钟/水泉
      [1.5, -15.0, -0.5],  // 照海/复溜
      [1.6, -11.0, -0.6],  // 筑宾
      [1.8, -7.8, -0.6],   // 阴谷 (腘窝内侧)
      [1.4, 2.0, 2.5],     // 横骨 (耻骨联合上旁开0.5寸)
      [1.2, 5.8, 3.2],     // 大赫/四满
      [1.0, 9.8, 3.4],     // 肓俞 (脐旁0.5寸)
      [1.2, 12.8, 2.8],    // 幽门 (巨阙旁0.5寸)
      [1.6, 14.8, 2.2],    // 步廊/神封
      [1.8, 16.2, 1.8],    // 俞府 (锁骨下缘旁开2寸)
    ],
    acupoints: [
      {
        id: 'point-ki1',
        name: '涌泉',
        pinyin: 'Yǒngquán',
        code: 'KI-1',
        meridianId: 'meridian-ki',
        meridianName: '足少阴肾经',
        categoryTags: ['井木穴', '回阳九针穴', '引火归元第一穴'],
        position: [1.4, -23.5, 0.4],
        actions: '开窍醒神，滋阴降火，引火归元，补肾强阴',
        indications: '昏厥休克、小儿惊风癫狂、头痛眩晕、高血压、咽喉剧痛失音、小便不利',
        location: '足底，屈足卷趾时足前部凹陷中，约当足底第2、3趾缝纹头端与足跟连线的前1/3处',
        needling: '直刺0.5~1寸，灸之引热下行',
        classicalVerse: '《灵枢·本输》：“涌泉者，足心也，为井木。”《玉龙歌》：“顶心头痛引涌泉。”',
        pointType: '井木穴',
        fivePhase: '木',
      },
      {
        id: 'point-ki3',
        name: '太溪',
        pinyin: 'Tàixī',
        code: 'KI-3',
        meridianId: 'meridian-ki',
        meridianName: '足少阴肾经',
        categoryTags: ['原穴', '五输穴之输土穴', '回阳九针穴'],
        position: [1.4, -18.5, -0.6],
        actions: '滋阴益肾，壮阳培元，壮骨清热，调理冲任',
        indications: '头晕耳鸣、失眠健忘、牙齿松动咽痛、腰膝酸痛、遗精阳痿、气喘喘促',
        location: '足内侧，内踝尖与跟腱之间的凹陷中',
        needling: '直刺0.5~1寸',
        classicalVerse: '《针灸大成》：“太溪乃肾之原，滋肾阴壮肾阳，百病无所不治。”',
        pointType: '原穴',
        fivePhase: '土',
      },
      {
        id: 'point-ki6',
        name: '照海',
        pinyin: 'Zhàohǎi',
        code: 'KI-6',
        meridianId: 'meridian-ki',
        meridianName: '足少阴肾经',
        categoryTags: ['八脉交会穴（通阴跷脉）'],
        position: [1.5, -15.0, -0.5],
        actions: '滋肾清热，润喉利咽，调经利尿，宁心安神',
        indications: '咽干喉痛失音、癫痫失眠、月经不调痛经、便秘、小便频数失禁',
        location: '足内侧，内踝尖下1寸凹陷处',
        needling: '直刺0.5~0.8寸',
        classicalVerse: '《八脉八穴歌》：“照海阴跷喉咙隔。”《通玄指要赋》：“便秘照海通其壅。”',
        pointType: '交会穴',
      }
    ]
  },

  // =========================================================================
  // 9. 手厥阴心包经 (Pericardium Meridian, PC)
  // 循行：从胸走手，戌时 (19:00 - 21:00)
  // =========================================================================
  {
    id: 'meridian-pc',
    name: '手厥阴心包经',
    shortName: '心包经',
    pinyin: 'Shǒu Juéyīn Xīnbāojīng',
    code: 'PC',
    yinYang: '阴经',
    handFoot: '手经',
    color: '#a855f7', // 紫红/洋红（代君行事，厥阴阴尽化阳）
    twColor: 'text-purple-400',
    flowDirection: '从胸走手（起于胸中天池，沿上肢内侧正中下行，止于中指端中冲）',
    circulationOrder: 9,
    timeSlot: '戌时 (19:00 - 21:00)',
    interiorOrgan: '属心包',
    pairedOrgan: '络三焦',
    startingPoint: '起于胸中，出属心包络，下膈历络三焦。体表起于乳旁【天池穴】',
    terminatingPoint: '止于手中指末端【中冲穴】；支脉从劳宫走向无名指交手少阳三焦经',
    pathwayDescription: '《灵枢·经脉》：“心主手厥阴心包络之脉，起于胸中，出属心包络，下膈，历络三焦。其支者，循胸出胁，下腋三寸，上抵腋下，循臑内，行太阴、少阴之间，入肘中，下臂，行两筋之间，入掌中，循中指，出其端。其支者，别掌中，循小指次指，出其端。”',
    keyIndications: '心痛胸闷、心悸心慌、胃脘疼痛、恶心呕吐、神昏谵语狂躁、掌心热。',
    curvePoints: [
      [3.8, 12.2, 2.2],    // 天池 (乳外1寸)
      [5.5, 11.0, 1.2],    // 腋前转折
      [6.5, 8.5, 0.4],     // 天泉
      [8.0, 5.8, 0.1],     // 曲泽 (肘横纹正中肱二头肌腱尺侧)
      [9.0, 3.2, -0.1],    // 郄门
      [9.8, 1.2, -0.2],    // 间使
      [10.4, -0.8, -0.2],  // 内关 (腕横纹上2寸两筋间)
      [11.0, -2.0, -0.2],  // 大陵 (腕横纹正中)
      [11.6, -3.2, -0.2],  // 劳宫 (掌心)
      [12.4, -4.8, -0.2],  // 中冲 (中指尖端)
    ],
    acupoints: [
      {
        id: 'point-pc3',
        name: '曲泽',
        pinyin: 'Qūzé',
        code: 'PC-3',
        meridianId: 'meridian-pc',
        meridianName: '手厥阴心包经',
        categoryTags: ['合水穴'],
        position: [8.0, 5.8, 0.1],
        actions: '清暑泄热，降逆止呕，和胃理肠，凉血安神',
        indications: '心痛心悸、急性胃肠炎剧烈呕吐泄泻、中暑发热、肘臂痉挛',
        location: '肘横纹中，肱二头肌腱尺侧缘凹陷中',
        needling: '直刺0.8~1.2寸，或点刺曲泽静脉放血',
        classicalVerse: '《千金方》：“曲泽主心痛呕血，热病烦满。”',
        pointType: '合水穴',
        fivePhase: '水',
      },
      {
        id: 'point-pc6',
        name: '内关',
        pinyin: 'Nèiguān',
        code: 'PC-6',
        meridianId: 'meridian-pc',
        meridianName: '手厥阴心包经',
        categoryTags: ['络穴', '八脉交会穴（通阴维脉）', '四总穴之一', '急救强心圣穴'],
        position: [10.4, -0.8, -0.2],
        actions: '宁心安神，理气止痛，和胃降逆，宽胸顺气，调节心律',
        indications: '心痛冠心病心绞痛、心律失常、恶心呕吐晕车、胃脘痛、失眠郁证癫狂',
        location: '前臂掌面正中，腕横纹上2寸，掌长肌腱与桡侧腕屈肌腱之间',
        needling: '直刺0.5~1寸，常有触电感窜至手指端',
        classicalVerse: '《四总穴歌》：“心胸寻内关。”《八脉八穴歌》：“内关阴维下膈中。”',
        pointType: '络穴',
      },
      {
        id: 'point-pc8',
        name: '劳宫',
        pinyin: 'Láogōng',
        code: 'PC-8',
        meridianId: 'meridian-pc',
        meridianName: '手厥阴心包经',
        categoryTags: ['荥火穴', '十三鬼穴之一'],
        position: [11.6, -3.2, -0.2],
        actions: '清心泻火，熄风凉血，开窍醒神，除烦止渴',
        indications: '中风昏迷、中暑、口舌生疮口臭、掌心发热、癫狂失眠',
        location: '手掌心，握拳屈指时中指尖所点处（第2、3掌骨间）',
        needling: '直刺0.3~0.5寸',
        classicalVerse: '《通玄指要赋》：“劳宫治口臭与舌强。”',
        pointType: '荥火穴',
        fivePhase: '火',
      }
    ]
  },

  // =========================================================================
  // 10. 手少阳三焦经 (Triple Energizer Meridian, TE)
  // 循行：从手走头，亥时 (21:00 - 23:00)
  // =========================================================================
  {
    id: 'meridian-te',
    name: '手少阳三焦经',
    shortName: '三焦经',
    pinyin: 'Shǒu Shàoyáng Sānjiāojīng',
    code: 'TE',
    yinYang: '阳经',
    handFoot: '手经',
    color: '#8b5cf6', // 蓝紫（少阳相火，通会三焦水火之枢纽）
    twColor: 'text-violet-400',
    flowDirection: '从手走头（起于无名指端关冲，循上肢外侧正中，过肩颈耳周，止于眉梢丝竹空）',
    circulationOrder: 10,
    timeSlot: '亥时 (21:00 - 23:00)',
    interiorOrgan: '属三焦',
    pairedOrgan: '络心包',
    startingPoint: '起于无名指尺侧端【关冲穴】，接手厥阴心包经',
    terminatingPoint: '止于眉梢外侧凹陷处【丝竹空穴】，交足少阳胆经',
    pathwayDescription: '《灵枢·经脉》：“三焦手少阳之脉，起于小指次指之端，上出两指之间，循手表腕，出臂外两骨之间，上贯肘，循臑外上肩，而交出足少阳之后，入缺盆，布膻中，散络心包，下膈，循属三焦。其支者，从膻中上出缺盆，上项，系耳后，直上出耳上角，以屈下颊至䪼。其支者，从耳后入耳中，出走耳前，过客主人前，交颊，至目锐眦。”',
    keyIndications: '偏头痛、耳鸣耳聋、咽喉肿痛、目赤肿痛、水肿小便不利、肩臂外侧痉挛疼痛。',
    curvePoints: [
      [11.9, -4.6, -0.4],  // 关冲 (无名指端)
      [11.0, -2.8, -0.4],  // 液门/中渚
      [10.2, -1.0, -0.4],  // 阳池 (腕背横纹中)
      [9.2, 2.5, -0.4],    // 外关 (腕背横纹上2寸两骨间)
      [8.4, 4.2, -0.4],    // 支沟
      [7.4, 7.2, -0.4],    // 天井 (肘尖后上方凹陷)
      [6.2, 10.8, -0.2],   // 消泺/臑会
      [5.0, 13.8, 0.4],    // 肩髎
      [3.2, 16.5, 0.8],    // 天牖 (乳突后下)
      [2.2, 18.2, 1.2],    // 翳风 (耳垂后方)
      [2.0, 19.8, 1.5],    // 角孙 (折耳耳尖上方)
      [1.5, 21.0, 2.8],    // 丝竹空 (眉梢凹陷)
    ],
    acupoints: [
      {
        id: 'point-te5',
        name: '外关',
        pinyin: 'Wàiguān',
        code: 'TE-5',
        meridianId: 'meridian-te',
        meridianName: '手少阳三焦经',
        categoryTags: ['络穴', '八脉交会穴（通阳维脉）'],
        position: [9.2, 2.5, -0.4],
        actions: '疏风解表，解热透郁，聪耳利目，清头通经',
        indications: '风热外感高热、偏头痛、耳聋耳鸣目赤、瘰疬、胁肋疼痛、手颤手臂麻木',
        location: '前臂背面正中，腕背横纹上2寸，尺骨与桡骨之间',
        needling: '直刺0.5~1寸',
        classicalVerse: '《八脉八穴歌》：“外关阳维胆经连。”《席弘赋》：“外关泻动便安康。”',
        pointType: '络穴',
      },
      {
        id: 'point-te6',
        name: '支沟',
        pinyin: 'Zhīgōu',
        code: 'TE-6',
        meridianId: 'meridian-te',
        meridianName: '手少阳三焦经',
        categoryTags: ['经火穴', '治便秘与胁肋痛要穴'],
        position: [8.4, 4.2, -0.4],
        actions: '宣通三焦，利气行郁，通降肠胃，消肿止痛',
        indications: '便秘习惯性便秘、胁肋胀痛、胸膜炎带状疱疹神经痛、耳鸣耳聋、暴瘖失音',
        location: '腕背横纹上3寸，尺骨与桡骨之间',
        needling: '直刺0.8~1.2寸',
        classicalVerse: '《玉龙歌》：“大便秘涩难宣通，若不支沟岂得消。”',
        pointType: '经火穴',
        fivePhase: '火',
      },
      {
        id: 'point-te17',
        name: '翳风',
        pinyin: 'Yìfēng',
        code: 'TE-17',
        meridianId: 'meridian-te',
        meridianName: '手少阳三焦经',
        categoryTags: ['手足少阳交会穴', '治耳聋口眼歪斜第一穴'],
        position: [2.2, 18.2, 1.2],
        actions: '疏风通络，开窍聪耳，息风解痉',
        indications: '耳聋耳鸣、中耳炎、面瘫面神经麻痹、三叉神经痛、痄腮腮腺炎、牙关紧闭',
        location: '耳垂后方，乳突下端前方凹陷中',
        needling: '向对侧内上方斜刺1~1.5寸，避开面神经主干',
        classicalVerse: '《百症赋》：“翳风听会，消耳聩之极痛。”',
        pointType: '交会穴',
      }
    ]
  },

  // =========================================================================
  // 11. 足少阳胆经 (Gallbladder Meridian, GB)
  // 循行：从头走足，子时 (23:00 - 01:00)
  // =========================================================================
  {
    id: 'meridian-gb',
    name: '足少阳胆经',
    shortName: '胆经',
    pinyin: 'Zú Shàoyáng Dǎnjīng',
    code: 'GB',
    yinYang: '阳经',
    handFoot: '足经',
    color: '#10b981', // 青翠绿（春木生发，中正之官，决断所出）
    twColor: 'text-emerald-400',
    flowDirection: '从头走足（起于目外眦瞳子髎，折旋头侧下肩，循体侧腰胯下肢外侧，止于足四趾端窍阴）',
    circulationOrder: 11,
    timeSlot: '子时 (23:00 - 01:00)',
    interiorOrgan: '属胆',
    pairedOrgan: '络肝',
    startingPoint: '起于目外眦【瞳子髎穴】，盘旋头部耳周侧面，下行肩部',
    terminatingPoint: '止于足第4趾外侧端【足窍阴穴】，并交足厥阴肝经',
    pathwayDescription: '《灵枢·经脉》：“胆足少阳之脉，起于目锐眦，上抵头角，下耳后，循颈，行手少阳之前，至肩上，却交出手少阳之后，入缺盆。其支者，从耳后入耳中，出走耳前，至目锐眦后。其支者，别锐眦，下大迎，合于手少阳，抵于䪼，下加颊车，下颈，合缺盆，以下胸中，贯膈，络肝，属胆，循胁里，出气街，绕毛际，横入髀厌中。其直者，从缺盆下腋，循胸，过季胁，下合髀厌中。以下循髀阳，出膝外廉，下外辅骨之前，直下抵绝骨之端，下出外踝之前，循足跗上，入小指次指之间。”',
    keyIndications: '偏头痛、口苦目眩、胸胁胀满疼痛、黄疸、坐骨神经痛、下肢外侧偏瘫麻木。',
    curvePoints: [
      [1.4, 21.0, 3.2],    // 瞳子髎
      [2.2, 22.8, 1.8],    // 悬颅/率谷 (耳上1.5寸)
      [2.2, 19.5, -1.0],   // 完骨/风池 (枕骨下发际两筋间)
      [3.8, 15.2, 0.4],    // 肩井 (大椎与肩峰连线中点)
      [4.2, 11.2, 1.0],    // 渊腋/日月 (胆之募穴)
      [3.8, 7.8, 1.8],     // 京门 (肾之募穴)
      [3.6, 5.0, 1.6],     // 带脉 (章门直下平脐)
      [3.2, 1.2, -1.2],    // 环跳 (股骨大转子后凹陷)
      [3.4, -3.8, 0.8],    // 风市 (立正垂手中指尽处)
      [3.4, -8.5, 0.6],    // 阳陵泉 (腓骨小头前下方)
      [3.5, -13.5, 0.5],   // 光明/悬钟 (外踝上3寸绝骨)
      [3.2, -19.5, 0.8],   // 丘墟 (外踝前下方)
      [3.0, -21.8, 1.4],   // 足临泣 (第4、5跖骨间)
      [2.8, -23.0, 2.0],   // 足窍阴 (第4趾外侧端)
    ],
    acupoints: [
      {
        id: 'point-gb20',
        name: '风池',
        pinyin: 'Fēngchí',
        code: 'GB-20',
        meridianId: 'meridian-gb',
        meridianName: '足少阳胆经',
        categoryTags: ['足少阳、阳维脉交会穴', '祛风熄风第一穴'],
        position: [2.2, 19.5, -1.0],
        actions: '平肝熄风，清头明目，疏风解表，醒脑开窍',
        indications: '外感风寒风热、偏正头痛、眩晕高血压、中风偏瘫、目赤鼻渊、颈项强痛',
        location: '后头枕骨下，斜方肌外缘与胸锁乳突肌内缘之间的凹陷中，平风府',
        needling: '向对侧鼻尖方向微斜刺0.8~1.2寸，严格控制深度角度防止穿刺枕骨大孔伤及延髓',
        classicalVerse: '《玉龙歌》：“偏正头痛最难医，针入风池立见效。”',
        pointType: '交会穴',
      },
      {
        id: 'point-gb21',
        name: '肩井',
        pinyin: 'Jiānjǐng',
        code: 'GB-21',
        meridianId: 'meridian-gb',
        meridianName: '足少阳胆经',
        categoryTags: ['手足少阳、足阳明、阳维脉交会穴'],
        position: [3.8, 15.2, 0.4],
        actions: '祛风通络，活血止痛，宣通气机，通经下乳',
        indications: '肩背剧痛、落枕颈部强直、乳痈乳汁不下、难产滞产、中风不遂',
        location: '肩上，大椎与肩峰连线的中点处',
        needling: '直刺0.5~0.8寸。严禁深刺以防刺穿胸壁刺伤肺尖造成气胸；孕妇严禁针刺',
        classicalVerse: '《百症赋》：“肩井消肩背之重胀。”',
        pointType: '交会穴',
      },
      {
        id: 'point-gb30',
        name: '环跳',
        pinyin: 'Huántiào',
        code: 'GB-30',
        meridianId: 'meridian-gb',
        meridianName: '足少阳胆经',
        categoryTags: ['足少阳、足太阳经交会穴', '治下肢瘫痪坐骨神经痛第一要穴'],
        position: [3.2, 1.2, -1.2],
        actions: '强健腰膝，祛风除湿，舒筋活络，活血止痛',
        indications: '坐骨神经痛、下肢瘫痪痿痹麻木、中风后遗症、风湿痹痛腰胯冷痛',
        location: '侧卧屈股，股骨大转子最凸点与骶管裂孔连线的外1/3与中1/3交点处',
        needling: '用3~4寸粗针直刺2~3寸，酸胀放射感需直达足跟',
        classicalVerse: '《玉龙歌》：“环跳能治腿股风，居髎二穴一般同。”',
        pointType: '交会穴',
      },
      {
        id: 'point-gb34',
        name: '阳陵泉',
        pinyin: 'Yánglíngquán',
        code: 'GB-34',
        meridianId: 'meridian-gb',
        meridianName: '足少阳胆经',
        categoryTags: ['合土穴', '胆之下合穴', '八会穴之筋会'],
        position: [3.4, -8.5, 0.6],
        actions: '疏肝利胆，清热利湿，舒筋活络，缓急止痛',
        indications: '一切筋病（抽筋、转筋、肌肉痉挛、软组织劳损）、胁肋剧痛、黄疸、胆囊炎、下肢瘫痪',
        location: '小腿外侧，腓骨小头前下方凹陷中',
        needling: '直刺1~1.5寸',
        classicalVerse: '《难经·四十五难》：“筋会阳陵泉。”《席弘赋》：“膝痛在表寻独处，膝病在筋阳陵看。”',
        pointType: '合土穴/下合穴/筋会',
        fivePhase: '土',
      }
    ]
  },

  // =========================================================================
  // 12. 足厥阴肝经 (Liver Meridian, LR)
  // 循行：从足走腹胸，丑时 (01:00 - 03:00)
  // =========================================================================
  {
    id: 'meridian-lr',
    name: '足厥阴肝经',
    shortName: '肝经',
    pinyin: 'Zú Juéyīn Gānjīng',
    code: 'LR',
    yinYang: '阴经',
    handFoot: '足经',
    color: '#059669', // 墨绿/碧玉（木之本色，主藏血疏泄）
    twColor: 'text-emerald-500',
    flowDirection: '从足走腹胸（起于大脚趾大敦，循足背上踝，沿下肢内侧中线上腹胸，止于乳下期门）',
    circulationOrder: 12,
    timeSlot: '丑时 (01:00 - 03:00)',
    interiorOrgan: '属肝',
    pairedOrgan: '络胆',
    startingPoint: '起于足大趾丛毛之际【大敦穴】，循足背出太冲，过中封',
    terminatingPoint: '止于乳头直下第6肋间隙【期门穴】；支脉从期门上膈注肺中，循环交手太阴肺经',
    pathwayDescription: '《灵枢·经脉》：“肝足厥阴之脉，起于大指聚毛之际，上循足跗上廉，去内踝一寸，上踝八寸，交出太阴之后，上腘内廉，循股阴，入毛中，环阴器，抵小腹，挟胃，属肝，络胆，上贯膈，布胁肋，循喉咙之后，上入颃颡，连目系，上出额，与督脉会于巅。其支者，从目系下颊里，环唇内。其支者，复从肝别贯膈，上注肺。”',
    keyIndications: '胁肋胀痛、黄疸、头顶痛、疝气少腹痛、经前期综合征、崩漏月经不调、目赤生翳。',
    curvePoints: [
      [1.7, -23.2, 1.8],   // 大敦 (大趾爪甲后丛毛)
      [1.5, -21.8, 1.5],   // 行间
      [1.3, -19.5, 1.0],   // 太冲 (足背第1、2跖骨结合部前)
      [1.4, -18.0, 0.3],   // 中封 (内踝前1寸)
      [1.8, -13.5, 0.0],   // 蠡沟 (内踝上5寸胫骨面上)
      [1.9, -10.5, 0.0],   // 中都
      [2.0, -8.0, 0.0],    // 膝关/曲泉 (膝内侧横纹头凹陷)
      [2.4, -3.8, 0.8],    // 阴包/足五里
      [2.6, 1.5, 2.2],     // 气冲旁/急脉 (环阴器)
      [2.8, 6.8, 2.8],     // 章门 (脾之募穴，第11肋游离端下)
      [2.6, 11.8, 2.4],    // 期门 (肝之募穴，乳下第6肋间)
    ],
    acupoints: [
      {
        id: 'point-lr1',
        name: '大敦',
        pinyin: 'Dàdūn',
        code: 'LR-1',
        meridianId: 'meridian-lr',
        meridianName: '足厥阴肝经',
        categoryTags: ['井木穴', '治疝气与月经崩漏专穴'],
        position: [1.7, -23.2, 1.8],
        actions: '疏肝调气，清利下焦湿热，温经散寒止痛，醒神开窍',
        indications: '疝气睾丸肿痛、功能性子宫出血崩漏、闭经痛经、小儿惊风昏厥、遗尿癃闭',
        location: '足大趾末节外侧，距趾甲角旁0.1寸',
        needling: '斜刺0.1~0.2寸，疝气首选艾柱温灸',
        classicalVerse: '《百症赋》：“大敦疗疝气之冲心。”',
        pointType: '井木穴',
        fivePhase: '木',
      },
      {
        id: 'point-lr2',
        name: '行间',
        pinyin: 'Xíngjiān',
        code: 'LR-2',
        meridianId: 'meridian-lr',
        meridianName: '足厥阴肝经',
        categoryTags: ['荥火穴', '泻肝火专穴'],
        position: [1.5, -21.8, 1.5],
        actions: '泻肝经实火，凉血熄风，清头目，调经水',
        indications: '目赤肿痛、偏头痛头晕、急躁易怒、口苦耳鸣、月经过多经行发狂、癫痫',
        location: '足背，第1、2趾间，趾蹼缘后方赤白肉际处',
        needling: '斜刺0.5~0.8寸',
        classicalVerse: '《通玄指要赋》：“目泪出而行间有功。”',
        pointType: '荥火穴',
        fivePhase: '火',
      },
      {
        id: 'point-lr3',
        name: '太冲',
        pinyin: 'Tàichōng',
        code: 'LR-3',
        meridianId: 'meridian-lr',
        meridianName: '足厥阴肝经',
        categoryTags: ['原穴', '五输穴之输土穴', '四关穴之一（配合谷）'],
        position: [1.3, -19.5, 1.0],
        actions: '平肝熄风，清肝利胆，开郁行气，通络止痛，调和气血',
        indications: '高血压头晕头痛、急躁易怒抑郁胸闷、中风失语偏瘫、面瘫、月经不调痛经、疝气小腹痛',
        location: '足背，第1、2跖骨间，跖骨结合部前方凹陷中，触及动脉搏动处',
        needling: '直刺0.5~1寸，与合谷并称开四关，行气解郁力极强',
        classicalVerse: '《席弘赋》：“行步艰难太冲拔。”《标幽赋》：“观太冲与合谷，行四关而通一身之气。”',
        pointType: '原穴',
        fivePhase: '土',
      },
      {
        id: 'point-lr14',
        name: '期门',
        pinyin: 'Qīmén',
        code: 'LR-14',
        meridianId: 'meridian-lr',
        meridianName: '足厥阴肝经',
        categoryTags: ['肝之募穴', '足厥阴、足太阴、阴维脉三经交会穴', '十二经脉终穴'],
        position: [2.6, 11.8, 2.4],
        actions: '疏肝理气，化痰消积，活血化瘀，和胃降逆',
        indications: '胸胁胀满剧痛、肝气郁结肋痛、肝炎胆囊炎、反酸呕吐、伤寒热入血室',
        location: '胸部，乳头直下，第6肋间隙，前正中线旁开4寸',
        needling: '沿肋间隙向外平刺0.5~0.8寸，不可深刺直刺以防伤及肝脾',
        classicalVerse: '《伤寒论》：“热入血室，刺期门。”《玉龙歌》：“期门穴内把针施，胸胁肋痛自安宁。”',
        pointType: '募穴',
      }
    ]
  }
];
