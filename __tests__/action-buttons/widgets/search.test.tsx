// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '../test-utils'
import { setLanguageCode, setSearchParams } from '../test-utils'
import Search from '@/app/components/action-buttons/widgets/search/Search'

describe('Search', () => {
  it('arama butonu ile inputu acar ve sonuc linki uretir', () => {
    render(<Search />)

    fireEvent.click(screen.getByTitle('Ara'))
    fireEvent.change(screen.getByPlaceholderText('Ara...'), {
      target: { value: 'selanik' },
    })

    const resultTitle = screen.getByText('Selanik')
    const resultLink = resultTitle.closest('a')

    expect(resultLink).toHaveAttribute('href', '/?id=1&language=tr')
  })

  it('arama parametresinde language yoksa mevcut dili sonuca ekler', () => {
    setSearchParams('id=1')
    setLanguageCode('de')

    render(<Search />)

    fireEvent.click(screen.getByTitle('Ara'))
    fireEvent.change(screen.getByPlaceholderText('Ara...'), {
      target: { value: 'ankara' },
    })

    const resultTitle = screen.getByText('Ankara')
    const resultLink = resultTitle.closest('a')

    expect(resultLink).toHaveAttribute('href', '/?id=2&language=de')
  })

  it('sonuca tiklaninca aramayi kapatir ve inputu temizler', () => {
    render(<Search />)

    fireEvent.click(screen.getByTitle('Ara'))
    fireEvent.change(screen.getByPlaceholderText('Ara...'), {
      target: { value: 'selanik' },
    })

    const resultLink = screen.getByText('Selanik').closest('a')
    fireEvent.click(resultLink as HTMLAnchorElement)

    expect(screen.queryByPlaceholderText('Ara...')).not.toBeInTheDocument()
  })
})
