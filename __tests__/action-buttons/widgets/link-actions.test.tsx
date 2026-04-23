// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '../test-utils'
import { setSearchParams } from '../test-utils'
import Direction from '@/app/components/action-buttons/widgets/direction/Direction'
import StreetView from '@/app/components/action-buttons/widgets/street-view/StreetView'
import EditThisContent from '@/app/components/action-buttons/widgets/edit-this-content/EditThisContent'

describe('ActionButtons link widgets', () => {
  describe('Direction', () => {
    it('gecerli koordinatlarda Google Maps yol tarifi linki olusturur', () => {
      render(<Direction lat={41.0082} lon={28.9784} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute(
        'href',
        'https://www.google.com/maps/dir/?api=1&destination=41.0082,28.9784',
      )
    })

    it('gecersiz koordinatlarda render etmez', () => {
      render(<Direction lat={0} lon={28.9784} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('StreetView', () => {
    it('gecerli koordinatlarda Street View linki olusturur', () => {
      render(<StreetView lat={41.0082} lon={28.9784} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute(
        'href',
        'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=41.0082,28.9784',
      )
    })

    it('gecersiz koordinatlarda render etmez', () => {
      render(<StreetView lat={41.0082} lon={0} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('EditThisContent', () => {
    it('aktif olay ve dil icin GitHub duzenleme linki olusturur', () => {
      setSearchParams('id=42&language=en')
      render(<EditThisContent />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/gayret/ataturk/blob/main/data/events/en/42.md',
      )
    })
  })
})
