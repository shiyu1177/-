import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// TCM Knowledge extraction prompt & schema definition
app.post('/api/extract-tcm-knowledge', async (req, res) => {
  const { title, text, userInstructions } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text content is required' });
  }

  // If Gemini API is not configured, send back structured fallback message so frontend can use built-in domain dictionary
  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured',
      fallback: true
    });
  }

  try {
    const prompt = `你是一位精通中医经典（伤寒杂病论、黄帝内经、神农本草经、温病学派）与中医本体知识图谱工程的国家级中医药大数据专家。
请仔细阅读以下中医典籍或文本内容（篇目：《${title || '中医典籍选段'}》），自动提取其中的核心知识点（实体），并根据【分类法】、【主题法】、【关系法】三种知识组织维度构建知识点之间的关系网络。

待提取文本：
"""
${text.slice(0, 7000)}
"""

${userInstructions ? `用户补充提取要求：${userInstructions}` : ''}

要求：
1. 知识点类别（category）必须准确归类为以下之一：
   - "syndrome" (证候/证型，如太阳中风证、脾阳虚证)
   - "formula" (方剂，如桂枝汤、柴胡疏肝散)
   - "herb" (中药/饮片，如桂枝、白芍、生姜)
   - "symptom" (症状/脉舌，如发热恶风、脉浮缓、干呕)
   - "pathology" (病因病机，如营卫不和、风寒外袭)
   - "method" (治法，如解肌发表、调和营卫)
   - "meridian" (经络/脏腑，如膀胱经、脾胃、心神)
   - "theory" (阴阳五行/古典纲要，如六经辨证、卫气营血)

2. 关系组织维度（dimension）分为：
   - "classification" (分类法：包含脏腑归属、八纲归属、功用归类、上下位从属等)
   - "thematic" (主题法：同一辨证论治主题、病变传变链、经典同卷探讨主题)
   - "relational" (关系法：方药配伍君臣佐使、治法针对病机、主治对症、药物归经、五行生克等)

3. 请提取丰富而有中医临床学术价值的节点（10~30个节点）及有向关系边（15~50条关系），并在每一个节点和关系中附带中医原理解释。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookTitle: { type: Type.STRING },
            summary: { type: Type.STRING, description: '典籍本章核心宗旨与学术概要' },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'syndrome | formula | herb | symptom | pathology | method | meridian | theory'
                  },
                  classificationCategory: { type: Type.STRING, description: '在分类法中的上级类目，如解表剂、太阳病、清热凉血' },
                  thematicGroup: { type: Type.STRING, description: '所属研讨主题，如解肌发表与调和营卫、水饮内停' },
                  description: { type: Type.STRING, description: '中医专业内涵解析' },
                  originalQuotes: { type: Type.STRING, description: '书中原文或对应经文依据' },
                  importance: { type: Type.NUMBER, description: '重要性权重 1-10' }
                },
                required: ['id', 'name', 'category', 'description']
              }
            },
            relations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  relationType: { type: Type.STRING, description: '如 配伍君臣、主治、表现为、因果导致、归经、体现治法' },
                  dimension: {
                    type: Type.STRING,
                    description: 'classification | thematic | relational'
                  },
                  description: { type: Type.STRING, description: '该关系的具体中医机理阐述' },
                  weight: { type: Type.NUMBER, description: '关联紧密度 1-5' }
                },
                required: ['source', 'target', 'relationType', 'dimension', 'description']
              }
            }
          },
          required: ['bookTitle', 'summary', 'nodes', 'relations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini extraction error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to extract TCM knowledge graph',
      fallback: true
    });
  }
});

// AI Inference of latent TCM pathology & pharmacological relationships for a specific node
app.post('/api/infer-node-relations', async (req, res) => {
  const { currentNode, candidateNodes, existingRelations, bookTitle } = req.body;

  if (!currentNode || !currentNode.id) {
    return res.status(400).json({ error: 'Current node is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured',
      fallback: true
    });
  }

  try {
    const candidatesSummary = (candidateNodes || [])
      .slice(0, 30)
      .map((n: any) => `ID: ${n.id}, 名称: ${n.name}, 类别: ${n.category}, 描述: ${n.description?.slice(0, 50)}`)
      .join('\n');

    const existingPairs = (existingRelations || [])
      .map((r: any) => `${r.source} <-> ${r.target} (${r.relationType})`)
      .join(', ');

    const prompt = `你是一位精通中医学术精要（伤寒经方、内经脏腑学说、五行生克乘侮、药对气味升降浮沉）的中医知识图谱推理专家。
当前典籍环境：《${bookTitle || '中医典籍'}》。

用户正在重点研习核心节点：
- 名称：【${currentNode.name}】
- 类别：${currentNode.category}
- 核心阐释：${currentNode.description}
- 归经/性味/属性：${JSON.stringify(currentNode.properties || {})}

图谱中已有直接关联包括：${existingPairs || '暂无'}

候选图谱节点列表：
${candidatesSummary}

请深度推理【${currentNode.name}】与图谱中其他节点之间【尚未显式连接、但具有深厚中医理论依据的隐含中医病机关系或配伍协同关系】（例如：脏腑母子相生、五行相克乘侮、脏腑表里同病、气血互根互用、升降相因、引经报使、隐性相畏相使等）。

要求：
1. 推理出 2 ~ 6 条高价值的隐含新关系（每条必须指明关联目标、关系名称如"隐含病机传变"、"气机升降互济"、"五行子盗母气"、"药力协同引经"、以及详细的中医病理学或药理学阐述）。
2. 可酌情推荐 1 个关键的隐含中间病机节点（newLatentNodes，若确有必要引入作为逻辑跳板）。
3. 给出一段精要的中医推理总述（reasoningSummary），阐明为何产生这层深层关联。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reasoningSummary: {
              type: Type.STRING,
              description: '针对当前节点的深度病机与关联推理阐述'
            },
            inferredRelations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING, description: '节点ID' },
                  target: { type: Type.STRING, description: '节点ID' },
                  relationType: { type: Type.STRING, description: '隐含关系类型，如 隐含病机传变、气机互济、五行乘侮' },
                  dimension: {
                    type: Type.STRING,
                    description: 'relational | thematic | classification'
                  },
                  description: { type: Type.STRING, description: '具体中医医理解释' },
                  weight: { type: Type.NUMBER, description: '关联紧密度 1-5' }
                },
                required: ['source', 'target', 'relationType', 'dimension', 'description']
              }
            },
            newLatentNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'pathology | method | theory | syndrome'
                  },
                  classificationCategory: { type: Type.STRING },
                  thematicGroup: { type: Type.STRING },
                  description: { type: Type.STRING },
                  importance: { type: Type.NUMBER }
                },
                required: ['id', 'name', 'category', 'description']
              }
            }
          },
          required: ['reasoningSummary', 'inferredRelations']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini latent relation inference error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to infer latent TCM relations',
      fallback: true
    });
  }
});

