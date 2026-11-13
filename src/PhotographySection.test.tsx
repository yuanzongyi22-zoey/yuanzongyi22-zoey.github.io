import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PhotographySpread } from './PhotographySection'
import { landscapeRun, portraitSets } from './photography-content'

// Mirrors folioPlates in PhotographySection.tsx: four frames to a page at most.
const plateCount = (count: number) => Math.max(1, Math.ceil(count / 4))

describe('photography spread', () => {
  it('gives every shoot at least one spread and splits the long ones', () => {
    render(<PhotographySpread onExpand={() => {}} />)
    const expected = portraitSets.reduce((sum, set) => sum + plateCount(set.photos.length), 0)
    expect(document.querySelectorAll('.folio-page')).toHaveLength(expected)
    expect(document.querySelectorAll('.folio-dots button')).toHaveLength(portraitSets.length)
    expect(screen.getByText('人物')).toBeTruthy()
    expect(screen.getByText('风光')).toBeTruthy()
  })

  it('places every portrait frame exactly once', () => {
    render(<PhotographySpread onExpand={() => {}} />)
    const sources = [...document.querySelectorAll('.page-plate img')].map(img => img.getAttribute('src'))
    const frames = portraitSets.flatMap(set => set.photos.map(photo => photo.src))
    expect(sources.sort()).toEqual(frames.sort())
  })

  it('runs the landscape list twice so the loop has no seam', () => {
    render(<PhotographySpread onExpand={() => {}} />)
    const runs = document.querySelectorAll('.film-run')
    expect(runs).toHaveLength(2)
    expect(runs[0].querySelectorAll('img')).toHaveLength(landscapeRun.photos.length)
    expect(runs[1].getAttribute('aria-hidden')).toBe('true')
  })

  it('opens a frame in the lightbox', () => {
    const onExpand = vi.fn()
    render(<PhotographySpread onExpand={onExpand} />)
    fireEvent.click(document.querySelector('.page-plate button')!)
    expect(onExpand).toHaveBeenCalledWith(expect.objectContaining({ src: portraitSets[0].photos[0].src }))
  })

  it('pauses the landscape column on request', () => {
    render(<PhotographySpread onExpand={() => {}} />)
    expect(document.querySelector('.film-column')!.hasAttribute('data-paused')).toBe(false)
    fireEvent.click(screen.getByText('暂停'))
    expect(document.querySelector('.film-column')!.hasAttribute('data-paused')).toBe(true)
  })
})
