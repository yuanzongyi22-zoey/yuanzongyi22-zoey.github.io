import type { CaseImage } from './portfolio-content'

// Curated interface excerpts from the owner's PRDs. Internal source IDs remain in the private material index.
export const baiduGalleries: Record<string, CaseImage[]> = {
  "preset": [
    {
      "src": "/internship/baidu/doc-01-01.webp",
      "alt": "保存范围默认收起",
      "caption": "保存预设面板：类型范围在保存前可见，范围列表支持展开与收起。",
      "kind": "产品界面",
      "width": 960,
      "height": 662
    },
    {
      "src": "/internship/baidu/doc-01-00.webp",
      "alt": "保存范围的层级结构",
      "caption": "色彩按全图和局部分层；展开后查看具体参数。",
      "kind": "产品界面",
      "width": 960,
      "height": 897
    },
    {
      "src": "/internship/baidu/doc-01-03.webp",
      "alt": "预设类型选择",
      "caption": "类型选择包含组合、人像和色彩，选中后恢复对应默认范围。",
      "kind": "交互设计",
      "width": 652,
      "height": 326
    },
    {
      "src": "/internship/baidu/doc-01-04.webp",
      "alt": "选择已调整项",
      "caption": "仅选择实际调整的末级项目，避免把整个模块一并选中。",
      "kind": "交互设计",
      "width": 960,
      "height": 899
    },
    {
      "src": "/internship/baidu/doc-01-05.webp",
      "alt": "预设面板中的标签",
      "caption": "标签出现在预设名称旁，用于辨认预设类型。",
      "kind": "产品界面",
      "width": 584,
      "height": 1532
    }
  ],
  "export": [
    {
      "src": "/internship/baidu/doc-06-00.webp",
      "alt": "客户端导出水印面板",
      "caption": "导出页面中的水印设置与照片预览。",
      "kind": "产品界面",
      "width": 960,
      "height": 601
    },
    {
      "src": "/internship/baidu/doc-06-01.webp",
      "alt": "横竖方图独立设置",
      "caption": "在横图、竖图、方图之间切换，需要统一时使用当前构图设置同步。",
      "kind": "交互设计",
      "width": 538,
      "height": 198
    },
    {
      "src": "/internship/baidu/doc-06-02.webp",
      "alt": "同时导出无水印照片",
      "caption": "说明两套照片分目录保存，原文件名保持对应。",
      "kind": "交互设计",
      "width": 518,
      "height": 402
    }
  ],
  "stability": [
    {
      "src": "/internship/baidu/doc-03-00.webp",
      "alt": "新建项目导入入口",
      "caption": "从新建项目的导入入口开始检查设备空间。",
      "kind": "产品界面",
      "width": 960,
      "height": 541
    },
    {
      "src": "/internship/baidu/doc-03-03.webp",
      "alt": "网盘图片导入界面",
      "caption": "网盘导入场景单独约定可用空间提示与按钮行为。",
      "kind": "产品界面",
      "width": 960,
      "height": 567
    },
    {
      "src": "/internship/baidu/doc-03-07.webp",
      "alt": "本地导出设置",
      "caption": "导出到本地与云端的检查对象和提示分别处理。",
      "kind": "产品界面",
      "width": 960,
      "height": 600
    }
  ],
  "import": [
    {
      "src": "/internship/baidu/doc-17-00.webp",
      "alt": "照片上传方式",
      "caption": "在上传入口增加读卡器与相机照片，连接存量照片导入。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-17-01.webp",
      "alt": "存储卡照片选择",
      "caption": "通过顶部目录切换与筛选组织相机卡内照片。",
      "kind": "交互设计",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-17-02.webp",
      "alt": "文件夹选择界面",
      "caption": "Android系统文件夹选择界面。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-17-03.webp",
      "alt": "另一端的文件夹选择",
      "caption": "iOS系统文件夹选择界面；返回后递归展示所选目录照片。",
      "kind": "产品界面",
      "width": 960,
      "height": 2081
    },
    {
      "src": "/internship/baidu/doc-17-05.webp",
      "alt": "照片加载状态",
      "caption": "加载过程和部分失败以页面提示反馈，避免把未完成读取误认为空列表。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    }
  ],
  "watermark": [
    {
      "src": "/internship/baidu/doc-20-00.webp",
      "alt": "水印编辑入口",
      "caption": "进入水印编辑页面，保留上传素材与预览。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-20-01.webp",
      "alt": "自定义水印调节",
      "caption": "选中素材后调整位置、大小与不透明度。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-20-02.webp",
      "alt": "横竖同步确认",
      "caption": "切换同步会覆盖另一构图的独立参数时，先提示确认。",
      "kind": "交互设计",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-20-05.webp",
      "alt": "预览背景与比例",
      "caption": "选择不同照片比例与预览背景，检查水印的构图关系。",
      "kind": "产品界面",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-20-06.webp",
      "alt": "删除自定义素材",
      "caption": "长按素材出现删除操作，已应用素材与编辑草稿分别处理。",
      "kind": "交互设计",
      "width": 1200,
      "height": 2670
    },
    {
      "src": "/internship/baidu/doc-20-07.webp",
      "alt": "多个自定义水印",
      "caption": "最多保存5张自定义素材，每张独立保存参数。",
      "kind": "交互设计",
      "width": 1200,
      "height": 2670
    }
  ],
  "activation": [
    {
      "src": "/internship/baidu/doc-19-02.webp",
      "alt": "免费体验资源位",
      "caption": "活动资源位引导领取权益，并进入创建项目路径。",
      "kind": "交互设计",
      "width": 372,
      "height": 194
    },
    {
      "src": "/internship/baidu/doc-19-07.webp",
      "alt": "项目内的工作流程",
      "caption": "进入项目后，将权益体验接到挑图和修图环节。",
      "kind": "产品界面",
      "width": 526,
      "height": 1140
    },
    {
      "src": "/internship/baidu/doc-19-08.webp",
      "alt": "工作流模块细节",
      "caption": "在具体工作环节继续提供操作与状态反馈。",
      "kind": "产品界面",
      "width": 512,
      "height": 202
    }
  ]
}
