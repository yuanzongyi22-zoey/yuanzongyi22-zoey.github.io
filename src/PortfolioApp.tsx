'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaseVisual } from './CaseVisuals'
import { InternshipRecord } from './InternshipVisuals'
import { InternshipCase, EmbeddedPrototype } from './InternshipCase'
import { AboutSection } from './AboutSection'
import { PhotographySpread } from './PhotographySection'
import { ParticlePortrait } from './ParticlePortrait'
import { startBookMotion, moveBook, stopBookMotion } from './book-motion'

import { internships, projects, type Entry, type Chapter, type Journey } from './portfolio-content'

const photography: Entry = { id: 'photography', number: '01', title: '影像', type: '关于我 / 影像', description: '人物与风光两辑：人物一组一页地翻，风光连成一条往下看。', color: '#9470cd', mark: 'VISUAL DIARY', kind: 'photography', chapters: [
  { title: '人物', english: 'Portraits', paragraphs: [], pages: [] },
  { title: '风光', english: 'Landscapes', paragraphs: [], pages: [] },
] }
const productPageRanges: Record<string, [number, number]> = {
  earlybird: [4, 14],
  eimusic: [15, 21],
  oldtravel: [22, 29],
  noselover: [30, 35],
}
const sections = [['home', '首页'], ['internships', '实习经历'], ['work', '项目作品'], ['about', '关于我'], ['contact', '联系方式']] as const
const collection = (entry: Entry) => entry.kind === 'internship' ? 'internships' : (entry.kind === 'photography' || entry.kind === 'personal') ? 'about' : 'work'
const collectionLabel = (entry: Entry) => entry.kind === 'internship' ? '实习经历' : (entry.kind === 'photography' || entry.kind === 'personal') ? '关于我' : '项目作品'

function scrollToSection(id: string, behavior: ScrollBehavior) {
  const section = document.getElementById(id)
  if (!section) return
  const heading = section.querySelector<HTMLElement>('.section-top, .about-section-label') ?? section
  const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 72
  window.scrollTo({ top: id === 'home' ? 0 : heading.getBoundingClientRect().top + window.scrollY - header - 24, behavior })
}

// Scattered rather than evenly spaced, kept to one pale violet family so the cluster reads as a single field.
const skillTags = [
  { title: 'AI 产品', english: 'AI PRODUCT', color: '#c3abe8', x: 8, y: 7, drift: 0 },
  { title: '用户研究', english: 'RESEARCH', color: '#b9a3e2', x: 30, y: 0, drift: -3.4 },
  { title: '影像表达', english: 'IMAGING', color: '#cdb6ed', x: 71, y: 5, drift: -6.1 },
  { title: 'AI Coding', english: 'PROTOTYPING', color: '#ae98da', x: 89, y: 20, drift: -1.8 },
  { title: '交互设计', english: 'INTERACTION', color: '#c7b1ea', x: 4, y: 40, drift: -5.2 },
  { title: '需求洞察', english: 'INSIGHT', color: '#d3bdf0', x: 25, y: 54, drift: -8.7 },
  { title: '原型验证', english: 'VALIDATION', color: '#baa5e4', x: 48, y: 44, drift: -2.6 },
  { title: '数据分析', english: 'ANALYTICS', color: '#c0aae6', x: 70, y: 52, drift: -7.3 },
  { title: '工业设计', english: 'INDUSTRIAL', color: '#cab4ec', x: 90, y: 62, drift: -4.1 },
  { title: '视觉叙事', english: 'STORYTELLING', color: '#b49ede', x: 10, y: 84, drift: -9.5 },
  { title: '跨团队协作', english: 'COLLABORATION', color: '#d0b9ef', x: 36, y: 94, drift: -3 },
  { title: '服务设计', english: 'SERVICE', color: '#b79fe0', x: 62, y: 88, drift: -6.8 },
  { title: '内容运营', english: 'CONTENT', color: '#c6b0e9', x: 86, y: 96, drift: -10.2 },
]

function SkillConstellation() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  return <div className="skill-constellation" aria-label="我的能力">
    {skillTags.map(tag => <button
      className={`skill-tag ${activeSkill === tag.title ? 'is-active' : ''}`}
      key={tag.title}
      style={{ '--skill-color': tag.color, '--skill-x': `${tag.x}%`, '--skill-y': `${tag.y}%`, '--skill-delay': `${tag.drift}s` } as React.CSSProperties}
      aria-pressed={activeSkill === tag.title}
      onClick={() => setActiveSkill(activeSkill === tag.title ? null : tag.title)}
    >
      <span className="skill-tag-ball" aria-hidden="true">
        <span className="skill-tag-orbit"><i /></span>
      </span>
      <span className="skill-tag-copy"><strong>{tag.title}</strong><small>{tag.english}</small></span>
    </button>)}
  </div>
}

function PortfolioSky() {
  return <div className="portfolio-sky" aria-hidden="true">
    {Array.from({ length: 76 }, (_, index) => <i
      className={index % 13 === 0 ? 'sky-star is-sparkle' : 'sky-star'}
      key={index}
      style={{
        left: `${((index * 47.31 + 7.4) % 98) + 1}%`,
        top: `${((index * 31.73 + 3.2) % 96) + 2}%`,
        '--star-size': `${index % 13 === 0 ? 5 : .8 + (index % 4) * .35}px`,
        '--star-delay': `${index * -.47}s`,
        '--star-opacity': .25 + (index % 5) * .1,
      } as React.CSSProperties}
    />)}
  </div>
}

