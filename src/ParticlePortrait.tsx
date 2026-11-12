'use client'

import { useEffect, useRef, useState } from 'react'

type Particle = {
  x: number
  y: number
  homeX: number
  homeY: number
  vx: number
  vy: number
  radius: number
  color: string
  phase: number
}

const PORTRAIT_SRC = '/hero/portrait-cutout.png'

export function ParticlePortrait() {
  const stageRef = useRef<HTMLButtonElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const burstRef = useRef(0)
  const pointerRef = useRef({ x: -1000, y: -1000, active: false })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    const context = canvas.getContext('2d')
    if (!context) return

    const image = new Image()
    image.decoding = 'async'

    let particles: Particle[] = []
    let animationFrame = 0
    let stageWidth = 0
    let stageHeight = 0
    let pixelRatio = 1
    let startTime = performance.now()

    const createParticles = () => {
      if (!image.naturalWidth || !stageWidth || !stageHeight) return

      const sampleCanvas = document.createElement('canvas')
      sampleCanvas.width = image.naturalWidth
      sampleCanvas.height = image.naturalHeight
      const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true })
      if (!sampleContext) return
      sampleContext.drawImage(image, 0, 0)

      const pixels = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data
      const cropX = Math.round(sampleCanvas.width * .23)
      const cropWidth = sampleCanvas.width - cropX
      const portraitRatio = cropWidth / sampleCanvas.height
      let renderHeight = stageHeight * .96
      let renderWidth = renderHeight * portraitRatio
      if (renderWidth > stageWidth * .98) {
        renderWidth = stageWidth * .98
        renderHeight = renderWidth / portraitRatio
      }
      const offsetX = (stageWidth - renderWidth) / 2
      const offsetY = stageHeight - renderHeight
      const step = stageWidth < 430 ? 11 : 8
      const next: Particle[] = []

      for (let sourceY = 0; sourceY < sampleCanvas.height; sourceY += step) {
        for (let sourceX = cropX; sourceX < sampleCanvas.width; sourceX += step) {
          const pixelIndex = (sourceY * sampleCanvas.width + sourceX) * 4
          const red = pixels[pixelIndex]
          const green = pixels[pixelIndex + 1]
          const blue = pixels[pixelIndex + 2]
          const alpha = pixels[pixelIndex + 3]
          if (alpha < 90) continue

          const homeX = offsetX + ((sourceX - cropX) / cropWidth) * renderWidth
          const homeY = offsetY + (sourceY / sampleCanvas.height) * renderHeight
          const luminance = red * .299 + green * .587 + blue * .114
          const useGold = ((sourceX / step + sourceY / step) % 17) < 1
          const tint = useGold ? [216, 182, 109] : [178, 143, 231]
          const tintStrength = luminance < 120 ? .88 : luminance < 175 ? .48 : .18
          const particleRed = Math.round(red * (1 - tintStrength) + tint[0] * tintStrength)
          const particleGreen = Math.round(green * (1 - tintStrength) + tint[1] * tintStrength)
          const particleBlue = Math.round(blue * (1 - tintStrength) + tint[2] * tintStrength)
          const angle = Math.random() * Math.PI * 2
          const distance = 8 + Math.random() * Math.min(stageWidth, stageHeight) * .09

          next.push({
            x: homeX + Math.cos(angle) * distance,
            y: homeY + Math.sin(angle) * distance,
            homeX,
            homeY,
            vx: 0,
            vy: 0,
            radius: 1 + Math.random() * 1.35,
            color: `rgb(${particleRed} ${particleGreen} ${particleBlue})`,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }

      particles = next
      startTime = performance.now()
      setReady(true)
    }

    const resize = () => {
      const bounds = stage.getBoundingClientRect()
      stageWidth = bounds.width
      stageHeight = bounds.height
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(stageWidth * pixelRatio)
      canvas.height = Math.round(stageHeight * pixelRatio)
      canvas.style.width = `${stageWidth}px`
      canvas.style.height = `${stageHeight}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      createParticles()
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, stageWidth, stageHeight)
      const pointer = pointerRef.current
      const intro = Math.min(1, (time - startTime) / 1500)
      const easedIntro = 1 - Math.pow(1 - intro, 3)
      const burst = Math.max(0, 1 - (time - burstRef.current) / 900)

      for (const particle of particles) {
        const floatX = Math.sin(time * .00065 + particle.phase) * 1.8
        const floatY = Math.cos(time * .00052 + particle.phase) * 1.5
        let forceX = (particle.homeX + floatX - particle.x) * (.022 + easedIntro * .05)
        let forceY = (particle.homeY + floatY - particle.y) * (.022 + easedIntro * .05)

        if (pointer.active) {
          const deltaX = particle.x - pointer.x
          const deltaY = particle.y - pointer.y
          const distanceSquared = deltaX * deltaX + deltaY * deltaY
          const radius = 82
          if (distanceSquared < radius * radius && distanceSquared > 1) {
            const distance = Math.sqrt(distanceSquared)
            const strength = (1 - distance / radius) * 1.15
            forceX += (deltaX / distance) * strength
            forceY += (deltaY / distance) * strength
          }
        }

        if (burst > 0) {
          const deltaX = particle.homeX - stageWidth * .52
          const deltaY = particle.homeY - stageHeight * .48
          const distance = Math.max(1, Math.sqrt(deltaX * deltaX + deltaY * deltaY))
          forceX += (deltaX / distance) * burst * .75
          forceY += (deltaY / distance) * burst * .75
        }

        particle.vx = (particle.vx + forceX) * .86
        particle.vy = (particle.vy + forceY) * .86
        particle.x += particle.vx
        particle.y += particle.vy

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius + burst * .45, 0, Math.PI * 2)
        context.fillStyle = particle.color
        context.globalAlpha = .42 + easedIntro * .5
        context.fill()
      }
      context.globalAlpha = 1

      const orbitRadiusX = stageWidth * .43
      const orbitRadiusY = stageHeight * .42
      for (let index = 0; index < 34; index += 1) {
        const angle = time * .00012 + index / 34 * Math.PI * 2
        const wobble = Math.sin(time * .0007 + index * 1.8) * 7
        const x = stageWidth * .5 + Math.cos(angle) * (orbitRadiusX + wobble)
        const y = stageHeight * .51 + Math.sin(angle) * (orbitRadiusY + wobble * .45)
        context.beginPath()
        context.arc(x, y, index % 7 === 0 ? 2.1 : 1.05, 0, Math.PI * 2)
        context.fillStyle = index % 5 === 0 ? 'rgb(216 182 109)' : 'rgb(178 143 231)'
        context.globalAlpha = .18 + (index % 4) * .1
        context.fill()
      }
      context.globalAlpha = 1
      animationFrame = requestAnimationFrame(draw)
    }

    image.addEventListener('load', resize)
    image.src = PORTRAIT_SRC
    if (image.complete) resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    animationFrame = requestAnimationFrame(draw)

    return () => {
      image.removeEventListener('load', resize)
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  const updatePointer = (clientX: number, clientY: number) => {
    const bounds = stageRef.current?.getBoundingClientRect()
    if (!bounds) return
    pointerRef.current = { x: clientX - bounds.left, y: clientY - bounds.top, active: true }
  }

  const disperse = () => {
    burstRef.current = performance.now()
  }

  return <div className="portrait-stage">
    <span className="portrait-note">A PORTRAIT<br />IN PARTICLES</span>
    <button
      ref={stageRef}
      type="button"
      className={`particle-portrait ${ready ? 'is-ready' : ''} is-full-particles`}
      aria-label="袁宗苡的完整粒子肖像，移动指针扰动粒子，点击让粒子散开重组"
      onClick={disperse}
      onPointerMove={event => updatePointer(event.clientX, event.clientY)}
      onPointerEnter={event => updatePointer(event.clientX, event.clientY)}
      onPointerLeave={() => { pointerRef.current.active = false }}
    >
      <img className="particle-portrait-fallback" src={PORTRAIT_SRC} alt="" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </button>
    <span className="portrait-caption"><i /> MOVE / CLICK / FOLLOW</span>
  </div>
}
