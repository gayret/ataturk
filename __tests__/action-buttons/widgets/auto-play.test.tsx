// @vitest-environment jsdom

import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import '../test-utils'

vi.mock('@/app/components/action-buttons/widgets/auto-play/widgets/timer/Timer', () => ({
  default: () => <div data-testid='timer' />,
}))

import AutoPlay from '@/app/components/action-buttons/widgets/auto-play/AutoPlay'

describe('AutoPlay', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      value: null,
      writable: true,
    })

    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: vi.fn().mockImplementation(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          configurable: true,
          value: document.documentElement,
          writable: true,
        })
        return Promise.resolve()
      }),
    })

    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn().mockImplementation(() => {
        Object.defineProperty(document, 'fullscreenElement', {
          configurable: true,
          value: null,
          writable: true,
        })
        return Promise.resolve()
      }),
    })
  })

  it('ilk tiklamada auto-play parametresini ekler ve fullscreen ister', () => {
    const { container } = render(<AutoPlay />)

    const [mainButton] = container.querySelectorAll('[data-auto-play-button="true"]')
    fireEvent.click(mainButton)

    expect(window.location.search).toContain('auto-play=true')
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled()
  })

  it('ikinci tiklamada auto-play parametresini siler ve fullscreeni kapatir', () => {
    const { container } = render(<AutoPlay />)

    const getMainButton = () => container.querySelector('[data-auto-play-button="true"]')

    fireEvent.click(getMainButton() as HTMLElement)
    fireEvent.click(getMainButton() as HTMLElement)

    expect(window.location.search).not.toContain('auto-play=true')
    expect(document.exitFullscreen).toHaveBeenCalled()
  })
})
