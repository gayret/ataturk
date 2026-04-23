// @vitest-environment jsdom

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import './test-utils'

vi.mock(
  '@/app/components/action-buttons/widgets/open-correct-order-game/OpenCorrectOrderGame',
  () => ({
    default: () => <div>open-correct-order-game</div>,
  }),
)
vi.mock('@/app/components/action-buttons/widgets/street-view/StreetView', () => ({
  default: () => <div>street-view</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/event-filter/EventFilter', () => ({
  default: () => <div>event-filter</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/direction/Direction', () => ({
  default: () => <div>direction</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/search/Search', () => ({
  default: () => <div>search</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/share/Share', () => ({
  default: () => <div>share</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/auto-play/AutoPlay', () => ({
  default: () => <div>auto-play</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/language-selector/LanguageSelector', () => ({
  default: () => <div>language-selector</div>,
}))
vi.mock('@/app/components/action-buttons/widgets/edit-this-content/EditThisContent', () => ({
  default: () => <div>edit-this-content</div>,
}))

import ActionButtons from '@/app/components/action-buttons/ActionButtons'

describe('ActionButtons', () => {
  it('hamburger butonuna tiklandiginda menu ikonunu degistirir', () => {
    render(<ActionButtons />)

    expect(screen.getByAltText('Menüyü aç')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Menüyü aç/kapat'))
    expect(screen.getByAltText('Menüyü kapat')).toBeInTheDocument()
  })

  it('showOnlyLanguageSelector modunda yalnizca dil seciciyi gosterir', () => {
    render(<ActionButtons showOnlyLanguageSelector />)

    expect(screen.getByText('language-selector')).toBeInTheDocument()
    expect(screen.queryByText('share')).not.toBeInTheDocument()
    expect(screen.queryByText('search')).not.toBeInTheDocument()
  })
})
