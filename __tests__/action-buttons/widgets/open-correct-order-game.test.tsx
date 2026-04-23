// @vitest-environment jsdom

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '../test-utils'

vi.mock('@/app/components/modal/Modal', () => ({
  default: ({
    isOpen,
    title,
    children,
  }: {
    isOpen: boolean
    title?: string
    children: React.ReactNode
  }) =>
    isOpen ? (
      <div data-testid='modal'>
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}))

vi.mock('@/app/games/correct-order/CorrectOrder', () => ({
  default: () => <div>correct-order-game</div>,
}))

import OpenCorrectOrderGame from '@/app/components/action-buttons/widgets/open-correct-order-game/OpenCorrectOrderGame'

describe('OpenCorrectOrderGame', () => {
  it('butona tiklaninca oyun modalini acar', () => {
    render(<OpenCorrectOrderGame />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Dogru Sirayi Bul')).toBeInTheDocument()
    expect(screen.getByText('correct-order-game')).toBeInTheDocument()
  })
})
