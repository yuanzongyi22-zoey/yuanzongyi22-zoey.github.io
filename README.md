# 袁宗苡 Zoey · 个人作品集网站

Next.js 14（App Router）+ React 18 + TypeScript 的单页作品集，纯静态站点，没有后端和数据库。
内容全部写在 TypeScript 数据文件里，图片放在 `public/`。

## 换设备后怎么接着改

```bash
git clone <你的仓库地址> zoey-portfolio
cd zoey-portfolio
npm install          # 装依赖，node_modules 不在 git 里
npm run dev          # 打开 http://localhost:3000
```

其他命令：

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发，改代码自动刷新 |
| `npm run build` | 静态导出到 `out/`，可直接传到任何静态托管 |
| `npm test` | 跑单元测试（预设范围规则 + 图廊 + 弹窗表单） |

要求 Node 18 以上。

## 文件说明

### 页面入口

| 文件 | 作用 |
| --- | --- |
| `app/page.tsx` | 路由入口。访问 `/` 时渲染 `PortfolioApp`，本身只有 5 行 |
| `app/layout.tsx` | 全站外壳。设置页面标题、语言、主题色，并引入两份 CSS |

### 主应用

| 文件 | 作用 |
| --- | --- |
| `src/PortfolioApp.tsx` | **整站的大脑**（约 560 行）。首页、实习经历、项目作品、关于我、联系方式五个区块；侧边/顶部导航与滚动联动；点开条目后的案例详情页；简历弹窗与留言表单；纸质作品集的翻页书架 |

### 内容数据（**改文字优先来这三个文件**）

| 文件 | 作用 |
| --- | --- |
| `src/portfolio-content.ts` | 所有文案的数据源（约 410 行）。定义 `Entry` / `Chapter` / `CaseStory` 等类型，并列出两段实习（百度、联想）和四个项目（早早鸟、Ei-Music、老友行、NOSE-Lover）的完整内容 |
| `src/baidu-content.ts` | 百度实习的案例正文，按 STAR（背景／目标／行动／结果）结构组织 To B 修图客户端和 To C 照片直播两条线 |
| `src/baidu-gallery.ts` | 百度实习的界面截图清单。每张图记录路径、说明、类别（产品界面／交互设计）和尺寸 |

### 区块与可视化组件

| 文件 | 作用 |
| --- | --- |
| `src/AboutSection.tsx` | 「关于我」区块。教育经历、工具栈、获奖，以及影像／运营／爱好三个入口卡片 |
| `src/CaseVisuals.tsx` | 项目案例的调研图表。服务蓝图、问卷统计、设计流程等**用代码画出来的**图，不是图片 |
| `src/InternshipCase.tsx` | 实习案例的版式组件。STAR 四段布局、左右翻页的界面图廊 `CaseGallery`、可全屏的原型 iframe `EmbeddedPrototype` |
| `src/InternshipVisuals.tsx` | 实习案例里可以真的点的小demo。比如还原 PRD 里的「保存预设」勾选面板、客诉数据、水印设置 |
| `src/preset-model.ts` | 上面那个预设面板的纯逻辑：勾选范围的父子联动、类型推断。独立出来方便写测试 |

### 动效

| 文件 | 作用 |
| --- | --- |
| `src/ParticlePortrait.tsx` | 首页的粒子头像。把 `/hero/portrait-cutout.png` 读成像素，在 canvas 上生成粒子，跟随鼠标散开聚合 |
| `src/book-motion.ts` | 书架封面的指针跟随动效。鼠标在封面上移动时驱动 SVG 装饰图形（滑线／转盘／环绕小球） |

### 样式

| 文件 | 作用 |
| --- | --- |
| `src/portfolio-base.css` | 主样式表（约 770 行）。配色（紫 `#b28fe7` + 金 `#d8b66d` + 近黑底）、字体、首页、导航、书架、响应式断点、`prefers-reduced-motion` 降级 |
| `src/portfolio-cases.css` | 案例详情页的补充样式 |

### 测试

| 文件 | 作用 |
| --- | --- |
| `src/PortfolioApp.test.tsx` | 测简历弹窗和留言表单（含草稿存 localStorage） |
| `src/InternshipCase.test.tsx` | 测 `preset-model` 的勾选规则和 `CaseGallery` 的翻页 |
| `src/test/setup.ts` | 测试环境初始化 |

### 配置

| 文件 | 作用 |
| --- | --- |
| `package.json` | 依赖与命令 |
| `package-lock.json` | 锁定依赖版本，**必须提交**，保证换设备装出同一套依赖 |
| `next.config.mjs` | Next 配置，开了 `output: 'export'` 静态导出 |
| `tsconfig.json` | TypeScript 配置 |
| `next-env.d.ts` | Next 自动生成的类型声明 |
| `vite.config.ts` | 只给 `npm test`（vitest）用，不参与页面构建 |
| `.gitignore` | 排除 `node_modules`、构建产物、`.env` |

## 图片资源 `public/`

| 目录 | 内容 |
| --- | --- |
| `public/portfolio/` | 纸质作品集的跨页图 `page-04` ~ `page-37` 和封面缩略图（9.7MB） |
| `public/project-figures/` | 四个项目的产品图、界面图、场景图（5.0MB） |
| `public/internship/baidu/` | 百度实习的 PRD 界面截图 `doc-*.webp`（2.2MB） |
| `public/resume/` | 简历长图 `resume.png` 和「关于我」头像 `portrait.png`（1.9MB） |
| `public/hero/` | 首页粒子用的抠图 `portrait-cutout.png` 和原图（816KB） |
| `public/about/` | 影像入口的两张照片（40KB） |
| `public/documents/` | 可下载的作品集 PDF 和简历 PDF（19MB） |

## 需要知道的两件事

1. **百度实习案例里嵌了一个外部原型 iframe**，地址写在 `src/baidu-content.ts:64`，指向 `https://yuanzongyi22-zoey.github.io/baidu-photo-live/`。那是另一个独立仓库部署的照片直播原型，和本仓库无关，但本地开发时这个 iframe 需要联网才能显示。
2. **如果以后要部署到 GitHub Pages 的子路径**（比如 `用户名.github.io/zoey-portfolio/`），`next.config.mjs` 要加 `basePath`，同时代码里硬写的 `/hero/...`、`/portfolio/...` 这些图片路径也得跟着加前缀，否则图片会 404。部署到自定义域名或 Vercel 根路径则不需要改。