function App() {
  const [active, setActive] = useState('home')
  const [selected, setSelected] = useState<Entry | null>(null)
  const siteRef = useRef<HTMLDivElement>(null)
  const returnPosition = useRef(0)
  const pendingScroll = useRef<{ section?: string; top?: number } | null>(null)
  const cursorRef = useRef({ x: -1000, y: -1000 })
  const pointerElement = useRef<HTMLDivElement>(null)
  const pointerGlow = useRef<HTMLDivElement>(null)
  const overBooks = useRef(false)
  const [cursorLabel, setCursorLabel] = useState('')
  const [dialog, setDialog] = useState<'resume' | 'feedback' | null>(null)
  const [view, setView] = useState<'shelf' | 'list'>('shelf')
  const [opening, setOpening] = useState<Entry | null>(null)
  const openingRef = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let frame = 0
    const move = (event: MouseEvent) => {
      cursorRef.current = { x: event.clientX, y: event.clientY }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const { x, y } = cursorRef.current
        if (pointerElement.current) pointerElement.current.style.transform = `translate3d(${x - 9}px, ${y - 9}px, 0)`
        if (pointerGlow.current && !overBooks.current) pointerGlow.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('mousemove', move) }
  }, [])

  const setOverBooks = (value: boolean) => {
    overBooks.current = value
    if (pointerGlow.current) pointerGlow.current.hidden = value
    if (pointerElement.current) pointerElement.current.dataset.overBook = String(value)
  }


  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    let frame = 0
    let lastPointer: { x: number; y: number } | null = null
    const palette = ['178,112,255', '240,112,188', '83,198,232', '103,141,255', '242,190,95', '239,140,115']
    // Cache soft colored sprites once; drawing the trail needs no per-frame filters.
    const sprites = palette.map(color => ['mist', 'glow', 'star'].map(kind => {
      const sprite = document.createElement('canvas')
      sprite.width = sprite.height = 128
      const brush = sprite.getContext('2d')!
      const gradient = brush.createRadialGradient(64, 64, 0, 64, 64, 64)
      const stops = kind === 'mist' ? [[0, .38], [.28, .22], [.65, .07], [1, 0]] : [[0, .95], [.16, .85], [.36, .25], [.7, .06], [1, 0]]
      stops.forEach(([stop, alpha]) => gradient.addColorStop(stop, `rgba(${color},${alpha})`))
      brush.fillStyle = gradient; brush.fillRect(0, 0, 128, 128)
      if (kind === 'star') {
        brush.fillStyle = `rgba(${color},.8)`
        brush.beginPath()
        brush.moveTo(64, 26); brush.lineTo(68, 60); brush.lineTo(102, 64); brush.lineTo(68, 68)
        brush.lineTo(64, 102); brush.lineTo(60, 68); brush.lineTo(26, 64); brush.lineTo(60, 60)
        brush.closePath(); brush.fill()
      }
      return sprite
    }))
    const trail: {
      x: number; y: number; born: number; size: number; life: number;
      vx: number; vy: number; phase: number; color: number; kind: number; opacity: number;
    }[] = []
    // Fewer ambient motes, but a wider spread of sizes so the field reads as depth.
    const particles = Array.from({ length: 24 }, (_, index) => ({
      x: Math.random(), y: Math.random(), size: .35 + Math.pow(Math.random(), 2.2) * 2.6, speed: .0003 + Math.random() * .0008, phase: index * .73,
    }))
    const resize = () => {
      const ratio = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.round(window.innerWidth * ratio)
      canvas.height = Math.round(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const leave = () => { lastPointer = null }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches || reducedMotion.matches || overBooks.current) { leave(); return }
      const current = { x: event.clientX, y: event.clientY }
      if (lastPointer) {
        const distance = Math.hypot(current.x - lastPointer.x, current.y - lastPointer.y)
        const count = Math.min(2, Math.floor(distance / 12))
        for (let index = 0; index < count; index++) {
          const progress = (index + 1) / count
          const chance = Math.random()
          const kind = chance < .27 ? 0 : chance < .88 ? 1 : 2
          const spread = kind === 0 ? 26 : 20
          trail.push({
            x: lastPointer.x + (current.x - lastPointer.x) * progress + (Math.random() - .5) * spread,
            y: lastPointer.y + (current.y - lastPointer.y) * progress + (Math.random() - .5) * spread,
            born: performance.now(),
            // Sizes skew small so the occasional large mote still reads as a highlight.
            size: kind === 0 ? 14 + Math.pow(Math.random(), 1.7) * 26 : kind === 1 ? 5 + Math.pow(Math.random(), 1.6) * 17 : 7 + Math.random() * 10,
            life: kind === 0 ? 1800 + Math.random() * 700 : 1000 + Math.random() * 1000,
            vx: (Math.random() - .5) * 55, vy: (Math.random() - .5) * 45,
            phase: Math.random() * Math.PI * 2, color: Math.floor(Math.random() * palette.length), kind,
            opacity: .4 + Math.random() * .45,
          })
        }
        if (trail.length > 64) trail.splice(0, trail.length - 64)
      }
      lastPointer = current
    }
    const draw = (time: number) => {
      const w = window.innerWidth; const h = window.innerHeight
      context.clearRect(0, 0, w, h)
      if (overBooks.current) { trail.length = 0; frame = requestAnimationFrame(draw); return }
      particles.forEach((particle, index) => {
        const x = particle.x * w + Math.sin(time * particle.speed + particle.phase) * 18
        const y = particle.y * h + Math.cos(time * particle.speed * .8 + particle.phase) * 14
        const dx = x - cursorRef.current.x; const dy = y - cursorRef.current.y; const distance = Math.sqrt(dx * dx + dy * dy)
        const pull = Math.max(0, 1 - distance / 240)
        const px = x - dx * pull * .08; const py = y - dy * pull * .08
        context.beginPath(); context.arc(px, py, particle.size + pull * (2 + index % 4), 0, Math.PI * 2)
        context.fillStyle = `rgba(${palette[index % palette.length]},${.12 + (index % 5) * .025 + pull * .4})`; context.fill()
      })
      for (let index = trail.length - 1; index >= 0; index--) {
        if (time - trail[index].born >= trail[index].life) trail.splice(index, 1)
      }
      trail.forEach(particle => {
        const age = Math.max(0, (time - particle.born) / particle.life)
        const breath = 1 + Math.sin(particle.phase + age * Math.PI * 3) * .18
        const radius = particle.size * breath * (particle.kind === 0 ? 1 + age * .6 : 1 - age * .35)
        const x = particle.x + particle.vx * age + Math.sin(particle.phase + age * 4) * age * 8
        const y = particle.y + particle.vy * age
        context.globalAlpha = particle.opacity * Math.min(1, age * 12) * Math.pow(1 - age, 1.25)
        context.drawImage(sprites[particle.color][particle.kind], x - radius, y - radius, radius * 2, radius * 2)
      })
      context.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }
    const syncAnimation = () => {
      cancelAnimationFrame(frame)
      trail.length = 0; leave()
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(draw)
    }
    resize(); syncAnimation()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', syncAnimation)
    reducedMotion.addEventListener('change', syncAnimation)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', syncAnimation)
      reducedMotion.removeEventListener('change', syncAnimation)
    }
  }, [])

  useLayoutEffect(() => {
    const target = pendingScroll.current
    if (!target) return
    pendingScroll.current = null
    if (target.section) scrollToSection(target.section, 'instant')
    else window.scrollTo({ top: target.top ?? 0, behavior: 'instant' })
    if (!selected && target.top !== undefined) document.getElementById(`entry-${returnProject.current}`)?.focus({ preventScroll: true })
  }, [selected, active])

  useEffect(() => {
    if (selected) return
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(visible.target.id)
    }, { rootMargin: '-15% 0px -40% 0px', threshold: [0, .2, .5] })
    ;sections.forEach(([id]) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [selected])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = siteRef.current
    const observer = new IntersectionObserver(entries => entries.forEach(item => {
      if (item.isIntersecting) { item.target.classList.add('is-revealed'); observer.unobserve(item.target) }
    }), { threshold: .08, rootMargin: '0px 0px -20px 0px' })
    root?.classList.add('motion-ready')
    root?.querySelectorAll('[data-reveal]').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [selected, view])

  const returnProject = useRef('')
  const navigate = (section: string) => {
    pendingScroll.current = { section }
    setSelected(null); setActive(section)
    if (!selected) {
      pendingScroll.current = null
      scrollToSection(section, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth')
    }
  }
  const goHome = () => navigate('home')
  const backToWork = () => { pendingScroll.current = { top: returnPosition.current }; setSelected(null); setActive(selected ? collection(selected) : 'work') }
  const openProject = (project: Entry) => {
    setOverBooks(false)
    if (openingRef.current) return
    if (!selected) { returnPosition.current = window.scrollY; returnProject.current = project.id }
    setCursorLabel('')
    if (project.kind === 'project' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      openingRef.current = true
      setOpening(project)
      pendingScroll.current = { top: 0 }
      setSelected(project); setActive('project')
    } else {
      pendingScroll.current = { top: 0 }
      setSelected(project); setActive('project')
    }
  }
  useEffect(() => {
    if (!opening) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const finish = window.setTimeout(() => { setOpening(null); openingRef.current = false }, 1050)
    return () => { clearTimeout(finish); document.body.style.overflow = overflow }
  }, [opening])


  return <div ref={siteRef} className={`site ${selected ? 'project-mode' : ''}`}>
    {!selected && <PortfolioSky />}
    <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
    <div ref={pointerGlow} className="pointer-glow" aria-hidden="true" />
    <div ref={pointerElement} className="cursor-orbit" aria-hidden="true"><span>{cursorLabel}</span></div>
    <header className="site-header">
      {selected ? <button className="header-back" onClick={backToWork}><span aria-hidden="true">←</span> back</button> : <button className="wordmark" onClick={goHome} aria-label="Zoey，返回首页"><span>z</span> / ZOEY</button>}
      <nav className="top-nav" aria-label="主要栏目">{sections.slice(1, 4).map(([id, label]) => <button key={id} aria-current={(selected ? collection(selected) === id : active === id) ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}</nav>
      <div className="header-actions"><ContactMenu /><button onClick={() => setDialog('feedback')}>提建议 ↗</button></div>
    </header>
    {selected ? <EntryDetail key={selected.id} entry={selected} onBack={backToWork} onOpen={openProject} /> : <main>
      <section className="hero orbit-hero" id="home">
        <div className="hero-planets" aria-hidden="true">
          <div className="hero-planet hero-planet-saturn"><PlanetBody planet="saturn" /></div>
          <div className="hero-planet hero-planet-moon"><PlanetBody planet="moon" /></div>
          <div className="hero-planet hero-planet-uranus"><PlanetBody planet="uranus" /></div>
        </div>
        <div className="hero-orbit-intro" onPointerEnter={() => pointerElement.current?.classList.add('is-hero-text')} onPointerLeave={() => pointerElement.current?.classList.remove('is-hero-text')}>
          <p className="eyebrow">YUAN ZONGYI / PRODUCT · AI · IMAGING</p>
          <p className="hero-greeting">Hello, I'm</p>
          <h1><span className="hero-name-line">Zoey Yuan</span></h1>
          <p className="hero-role">An AI Product Manager</p>
        </div>
        <div className="hero-orbit-map">
          <button className="orbit-entry orbit-baidu" onClick={() => openProject(internships[0]!)}><span className="orbit-entry-planet" aria-hidden="true"><PlanetBody planet="jupiter" /></span><span><small>INTERNSHIP 01</small><strong>百度 · AI 工具产品</strong></span></button>
          <button className="orbit-entry orbit-lenovo" onClick={() => openProject(internships[1]!)}><span className="orbit-entry-planet" aria-hidden="true"><PlanetBody planet="venus" /></span><span><small>INTERNSHIP 02</small><strong>联想 moto · AI 产品</strong></span></button>
          <button className="orbit-entry orbit-projects" onClick={() => navigate('work')}><span className="orbit-entry-planet" aria-hidden="true"><PlanetBody planet="saturn" /></span><span><small>SELECTED WORK</small><strong>项目作品</strong></span></button>
          <button className="orbit-entry orbit-about" onClick={() => navigate('about')}><span className="orbit-entry-planet" aria-hidden="true"><PlanetBody planet="moon" /></span><span><small>MORE ABOUT ME</small><strong>关于我</strong></span></button>
          <ParticlePortrait />
          <SkillConstellation />
        </div>
        <div className="hero-orbit-actions">
          <span>MOVE / CLICK / EXPLORE</span>
          <button className="resume-link" onClick={() => setDialog('resume')}>查看简历 <small>RESUME ↗</small></button>
          <button onClick={() => openProject(photography)}>从影像认识我 ↗</button>
        </div>
      </section>
      <section className="internship-section" id="internships"><div className="section-top"><div><p className="section-index">01 / EXPERIENCE</p><h2 className="section-heading">在真实业务里，<br /><em>把事情向前推进。</em></h2><p className="editorial-english">From insight to impact.</p></div><p className="editor-note">AI 产品 / 手机产品<br />职责 · 判断 · 协作 · 落地</p></div><ExperienceIndex onOpen={openProject} /></section>
      <section className="work-section" id="work">
        <div className="section-top"><div><p className="section-index">02 / PROJECTS</p><h2 className="section-heading">想法的<em>陈列室。</em></h2><p className="editorial-english">A collection of possibilities.</p></div></div>
        <div className="project-category product-category"><div className="project-category-heading"><div><p className="section-index">PRODUCT WORK</p><h3>产品设计作品。</h3></div><div className="view-switch" role="group" aria-label="产品作品浏览方式"><button aria-pressed={view === 'shelf'} onClick={() => setView('shelf')}>书架</button><button aria-pressed={view === 'list'} onClick={() => setView('list')}>列表</button></div></div><p className="collection-note">从调研、方案到模型与交互，记录五次不同的设计实践。</p><div className={view === 'shelf' ? 'project-shelf' : 'project-list'} onPointerEnter={() => setOverBooks(true)} onPointerLeave={() => setOverBooks(false)}>{projects.map((entry, index) => <button className={view === 'shelf' ? 'shelf-item interactive-book' : 'book-list-item interactive-book'} id={`entry-${entry.id}`} key={entry.id} style={{ '--project-color': entry.color, '--book-weight': [60, 64, 58, 70, 62][index], '--book-height': `${[352, 370, 340, 390, 355][index]}px` } as React.CSSProperties} onPointerEnter={startBookMotion} onPointerMove={moveBook} onPointerLeave={stopBookMotion} onClick={() => openProject(entry)} onMouseEnter={() => setCursorLabel('查看')} onMouseLeave={() => setCursorLabel('')}>
        {view === 'shelf' ? <><ProjectBook entry={entry} /><span className="shelf-info"><small>{entry.type}</small><strong>{entry.title} ↗</strong><span>{entry.description}</span></span></> : <><span className={`standing-book standing-${entry.id}`}><span className="standing-spine"><small>{entry.number}</small><strong>{entry.title}</strong><em>{entry.mark}</em><small>{entry.date?.slice(0, 4)}</small></span><span className="book-page-edge" /><span className="book-top-edge" /><span className="book-back-cover" /><ProjectBook entry={entry} /></span></>}
      </button>)}{view === 'list' && <BlankBooks />}</div></div>
      </section>
      <AboutSection onOpen={openProject} photography={photography} />
      <ContactSection />
      <footer className="site-footer"><span>© 2026 ZOEY</span><span>PRODUCT, WITH A DIFFERENT PERSPECTIVE.</span><button onClick={goHome}>回到首页 ↑</button></footer>
    </main>}
    {opening && <div className="book-opening-overlay" role="status" aria-label={`正在翻开${opening.title}`}><div className="presentation-page" aria-hidden="true"><ProjectBook entry={opening} /></div></div>}
    {dialog && <PortfolioDialog kind={dialog} onClose={() => setDialog(null)} />}
  </div>
}

const emptyChapters: Chapter[] = []

function BlankBooks() {
  return <>{['#675171', '#a18b64', '#30283d', '#84718c', '#514254', '#bdad8d', '#6d596f', '#2b2634'].map((color, index) => <span className="placeholder-book" aria-hidden="true" key={color} style={{ '--blank-color': color, '--book-weight': [54, 66, 48, 60, 56, 72, 52, 64][index], '--book-height': `${[345, 380, 330, 360, 350, 385, 340, 365][index]}px` } as React.CSSProperties}><span className="standing-book"><span className="standing-spine"><i /><i /></span><span className="book-page-edge" /><span className="book-top-edge" /><span className="book-back-cover" /><span className="blank-front" /></span></span>)}</>
}

function ProjectBook({ entry }: { entry: Entry }) {
  return <span className={`shelf-cover book-jacket jacket-${entry.id}`}>
    <span className="book-spine">{entry.title} / {entry.number}</span>
    <span className="jacket-volume">SELECTED WORK / VOL. {entry.number}</span>
    <CoverArt id={entry.id} />
    <strong className="jacket-title">{entry.title}</strong>
    <span className="jacket-english">{entry.mark}</span>
    <span className="jacket-bottom"><span>{entry.type}</span><span>YUAN ZONGYI<br />{entry.date?.slice(0,4)}</span></span>
  </span>
}

function CoverArt({ id }: { id: string }) {
  if (id === 'coffee') return <svg className="jacket-art cover-art art-cup" viewBox="0 0 260 210" aria-hidden="true">
    <circle cx="130" cy="108" r="72" fill="none" stroke="currentColor" opacity=".35" />
    <circle cx="130" cy="108" r="56" fill="currentColor" opacity=".09" />
    <path d="M130 66 C104 92 108 128 130 150 C152 128 156 92 130 66 Z" fill="none" stroke="currentColor" strokeWidth=".9" opacity=".75" />
    <path d="M130 150 L130 176" stroke="currentColor" strokeWidth=".8" opacity=".5" />
    <path d="M104 30 Q112 42 104 54 M130 24 Q138 36 130 48 M156 30 Q164 42 156 54" fill="none" stroke="currentColor" strokeWidth=".9" opacity=".45" />
    <circle className="line-bead" transform="translate(130 108)" r="11" fill="#8a5a2c" stroke="currentColor" strokeWidth=".7" />
  </svg>
  if (id === 'earlybird') return <svg className="jacket-art cover-art art-line" viewBox="0 0 260 210" aria-hidden="true">
    <circle cx="150" cy="98" r="67" fill="none" stroke="currentColor" opacity=".4" />
    <circle cx="150" cy="98" r="38" fill="currentColor" opacity=".1" />
    <path d="M32 180 L228 40" fill="none" stroke="currentColor" strokeWidth=".9" />
    <circle className="line-bead" transform="translate(90.8 138)" r="14" fill="#805593" stroke="#684477" strokeWidth=".7" />
    <circle cx="228" cy="40" r="2" fill="currentColor" /><circle cx="32" cy="180" r="2" fill="currentColor" />
  </svg>
  if (id === 'eimusic') return <svg className="jacket-art cover-art art-disc" viewBox="0 0 260 210" aria-hidden="true">
    <g className="rotating-disc" transform="rotate(0 130 105)"><circle cx="130" cy="105" r="80" fill="none" stroke="#b48ccf" strokeWidth=".7" strokeDasharray="220 28 140 114" /><circle cx="130" cy="105" r="62" fill="none" stroke="#b48ccf" strokeWidth=".7" /><circle cx="130" cy="105" r="43" fill="none" stroke="#b48ccf" strokeWidth=".7" strokeDasharray="150 20 70 30" /><path d="M130 25 L130 72 M130 138 L130 185" stroke="#dec68a" strokeWidth="1" /><circle cx="130" cy="25" r="5" fill="#dec68a" /><circle cx="130" cy="105" r="22" fill="#d8b66d" fillOpacity=".12" stroke="#dec68a" strokeWidth=".7" /><path d="M113 113 Q130 80 147 113" stroke="#dec68a" fill="none" /></g>
    <path d="M22 160 L238 50" stroke="#dec68a" strokeOpacity=".35" strokeWidth=".7" />
  </svg>
  if (id === 'oldtravel') return <svg className="jacket-art cover-art art-orbits" viewBox="0 0 260 210" aria-hidden="true">
    <g transform="translate(130 105) rotate(-24)"><ellipse rx="92" ry="42" fill="none" stroke="#b28fe7" strokeWidth=".8" /><circle className="orbit-bead" transform="translate(77.5 -22.6)" r="8" fill="#d8b66d" /></g>
    <g transform="translate(130 105) rotate(32)"><ellipse rx="82" ry="38" fill="none" stroke="#d8b66d" strokeWidth=".8" /><circle className="orbit-bead-secondary" transform="translate(-69 20.5)" r="6" fill="#b28fe7" /></g><circle cx="130" cy="105" r="2" fill="#c5a7dd" />
  </svg>
  return <span className="jacket-art" aria-hidden="true"><i /><i /><i /><i /><i className="growing-ring" /><i className="growing-ring" style={{ '--ring-delay': '-.8s' } as React.CSSProperties} /><i className="growing-ring" style={{ '--ring-delay': '-1.6s' } as React.CSSProperties} /></span>
}

function PracticeArtwork({ company }: { company: 'ai' | 'mobile' }) {
  return <span className={`practice-art art-${company}`} aria-hidden="true">
    <span className="practice-orbit" /><span className="practice-orbit orbit-secondary" />
    {company === 'ai' ? <><span className="image-plane plane-back"><i /><i /></span><span className="image-plane plane-front"><span>✦</span><i /></span><span className="art-axis">IMAGES, IN MOTION</span><span className="art-coordinate">01 / AI ECOSYSTEM</span></> : <><span className="fold-paper fold-left"><i /><i /><i /></span><span className="fold-paper fold-right"><i /><i /><i /></span><span className="art-axis">A DIFFERENT PERSPECTIVE</span><span className="art-coordinate">02 / MOBILE EXPERIENCE</span></>}
  </span>
}

function ExperienceIndex({ onOpen }: { onOpen: (entry: Entry) => void }) {
  return <div className="practice-index">{internships.map((entry, index) => <button id={`entry-${entry.id}`} className={`practice-entry practice-${entry.id}`} data-reveal key={entry.id} onClick={() => onOpen(entry)}>
    <span className="practice-caption"><span>FIELD NOTES / {entry.number}</span><span>{entry.date}</span></span>
    <span className="practice-content"><span className="practice-copy"><span className="practice-company-en">{index === 0 ? 'BAIDU' : 'LENOVO / MOTO'}</span><strong className="practice-company">{index === 0 ? '百度' : '联想 moto'}<span>↗</span></strong><span className="practice-role">{entry.role} <i>/</i> {entry.type}</span><span className="practice-summary">{index === 0 ? '从修图客户端，到照片直播。\n沿着影像的工作流，寻找产品可以向前一步的地方。' : '把 AI 放进日常使用场景。\n参与手机 AI 功能规划、用户研究与新品体验。'}</span><span className="practice-topics">{index === 0 ? 'To B · AI 修图　/　To C · 照片直播' : 'AI 功能规划　/　用户研究　/　策略信息'}</span><span className="practice-read">阅读这段经历 <i>→</i></span></span><PracticeArtwork company={entry.id === 'ai' ? 'ai' : 'mobile'} /></span>
  </button>)}</div>
}

function WorkIndex({ chapters }: { chapters: Chapter[] }) {
  const groups = Array.from(new Set(chapters.flatMap(chapter => chapter.group ? [chapter.group] : [])))
  if (!groups.length) return null
  return <div className="work-index"><div className="work-index-heading"><span>SELECTED CONTRIBUTIONS</span><span>{groups.length}条业务线，{chapters.filter(chapter => chapter.group).length}项工作记录。</span></div>{groups.map((group, groupIndex) => <div className={`work-domain domain-${groupIndex}`} key={group}><div className="domain-intro"><span className="domain-letter" aria-hidden="true">{groupIndex === 0 ? 'B' : 'C'}</span><span className="domain-label">FOR {groupIndex === 0 ? 'BUSINESS' : 'CREATORS'}</span><h3>{group}</h3><p>{groupIndex === 0 ? '沿着专业影像工作流，\n梳理链路与高频操作。' : '进入拍摄与分享现场，\n处理图片组织与联机体验。'}</p></div><div className="domain-features">{chapters.map((chapter, index) => chapter.group === group && <button key={chapter.title} onClick={() => document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: 'smooth' })}><span className="feature-sequence">{String(index).padStart(2, '0')}</span><span className="feature-label"><span>{chapter.title}</span><small>{chapter.english}</small></span><span className="feature-visit" aria-hidden="true">↗</span></button>)}</div></div>)}</div>
}

