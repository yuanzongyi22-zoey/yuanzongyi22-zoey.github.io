import { useEffect, useRef, useState, type ReactNode } from 'react'
import { adjustedScopes, defaultPresetScopes, inferPresetType, presetScopes, scopeLeaves, toggleScope, type PresetType, type ScopeNode } from './preset-model'

export type InternshipVisual = 'complaints' | 'preset' | 'export' | 'stores' | 'studio' | 'watermark' | 'ftp' | 'activation' | 'retention'

function Record({ title, english, note, children }: { title: string; english: string; note: string; children: ReactNode }) {
  return <figure className="work-record"><header><small>{english}</small><h3>{title}</h3></header>{children}<figcaption>{note}</figcaption></figure>
}

function Steps({ items }: { items: [string, string][] }) {
  return <ol className="record-steps">{items.map(([title, body], index) => <li key={title}><small>{String(index + 1).padStart(2, '0')}</small><div><h4>{title}</h4><p>{body}</p></div></li>)}</ol>
}

function ScopeCheckbox({ node, selected, onToggle }: { node: ScopeNode; selected: string[]; onToggle: () => void }) {
  const input = useRef<HTMLInputElement>(null)
  const leaves = scopeLeaves(node)
  const checked = leaves.every(id => selected.includes(id))
  const partial = !checked && leaves.some(id => selected.includes(id))
  useEffect(() => { if (input.current) input.current.indeterminate = partial }, [partial])
  return <input ref={input} type="checkbox" aria-label={`保存${node.label}范围`} checked={checked} onChange={onToggle} />
}

function PresetRecord() {
  const [selected, setSelected] = useState(() => defaultPresetScopes('组合'))
  const [expanded, setExpanded] = useState<string[]>(() => {
    try { const stored: unknown = JSON.parse(localStorage.getItem('zoey-preset-expanded') ?? '[]'); return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string') : [] } catch { return [] }
  })
  const [saved, setSaved] = useState('')
  const type = inferPresetType(selected)
  const toggleExpanded = (id: string) => setExpanded(previous => {
    const next = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]
    try { localStorage.setItem('zoey-preset-expanded', JSON.stringify(next)) } catch { /* Memory is optional when storage is unavailable. */ }
    return next
  })
  const update = (next: string[]) => { setSelected(next); setSaved('') }
  const renderNode = (node: ScopeNode, level = 0): ReactNode => <li key={node.id}>
    <div className="preset-tree-row" style={{ paddingLeft: `${level * 16}px` }}>
      <ScopeCheckbox node={node} selected={selected} onToggle={() => update(toggleScope(selected, node))} />
      {node.children ? <button className="scope-expand" aria-expanded={expanded.includes(node.id)} onClick={() => toggleExpanded(node.id)}><span aria-hidden="true">{expanded.includes(node.id) ? '▾' : '▸'}</span>{node.label}</button> : <span className="scope-leaf">{node.label}</span>}
      {scopeLeaves(node).some(id => adjustedScopes.includes(id)) && <i className="adjusted-dot" aria-label="包含已调整项" />}
    </div>
    {node.children && expanded.includes(node.id) && <ul>{node.children.map(child => renderNode(child, level + 1))}</ul>}
  </li>
  return <Record title="保存类型与范围，双向联动。" english="PRESET / INTERACTIVE RULES" note="交互演示 · 展示类型、范围、已调整项和默认重置的关键关系；色彩展开至全图参数与局部范围。">
    <div className="preset-window">
      <div className="preset-window-title">保存预设 <small>INTERACTION STUDY</small></div>
      <div className="preset-columns">
        <div className="preset-settings"><h4>保存设置</h4><label>预设名称<input className="preset-name" value="我的预设" readOnly /></label><label>预设类型<select aria-label="预设类型" value={type ?? ''} onChange={event => { const next = event.target.value; if (next) update(defaultPresetScopes(next as PresetType)) }}>
          {!type && <option value="" disabled>请选择保存范围</option>}{(['色彩', '人像', '组合'] as PresetType[]).map(item => <option key={item} value={item}>{item}</option>)}
        </select></label><p>切换类型，恢复该类型默认范围。</p><button className="preset-reset" onClick={() => update(defaultPresetScopes(type ?? '组合'))}>恢复当前类型默认范围</button><div className="preset-type-summary" role="status" aria-live="polite"><small>当前类型</small><strong>{type ?? '未选择'}</strong></div></div>
        <div className="preset-range"><div className="preset-range-header"><h4>保存范围选择</h4><button onClick={() => update([...adjustedScopes])}>选择已调整项</button></div><ul className="preset-tree">{presetScopes.map(node => renderNode(node))}</ul></div>
      </div>
      <div className="preset-footer"><span role="status">{saved || (selected.length ? '● 为示例中已调整的项目' : '至少选择一项保存范围')}</span><button disabled={!selected.length} onClick={() => setSaved(`已保存为${type}预设`)}>保存</button></div>
    </div>
    <div className="record-rule"><span>已调整 ＋ 勾选</span><b>保存调整值</b><span>未调整 ＋ 勾选</span><b>保存初始值</b><span>不勾选</span><b>不保存该项</b></div>
  </Record>
}

