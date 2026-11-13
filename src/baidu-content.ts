import type { Chapter, CaseStory } from './portfolio-content'

const business = 'To B · 百度网盘 AI 修图客户端'
const consumer = 'To C · 百度网盘照片直播 App'

const feature = (title: string, english: string, group: string, story: CaseStory, extra: Partial<Chapter> = {}): Chapter => ({
  title,
  english,
  group,
  story,
  paragraphs: [],
  pages: [],
  ...extra,
})

export const baiduChapters: Chapter[] = [
  feature('百度网盘 AI 修图客户端——功能优化', 'AI retouching client', business, {
    situation: '产品面向影楼、独立摄影师、摄影工作室等行业从业者，目标是覆盖筛分选片、AI 修图与交付的完整流程，提高用户使用体验和工作效率。',
    task: '从竞品、用户调研、客诉与业务数据中找到影响全链路效率的问题，明确优先级，并推动需求从分析、PRD到交互原型和版本验证。',
    actions: [
      {
        title: '竞品分析与需求洞察',
        points: [
          '系统拆解 Evoto、像素蛋糕、Imagen、Aftershoot、Retouch4me 等软件的功能与使用工作流。',
          '参与线下实地调研15家影楼，线上分析1,431条客诉卡片。',
          '识别选片能力扩展、多人智能识别及导出分享等问题，形成10项待优化需求。',
        ]
      },
      {
        title: '围绕版本迭代推进功能优化',
        points: [
          '累计参与5个版本迭代，撰写共16份PRD。',
          '推进导出、预设、快捷键交互、启动程序检验、企业控制台等需求。',
          '重点完成导出水印设置及文件位置、预设面板视觉与标签逻辑、保存筛选机制等方案。',
          '用 Codex 输出可交互原型，提升内部验证与沟通效率约50%。',
        ]
      },
      {
        title: '从具体功能延伸到行业工作流',
        points: [
          '针对影楼订单、原片、初修、选片备注、精修与制作分散在不同工具的问题，提出摄影行业 Agent 客户端方案。',
          '把订单、图片范围、任务执行和人工确认组织到同一条路径中。',
          '完成可交互原型探索。',
        ]
      }
    ],
    result: '优化导出水印后，导出完成率由70.47%提升至92.85%（+22.38 PP）；预设相关客诉率减少60%；AI修图客户端平均 DAU 达6,794，周环比增长2.74%，服务超过6,000家企业。',
    takeaway: '专业影像工具的效率来自完整链路：识别只是开始，用户还需要顺利修正、整理、导出并完成交付。'
  }, {
    internshipVisual: 'complaints',
    prototype: {
      src: 'https://yuanzongyi22-zoey.github.io/ai-photo-pc/#home',
      title: 'AI 修图客户端 · 可交互原型',
      description: '用 AI Coding 搭建的修图客户端原型，可在页面内直接点击体验。',
      format: 'desktop'
    },
  }),
  feature('百度网盘 APP｜照片直播', 'Photo live app', consumer, {
    situation: '百度网盘约80%的用户来自影像从业者。为了拓宽影像行业应用场景，产品从照片直播切入，持续优化摄影师从拍摄、导入、整理到分享的现场体验。',
    task: '围绕照片直播的真实场景，补齐导入、联机、水印、权益和数据分析等能力，验证用户需求并推动功能落地。',
    actions: [
      {
        title: '从场景与竞品中找到机会',
        points: [
          '对像素芝士、拍立享、喂图、一拍即传等 App 进行横向对比，分析百度网盘整体生态与储存空间优势。',
          '结合用户反馈和使用体验调研，发现摄影现场中图片混乱、水印不合理、联机受线缆限制等问题。',
        ]
      },
      {
        title: '完善照片直播工作流',
        points: [
          '参与存储卡导入、断连补传、多格式处理、App 水印配置、权益领取与帮助入口等需求。',
          '明确设备检测、失败重试、草稿与已应用状态、存量与后续照片更新等规则。',
          '调研3家竞品及 FTP、HTTP、SDK 方案，提出从0到1的联机 App 策略。',
        ]
      },
      {
        title: '用原型和数据验证方案',
        points: [
          '参与 PRD 撰写、评审与排期，与交互、UI、双端研发协作推进迭代。',
          '使用 AI Coding 搭建 FTP 联机原型。',
          '基于访问、创建和购买数据拆分复访用户与页面状态，为后续增长和体验优化建立分析基础。',
        ]
      }
    ],
    result: '照片直播于7月底上线，累计用户达到3,000家企业；围绕联机拍摄、照片导入、水印和权益体验形成完整需求与原型，部分功能已投入客户灰度使用并获得超过90%的正向反馈。',
    takeaway: '照片直播不只是把照片传上来，还要让现场的人知道连接是否正常、照片是否完整、接下来如何整理和交付。'
  }, {
    prototype: {
      src: 'https://yuanzongyi22-zoey.github.io/baidu-photo-live/',
      title: 'FTP联机 · 照片直播原型',
      description: '在页面内体验连接、照片管理与传输操作。',
      format: 'desktop'
    }
  }),
]
