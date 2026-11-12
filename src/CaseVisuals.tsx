import type { ReactNode } from 'react'

export type NativeVisual = 'breakfast-research' | 'service-blueprint' | 'music-insights' | 'music-system' | 'travel-research' | 'travel-system' | 'travel-rehearsal' | 'nose-comparison' | 'nose-ergonomics' | 'nose-routine'

function Sheet({ title, english, source, children, wide = false }: { title: string; english: string; source: string; children: ReactNode; wide?: boolean }) {
  return <figure className={`native-sheet ${wide ? 'native-wide' : ''}`}>
    <header><span>{english}</span><h3>{title}</h3></header>
    {children}
    <figcaption>调研与设计记录 / 依据原作品集 {source} 整理</figcaption>
  </figure>
}

function Flow({ items }: { items: { title: string; body: string }[] }) {
  return <ol className="native-flow">{items.map((item, index) => <li key={item.title}><small>{String(index + 1).padStart(2, '0')}</small><h4>{item.title}</h4><p>{item.body}</p></li>)}</ol>
}

const serviceStages = ['手机预约', '收到取餐号码', '准备取餐', '扫码取餐', '离开', '餐后反馈']
const serviceRows = [
  { label: '接触点', english: 'TOUCHPOINT', cells: ['小程序', '小程序', '小程序', '小程序 / 智能餐车', '智能餐车', '小程序'] },
  { label: '用户行为', english: 'CUSTOMER ACTION', cells: ['填写预约信息\n选择早餐搭配', '接收取餐号码\n查看定制信息', '前往楼下餐车', '扫描二维码\n提取餐品', '前往目的地', '填写评价\n反馈建议'] },
  { label: '前台响应', english: 'FRONTSTAGE', cells: ['早餐搭配\n个性化定制', '发送取餐号码', '发送取餐提醒', '识别二维码\n自动弹盖', '显示取餐完成', '接收反馈'] },
  { label: '后台协作', english: 'BACKSTAGE', cells: ['后厨预备食材', '制作、打包\n装填食品舱', '无人车配送', '食品舱传送出餐', '食品舱回收\n设备充电', '管理反馈'] },
  { label: '支持系统', english: 'SUPPORT', cells: ['创建预约数据', '订单与配送信息', '配送调度', '二维码识别\n食品舱传输', '无人驾驶调度', '数据汇总'] },
]

