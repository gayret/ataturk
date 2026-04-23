// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '../test-utils'
import { mockSetLanguage } from '../test-utils'
import LanguageSelector from '@/app/components/action-buttons/widgets/language-selector/LanguageSelector'

describe('LanguageSelector', () => {
  it('dil listesini acar ve mevcut dili disabled gosterir', () => {
    render(<LanguageSelector />)

    fireEvent.click(screen.getByTitle('Dil Sec'))

    expect(screen.getByRole('button', { name: 'Turkce' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument()
  })

  it('yeni dil secildiginde URLi ve storeu gunceller', () => {
    render(<LanguageSelector />)

    fireEvent.click(screen.getByTitle('Dil Sec'))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(mockSetLanguage).toHaveBeenCalledWith('en')
    expect(window.location.search).toContain('language=en')
  })
})
