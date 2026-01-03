"use client"

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './VoiceControls.module.css'
import volumeUpIcon from '@/app/assets/icons/volume-up.svg'
import volumeMuteIcon from '@/app/assets/icons/volume-mute.svg'
import { useEventsData } from '@/app/helpers/data'
import { useLanguageStore } from '@/app/stores/languageStore'
import { formatDate } from '@/app/helpers/date'
import type { ItemType } from '@/app/components/content/Content'

const supportsSpeech = () =>
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof window.SpeechSynthesisUtterance !== 'undefined'

export default function VoiceControls() {
  const events = useEventsData() as ItemType[]
  const searchParams = useSearchParams()
  const { t, currentLanguageCode } = useLanguageStore()

  const [enabled, setEnabled] = useState(false)
  const [showSlider, setShowSlider] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([])
  const speakRequestRef = useRef(0)
  const volumeRef = useRef(0.8)

  const currentId = searchParams?.get('id')

  const selectedEvent = useMemo(() => {
    if (!events || events.length === 0) return null
    const found = events.find((item) => item.id === Number(currentId))
    return found || events[0]
  }, [events, currentId])

  const formattedDate = useMemo(() => {
    if (!selectedEvent?.date) return ''
    return formatDate(selectedEvent.date, currentLanguageCode)
  }, [selectedEvent, currentLanguageCode])

  const cancelSpeech = useCallback(() => {
    if (!supportsSpeech()) return
    speakRequestRef.current += 1
    activeUtterancesRef.current = []
    setIsSpeaking(false)
    try {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
    } catch (speechError) {
      console.log('Speech cancel error', speechError)
    }
  }, [])

  useEffect(() => {
    if (!supportsSpeech()) {
      setIsSupported(false)
      setEnabled(false)
      setError(t.Voice.unsupported)
    }
  }, [t.Voice.unsupported])

  useEffect(() => {
    return () => {
      cancelSpeech()
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [cancelSpeech])

  const loadVoices = useCallback(() => {
    if (!supportsSpeech()) return Promise.resolve<SpeechSynthesisVoice[]>([])

    const existing = window.speechSynthesis.getVoices()
    if (existing.length > 0) {
      return Promise.resolve(existing)
    }

    return new Promise<SpeechSynthesisVoice[]>((resolve) => {
      const handleVoicesChanged = () => {
        resolve(window.speechSynthesis.getVoices())
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      }

      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
      window.speechSynthesis.getVoices()

      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices())
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      }, 500)
    })
  }, [])

  const pickVoice = useCallback(
    (voices: SpeechSynthesisVoice[]) => {
      return (
        voices.find((voice) => voice.lang?.toLowerCase().startsWith(currentLanguageCode.toLowerCase())) ||
        voices[0] ||
        null
      )
    },
    [currentLanguageCode]
  )

  const speakCurrentEvent = useCallback(async () => {
    if (!enabled) return

    if (!selectedEvent || currentId === 'about') {
      cancelSpeech()
      return
    }

    if (!supportsSpeech()) {
      setIsSupported(false)
      setEnabled(false)
      setError(t.Voice.unsupported)
      return
    }

    cancelSpeech()
    const requestId = speakRequestRef.current
    setError(null)

    // Give the speech engine a brief moment to flush the previous queue.
    await new Promise((resolve) => setTimeout(resolve, 60))

    const voices = await loadVoices()
    if (!voices || voices.length === 0) {
      setIsSupported(false)
      setEnabled(false)
      setError(t.Voice.unsupported)
      return
    }

    if (requestId !== speakRequestRef.current) {
      return
    }

    const voice = pickVoice(voices)
    const parts = [formattedDate, selectedEvent.title, selectedEvent.description].filter(Boolean) as string[]

    if (parts.length === 0) {
      return
    }

    const utterances = parts.map((text) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.volume = volumeRef.current
      utterance.lang = voice?.lang || currentLanguageCode
      if (voice) {
        utterance.voice = voice
      }
      return utterance
    })

    if (requestId !== speakRequestRef.current) {
      return
    }

    activeUtterancesRef.current = utterances
    setIsSpeaking(true)

    let remaining = utterances.length

    const settle = (hasError: boolean) => {
      if (requestId !== speakRequestRef.current) return

      remaining -= 1
      if (hasError) {
        setError(t.Voice.error)
        cancelSpeech()
        return
      }

      if (remaining <= 0) {
        setIsSpeaking(false)
      }
    }

    utterances.forEach((utterance) => {
      utterance.onend = () => settle(false)
      utterance.onerror = () => settle(true)
      window.speechSynthesis.speak(utterance)
    })
  }, [enabled, selectedEvent, currentId, formattedDate, currentLanguageCode, t.Voice, cancelSpeech, loadVoices, pickVoice])

  useEffect(() => {
    if (!enabled) {
      cancelSpeech()
      setShowSlider(false)
      return
    }

    speakCurrentEvent()
  }, [enabled, speakCurrentEvent, cancelSpeech])

  useEffect(() => {
    volumeRef.current = volume
    if (!isSpeaking) return
    activeUtterancesRef.current.forEach((utterance) => {
      utterance.volume = volume
    })
  }, [volume, isSpeaking])

  const openSlider = () => {
    if (!enabled) return
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setShowSlider(true)
  }

  const scheduleHideSlider = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowSlider(false)
    }, 200)
  }

  const handleToggle = () => {
    const nextState = !enabled
    setEnabled(nextState)
    if (!nextState) {
      cancelSpeech()
      setError(null)
    } else {
      openSlider()
    }
  }

  const buttonLabel = !isSupported
    ? t.Voice.unsupported
    : enabled
    ? t.Voice.toggleOnLabel
    : t.Voice.toggleOffLabel
  const toggleTitle = enabled ? t.Voice.turnOffTitle : t.Voice.turnOnTitle
  const iconAlt = enabled ? t.Voice.iconAltOn : t.Voice.iconAltOff

  const visibleError = error || (!isSupported ? t.Voice.unsupported : null)

  return (
    <div
      className={styles.voiceControls}
      onMouseEnter={openSlider}
      onMouseLeave={scheduleHideSlider}
      onFocus={openSlider}
      onBlur={scheduleHideSlider}
    >
      <button
        type='button'
        className={`${styles.toggleButton} ${enabled ? styles.active : ''}`}
        onClick={handleToggle}
        aria-pressed={enabled}
        aria-label={buttonLabel}
        disabled={!isSupported}
        title={toggleTitle}
      >
        <Image src={enabled ? volumeUpIcon : volumeMuteIcon} alt={iconAlt} width={20} height={20} />
      </button>

      {enabled && showSlider && (
        <div className={styles.sliderPopup}>
          <input
            id='voice-volume'
            type='range'
            min='0'
            max='1'
            step='0.05'
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className={styles.slider}
            aria-label={t.Voice.volumeLabel}
          />
        </div>
      )}

      {!isSupported && <div className={styles.tooltip}>{t.Voice.unsupported}</div>}

      {visibleError && (
        <div className={styles.errorMessage} role='alert'>
          {visibleError}
        </div>
      )}
    </div>
  )
}
