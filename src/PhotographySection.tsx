import { useEffect, useMemo, useRef, useState } from 'react'
import { landscapeRun, portraitSets, type FolioLayout, type Photo, type PortraitSet } from './photography-content'

type Expand = (image: { src: string; label: string }) => void
// A shoot longer than six frames runs over consecutive spreads, so a page is a plate
// of one set rather than the whole set.
type Plate = { set: PortraitSet; photos: Photo[]; part: number; parts: number }

// A shoot of more than four frames reads as consecutive spreads of the same set, split
// as evenly as possible. Four is the ceiling because a page has to keep its white space.
const folioPlates = (set: PortraitSet): Photo[][] => {
  const pages = Math.max(1, Math.ceil(set.photos.length / 4))
  const size = Math.ceil(set.photos.length / pages)
  return Array.from({ length: pages }, (_, page) => set.photos.slice(page * size, page * size + size)).filter(plate => plate.length)
}

const folioLayout = (plate: Photo[], override?: FolioLayout): FolioLayout =>
  override ?? (['solo', 'solo', 'duo', 'trio', 'quad'][plate.length] as FolioLayout) ?? 'quad'

const shapeOf = (photo: Photo) => (photo.height > photo.width * 1.05 ? 'tall' : 'wide')
// Two wide frames, then an upright one: the column keeps a rhythm instead of stacking
// all the vertical frames together in the order they came off the card.
const filmOrder = (photos: Photo[]): Photo[] => {
  const wide = photos.filter(photo => shapeOf(photo) === 'wide')
  const tall = photos.filter(photo => shapeOf(photo) === 'tall')
  const run: Photo[] = []
  while (wide.length || tall.length) {
    run.push(...wide.splice(0, 2))
    run.push(...tall.splice(0, 1))
  }
  return run
}

// 人物: one plate per spread, swiped sideways. Native scroll-snap does the paging so
// touch, trackpad, keyboard and the arrow buttons all move through the same track.
function PortraitFolio({ onExpand }: { onExpand: Expand }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const plates = useMemo<Plate[]>(() => portraitSets.flatMap(set => {
    const parts = folioPlates(set)
    return parts.map((photos, index) => ({ set, photos, part: index + 1, parts: parts.length }))
  }), [])
  const total = plates.length
  const currentSet = plates[Math.min(current, total - 1)]?.set.id

  useEffect(() => {
    const node = track.current
    if (!node) return
    let frame = 0
    const read = () => {
      const page = node.clientWidth || 1
      setCurrent(Math.max(0, Math.min(total - 1, Math.round(node.scrollLeft / page))))
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(read) }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); node.removeEventListener('scroll', onScroll) }
  }, [total])

  const goto = (index: number) => {
    const node = track.current
    if (!node) return
    const target = Math.max(0, Math.min(total - 1, index))
    node.scrollTo({ left: target * node.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  return <div className="folio-deck">
    <div className="folio-track" ref={track} tabIndex={0} role="group" aria-label="人物组图，左右方向键切换" onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      goto(current + (event.key === 'ArrowLeft' ? -1 : 1))
    }}>
      {plates.map((plate, index) => <FolioPage key={`${plate.set.id}-${plate.part}`} plate={plate} position={index + 1} total={total} onExpand={onExpand} />)}
    </div>
    <div className="folio-controls">
      <div className="folio-arrows">
        <button onClick={() => goto(current - 1)} disabled={current === 0} aria-label="上一页">←</button>
        <button onClick={() => goto(current + 1)} disabled={current === total - 1} aria-label="下一页">→</button>
      </div>
      <div className="folio-dots" role="group" aria-label="选择组图">{portraitSets.map(set => <button key={set.id} aria-pressed={set.id === currentSet} aria-label={`第${set.index}组：${set.title}`} onClick={() => goto(plates.findIndex(plate => plate.set.id === set.id))}><i /><span>{set.index}</span></button>)}</div>
      <p className="folio-count">{String(current + 1).padStart(2, '0')} <span>/ {String(total).padStart(2, '0')}</span></p>
    </div>
  </div>
}

