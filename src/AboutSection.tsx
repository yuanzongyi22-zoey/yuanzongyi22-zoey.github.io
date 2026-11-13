import type { Entry } from './portfolio-content'

const operations: Entry = {
  id: 'operations', number: '02', kind: 'personal', title: '内容创作与运营', mark: 'CREATE & CONNECT',
  type: '关于我 / 运营', color: '#d8b66d', description: '从选题、剪辑到发布，持续记录内容创作的实践。', date: '2024.12 起', role: '独立运营小红书、抖音账号',
  chapters: [
    { title: '个人 IP 账号', english: 'Personal channel', pages: [], paragraphs: ['独立运营小红书、抖音账号，建立个人视频制作 SOP。累计输出视频笔记20+、图文笔记10+，其中8条爆文。'], blocks: [{ label: '制作流程', body: '将内容制作中的方法整理为可复用的流程。具体选题、脚本、制作过程与复盘材料，后续结合原始作品补充。' }] },
    { title: '明星文娱账号', english: 'Entertainment content', pages: [], paragraphs: ['累计产出视频118条，超千赞视频26条，其中多条万赞视频。'], blocks: [{ label: '作品留痕', body: '后续在这里展示具体视频与对应的内容判断。' }] },
  ],
}
const interests: Entry = {
  id: 'interests', number: '03', kind: 'personal', title: '生活的其他频率', mark: 'OFF THE CLOCK',
  type: '关于我 / 爱好', color: '#a489c3', description: '运动、音乐，以及工作之外的生活。', chapters: [
    { title: '运动与音乐', english: 'Move & listen', pages: [], paragraphs: ['这里留给运动、音乐与生活中的片段。'], blocks: [{ label: '待续', body: '具体的故事与照片，等我慢慢整理。' }] },
  ],
}

export function AboutSection({ onOpen, photography }: { onOpen: (entry: Entry) => void; photography: Entry }) {
  return <section className="personal-section about-pages" id="about">
    <div className="about-section-label"><p className="section-index">03 / ABOUT ME</p><span>01 — A LITTLE INTRODUCTION</span></div>
    <div className="about-profile">
      <div className="profile-title"><p className="editorial-english">A little more about me.</p><h2>袁宗苡<span>Zoey.</span></h2><p>关注 AI 与移动端体验。<br />从工业设计出发，把对人、场景和影像的观察带进产品实践。</p><button className="about-next" onClick={() => document.getElementById('about-outside')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>继续向下，产品之外 <span>↓</span></button></div>
      <figure className="profile-portrait"><img src="/resume/portrait.png" alt="袁宗苡的个人照片" /><figcaption>YUAN ZONGYI / A WORK IN PROGRESS</figcaption></figure>
      <div className="profile-details"><article><small>01 / EDUCATION</small><h3>教育经历</h3><p>南京理工大学 · 工业设计工程硕士<br />2025.09—2028.06 · 综合排名前10%</p><p>河海大学 · 工业设计工程本科<br />2021.09—2025.06 · 综合排名4/60，保研</p></article><article><small>02 / TOOLKIT</small><h3>方法与表达</h3><p>SQL / SPSS · Figma / Axure<br />PR / PS · Blender / Rhino / KeyShot<br />GPT Image / Codex / Claude Code</p></article><article><small>03 / RECOGNITION</small><h3>积累与认可</h3><p>数模美赛H等5项国家级竞赛；iCAN、米兰等5项省级竞赛。发明专利2项、实用新型专利1项。</p><p>中共党员 · CET 4 / CET 6<br />计算机二级C语言、三级网络技术</p></article></div>
    </div>
    <div className="about-outside" id="about-outside">
      <p className="section-index">02 — OFF THE CLOCK</p>
      <div className="about-outside-title"><h2 className="section-heading">产品之外，<em>还有几种认识我的方式。</em></h2><p className="editorial-english">Different sides, same curiosity.</p><p className="about-outside-sub">IMAGING / CONTENT / EVERYDAY LIFE</p></div>
      <div className="about-destinations">
        <button id="entry-photography" className="about-door door-imaging" onClick={() => onOpen(photography)}><small>01 / VISUAL DIARY</small><span className="imaging-montage" aria-hidden="true"><img className="mountain-photo" src="/about/mountain.webp" alt="" loading="lazy" /><img className="sunset-photo" src="/about/sunset.webp" alt="" loading="lazy" /><span className="imaging-keywords"><i>自由感人像</i><i>梦幻</i><i>自然风光</i><i>活动现场</i></span></span><span className="door-copy"><strong>影像<span>↗</span></strong><span>用画面，留下观察。</span><span className="door-enter" aria-hidden="true">进入影像 <i>→</i></span></span></button>
        <button id="entry-operations" className="about-door door-operations" onClick={() => onOpen(operations)}><small>02 / CREATE & CONNECT</small><span className="operations-editorial" aria-hidden="true"><em>Make it.<br /><span>Mean it.</span></em><span className="editorial-play">▷<i /><i /><i /><i /><i /><i /><i /><i /><i /></span><span className="operations-stat"><b>20+</b> 视频笔记 <span>/</span> <b>10+</b> 图文笔记</span></span><span className="door-copy"><strong>运营<span>↗</span></strong><span>让内容与人相遇。</span><span className="door-enter" aria-hidden="true">进入运营 <i>→</i></span></span></button>
        <button id="entry-interests" className="about-door door-interests" onClick={() => onOpen(interests)}><small>03 / OFF THE CLOCK</small><span className="interests-orbit" aria-hidden="true"><i /><i /><span>♪</span></span><span className="door-copy"><strong>爱好<span>↗</span></strong><span>生活的其他频率。</span><span className="door-enter" aria-hidden="true">进入爱好 <i>→</i></span></span></button>
      </div>
    </div>
  </section>
}
