import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InternshipRecord } from './InternshipVisuals'
import { CaseGallery } from './InternshipCase'
import { adjustedScopes, defaultPresetScopes, inferPresetType, presetScopes, scopeLeaves, toggleScope } from './preset-model'
import type { CaseImage } from './portfolio-content'

describe('preset scope rules from the PRD', () => {
  beforeEach(() => localStorage.clear())

  it('combination defaults exclude frame, but frame by itself is a combination', () => {
    expect(defaultPresetScopes('组合')).not.toContain('frame')
    expect(inferPresetType(['frame'])).toBe('组合')
    expect(inferPresetType(['background'])).toBe('组合')
    expect(inferPresetType(['clothes'])).toBe('组合')
    expect(inferPresetType([])).toBeNull()
  })

  it('checks descendants as a group and preserves unrelated scopes', () => {
    const selection = toggleScope(['portrait'], presetScopes[0])
    expect(selection).toEqual(['portrait', ...scopeLeaves(presetScopes[0])])
    expect(toggleScope(selection, presetScopes[0])).toEqual(['portrait'])
    expect(inferPresetType(scopeLeaves(presetScopes[0]))).toBe('色彩')
  })

  it('selecting adjusted items checks only the changed leaves, with a partial parent', () => {
    render(<InternshipRecord type="preset" />)
    fireEvent.click(screen.getByRole('button', { name: '选择已调整项' }))
    const parent = screen.getByRole('checkbox', { name: '保存色彩范围' }) as HTMLInputElement
    expect(parent.indeterminate).toBe(true)
    expect(parent.checked).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: /色彩/ }))
    fireEvent.click(screen.getByRole('button', { name: /全图/ }))
    expect(screen.getByRole('checkbox', { name: '保存样片仿色范围' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '保存智能调色范围' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: '保存人像范围' })).toBeChecked()
    expect(adjustedScopes).not.toContain('color-global')
  })

  it('restores defaults after adjusted items, and disables saving an empty selection', () => {
    render(<InternshipRecord type="preset" />)
    fireEvent.click(screen.getByRole('button', { name: '选择已调整项' }))
    fireEvent.click(screen.getByRole('button', { name: '恢复当前类型默认范围' }))
    expect(screen.getByRole('checkbox', { name: '保存色彩范围' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '保存背景范围' })).toBeChecked()
    for (const name of ['色彩', '人像', '背景', '衣物']) fireEvent.click(screen.getByRole('checkbox', { name: `保存${name}范围` }))
    expect(screen.getByRole('button', { name: '保存', exact: true })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: '预设类型' })).toHaveValue('')
    fireEvent.change(screen.getByRole('combobox', { name: '预设类型' }), { target: { value: '人像' } })
    expect(screen.getByRole('checkbox', { name: '保存人像范围' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: '保存色彩范围' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: '保存', exact: true })).toBeEnabled()
  })

  it('remembers expansion without requiring a save', () => {
    const { unmount } = render(<InternshipRecord type="preset" />)
    fireEvent.click(screen.getByRole('button', { name: /色彩/ }))
    unmount()
    render(<InternshipRecord type="preset" />)
    expect(screen.getByRole('button', { name: /色彩/ })).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('interface gallery', () => {
  const images: CaseImage[] = [1, 2, 3].map(number => ({
    src: `/image-${number}.webp`, alt: `界面${number}`, caption: `步骤${number}`,
    kind: '交互设计', width: 960, height: 640,
  }))
  it('wraps in both directions and expands the displayed image', () => {
    const onExpand = vi.fn()
    render(<CaseGallery images={images} onExpand={onExpand} />)
    fireEvent.click(screen.getByRole('button', { name: '上一张界面' }))
    expect(screen.getByRole('img')).toHaveAttribute('src', '/image-3.webp')
    fireEvent.keyDown(screen.getByRole('group', { name: '界面图片，左右方向键切换' }), { key: 'ArrowRight' })
    expect(screen.getByRole('img')).toHaveAttribute('src', '/image-1.webp')
    fireEvent.click(screen.getByRole('button', { name: '下一张界面' }))
    fireEvent.click(screen.getByRole('button', { name: '放大：界面2' }))
    expect(onExpand).toHaveBeenCalledWith({ src: '/image-2.webp', label: '界面2' })
  })
})