// AI Enrichment for single TCM node's deep clinical explanation & structured attributes
app.post('/api/enrich-node-details', async (req, res) => {
  const { node, bookTitle } = req.body;

  if (!node || !node.name) {
    return res.status(400).json({ error: 'Node with name is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured',
      fallback: true
    });
  }

  try {
    const prompt = `你是一位精通《中医诊断学》、《方剂学》、《中药学》及中医临床各科的资深中医大师。
请针对以下中医知识实体进行深度、权威、结构化的临床与典籍属性补充：
- 知识实体名称：【${node.name}】
- 知识门类：${node.category} (syndrome: 证候证型 | formula: 经典方剂 | herb: 本草中药 | symptom: 症状体征 | method: 治法 | meridian: 经络脏腑 | pathology: 病机 | theory: 理论纲领)
- 当前简述：${node.description || '无'}
- 出处环境：《${bookTitle || '中医典籍'}》

请严格根据中医学科规范提供：
1. 若为【证候证型】：提供精准权威定义、辨证要点（核心舌脉体征）、推荐首选经典治方、对应治则治法、深层病机演变。
2. 若为【经典方剂】：提供完整配伍组成与君臣佐使清单（每味药名称、角色如君/臣/佐/使、剂量、配伍配对机理）、功用治法、主治病证、煎服法（如温覆微汗等）、临床使用禁忌与加减化裁。
3. 若为【本草中药】：提供标准四气五味、药力归经、核心功效、临床主治病证、常规用法用量、配伍禁忌与注意事项（如十八反十九畏、慎用体质）。
4. 若为其他类别（经络/治法/症状/病机/理论）：提供对应的中医专业定义、临床应用要点、关联名方与病理机制。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedDefinition: { type: Type.STRING, description: '权威详尽的中医学术定义与内涵' },
            nature: { type: Type.STRING, description: '四气五味，如 辛、甘，温' },
            meridianTropism: { type: Type.STRING, description: '归经，如 心、肺、膀胱经' },
            compositionRole: { type: Type.STRING, description: '配伍位次：君药/臣药/佐药/使药' },
            syndromeType: { type: Type.STRING, description: '八纲表里，如 表虚证、阳明里实热证' },
            organAffiliation: { type: Type.STRING, description: '脏腑经络所主' },
            actions: { type: Type.STRING, description: '核心功效，如 解肌发表，调和营卫' },
            indications: { type: Type.STRING, description: '临床主治，如 太阳中风表虚证，发热头痛，汗出恶风' },
            therapeuticMethod: { type: Type.STRING, description: '治则治法' },
            diagnosticPoints: { type: Type.STRING, description: '辨证要点，如 汗出恶风，脉浮缓' },
            dosageUsage: { type: Type.STRING, description: '用法用量或煎服法说明' },
            precautions: { type: Type.STRING, description: '使用注意事项与配伍禁忌' },
            pathogenesisAnalysis: { type: Type.STRING, description: '深层病因病机与转化机制' },
            variations: { type: Type.STRING, description: '加减化裁' },
            treatsFormulas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '证候对应的推荐治疗经典方剂列表'
            },
            compositionList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  herbName: { type: Type.STRING },
                  role: { type: Type.STRING, description: '君 / 臣 / 佐 / 使' },
                  dosage: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ['herbName', 'role']
              },
              description: '方剂君臣佐使清单'
            }
          },
          required: ['detailedDefinition']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini node enrichment error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to enrich TCM node details',
      fallback: true
    });
  }
});

// Search authoritative TCM classical literature citations and modern research reviews
app.post('/api/search-tcm-literature', async (req, res) => {
  const { node, bookTitle } = req.body;

  if (!node || !node.name) {
    return res.status(400).json({ error: 'Node with name is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured',
      fallback: true
    });
  }

  try {
    const prompt = `你是一位权威的中医药文献考证学家与中药现代药理学首席研究员。
用户正在研读中医知识实体：【${node.name}】（类别：${node.category}，简述：${node.description}，典籍背景：《${bookTitle || '中医典籍'}》）。

请检索并匹配权威中医药古籍文献库（如《黄帝内经》、《伤寒杂病论》、《神农本草经》、《金匮要略》、《温病条辨》、《本草纲目》、《医宗金鉴》等）与现代中医药药理学术期刊库，输出两部分权威文献内容：
1. 【权威古籍经典原文摘录与名医按语】（2~4条）：
   - 出处典籍（书名、朝代与作者）
   - 卷次篇章条目
   - 经典原文摘录
   - 历代名家经典按语（如成无己、柯琴、张锡纯、李时珍等按语）
   - 经旨要义解读

2. 【现代科学研究与临床综述】（2~3条）：
   - 研究主题方向（如药效物质基础、受体靶点机制、免疫/代谢调控、神经内分泌机制等）
   - 现代有效成分与化学物质基础（如桂枝醛、芍药苷、黄芪多糖、人参皂苷等）
   - 现代药理机制与实验证据
   - 现代临床循证医学应用（如呼吸道感染、心血管保护、微循环改善等）
   - 权威学术期刊或现代专科共识来源与发表年份`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodeName: { type: Type.STRING },
            classicalCitations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sourceBook: { type: Type.STRING, description: '典籍名称，如《伤寒论》' },
                  dynastyAndAuthor: { type: Type.STRING, description: '朝代与医家，如 汉 · 张仲景' },
                  chapter: { type: Type.STRING, description: '篇章卷次与条文号' },
                  originalText: { type: Type.STRING, description: '古籍经文原文' },
                  doctorCommentary: { type: Type.STRING, description: '历代名医权威按语考证' },
                  medicalSignificance: { type: Type.STRING, description: '医理临床要义' }
                },
                required: ['sourceBook', 'dynastyAndAuthor', 'chapter', 'originalText', 'medicalSignificance']
              }
            },
            modernResearchReviews: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING, description: '科研主题与机制方向' },
                  chemicalBases: { type: Type.STRING, description: '有效成分与药效物质基础' },
                  pharmacologicalAction: { type: Type.STRING, description: '现代生物学与药理学作用机理' },
                  clinicalEvidence: { type: Type.STRING, description: '临床循证治疗适应证' },
                  journalOrSource: { type: Type.STRING, description: '期刊来源或现代指南' },
                  publicationYear: { type: Type.STRING, description: '发表年份' }
                },
                required: ['topic', 'pharmacologicalAction', 'journalOrSource']
              }
            }
          },
          required: ['nodeName', 'classicalCitations', 'modernResearchReviews']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini literature search error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to search TCM literature citations',
      fallback: true
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