type ContactPlanet = 'moon' | 'venus' | 'uranus' | 'jupiter' | 'saturn'
const contactPlanets: ContactPlanet[] = ['moon', 'venus', 'uranus', 'jupiter']

function PlanetBody({ planet }: { planet: ContactPlanet }) {
  return <span className={`planet-body planet-body-${planet}`}>
    <img src={`/portfolio/planets/${planet}.webp`} alt="" width={512} height={512} loading="lazy" draggable={false} />
  </span>
}

function ContactSection() {
  const [activeConstellation, setActiveConstellation] = useState<string | null>(null)
  // Feedback lives on the planet that was copied, so the label can swap in place.
  const [copiedLabel, setCopiedLabel] = useState('')
  const copyTimer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(copyTimer.current), [])
  const copy = async (item: { label: string; value: string }) => {
    clearTimeout(copyTimer.current)
    try {
      await navigator.clipboard.writeText(item.value)
    } catch {
      return
    }
    setCopiedLabel(item.label)
    copyTimer.current = setTimeout(() => setCopiedLabel(''), 2200)
  }
  return <section className="contact-section contact-constellation-section" id="contact">
    {(['saturn', 'venus', 'jupiter', 'moon', 'uranus'] as const).map(planet =>
      <div className={`cosmic-planet cosmic-${planet}`} key={planet} aria-hidden="true"><PlanetBody planet={planet} /></div>
    )}
    <div className="contact-center">
      <div className="contact-heading">
        <p className="section-index">04 / CONTACT CONSTELLATION</p>
        <h2 className="section-heading">在星体之间，<em>发现连接点。</em></h2>
        <p className="editorial-english">Choose a planet. Follow the signal.</p>
      </div>
      <div className="contact-systems" aria-label="联系方式">
        {contactDetails.map((item, index) => <div className={`contact-system contact-system-${index} ${copiedLabel === item.label ? 'is-copied' : ''}`} key={item.label}>
          <button className="contact-core" onClick={() => item.href ? window.open(item.href, '_blank', 'noopener,noreferrer') : copy(item)} aria-label={`${item.href ? '打开' : '复制'}${item.label}：${item.value}`}>
            <small>{item.label}</small><strong>{item.value}</strong><em>{item.href ? 'OPEN ↗' : copiedLabel === item.label ? '已复制' : 'COPY'}</em>
          </button>
          <span className="contact-orbit-plane" aria-hidden="true">
            <span className="contact-orbit-path" />
            <span className="contact-orbit-revolution">
              <span className="contact-satellite-position">
                <span className="contact-satellite-counterspin">
                  <span className="contact-satellite"><PlanetBody planet={contactPlanets[index]} /></span>
                </span>
              </span>
            </span>
          </span>
        </div>)}
      </div>
      <div className={`constellation-map ${activeConstellation ? 'is-focused' : ''}`} aria-label="星座导航">
        {constellations.map((constellation, index) => <button key={constellation.name} className={`constellation constellation-${index} ${activeConstellation === constellation.name ? 'is-active' : ''}`} onClick={() => setActiveConstellation(activeConstellation === constellation.name ? null : constellation.name)} aria-label={`查看${constellation.name}`} aria-pressed={activeConstellation === constellation.name}><span className="constellation-lines" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">{constellation.points.slice(1).map((point, pointIndex) => { const previous = constellation.points[pointIndex]!; return <line key={pointIndex} x1={previous[0]} y1={previous[1]} x2={point[0]} y2={point[1]} /> })}</svg>{constellation.points.map((point, pointIndex) => <i key={pointIndex} style={{ '--star-x': `${point[0]}%`, '--star-y': `${point[1]}%` } as React.CSSProperties} />)}</span><small>{constellation.name}</small></button>)}
      </div>
      <p className="visually-hidden" role="status">{copiedLabel ? `${copiedLabel}已复制` : ''}</p>
      <a className="contact-credits" href="/portfolio/planets/CREDITS.txt" target="_blank" rel="noopener noreferrer">Textures · Solar System Scope / CC BY 4.0</a>
    </div>
  </section>
}

function ProductSourceSpread({ entry, next, onOpen }: { entry: Entry; next?: Entry; onOpen: (entry: Entry) => void }) {
  const range = productPageRanges[entry.id]
  const brief = range ? [] : entry.chapters ?? []
  if (!range && !brief.length) return null
  const pages = range ? Array.from({ length: range[1] - range[0] + 1 }, (_, index) => range[0] + index) : []
  return <section className="product-source-spread" aria-label={`${entry.title}作品集页面`}>
    <div className="product-source-intro"><p className="section-index">PRODUCT ARCHIVE / {entry.number}</p><h2>{entry.title}</h2><p>{range ? '作品集页面连续阅读' : '产品定义与可交互原型'}</p></div>
    {!!pages.length && <div className="product-source-pages">{pages.map(page => <figure key={page}><img src={`/portfolio/page-${String(page).padStart(2, '0')}.webp`} alt={`${entry.title} · 作品集第${page}页`} width={3000} height={1062} loading={page === range[0] ? 'eager' : 'lazy'} /><figcaption>PAGE {String(page).padStart(2, '0')}</figcaption></figure>)}</div>}
    {!!brief.length && <div className="product-source-brief">{brief.map((chapter, index) => <section className="brief-block" id={`chapter-${index}`} key={chapter.title}>
      <div className="brief-heading"><p className="section-index">{String(index + 1).padStart(2, '0')} / {chapter.english.toUpperCase()}</p><h3>{chapter.title}</h3></div>
      <div className="brief-body">
        {chapter.paragraphs.map((text, paragraph) => <p key={paragraph}>{text}</p>)}
        {!!chapter.blocks?.length && <ul className="brief-points">{chapter.blocks.map(block => <li key={block.label}><strong>{block.label}</strong><span>{block.body}</span></li>)}</ul>}
        {chapter.journey && <JourneyBoard journey={chapter.journey} />}
        {chapter.note && <p className="brief-note">{chapter.note}</p>}
      </div>
    </section>)}</div>}
    {entry.prototype && <div className="product-source-prototype"><p className="section-index">LIVE PROTOTYPE / 可点击体验</p><EmbeddedPrototype prototype={entry.prototype} /></div>}
    <div className="product-source-next">{next ? <button onClick={() => onOpen(next)}><small>NEXT PROJECT</small><strong>{next.title} <span>→</span></strong></button> : <span>END OF PRODUCT ARCHIVE</span>}</div>
  </section>
}

function JourneyBoard({ journey }: { journey: Journey }) {
  return <div className="journey-board">
    <div className="journey-board-header"><span>{journey.window}</span><small>{journey.note}</small></div>
    <div className="journey-scroll">
      <div className="journey-track">{journey.stages.map((stop, index) => <div className="journey-stop" key={stop.stage}><i>{String(index + 1).padStart(2, '0')}</i><strong>{stop.stage}</strong><span>{stop.moment}</span></div>)}</div>
      <div className="journey-lanes">{journey.lanes.map(lane => <div className="journey-lane" key={lane.label}>
        <p>{lane.label} <small>{lane.english}</small></p>
        <div className="journey-lane-cells">{lane.cells.map((cell, index) => <span key={index}>{cell}</span>)}</div>
      </div>)}</div>
    </div>
    <div className="service-actors">{journey.actors.map((actor, index) => <span className={`actor-${['student', 'kitchen', 'cart'][index] ?? 'student'}`} key={actor}>{actor}</span>)}<b>{journey.summary}</b></div>
  </div>
}

function RebuiltProjectPreview({ entry, chapters }: { entry: Entry; chapters: Chapter[] }) {
  if (entry.id !== 'earlybird') return null
  return <div className="rebuilt-project-preview" aria-label="早早鸟项目重绘内容">
    <div className="rebuilt-project-intro">
      <p className="section-index">REBUILT CASE STUDY / FIRST PASS</p>
      <h2>先把问题看清，再把服务接起来。</h2>
      <p>将作品集中的调研信息拆成可阅读的内容层：数据负责说明规模，标签负责呈现差异，流程负责展示问题如何进入方案。</p>
    </div>
    {chapters.slice(0, 2).map((chapter, index) => <section id={`chapter-${index}`} className={`rebuilt-project-section rebuilt-section-${index}`} key={chapter.title}>
      <div className="rebuilt-project-heading">
        <span className="chapter-number">{String(index + 1).padStart(2, '0')}</span>
        <div><p className="section-index">{chapter.english.toUpperCase()}</p><h3>{chapter.title}</h3><p>{index === 0 ? '从大学生的早餐选择开始，观察时间、路径和供给压力如何叠加。' : '把问卷、访谈和流程观察收敛成一条可以被设计的服务链。'}</p></div>
      </div>
      {index === 0 ? <div className="research-canvas">
        <div className="research-copy-column">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}<div className="floating-tags" aria-label="早餐问题标签">{['起床晚', '赶课', '到食堂绕路', '排队太久', '选择有限', '口味不确定', '想吃得健康', '不知道今天吃什么'].map((tag, tagIndex) => <span key={tag} style={{ '--tag-delay': `${tagIndex * -0.45}s`, '--tag-tilt': `${tagIndex % 2 ? 2 : -2}deg` } as React.CSSProperties}>{tag}</span>)}</div></div>
        <div className="research-data-wall">
          <div className="data-number data-number-main"><strong>203</strong><span>有效问卷<br />VALID RESPONSES</span></div>
          <div className="data-number"><strong>10</strong><span>大学生访谈</span></div><div className="data-number"><strong>3 + 1</strong><span>食堂工作人员<br />食品专家</span></div>
          <div className="research-bars"><div className="research-bar-head"><span>被时间推着走</span><b>41%</b></div><div className="research-bar"><i style={{ width: '41%' }} /></div><small>不吃早餐的原因中，时间紧是最直接的阻力</small><div className="research-bar-head"><span>校内食堂是主要场景</span><b>70%</b></div><div className="research-bar"><i style={{ width: '70%' }} /></div><small>设计必须进入校园日常，而不是增加新的路线</small></div>
          <div className="interview-constellation"><p>INTERVIEW CONSTELLATION / 14 VOICES</p><div className="interview-nodes">{Array.from({ length: 14 }, (_, node) => <i key={node} className={node < 10 ? 'student-node' : node < 13 ? 'canteen-node' : 'expert-node'} style={{ '--node-index': node } as React.CSSProperties} />)}</div><div className="interview-legend"><span><i className="student-node" />学生 10</span><span><i className="canteen-node" />食堂 3</span><span><i className="expert-node" />专家 1</span></div></div>
          <figure className="research-source-fragment"><img src="/project-figures/earlybird-research.webp" alt="早早鸟原始调研版面局部" /><figcaption>原始材料中的问题聚类，转化为网页上的标签与关系节点</figcaption></figure>
        </div>
      </div> : <div className="service-canvas">
        <div className="service-copy-column">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}<div className="service-opportunity"><small>DESIGN OPPORTUNITY</small><strong>把“想吃早餐”变成一条更短的路径</strong><span>预约 → 备餐 → 配送 → 取餐 → 反馈</span></div></div>
        <div className="journey-board"><div className="journey-board-header"><span>USER JOURNEY / 07:00—08:00</span><small>从早晨的混乱到可预期</small></div><div className="journey-track">{['醒来', '决定', '预约', '等待', '取餐', '反馈'].map((stage, stageIndex) => <div className="journey-stop" key={stage}><i>{String(stageIndex + 1).padStart(2, '0')}</i><strong>{stage}</strong><span>{['赶课时间', '不知道吃什么', '选择早餐搭配', '查看取餐号码', '扫码取餐', '评价与建议'][stageIndex]}</span></div>)}</div><div className="service-layers"><div><small>USER</small><span>选择 / 等待 / 取餐 / 反馈</span></div><div><small>FRONTSTAGE</small><span>推荐 / 提醒 / 识别 / 出餐</span></div><div><small>BACKSTAGE</small><span>备餐 / 打包 / 配送 / 回收</span></div></div><div className="service-actors"><span className="actor-student">学生</span><span className="actor-kitchen">食堂</span><span className="actor-cart">智能餐车</span><b>一条服务链</b></div></div>
      </div>}
    </section>)}
    <div className="rebuilt-project-next"><span>CONTINUE THE STORY</span><strong>接下来：界面如何承接这条服务链 →</strong></div>
  </div>
}

