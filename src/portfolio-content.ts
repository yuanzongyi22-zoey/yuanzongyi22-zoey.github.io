import type { NativeVisual } from './CaseVisuals'
import { baiduChapters } from './baidu-content'
import type { InternshipVisual } from './InternshipVisuals'

export type Figure = { src: string; alt: string; caption: string; sourcePage: number; width: number; height: number }
export type Evidence = { title: string; description: string }
export type CaseStory = { situation: string; task: string; actions: { title: string; body: string }[]; result: string; takeaway: string }
export type CaseImage = { src: string; alt: string; caption: string; kind: '交互设计' | 'UI界面' | '产品界面' | '流程设计'; width: number; height: number }
export type Prototype = { src: string; title: string; description: string; format: 'desktop' | 'mobile' }
export type Chapter = { title: string; english: string; paragraphs: string[]; pages: number[]; group?: string; nativeVisual?: NativeVisual; internshipVisual?: InternshipVisual; figures?: Figure[]; blocks?: { label: string; body: string }[]; evidence?: Evidence[]; evidenceNote?: string; story?: CaseStory; gallery?: CaseImage[]; prototype?: Prototype }
export type Entry = { id: string; number: string; title: string; type: string; description: string; color: string; mark: string; kind: 'internship' | 'project' | 'photography' | 'personal'; date?: string; role?: string; cover?: string; sourceNote?: string; chapters?: Chapter[] }

// Draft case-study copy based on the owner's resume and original portfolio. Image crops cite their source pages; unverified effects remain design intentions.
export const internships: Entry[] = [
  {
    "id": "ai",
    "number": "01",
    "title": "百度 · AI 工具产品经理",
    "type": "PSIG-AI生态产研组",
    "description": "to B负责百度网盘AI修图客户端的优化，提升全链路使用效率和体验感；to C负责百度网盘照片直播软件的功能优化和用户增长。",
    "color": "#b28fe7",
    "mark": "BAIDU",
    "kind": "internship",
    "date": "2026.08—2026.11",
    "role": "AI工具产品经理",
    "chapters": baiduChapters
  },
  {
    "id": "mobile",
    "number": "02",
    "title": "联想 · AI 产品经理",
    "type": "中国区 moto 手机事业部",
    "description": "手机部门2026年razr fold和razr70系列新品功能规划及AI软件升级，计划用AI体验和AI软件作为新款手机的卖点，提高市场竞争力。",
    "color": "#d8b66d",
    "mark": "MOTO",
    "kind": "internship",
    "date": "2025.11—2026.04",
    "role": "AI产品经理",
    "chapters": [
      {
        "title": "项目背景",
        "english": "Context",
        "paragraphs": [
          "手机部门2026年razr fold和razr70系列新品功能规划及AI软件升级，计划用AI体验和AI软件作为新款手机的卖点，提高市场竞争力。"
        ],
        "pages": []
      },
      {
        "title": "AI 场景与能力",
        "english": "AI planning",
        "paragraphs": [
          "聚焦手机用户日常使用中的AI体验需求，以提升用户体验、丰富手机AI应用场景、提高声量和销量为目的，构建场景化AI功能体系。负责AI功能的策略规划与核心功能拆解，明确功能目标与优先级，推动AI妙记、AI生图和视频、AI游戏助手、AI手写笔、AI外屏萌宠、AI识屏6大类核心功能从需求梳理、方案设计到最终上线的全流程落地。"
        ],
        "pages": []
      },
      {
        "title": "竞品与市场洞察",
        "english": "Market insights",
        "paragraphs": [
          "对华为等5家厂商的系统AI功能竞品分析并挖掘用户痛点，聚焦同声传译、多模态纪要、AI圈选问答等15+个关键场景，提炼差异化机会点，输出策略报告支撑产品规划，使用figma和墨刀绘制软件功能演示页面20+，产出PRD文档，并成功推动五大类功能立项。"
        ],
        "pages": []
      },
      {
        "title": "用户需求调研",
        "english": "User research",
        "paragraphs": [
          "为了挖掘新老用户使用体验痛点并优化体验，发放500份在线定性问卷，对15个外部用户和15内部用户深度访谈，AI结合人工处理10,000+条用户原声，深度使用并测试产品软件，提炼并总结出20+产品需求，提出6条bug和待优化功能，均已被采纳并完成迭代优化更新。"
        ],
        "pages": []
      },
      {
        "title": "策略信息体系",
        "english": "Knowledge system",
        "paragraphs": [
          "针对竞品信息分散、更新滞后、复用性低的问题，基于飞书搭建竞品参数自动更新表单、看板及roadmap，实现竞品信息的集中管理，提升跨部门对齐效率，节约30%对齐时间，提高信息复用率达到25%。"
        ],
        "pages": []
      },
      {
        "title": "项目成果",
        "english": "Outcomes",
        "paragraphs": [
          "上述AI软件功能已投入使用，AI手写笔和razr fold系列在5月已发布售卖，搭载手写笔的大折叠屏在声量上是razr60的3倍。搭载AI妙记、AI影像、AI看世界等功能的2026新款手机声量ROI从2.34提升至6.37，实现翻倍。"
        ],
        "pages": []
      }
    ]
  }
]

