import type { PointerEvent } from 'react'

type Motion = {
  frame: number
  x: number
  y: number
  left: number
  top: number
  width: number
  height: number
  scrollY: number
  graphic: SVGElement | null
  secondary: SVGElement | null
  kind: 'line' | 'disc' | 'orbit'
}
const motions = new WeakMap<HTMLButtonElement, Motion>()

export function startBookMotion(event: PointerEvent<HTMLButtonElement>) {
  if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const node = event.currentTarget
  const rect = node.getBoundingClientRect()
  const compact = node.classList.contains('book-list-item')
  // Use the stationary hit area, so a turning cover never changes its own input.
  const width = compact ? 200 : rect.width - 35
  motions.set(node, {
    frame: 0, x: event.clientX, y: event.clientY,
    left: rect.left + (compact ? 40 : 25), top: rect.top + 52,
    width, height: width * 210 / 260, scrollY: window.scrollY,
    graphic: node.querySelector('.line-bead, .rotating-disc, .orbit-bead'),
    secondary: node.querySelector('.orbit-bead-secondary'),
    kind: node.querySelector('.art-line') ? 'line' : node.querySelector('.art-disc') ? 'disc' : 'orbit',
  })
  moveBook(event)
}

export function moveBook(event: PointerEvent<HTMLButtonElement>) {
  const motion = motions.get(event.currentTarget)
  if (!motion?.graphic) return
  motion.x = event.clientX
  motion.y = event.clientY
  if (motion.frame) return
  motion.frame = requestAnimationFrame(() => {
    motion.frame = 0
    const px = Math.max(0, Math.min(1, (motion.x - motion.left) / motion.width))
    const py = Math.max(0, Math.min(1, (motion.y - motion.top + window.scrollY - motion.scrollY) / motion.height))
    if (motion.kind === 'line') {
      const t = Math.max(0, Math.min(1, ((px * 260 - 32) * 196 - (py * 210 - 180) * 140) / (196 ** 2 + 140 ** 2)))
      motion.graphic?.setAttribute('transform', `translate(${32 + t * 196} ${180 - t * 140})`)
    } else if (motion.kind === 'disc') {
      motion.graphic?.setAttribute('transform', `rotate(${px * 360} 130 105)`)
    } else {
      const angle = Math.atan2(py - .5, px - .5)
      motion.graphic?.setAttribute('transform', `translate(${Math.cos(angle) * 92} ${Math.sin(angle) * 42})`)
      motion.secondary?.setAttribute('transform', `translate(${-Math.cos(angle) * 82} ${-Math.sin(angle) * 38})`)
    }
  })
}

export function stopBookMotion(event: PointerEvent<HTMLButtonElement>) {
  const motion = motions.get(event.currentTarget)
  if (motion?.frame) cancelAnimationFrame(motion.frame)
  motions.delete(event.currentTarget)
}