const portfolioPdfPages: Record<string, number> = { earlybird: 4, eimusic: 15, oldtravel: 22, noselover: 30 }

function CaseOpening({ entry }: { entry: Entry }) {
  const isProject = entry.kind === 'project'
  return <section id="detail-overview" className={`detail-hero case-opening ${isProject ? 'opening-project' : 'opening-practice'}`} style={{ '--project-color': entry.color } as React.CSSProperties}>
    <div className="opening-copy" data-reveal><p className="section-index">{entry.number} / {isProject ? 'SELECTED PROJECT' : entry.kind === 'internship' ? 'IN PRACTICE' : 'VISUAL DIARY'}</p><h1>{entry.title}</h1><p className="opening-english">{isProject ? entry.mark : entry.kind === 'internship' ? 'Working through the details.' : 'Through a different lens.'}</p><p className="opening-description">{entry.description}</p>{entry.date && <div className="opening-meta"><span><small>WHEN</small>{entry.date}</span><span><small>{isProject ? 'MY PART' : 'ROLE'}</small>{entry.role}</span></div>}
    <button className="opening-explore" onClick={() => document.getElementById('chapter-0')?.scrollIntoView({ behavior: 'smooth' })}><span>↓</span>{isProject ? '走进这个项目' : '展开工作记录'} <small>EXPLORE THE STORY</small></button>
    {isProject && portfolioPdfPages[entry.id] && <a className="opening-source" href={`/documents/yuanzongyi-portfolio.pdf#page=${portfolioPdfPages[entry.id]}`} target="_blank" rel="noreferrer">原始作品集 PDF ↗</a>}</div>
    {isProject ? <div className="opening-book" aria-hidden="true"><span className="opening-circle" /><ProjectBook entry={entry} /><span className="opening-edition">A STUDY BY YUAN ZONGYI<br />DESIGN ARCHIVE / {entry.number}</span></div> : entry.kind === 'internship' ? <div className="opening-practice-art"><PracticeArtwork company={entry.id === 'ai' ? 'ai' : 'mobile'} /></div> : null}
  </section>
}

