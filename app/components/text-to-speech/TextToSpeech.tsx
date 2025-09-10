'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'
import { useEventsData } from '@/app/helpers/data'
import { ItemType } from '../content/Content'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    responsiveVoice: {
      speak: (text: string, voice?: string) => void
      setDefaultVoice?: (voice: string) => void
    }
  }
}

export default function TextToSpeech() {
  const [muted, setMuted] = useState(true)
  const searchParams = useSearchParams()
  const events = useEventsData() as ItemType[]

  const selectedEvent =
    events.find((item: ItemType) => item.id === Number(searchParams.get('id'))) || events[0]

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.responsiveVoice) {
      window.responsiveVoice.speak(text, 'Turkish Male')
    } else {
      console.warn('responsiveVoice henüz yüklenmedi')
    }
  }

  useEffect(() => {
    const announcement = searchParams.get('announcement')
    setMuted(announcement !== 'true')
  }, [searchParams])

  useEffect(() => {
    if (muted || !selectedEvent) return
    speak(`${selectedEvent.date} - ${selectedEvent.title}`)
  }, [muted, selectedEvent])

  return (
    <div>
      <Script
        src={`https://code.responsivevoice.org/responsivevoice.js?key=${process.env.NEXT_PUBLIC_RESPONSIVE_VOICE_KEY}`}
        strategy='beforeInteractive'
      />
    </div>
  )
}