export function CaseVisual({ type }: { type: NativeVisual }) {
  switch (type) {
    case 'breakfast-research':
      return <Sheet title="早晨的阻力，从哪里来？" english="RESEARCH / THE MORNING GAP" source="p.05 / 简历">
        <div className="research-totals"><div><strong>203</strong><span>有效问卷</span></div><div><strong>10<span>+3+1</span></strong><span>学生 / 食堂人员 / 专家访谈</span></div></div>
        <div className="native-bar-group">
          {[['时间紧', 41, '不吃早餐的原因中占比'], ['校内食堂', 70, '早餐就餐地点中占比']].map(([label, value, note]) => <div className="native-bar" key={label}><div><span>{label}</span><strong>{value}%</strong></div><span className="bar-track"><i style={{ width: `${value}%` }} /></span><small>{note} · 两项来自不同问题</small></div>)}
        </div>
        <div className="insight-notes"><p><small>学生端</small>时间紧、选择少，预约与快速取餐成为设计切口。</p><p><small>供给端</small>高峰排队与备餐压力，需要和取餐路径一起考虑。</p></div>
      </Sheet>
    case 'service-blueprint':
      return <Sheet title="一次早餐，六个接力点。" english="SERVICE BLUEPRINT / ONLINE TO OFFLINE" source="p.08" wide>
        <p className="native-hint">从左到右阅读；小屏可横向滑动查看完整链路 →</p>
        <div className="native-table-scroll" tabIndex={0} role="region" aria-label="早餐服务蓝图，可横向滚动"><table className="blueprint-table"><thead><tr><th scope="col">服务层次</th>{serviceStages.map((stage, index) => <th scope="col" key={stage}><small>0{index + 1}</small>{stage}</th>)}</tr></thead><tbody>{serviceRows.map(row => <tr key={row.label}><th scope="row">{row.label}<small>{row.english}</small></th>{row.cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        <div className="blueprint-legend"><span>○ 用户可见</span><span>┄ 前台 / 后台分界</span><span>连接预约、配送与反馈</span></div>
      </Sheet>
    case 'music-insights':
      return <Sheet title="把创作门槛，变成设计机会。" english="INSIGHT → OPPORTUNITY → RESPONSE" source="p.17">
        <div className="insight-matrix"><div className="matrix-heading"><span>发现的阻力</span><span>设计回应</span></div>{[
          ['乐理知识不足', '模块化组合与 AI 辅助', '降低开始创作时的知识限制'],
          ['软件操作复杂', '软硬件操作对应', '让采样、处理与编曲的动作更直观'],
          ['灵感难以及时捕捉', '便携采样模块', '从日常声音开始记录'],
          ['创作畏难、互动少', '分享与多人共创', '给练习留出交流和反馈的空间'],
        ].map(([problem, response, reason], index) => <div className="matrix-row" key={problem}><span><small>0{index + 1}</small>{problem}</span><div><h4>{response}</h4><p>{reason}</p></div></div>)}</div>
        <p className="native-footnote">这里呈现设计概念中的能力规划。</p>
      </Sheet>
    case 'music-system':
      return <Sheet title="三个模块，一条创作路径。" english="SYSTEM / CAPTURE · PROCESS · COMPOSE" source="p.18" wide>
        <Flow items={[{ title: '采样', body: '捕捉生活中的声音，保留灵感片段。' }, { title: '处理', body: '对声音做降噪、修复与节奏处理。' }, { title: '编曲', body: '将声音片段组合到时间线，形成创作。' }]} />
        <div className="system-companion"><small>APP COMPANION</small><span>创意空间</span><span>AI 实验室</span><span>互动与社区</span><span>乐器与乐理</span></div>
        <p className="native-footnote">物理模块与 App 对应，AI 功能为方案设想。</p>
      </Sheet>
    case 'travel-research':
      return <Sheet title="一趟出行，谁在担心什么？" english="RESEARCH / DIFFERENT ROLES, SHARED JOURNEY" source="p.24">
        <div className="travel-sample"><strong>83<small>份目标人群问卷</small></strong><div><div className="sample-split"><span>导游 30%</span><span>游客 70%</span></div><small>原稿比例为约数</small></div></div>
        <div className="insight-notes"><p><small>游客</small>集合点怎么找？走散后如何联络？遇到紧急情况怎么办？</p><p><small>导游</small>如何及时传达信息，并掌握团队位置与集合进度？</p></div>
        <p className="native-takeaway">把“听得到、找得到、联系得上”放在同一套出行服务中。</p>
      </Sheet>
    case 'travel-system':
      return <Sheet title="三个终端，职责分开。" english="SERVICE SYSTEM / THREE CONNECTED TERMINALS" source="p.25" wide>
        <div className="terminal-system">{[
          ['01', '老人端', '随身的出行提示', ['急救呼叫', '接收讲解', '景区地图', '集合倒计时']],
          ['02', '导游端', '团队的信息中枢', ['信息发布', '定位查看', '统一讲解', '即时联络']],
          ['03', '急救端', '应急用品的组织', ['器材收纳', '用品分区', '操作说明']],
        ].map(([number, title, subtitle, features]) => <article key={String(number)}><small>{number}</small><span className="terminal-orbit" aria-hidden="true">◉</span><h4>{title}</h4><p>{subtitle}</p><ul>{(features as string[]).map(feature => <li key={feature}>{feature}</li>)}</ul></article>)}</div>
        <p className="native-footnote">终端功能为产品设计方案；情景模拟用于检视使用流程。</p>
      </Sheet>
    case 'travel-rehearsal':
      return <Sheet title="用纸模，把流程实际走一遍。" english="PAPER PROTOTYPE / REHEARSE BEFORE REFINING" source="p.26" wide>
        <p>用硬卡纸和纸箱模拟终端，在制作、佩戴与场景演练中检查形态、重量、按钮和用品布局。</p>
        <div className="process-photo-grid">{['材料准备', '制作导游端', '制作老人端', '制作急救端', '完成模型', '分发设备', '体验佩戴', '查看用品', '模拟集体讲解', '模拟自由活动'].map((label, index) => <figure key={label}><img src={`/project-figures/travel-process-${String(index + 1).padStart(2, '0')}.webp`} alt={`纸模情景模拟：${label}`} width={200} height={250} loading="lazy" /><figcaption><small>{String(index + 1).padStart(2, '0')}</small>{label}</figcaption></figure>)}</div>
        <div className="prototype-decisions"><small>REVISIONS / 模拟后的调整</small><ul><li>移除老人端的急救药品与创可贴。</li><li>取消急救端太阳能板为老人端充电的方案。</li><li>增加车载时钟显示基座与无线充电的设计。</li></ul></div>
      </Sheet>
    case 'nose-comparison':
      return <Sheet title="从已有产品里，找出体验取舍。" english="BENCHMARK / OBSERVATIONS INTO DESIGN" source="p.32" wide>
        <div className="native-table-scroll" tabIndex={0} role="region" aria-label="洗鼻器竞品对比，可横向滚动"><table className="comparison-table"><thead><tr><th scope="col">原稿中的产品</th><th scope="col">关注的设计特点</th><th scope="col">原稿记录的使用问题</th><th scope="col">带入方案的考虑</th></tr></thead><tbody>{[
          ['swk 赛维康', '电动操作、材料选择', '操作步骤较繁琐', '简化操作与握持动作'],
          ['儿童电动雾化洗鼻器', '分仓与废液回收', '高档位外流、回收口偏小', '关注回收路径与开口设计'],
          ['Sonmol 朔茂', '小巧外形、充电方式', '产品内部不易清洁', '兼顾便携与拆洗'],
          ['NAVAGE', '负压与废液回收', '体积、重量偏大，造型偏成人', '适配儿童握持与家庭使用场景'],
        ].map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        <p className="native-footnote">保留原调研中的设计观察，聚焦操作、形态与清洁维护。</p>
        <div className="design-keywords"><span>儿童友好</span><span>易握持</span><span>可拆洗</span><span>便携收纳</span></div>
      </Sheet>
    case 'nose-ergonomics':
      return <Sheet title="从模型反馈，回到毫米。" english="ERGONOMICS / REFINING THE GRIP" source="p.34">
        <div className="ergonomics-drawing">
          <svg viewBox="0 0 380 280" role="img" aria-label="握持外径由58毫米调整到60毫米，按钮直径15毫米的尺寸示意">
            <defs><linearGradient id="grip-fill"><stop stopColor="#b28fe7" stopOpacity=".3" /><stop offset="1" stopColor="#b28fe7" stopOpacity=".04" /></linearGradient></defs>
            <path d="M155 44 Q190 15 225 44 L241 214 Q190 246 139 214 Z" fill="url(#grip-fill)" stroke="#b28fe7" />
            <ellipse cx="190" cy="44" rx="35" ry="15" fill="none" stroke="#b28fe7" />
            <circle cx="190" cy="118" r="16" fill="none" stroke="#d8b66d" />
            <path d="M139 250 H241 M139 243 V257 M241 243 V257 M207 118 H300" fill="none" stroke="#d8b66d" strokeWidth=".8" />
            <text x="190" y="274" textAnchor="middle" fill="#d8b66d" fontSize="12">Ø 60 mm</text>
            <text x="255" y="108" fill="#d8b66d" fontSize="12">Ø 15 mm</text>
            <path d="M150 43 L120 25 M230 43 L260 25" fill="none" stroke="#726280" strokeDasharray="3 4" />
          </svg>
        </div>
        <dl className="dimension-notes"><div><dt>握持外径</dt><dd><s>58</s> → <strong>60</strong> mm</dd></div><div><dt>按键直径</dt><dd><strong>15</strong> mm</dd></div></dl>
        <p className="native-footnote">依据原稿的模型调整记录重绘；示意图不代表工程图。</p>
      </Sheet>
    case 'nose-routine':
      return <Sheet title="把使用与收纳，设计成连续动作。" english="USE SCENARIO / FROM PREPARATION TO STORAGE" source="p.35" wide>
        <Flow items={[{ title: '准备', body: '取出分装液，加入储液仓。' }, { title: '操作', body: '取下保护盖，进入产品操作流程。' }, { title: '拆洗', body: '使用后拆卸水仓，便于清洁。' }, { title: '归位', body: '设备归位，完成充电与收纳。' }]} />
        <p className="native-footnote">产品概念的使用情景与结构组织。</p>
      </Sheet>
  }
}