function EntryDetail({ entry, onBack, onOpen }: { entry: Entry; onBack: () => void; onOpen: (entry: Entry) => void }) {
  const siblings = entry.kind === 'internship' ? internships : entry.kind === 'project' ? projects : []
  const position = siblings.findIndex(item => item.id === entry.id)
  const previous = siblings[position - 1]
  const next = siblings[position + 1]
  const chapters = entry.chapters ?? emptyChapters
  const [currentChapter, setCurrentChapter] = useState(0)
  const [expandedImage, setExpandedImage] = useState<{ src: string; label: string } | null>(null)
  const chapterLinks = [{ id: 'detail-overview', title: '概览', english: 'Overview', group: undefined as string | undefined }, ...chapters.map((chapter, index) => ({ id: `chapter-${index}`, title: chapter.title, english: chapter.english, group: chapter.group }))]

  useEffect(() => {
    let frame = 0
    const update = () => {
      const ids = ['detail-overview', ...chapters.map((_, index) => `chapter-${index}`)]
      let current = 0
      ids.forEach((id, index) => {
        const node = document.getElementById(id)
        if (node && node.getBoundingClientRect().top <= window.innerHeight * .4) current = index
      })
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = ids.length - 1
      setCurrentChapter(current)
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [entry.id, chapters])

  useEffect(() => {
    const timeline = document.querySelector<HTMLElement>('.story-timeline')
    const current = timeline?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!timeline || !current) return
    if (window.innerWidth <= 760) {
      const offset = current.getBoundingClientRect().left - timeline.getBoundingClientRect().left
      if (offset < 0 || offset + current.offsetWidth > timeline.clientWidth) {
        timeline.scrollLeft += offset - timeline.clientWidth / 2 + current.offsetWidth / 2
      }
      return
    }
    const offset = current.getBoundingClientRect().top - timeline.getBoundingClientRect().top
    if (offset < 0 || offset + current.offsetHeight > timeline.clientHeight) {
      timeline.scrollTop += offset - timeline.clientHeight / 2 + current.offsetHeight / 2
    }
  }, [currentChapter])

  return <main className={`project-detail case-${entry.id} kind-${entry.kind}`}>
    <div className="detail-breadcrumb">{collectionLabel(entry)} / {entry.title}</div>
    {entry.kind !== 'photography' && <aside className="case-outline" aria-label="本篇阅读脉络">
      <SiblingLink entry={previous} direction="previous" kind={entry.kind} onOpen={onOpen} /><p className="outline-eyebrow">IN THIS STORY</p><p className="outline-title">{entry.title}</p>
      <nav className="story-timeline" aria-label="详情章节" style={{ '--timeline-progress': currentChapter / (chapterLinks.length - 1) } as React.CSSProperties}>
        {chapterLinks.map((chapter, index) => <div className="timeline-item" key={chapter.id}>{chapter.group && chapter.group !== chapterLinks[index - 1]?.group && <p className="timeline-group">{chapter.group}</p>}<button className={index < currentChapter ? 'is-read' : ''} aria-current={index === currentChapter ? 'step' : undefined} onClick={() => document.getElementById(chapter.id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><i aria-hidden="true" /><span className="timeline-label"><span>{chapter.title}</span><small>{chapter.english}</small></span></button></div>)}
      </nav><span className="outline-count">{String(currentChapter + 1).padStart(2, '0')} <span>/ {String(chapterLinks.length).padStart(2, '0')}</span></span>
      <SiblingLink entry={next} direction="next" kind={entry.kind} onOpen={onOpen} />
    </aside>}
    <CaseOpening entry={entry} />
    {entry.kind === 'photography' ? <PhotographySpread onExpand={setExpandedImage} /> : entry.kind === 'project' ? <ProductSourceSpread entry={entry} next={next} onOpen={onOpen} /> : <div className="detail-chapters">{chapters.map((chapter, index) => <section id={`chapter-${index}`} key={chapter.title} className={`case-chapter ${(chapter.nativeVisual || chapter.internshipVisual) ? 'has-native-visual' : ''} ${chapter.group ? 'feature-case' : ''} ${entry.kind === 'project' ? `chapter-layout-${index % 4}` : ''}`}>
      {chapter.group && chapter.group !== chapters[index - 1]?.group && <p className="business-divider">{chapter.group}</p>}
      <div className="chapter-heading" data-reveal><p className="section-index"><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span> / {chapter.english.toUpperCase()}</p><h2>{chapter.title}</h2><p className="chapter-english">{chapter.english}</p></div>
      {chapter.story ? <InternshipCase chapter={chapter} onExpand={setExpandedImage} /> : <>
      <div className="chapter-story"><div className="chapter-prose" data-reveal>{chapter.paragraphs.map((text, paragraph) => <p className="case-paragraph" key={paragraph}>{text}</p>)}{chapter.blocks?.map(block => <div className="work-block" key={block.label}><h3>{block.label}</h3><p>{block.body}</p></div>)}</div>
      {(chapter.nativeVisual || chapter.internshipVisual || !!chapter.figures?.length) && <div className={`chapter-visuals visuals-${chapter.figures?.length ?? 0}`} data-reveal>{chapter.nativeVisual && <CaseVisual type={chapter.nativeVisual} />}{chapter.internshipVisual && <InternshipRecord type={chapter.internshipVisual} />}{chapter.figures?.map((figure, figureIndex) => <figure className="case-figure" key={figure.src}><button onClick={() => setExpandedImage({ src: figure.src, label: figure.alt })} aria-label={`放大：${figure.alt}`}><img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" /><span className="figure-expand" aria-hidden="true">↗</span></button><figcaption><small>FIG. {index + 1}.{figureIndex + 1}</small><span>{figure.caption}</span><button onClick={() => setExpandedImage({ src: figure.src, label: figure.alt })}>放大 ↗</button></figcaption></figure>)}</div>}</div>
      </>}
      {index === 0 && entry.kind === 'project' && <WorkIndex chapters={chapters} />}
      {chapter.evidence && <div className="evidence-panel"><div className="evidence-heading"><span>方案细节 <small>DESIGN DETAILS</small></span><small>{chapter.evidenceNote}</small></div><div className="evidence-grid">{chapter.evidence.map(item => <article key={item.title}><span className="evidence-icon" aria-hidden="true">↗</span><h4>{item.title}</h4><p>{item.description}</p></article>)}</div></div>}
      {chapter.pages.map(page => <figure className="portfolio-page" key={page}><button onClick={() => setExpandedImage({ src: `/portfolio/page-${String(page).padStart(2, '0')}.webp`, label: `${entry.title} · 第${page}页` })} aria-label={`放大${entry.title}作品集第${page}页`}><img src={`/portfolio/page-${String(page).padStart(2, '0')}.webp`} alt={`${entry.title} · ${chapter.title} · 原作品集第${page}页`} width={4096} height={1449} loading="lazy" /></button><figcaption>原作品集 / p.{String(page).padStart(2, '0')}</figcaption></figure>)}
    </section>)}</div>}
    {entry.sourceNote && <p className="source-note">{entry.sourceNote}</p>}
    <div className="detail-bottom"><button onClick={onBack}>← 返回刚才的浏览位置</button></div>
    {expandedImage && <ImageLightbox src={expandedImage.src} title={expandedImage.label} onClose={() => setExpandedImage(null)} />}
  </main>
}

function ImageLightbox({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    root.current?.focus()
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); if (event.key === 'Tab') { event.preventDefault(); root.current?.querySelector('button')?.focus() } }
    document.addEventListener('keydown', key)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus() }
  }, [onClose])
  return createPortal(<div className="page-lightbox" ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${title}放大阅读`}><div className="lightbox-bar"><span>{title}</span><button onClick={onClose} aria-label="关闭放大阅读">关闭 ×</button></div><div className="lightbox-scroll"><img src={src} alt={title} /></div></div>, document.body)
}

function SiblingLink({ entry, direction, kind, onOpen }: { entry?: Entry; direction: 'previous' | 'next'; kind: Entry['kind']; onOpen: (entry: Entry) => void }) {
  if (kind === 'photography' || kind === 'personal') return null
  const label = `${direction === 'previous' ? '上一' : '下一'}${kind === 'internship' ? '段实习' : '个项目'}`
  return <button className={`sibling-link ${direction}`} disabled={!entry} onClick={() => entry && onOpen(entry)}><small>{direction === 'previous' ? '↑' : '↓'} {label}</small><span>{entry?.title ?? (direction === 'previous' ? '已是第一篇' : '已是最后一篇')}</span></button>
}

// Populate these values only with the owner's confirmed contact details.
const contactDetails = [
  { label: '手机号', value: '17360543015' },
  { label: '邮箱', value: 'yuanzongyi@qq.com' },
  { label: '微信', value: 'zoey11yzy' },
  { label: 'GitHub', value: 'yuanzongyi22-zoey', href: 'https://github.com/yuanzongyi22-zoey' },
]
const constellations = [
  { name: '北斗七星', points: [[8, 66], [24, 50], [39, 58], [54, 33], [68, 43], [82, 18], [91, 24]] },
  { name: '猎户座', points: [[26, 20], [46, 36], [63, 20], [35, 70], [56, 76], [44, 51]] },
  { name: '双子座', points: [[30, 12], [45, 28], [63, 44], [77, 62], [39, 79], [58, 90]] },
  { name: '狮子座', points: [[12, 44], [28, 28], [49, 34], [62, 55], [47, 73], [73, 78]] },
]
function ContactMenu({ placement = 'header' }: { placement?: 'header' | 'section' }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [status, setStatus] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const open = hovered || pinned
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setPinned(false); setHovered(false) } }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setPinned(false); setHovered(false) } }
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [])
  const copy = async (value: string, label: string) => {
    try { await navigator.clipboard.writeText(value); setStatus(`${label}已复制`) }
    catch { setStatus('复制失败，请选中号码手动复制') }
  }
  return <div ref={root} className={`contact-menu contact-${placement}`} onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={() => setHovered(false)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) { setHovered(false); setPinned(false) } }}>
    <button className="contact-trigger" aria-expanded={open} onClick={() => { setPinned(!pinned); setHovered(false) }}>联系方式 <span>↗</span></button>
    {open && <div className="contact-popover" role="region" aria-label="联系方式"><p className="section-index">GET IN TOUCH</p><h3>保持联系</h3>{contactDetails.map(item => <div className="contact-item" key={item.label}><div><small>{item.label}</small><span>{item.value || '待补充'}</span></div><button disabled={!item.value} aria-label={`复制${item.label}`} onClick={() => copy(item.value, item.label)}>复制</button></div>)}<p className="contact-status" role="status">{status || (pinned ? '已固定 · 点击其他位置收起' : '点击联系方式可固定此卡片')}</p></div>}
  </div>
}

export function PortfolioDialog({ kind, onClose }: { kind: 'resume' | 'feedback'; onClose: () => void }) {
  const container = useRef<HTMLDivElement>(null)
  const [suggestion, setSuggestion] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (kind === 'feedback') {
      try { setSuggestion(localStorage.getItem('zoey-feedback-draft') || '') } catch { /* Keep the form usable when storage is unavailable. */ }
    }
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    container.current?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const nodes = container.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,a[href]')
        if (!nodes?.length) return
        const first = nodes[0], last = nodes[nodes.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === container.current)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === container.current)) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', keyboard)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keyboard); previous?.focus() }
  }, [kind, onClose])
  return <div className="portfolio-dialog-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose() }}><div ref={container} tabIndex={-1} className={`portfolio-dialog ${kind === 'resume' ? 'resume-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="portfolio-dialog-title"><button className="dialog-close" onClick={onClose} aria-label="关闭弹窗">×</button><p className="section-index">{kind === 'resume' ? 'RESUME / 简历' : 'A LITTLE FEEDBACK'}</p><h2 id="portfolio-dialog-title">{kind === 'resume' ? '我的简历' : '你的建议，我很想听。'}</h2>{kind === 'resume' ? <div className="resume-document"><a className="resume-download" href="/documents/yuanzongyi-resume.pdf" download="袁宗苡-简历.pdf">下载简历 PDF ↓</a><img src="/resume/resume.png" alt="袁宗苡简历：教育背景、荣誉及技能、百度与联想实习经历、早早鸟项目及内容运营实践" /></div> : <form onSubmit={event => { event.preventDefault(); try { localStorage.setItem('zoey-feedback-draft', suggestion.trim()); setMessage('草稿已保存在此浏览器，尚未发送。') } catch { setMessage('未能保存，请复制文字自行保留。') } }}><label htmlFor="feedback-text">对内容、浏览体验或交互的建议</label><textarea id="feedback-text" required maxLength={2000} value={suggestion} onChange={event => setSuggestion(event.target.value)} placeholder="我觉得这里可以……" /><p>建议接收渠道待配置，目前可以保存本地草稿。</p><button className="primary-link" type="submit" disabled={!suggestion.trim()}>保存草稿</button><p role="status">{message}</p></form>}</div></div>
}

export default App
