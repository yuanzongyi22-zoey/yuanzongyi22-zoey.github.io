import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PortfolioDialog } from './PortfolioApp'

const DRAFT_KEY = 'zoey-feedback-draft'

describe('PortfolioDialog', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('resume variant', () => {
    it('renders resume copy and no feedback form', () => {
      render(<PortfolioDialog kind="resume" onClose={() => {}} />)
      expect(screen.getByText('RESUME / 简历')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: '我的简历' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '下载简历 PDF ↓' })).toHaveAttribute('href', '/documents/yuanzongyi-resume.pdf')
      expect(screen.getByRole('img')).toHaveAttribute('src', '/resume/resume.png')
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('feedback variant', () => {
    it('renders feedback copy and the suggestion form', () => {
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      expect(screen.getByText('A LITTLE FEEDBACK')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: '你的建议，我很想听。' })).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('prefills the textarea from a saved draft', () => {
      localStorage.setItem(DRAFT_KEY, '之前写到一半的建议')
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      expect(screen.getByRole('textbox')).toHaveValue('之前写到一半的建议')
    })

    it('leaves the textarea empty when no draft exists', () => {
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      expect(screen.getByRole('textbox')).toHaveValue('')
    })

    it('disables submit until the suggestion has non-whitespace content', async () => {
      const user = userEvent.setup()
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      const submit = screen.getByRole('button', { name: '保存草稿' })
      expect(submit).toBeDisabled()

      await user.type(screen.getByRole('textbox'), '   ')
      expect(submit).toBeDisabled()

      await user.type(screen.getByRole('textbox'), '有内容了')
      expect(submit).toBeEnabled()
    })

    it('saves a trimmed draft to localStorage and reports success on submit', async () => {
      const user = userEvent.setup()
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      await user.type(screen.getByRole('textbox'), '  我的建议  ')
      await user.click(screen.getByRole('button', { name: '保存草稿' }))

      expect(localStorage.getItem(DRAFT_KEY)).toBe('我的建议')
      expect(screen.getByRole('status')).toHaveTextContent('草稿已保存在此浏览器，尚未发送。')
    })

    it('reports a fallback message when localStorage.setItem throws', async () => {
      const user = userEvent.setup()
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      render(<PortfolioDialog kind="feedback" onClose={() => {}} />)
      await user.type(screen.getByRole('textbox'), '建议内容')
      await user.click(screen.getByRole('button', { name: '保存草稿' }))

      expect(screen.getByRole('status')).toHaveTextContent('未能保存，请复制文字自行保留。')
      spy.mockRestore()
    })

    it('stays usable when reading the draft from localStorage throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      expect(() => render(<PortfolioDialog kind="feedback" onClose={() => {}} />)).not.toThrow()
      expect(screen.getByRole('textbox')).toHaveValue('')
      spy.mockRestore()
    })
  })

  describe('closing behaviour', () => {
    it('calls onClose when the close button is clicked', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      render(<PortfolioDialog kind="resume" onClose={onClose} />)
      await user.click(screen.getByRole('button', { name: '关闭弹窗' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when the backdrop is clicked', () => {
      const onClose = vi.fn()
      const { container } = render(<PortfolioDialog kind="resume" onClose={onClose} />)
      const backdrop = container.querySelector('.portfolio-dialog-backdrop') as HTMLElement
      fireEvent.click(backdrop)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when clicking inside the dialog', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      render(<PortfolioDialog kind="resume" onClose={onClose} />)
      await user.click(screen.getByRole('dialog'))
      expect(onClose).not.toHaveBeenCalled()
    })

    it('calls onClose when Escape is pressed', () => {
      const onClose = vi.fn()
      render(<PortfolioDialog kind="resume" onClose={onClose} />)
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('modal side effects', () => {
    it('locks body scroll while open and restores it on unmount', () => {
      document.body.style.overflow = 'auto'
      const { unmount } = render(<PortfolioDialog kind="resume" onClose={() => {}} />)
      expect(document.body.style.overflow).toBe('hidden')
      unmount()
      expect(document.body.style.overflow).toBe('auto')
    })

    it('moves focus to the dialog container on mount', () => {
      render(<PortfolioDialog kind="resume" onClose={() => {}} />)
      expect(screen.getByRole('dialog')).toHaveFocus()
    })

    it('exposes modal dialog semantics', () => {
      render(<PortfolioDialog kind="resume" onClose={() => {}} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'portfolio-dialog-title')
      expect(within(dialog).getByText('我的简历')).toHaveAttribute('id', 'portfolio-dialog-title')
    })

    it('restores focus to the previously focused element on unmount', () => {
      const trigger = document.createElement('button')
      document.body.appendChild(trigger)
      trigger.focus()
      const { unmount } = render(<PortfolioDialog kind="resume" onClose={() => {}} />)
      unmount()
      expect(trigger).toHaveFocus()
      trigger.remove()
    })
  })
})