export const projects: Entry[] = [
  {
    "id": "earlybird",
    "number": "01",
    "title": "早早鸟",
    "type": "产品设计 / UI / 服务设计",
    "description": "围绕大学生早餐中的时间、选择与反馈问题，设计早餐预约小程序、智能无人餐车及配套服务。",
    "color": "#e8b879",
    "mark": "MORNING BIRD",
    "kind": "project",
    "date": "2024.04—2024.06",
    "role": "团队项目｜前期调研、UI低保真高保真、服务体系设计、产品草图和建模",
    "chapters": [
      {
        "title": "先理解，为什么不吃早餐",
        "english": "The problem",
        "paragraphs": [
          "项目从大学生不规律的早餐习惯切入。但“不吃早餐”并不只有一个原因：起床晚、到食堂绕路、排队、选择有限，以及对口味和健康搭配的不满意，会在同一段早晨叠加。",
          "团队收回203份有效问卷，并访谈10位大学生、3位食堂工作人员和1位食品专家。我的工作包括前期调研，把学生的用餐体验与食堂的供餐压力放在同一条流程里看。",
          "调研最终归纳出8项需求。方案既要让学生更方便地吃到早餐，也要考虑食堂如何准备、配送，以及如何接收用餐后的反馈。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "breakfast-research"
      },
      {
        "title": "把订餐、配送与反馈接起来",
        "english": "The service",
        "paragraphs": [
          "我用用户流程和5 Why继续追问不吃早餐的原因，再结合双钻模型整理痛点与机会。方案由此收敛为“小程序＋智能无人餐车”：用预约减少早晨临时选择的负担，用集中配送缩短取餐路径。",
          "服务不是在下单后结束。利益相关者地图与服务蓝图把学生、食堂、运营者和餐车串在一起：预约信息进入后厨，餐品打包入舱，送达后扫码取餐，最后再把评价与建议反馈给食堂。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "service-blueprint"
      },
      {
        "title": "让关键动作在界面里可见",
        "english": "The interface",
        "paragraphs": [
          "小程序分为早餐预定与评价、个性化食谱、社区打卡和“我的”四个板块。我参与信息架构、设计规范、24个低保真页面，以及高保真设计和视觉优化。",
          "首页把预定早餐、取餐信息和评价放在主要位置；食谱页组织个性化搭配；社区通过组队打卡和活动回应“缺少早餐习惯”的问题。这些功能分别对应调研中的便捷、选择与持续行动需求。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/earlybird-ui.webp",
            "alt": "从低保真到高保真：早餐预定、订单、取餐信息与评价。",
            "caption": "从低保真到高保真：早餐预定、订单、取餐信息与评价。",
            "sourcePage": 10,
            "width": 2171,
            "height": 1291
          }
        ]
      },
      {
        "title": "从屏幕延伸到取餐现场",
        "english": "The product",
        "paragraphs": [
          "硬件部分把食品舱与调度车分开：调度车完成配送与回收，食品舱在宿舍楼下承担取餐。扫码后，对应餐品通过舱内旋转与传送结构送至出口。这里呈现的是设计方案与结构推演。",
          "我参与产品草图、建模与服务体系设计。团队对5个点餐App和5家物流无人车进行竞品分析，并形成完整商业计划书。项目获米兰设计周二等奖、iCAN创新创业大赛二等奖；当前成果包括服务方案、界面、产品建模与商业计划书。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/earlybird-scene.webp",
            "alt": "服务场景：食品舱配送、摆放与学生取餐。",
            "caption": "服务场景：食品舱配送、摆放与学生取餐。",
            "sourcePage": 13,
            "width": 2089,
            "height": 1393
          },
          {
            "src": "/project-figures/earlybird-product.webp",
            "alt": "餐车与食品舱的组合方案及产品细节。",
            "caption": "餐车与食品舱的组合方案及产品细节。",
            "sourcePage": 14,
            "width": 2089,
            "height": 1320
          }
        ]
      }
    ],
    "sourceNote": "项目时间：纸质作品集记录2024.04—2024.06，简历记录2024.02—2024.07，后续统一。"
  },
  {
    "id": "eimusic",
    "number": "02",
    "title": "Ei Music",
    "type": "产品设计 / UI 设计",
    "description": "把日常采样、模块化创作与音乐分享连接起来，让不熟悉专业软件的音乐爱好者也能尝试表达。",
    "color": "#b9a7ed",
    "mark": "Ei Music",
    "kind": "project",
    "date": "2023.10—2023.12",
    "role": "个人项目",
    "chapters": [
      {
        "title": "喜欢音乐，为什么没有开始创作",
        "english": "The question",
        "paragraphs": [
          "Ei Music关注音乐爱好者从“听”走向“做”的阻力。作品集中的问卷与访谈反复出现几类问题：不懂乐理、专业软件难上手、灵感来时来不及记录，以及创作和分享分散在不同工具里。",
          "我把问题分成两层：操作层面需要减少软件和乐器的学习负担，体验层面则需要让尝试本身更有趣，并为交流留下入口。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "music-insights"
      },
      {
        "title": "用三类模块组织创作",
        "english": "The system",
        "paragraphs": [
          "方案把创作拆成采样、处理与组合。采样模块负责记录真实声音，处理模块对音轨做调整，创作模块则把音轨组合到时间线里。手机端承接记录、管理和分享。",
          "我尝试用摆放、旋转、按压和类似盖章的动作连接硬件与软件，让部分原本藏在菜单里的操作变成看得见、摸得到的动作。AI被用于采样处理和创作辅助，而不是替代所有创作选择。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/music-hardware.webp",
            "alt": "硬件外观、模块组合与实体交互细节。",
            "caption": "硬件外观、模块组合与实体交互细节。",
            "sourcePage": 19,
            "width": 1311,
            "height": 1393
          }
        ],
        "nativeVisual": "music-system"
      },
      {
        "title": "让声音留得住，也分享得出去",
        "english": "The experience",
        "paragraphs": [
          "App分为创意空间、AI实验室、互动与社区、乐器乐理四个部分。创意空间管理项目与采样，AI实验室探索声音和图片到音乐的转换，社区承接小组创作、素材共享与互动。",
          "硬件与App围绕同一份创作记录协作：户外采样可以回到创作库继续处理，完成的音乐可以进入社区，也可以成为送给朋友的声音礼物。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/music-interface.webp",
            "alt": "App功能：创作库、AI实验室、互动社区与乐理学习。",
            "caption": "App功能：创作库、AI实验室、互动社区与乐理学习。",
            "sourcePage": 20,
            "width": 2200,
            "height": 736
          }
        ]
      },
      {
        "title": "把交互拿到手里试一试",
        "english": "The prototype",
        "paragraphs": [
          "我制作了3D打印模型，并结合人机尺寸分析检查模块大小和操作方式。作品集记录邀请10位同学体验模型、模拟使用场景，观察交互状态与操作行为。",
          "模型体验用于初步检查尺寸与交互可操作性；AI功能与多人协作目前以方案和界面形式呈现。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/music-scenes.webp",
            "alt": "音乐采样、分享与共同创作的场景设想。",
            "caption": "音乐采样、分享与共同创作的场景设想。",
            "sourcePage": 21,
            "width": 2048,
            "height": 1393
          }
        ]
      }
    ]
  },
  {
    "id": "oldtravel",
    "number": "03",
    "title": "老友行",
    "type": "产品设计 / 旅行安全",
    "description": "从老年游客与导游的双重需求出发，设计老人端、导游端与急救端，连接讲解、联络和出行支持。",
    "color": "#d8b66d",
    "mark": "OLD TRAVEL",
    "kind": "project",
    "date": "2024.02—2024.05",
    "role": "个人项目｜河海大学",
    "chapters": [
      {
        "title": "旅行中的不安，来自哪里",
        "english": "The context",
        "paragraphs": [
          "老友行关注老年人跟团旅行中的安全与沟通体验。对游客来说，找不到集合点、听不清讲解、自由活动时联系不上导游都可能变成负担；导游则需要在集体安排与个体需求之间协调。",
          "我通过小红书、抖音、携程旅行和飞猪寻找目标用户，共邀请83位用户填写问卷，其中导游占30%、游客占70%，并进一步访谈老人和旅行从业者。",
          "调研把需求指向了快速联络、位置查询、集合提醒和应急支持。设计因此围绕整段旅行的协作，而不是只增加一个报警按钮。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "travel-research"
      },
      {
        "title": "三端协作，各自承担什么",
        "english": "The roles",
        "paragraphs": [
          "方案由老人端、导游端和急救端组成。老人端承接讲解、地图、集合提醒与联系导游；导游端帮助组织行程和联络；急救端集中承载应急用品及相关操作信息。",
          "我用需求聚类与功能架构区分各端的职责，再把这些触点放回旅行场景中检查：自由活动如何获知集合信息，遇到问题时如何联系，导游如何找到需要帮助的人。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "travel-system"
      },
      {
        "title": "先用纸模型检查场景",
        "english": "The rehearsal",
        "paragraphs": [
          "在确定外形前，我用硬卡纸和纸箱制作实体模型，把故事板变成可以演示的旅行场景。模拟关注佩戴、按键、重量、箱体开合和物品布局。",
          "作品集记录了模拟后的调整：不在老人设备中放置急速救心丸和创可贴，取消急救端为老人端充电的太阳能板，改为增加车载时钟基座与无线充电。这些调整来自纸模型阶段的情境模拟。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "travel-rehearsal"
      },
      {
        "title": "把提示做得直接一些",
        "english": "The design",
        "paragraphs": [
          "最终方案使用白色与橙色区分主体和提示区域。老人端保留SOS紧急呼叫、旋转音量调节、伸缩耳机和集合倒计时；导游与急救端承担不同的管理和信息展示任务。",
          "设计重点是让信息在具体场景中可见：自由活动时看地图，集合前看倒计时，需要联络时用直接的按键。当前材料包括草图、渲染、功能说明和场景模型。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/travel-devices.webp",
            "alt": "老人端的佩戴、按键与提示方式。",
            "caption": "老人端的佩戴、按键与提示方式。",
            "sourcePage": 28,
            "width": 2089,
            "height": 1393
          },
          {
            "src": "/project-figures/travel-final.webp",
            "alt": "三端设备的组合与整体方案。",
            "caption": "三端设备的组合与整体方案。",
            "sourcePage": 29,
            "width": 2200,
            "height": 1100
          }
        ]
      }
    ]
  },
  {
    "id": "noselover",
    "number": "04",
    "title": "NOSE Lover",
    "type": "产品设计 / 儿童洗鼻器",
    "description": "围绕儿童与家长的使用感受，探索洗鼻器的握持、操作、外观和清洁收纳，形成负压式产品设计概念。",
    "color": "#a9c9e7",
    "mark": "NOSE Lover",
    "kind": "project",
    "date": "2024.04—2024.06",
    "role": "团队项目｜前期调研、设计方案、人机分析、渲染",
    "chapters": [
      {
        "title": "把儿童和家长一起纳入使用过程",
        "english": "The users",
        "paragraphs": [
          "NOSE Lover从儿童对洗鼻过程的抗拒与家长的操作负担切入。我参与前期调研、方案、人机分析与渲染；团队同时关注外观感受、握持操作以及清洁和收纳。",
          "作品集整理了医生与家长的访谈、儿童同理心地图及用户画像。调研中的设计问题包括儿童害怕操作、需要家长协助、器具难清洁，以及如何让日常使用更容易接受。这些观察成为外观、握持与操作流程的设计输入。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "nose-comparison"
      },
      {
        "title": "让外观与操作同时回应情绪",
        "english": "The direction",
        "paragraphs": [
          "团队把圆润形态、柔和色彩与较直接的开关操作作为方案方向，尝试减轻传统器械带来的严肃感。粉色与蓝色分别用于不同外观方案，材料与表面细节服务于握持和视觉体验。",
          "负压方式是项目的技术设想，外观、结构与使用流程围绕这一方向展开。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/nose-sketches.webp",
            "alt": "形态探索与CMF：圆润轮廓、色彩及材质方向。",
            "caption": "形态探索与CMF：圆润轮廓、色彩及材质方向。",
            "sourcePage": 33,
            "width": 2048,
            "height": 1393
          }
        ]
      },
      {
        "title": "从模型体验回到尺寸调整",
        "english": "The ergonomics",
        "paragraphs": [
          "团队把初始模型3D打印后进行情境模拟和使用体验，再结合人机数据调整尺寸与结构。我参与的人机分析同时考虑儿童和成人，因为实际使用中家长也会帮助操作。",
          "原稿记录了圆形开关的按压设计，以及握持直径由58mm调整为60mm的过程。尺寸调整对应本次模型与人机分析的记录。"
        ],
        "pages": [],
        "figures": [
          {
            "src": "/project-figures/nose-model-gallery.webp",
            "alt": "NOSE Lover的蓝色3D打印模型，以及拿取和握持的记录照片。",
            "caption": "原稿中的3D打印模型与握持情景记录。",
            "sourcePage": 33,
            "width": 1180,
            "height": 1020
          }
        ],
        "nativeVisual": "nose-ergonomics"
      },
      {
        "title": "把收纳和清洁也纳入流程",
        "english": "The routine",
        "paragraphs": [
          "方案把取用、加液、操作、拆洗和归位组织为一条完整流程，并为充电、收纳、干燥等环节预留空间。目的在于把家长日常需要处理的动作一起纳入产品，而不是只设计使用中的那一刻。",
          "现阶段成果包括产品概念、渲染、3D打印模型与人机分析，验证范围集中在形体和操作体验；医疗性能尚未验证。"
        ],
        "pages": [],
        "figures": [],
        "nativeVisual": "nose-routine"
      }
    ]
  }
]
