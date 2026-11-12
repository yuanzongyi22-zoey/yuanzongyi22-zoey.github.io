import { useEffect, useRef, useState } from 'react'
import type { CaseImage, Chapter, Prototype } from './portfolio-content'
import { InternshipRecord } from './InternshipVisuals'

export function CaseGallery({ images, onExpand }: { images: CaseImage[]; onExpand: (image: { src: string; label: string }) => void }) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  const change = (step: number) => setIndex(previous => (previous + step + images.length) % images.length)
  if (!current) return null
  return <figure className="case-gallery" aria-label="交互与界面展示">
    <div className="gallery-heading"><span>{current.kind} <small>DESIGN DETAILS</small></span><span>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span></div>
    <div className="gallery-stage" tabIndex={images.length > 1 ? 0 : undefined} role="group" aria-label="界面图片，左右方向键切换" onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <button className="gallery-image" onClick={() => onExpand({ src: current.src, label: current.alt })} aria-label={`放大：${current.alt}`}>
        <img src={current.src} alt={current.alt} width={current.width} height={current.height} loading="lazy" />
        <span className="gallery-zoom" aria-hidden="true">↗ 放大查看</span>
      </button>
      {images.length > 1 && <div className="gallery-arrows"><button aria-label="上一张界面" onClick={() => change(-1)}>←</button><button aria-label="下一张界面" onClick={() => change(1)}>→</button></div>}
    </div>
    <figcaption aria-live="polite">{current.caption}</figcaption>
    {images.length > 1 && <div className="gallery-pages" role="group" aria-label="选择界面">{images.map((image, i) => <button key={image.src} aria-label={`第${i + 1}张：${image.alt}`} aria-pressed={index === i} onClick={() => setIndex(i)}><span />{String(i + 1).padStart(2, '0')}</button>)}</div>}
  </figure>
}

export function EmbeddedPrototype({ prototype }: { prototype: Prototype }) {
  const container = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    const update = () => setNativeFullscreen(document.fullscreenElement === container.current)
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (container.current?.requestFullscreen) await container.current.requestFullscreen()
      else setFullscreen(value => !value)
    } catch { setFullscreen(value => !value) }
  }
  return <div ref={container} className={`prototype-embed ${fullscreen ? 'prototype-expanded' : ''}`} onKeyDown={event => { if (event.key === 'Escape') setFullscreen(false) }}>
    <div className="prototype-toolbar"><span><i aria-hidden="true" />可交互原型 <small>LIVE PROTOTYPE</small></span><button onClick={toggleFullscreen}>{nativeFullscreen ? '退出全屏' : fullscreen ? '收起' : '放大体验'} ⤢</button></div>
    <div className={`prototype-viewport prototype-${prototype.format}`}><iframe src={prototype.src} title={prototype.title} loading="lazy" allow="fullscreen; clipboard-write" referrerPolicy="no-referrer" onError={() => setUnavailable(true)} />{unavailable && <p className="prototype-error">原型暂时无法载入，请稍后刷新页面。</p>}</div>
    <p className="prototype-caption">{prototype.description}</p>
  </div>
}

export function InternshipCase({ chapter, onExpand }: { chapter: Chapter; onExpand: (image: { src: string; label: string }) => void }) {
  const story = chapter.story
  if (!story) return null
  const visuals = !!chapter.internshipVisual || !!chapter.gallery?.length
  return <div className="start-case">
    <div className="start-context">
      <div><p className="start-label"><b>S</b> 背景 <small>SITUATION</small></p><p>{story.situation}</p></div>
      <div><p className="start-label"><b>T</b> 目标 <small>TASK</small></p><p>{story.task}</p></div>
    </div>
    <div className={`start-execution ${visuals ? 'with-design' : ''}`}>
      <div className="start-actions"><p className="start-label"><b>A</b> 我的行动 <small>ACTION</small></p><ol>{story.actions.map((action, i) => <li key={action.title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{action.title}</h3><p>{action.body}</p></div></li>)}</ol></div>
      {visuals && <div className="start-design">{chapter.gallery?.length ? <CaseGallery images={chapter.gallery} onExpand={onExpand} /> : chapter.internshipVisual && <InternshipRecord type={chapter.internshipVisual} />}</div>}
    </div>
    {chapter.gallery?.length && chapter.internshipVisual && <div className="start-supplement"><InternshipRecord type={chapter.internshipVisual} /></div>}
    <div className="start-outcomes">
      <div><p className="start-label"><b>R</b> 结果 <small>RESULT</small></p><p>{story.result}</p></div>
      <div><p className="start-label"><b>T</b> 思考 <small>TAKEAWAY</small></p><p>{story.takeaway}</p></div>
    </div>
    {chapter.prototype && <EmbeddedPrototype prototype={chapter.prototype} />}
  </div>
}