export function InternshipRecord({ type }: { type: InternshipVisual }) {
  switch (type) {
    case 'preset': return <PresetRecord />
    case 'complaints': return <Record title="三段流程，三类阻力。" english="COMPLAINTS / 1,431 RECORDS" note="客诉分布 · 共1,431条分析记录，比例为问题记录占比。">
      <div className="record-bars">{[
        ['AI挑图', '299', 20.9, '导入兼容、任务状态与操作'],
        ['多人分片', '338', 23.6, '识别之后的人物整理与修正'],
        ['在线选片', '794', 55.5, '小程序、分享权限与客户交付']
      ].map(([title, count, percent, body]) => <div key={title}><div className="record-bar-label"><span>{title}</span><strong>{percent}% <small>/ {count}条</small></strong></div><div className="record-track"><i style={{ width: `${percent}%` }} /></div><p>{body}</p></div>)}</div>
    </Record>
    case 'export': return <Record title="一组照片，两套交付。" english="EXPORT / KEEP THE FILES PAIRED" note="双版本交付流程 · 文件名为示例。">
      <div className="orientation-strip">{['横图', '竖图', '方图'].map((title, index) => <div key={title}><span className={`orientation-sample orientation-${index}`}><i>W</i></span><span>{title}独立配置</span></div>)}</div>
      <div className="export-branch"><div className="export-source"><small>一次导出</small><strong>同时导出无水印照片</strong></div><div className="export-folders"><div><small>活动_有水印 /</small><code>IMG_0001.jpg</code></div><div><small>活动_无水印 /</small><code>IMG_0001.jpg</code></div></div></div>
    </Record>
    case 'stores': return <Record title="同一个累计值，解释两段时间。" english="ACCOUNTING / BEFORE & AFTER" note="历史消耗口径 · 8月17日为统计分界。">
      <div className="accounting-periods"><article><small>8月17日前</small><h4>看当前归属</h4><p>历史消耗计入用户当前所在门店。</p></article><span aria-hidden="true">→</span><article><small>8月17日及以后</small><h4>看发生时归属</h4><p>每笔消耗计入发生当时所在门店。</p></article></div>
      <p className="record-callout">跨时间查询 = 两段统计合并；图表、门店累计字段和页面说明使用一致口径。</p>
    </Record>
    case 'studio': return <Record title="让订单信息沿流程传下去。" english="PHOTOGRAPHY AGENT / WORKFLOW" note="摄影行业Agent方案 · 从订单到制作交付。">
      <Steps items={[['订单与素材', '匹配订单、确认图片范围，创建项目并导入。'], ['挑图与初修', '推荐预设、展示任务量及费用，确认后执行与检查。'], ['选片与精修', '将入选图片、用途与备注关联，再确认具体调整。'], ['制作与交付', '更新产品素材、确认交付，回写订单状态。']]} />
      <div className="record-loop"><small>贯穿各阶段</small><span>授权与权限</span><span>人工确认</span><span>状态回写</span></div>
    </Record>
    case 'watermark': return <Record title="保存了，不等于应用了。" english="WATERMARK / TWO SEPARATE STATES" note="依据分构图加水印与交互优化PRD重绘 · 展示需求中的状态关系。">
      <Steps items={[['编辑草稿', '上传、切换素材与调整参数，自动保留编辑内容。'], ['确认应用', '当前选中的水印配置成为项目已应用配置。'], ['全量更新', '覆盖存量、处理中和后续照片；部分失败可重试。']]} />
      <div className="watermark-states"><div><small>未确认退出</small><p>保留草稿<br />照片继续用上次已应用配置</p></div><div><small>确认“无水印”</small><p>项目照片清除水印<br />自定义素材与参数继续保留</p></div></div>
    </Record>
    case 'ftp': return <Record title="无线发生在手机与电脑之间。" english="CONNECTED SHOOTING / LOCAL NETWORK" note="FTP联机方案 · 从电脑项目内启动连接。">
      <div className="device-chain"><div><span aria-hidden="true">▣</span><h4>相机</h4><p>拍摄与存储</p></div><small>有线连接 →</small><div><span aria-hidden="true">▯</span><h4>手机</h4><p>控制与上传</p></div><small>局域网 FTP →</small><div><span aria-hidden="true">▱</span><h4>电脑</h4><p>接收与处理</p></div></div>
      <Steps items={[['电脑先创建项目', '启动FTP服务，展示二维码与手动连接信息。'], ['手机建立连接', '扫码或输入信息，开启实时传输或选择已有照片。'], ['完整接收再确认', '校验临时文件、处理重名，完整写入后反馈单张成功。']]} />
    </Record>
    case 'activation': return <Record title="从“领到了”走到“用起来”。" english="ACTIVATION / CLAIM → REDEEM → EXPERIENCE" note="首次体验路径 · 从领取到项目内体验。">
      <Steps items={[['未领取', '活动资源位引导领取，成功后进入项目创建。'], ['已领取，未兑换', '按有无项目记录展示提醒，进入创建项目页。'], ['创建首个项目', '权益自动绑定，开启并引导体验挑图与修图。'], ['已兑换', '恢复普通资源位，正常浏览使用。']]} />
      <p className="record-callout">活动资源位 → 普通资源位 → 兜底素材。提醒另设频次，避免每次进入都弹出。</p>
    </Record>
    case 'retention': return <Record title="少数复访，贡献了更多访问。" english="EARLY SNAPSHOT / AUGUST 04" note="8月4日访问快照 · 复访指至少两个活跃日。">
      <div className="retention-totals"><div><strong>302</strong><small>累计活跃用户</small></div><div><strong>1,121</strong><small>访问 PV</small></div></div>
      <div className="retention-share"><div><span>复访用户占比</span><div className="record-track"><i style={{ width: '13.6%' }} /></div><strong>13.6%</strong></div><div><span>贡献访问占比</span><div className="record-track"><i style={{ width: '40.9%' }} /></div><strong>40.9%</strong></div></div>
      <p className="record-callout">41人至少访问两天。下一步要看再次访问的路径，也要排查高频用户是否反复遇到空状态。</p>
    </Record>
  }
}