function FolioPage({ plate, position, total, onExpand }: { plate: Plate; position: number; total: number; onExpand: Expand }) {
  const { set, photos, part, parts } = plate
  return <article className="folio-page" aria-label={parts > 1 ? `${set.title}组图 第${part}页` : `${set.title}组图`}>
    <div className="page-rule">
      <span>PORTRAIT / {set.index}{parts > 1 ? ` · PLATE ${part}/${parts}` : ''}</span>
      <span className="page-rule-mark" aria-hidden="true">■</span>
      <span>{set.english.toUpperCase()}</span>
    </div>
    <div className={`page-plate plate-${folioLayout(photos, set.layout)}`}>
      {photos.map(photo => {
        const number = set.photos.indexOf(photo) + 1
        const label = `${set.title} · 第${number}张`
        return <figure key={photo.src} className={`is-${shapeOf(photo)}`}>
          <button onClick={() => onExpand({ src: photo.src, label })} aria-label={`放大${label}`}>
            <img src={photo.src} alt={photo.alt ?? label} width={photo.width} height={photo.height} loading={position === 1 ? 'eager' : 'lazy'} />
          </button>
        </figure>
      })}
    </div>
    <span className="page-side" aria-hidden="true">{set.english}</span>
    <div className="page-foot">
      <div className="page-title"><h3>{set.title}</h3><p className="editorial-english">{set.english}</p>{set.note && part === 1 && <p className="page-note">{set.note}</p>}</div>
      {!!set.meta?.length && part === 1 && <dl className="page-meta">{set.meta.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
      <span className="page-number">{String(position).padStart(3, '0')} <small>/ {String(total).padStart(3, '0')}</small></span>
    </div>
  </article>
}

// 风光: one continuous vertical run. The list is rendered twice so the column can
// loop without a jump; the second copy is decorative only.
function LandscapeFilm({ onExpand }: { onExpand: Expand }) {
  const [paused, setPaused] = useState(false)
  const run = landscapeRun
  const photos = useMemo(() => filmOrder(run.photos), [run])
  const seconds = Math.max(28, photos.length * 11)
  return <div className="film-stage" style={{ '--film-duration': `${seconds}s` } as React.CSSProperties}>
    <div className="film-rule"><span>LANDSCAPE / CONTINUOUS · {String(photos.length).padStart(2, '0')} FRAMES</span><button onClick={() => setPaused(value => !value)}>{paused ? '继续播放' : '暂停'}</button></div>
    <div className="film-window" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="film-column" data-paused={paused || undefined}>
        {[0, 1].map(copy => <div className="film-run" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {photos.map((photo, index) => {
            const label = `${run.title} · 第${index + 1}张`
            return <figure key={`${copy}-${photo.src}`} className={`is-${shapeOf(photo)}`}>
              <button onClick={() => onExpand({ src: photo.src, label })} aria-label={`放大${label}`} tabIndex={copy === 1 ? -1 : undefined}>
                <img src={photo.src} alt={copy === 1 ? '' : label} width={photo.width} height={photo.height} loading={copy === 0 && index === 0 ? 'eager' : 'lazy'} />
              </button>
              <figcaption><small>{String(index + 1).padStart(2, '0')}</small>{photo.tag ?? run.english.toUpperCase()}</figcaption>
            </figure>
          })}
        </div>)}
      </div>
      <span className="film-side" aria-hidden="true">{run.english}</span>
    </div>
  </div>
}

export function PhotographySpread({ onExpand }: { onExpand: Expand }) {
  const frames = portraitSets.reduce((sum, set) => sum + set.photos.length, 0)
  return <div className="photo-spread">
    <div className="photo-intro">
      <p className="section-index">VISUAL DIARY / 影像</p>
      <h2>影像分成两种看法。</h2>
      <p>人物一组一页，左右翻看；风光连成一条，自己往下走。点开任意一张可以看大图。</p>
    </div>
    <section className="photo-chapter" id="chapter-0">
      <div className="photo-chapter-head">
        <p className="section-index">01 / PORTRAITS · {String(portraitSets.length).padStart(2, '0')} SETS · {frames} FRAMES</p>
        <h3>人物</h3>
        <p className="editorial-english">Portraits</p>
        <p className="photo-chapter-note">一次拍摄算一组，一组占一页；照片多的那几组会往后多占一页。左右滑动，或用方向键翻页。</p>
      </div>
      <PortraitFolio onExpand={onExpand} />
    </section>
    <section className="photo-chapter" id="chapter-1">
      <div className="photo-chapter-head">
        <p className="section-index">02 / LANDSCAPES · {landscapeRun.photos.length} FRAMES</p>
        <h3>风光</h3>
        <p className="editorial-english">Landscapes</p>
        <p className="photo-chapter-note">{landscapeRun.note}</p>
      </div>
      <LandscapeFilm onExpand={onExpand} />
    </section>
  </div>
}
