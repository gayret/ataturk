// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '../test-utils'
import Share from '@/app/components/action-buttons/widgets/share/Share'

describe('Share', () => {
  it('tiklaninca paylasim linklerini acar', () => {
    render(<Share />)

    fireEvent.click(screen.getByTitle('Paylas'))

    expect(screen.getByTitle('LinkedIn')).toBeInTheDocument()
    expect(screen.getByTitle('X')).toBeInTheDocument()
    expect(screen.getByTitle('Facebook')).toBeInTheDocument()
    expect(screen.getByTitle('WhatsApp')).toBeInTheDocument()
  })

  it('disariya tiklaninca acik menuyu kapatir', () => {
    render(<Share />)

    fireEvent.click(screen.getByTitle('Paylas'))
    expect(screen.getByTitle('LinkedIn')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByTitle('LinkedIn')).not.toBeInTheDocument()
  })
})
