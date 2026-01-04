"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useLanguageStore } from '@/app/stores/languageStore'
import type { ItemType } from '@/app/components/content/Content'
import Image from 'next/image'
import volumeOnIcon from '@/app/assets/icons/volume-up.svg'
import volumeOffIcon from '@/app/assets/icons/volume-off.svg'
import styles from './VoiceControls.module.css'
import { dispatchVoicePlaybackEvent } from '@/app/helpers/voicePlaybackEvents'

const supportsSpeech = () =>
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof window.SpeechSynthesisUtterance !== 'undefined'

export default function VoiceControls() {
  const events = useEventsData() as ItemType[]
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t, currentLanguageCode } = useLanguageStore()

  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(0.85)
  const [showSlider, setShowSlider] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hideSliderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const volumeRef = useRef(volume)
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null)
  const volumeSpeakTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeEventIdRef = useRef<number | null>(null)
  const utteranceStartedAt = useRef<number | null>(null)

  const currentId = searchParams?.get('id')
  const voiceParam = searchParams?.get('voice')

  useEffect(() => {
    setEnabled(voiceParam === 'enabled')
  }, [voiceParam])

  const selectedEvent = useMemo(() => {
    if (!events || events.length === 0) return null
    const found = events.find((item) => item.id === Number(currentId))
    return found || events[0]
  }, [events, currentId])

  const updateVoiceParam = (nextEnabled: boolean) => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (nextEnabled) {
      url.searchParams.set('voice', 'enabled')
    } else {
      url.searchParams.delete('voice')
    }
    router.replace(url.toString(), { scroll: false })
    setEnabled(nextEnabled)
  }

  const cancelSpeech = useCallback(() => {
    if (!supportsSpeech()) return
    try {
      if (activeUtterance.current) {
        activeUtterance.current.onerror = null
        activeUtterance.current.onend = null
      }
      window.speechSynthesis.cancel()
      activeUtterance.current = null
      if (activeEventIdRef.current !== null) {
        dispatchVoicePlaybackEvent({
          status: 'cancel',
          eventId: activeEventIdRef.current,
        })
      }
      activeEventIdRef.current = null
      utteranceStartedAt.current = null
    } catch (speechError) {
      console.log('Speech cancel error', speechError)
    }
  }, [])

  const speakCurrent = useCallback(() => {
    if (!enabled) return
    if (!supportsSpeech()) {
      setIsSupported(false)
      setError(t.Voice.unsupported)
      setEnabled(false)
      return
    }
    if (!selectedEvent) return

    cancelSpeech()
    setError(null)

    const textParts = [formatDate(selectedEvent.date), selectedEvent.title].filter(Boolean)
    const utterance = new SpeechSynthesisUtterance(textParts.join('. '))
    const eventId = selectedEvent.id
    activeEventIdRef.current = eventId
    utterance.lang = currentLanguageCode
    utterance.volume = volumeRef.current

    utterance.onstart = () => {
      const startedAt = performance.now()
      utteranceStartedAt.current = startedAt
      dispatchVoicePlaybackEvent({
        status: 'start',
        eventId,
        startedAt,
      })
    }

    utterance.onend = () => {
      if (activeUtterance.current === utterance) {
        activeUtterance.current = null
      }
      const endedAt = performance.now()
      const startedAt = utteranceStartedAt.current ?? endedAt
      const durationMs = Math.max(0, endedAt - startedAt)

      dispatchVoicePlaybackEvent({
        status: 'end',
        eventId,
        startedAt,
        endedAt,
        durationMs,
      })

      activeEventIdRef.current = null
      utteranceStartedAt.current = null
    }

    utterance.onerror = () => {
      if (activeUtterance.current === utterance) {
        setError(t.Voice.error)
        activeUtterance.current = null
      }
      dispatchVoicePlaybackEvent({
        status: 'error',
        eventId,
      })
      activeEventIdRef.current = null
      utteranceStartedAt.current = null
    }

    activeUtterance.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [enabled, selectedEvent, currentLanguageCode, cancelSpeech, t.Voice])

  useEffect(() => {
    if (!enabled) {
      cancelSpeech()
      setShowSlider(false)
      return
    }
    speakCurrent()
  }, [enabled, selectedEvent, currentLanguageCode, speakCurrent, cancelSpeech])

  useEffect(() => {
    if (!supportsSpeech()) {
      setIsSupported(false)
      setEnabled(false)
      setError(t.Voice.unsupported)
    }
    return () => cancelSpeech()
  }, [cancelSpeech, t.Voice.unsupported])

  const handleToggle = () => {
    const next = !enabled
    updateVoiceParam(next)
    if (!next) {
      setError(null)
      cancelSpeech()
      setShowSlider(false)
    } else {
      speakCurrent()
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    volumeRef.current = value
    if (!enabled) return
    if (volumeSpeakTimeout.current) {
      clearTimeout(volumeSpeakTimeout.current)
    }
    volumeSpeakTimeout.current = setTimeout(() => {
      speakCurrent()
      volumeSpeakTimeout.current = null
    }, 150)
  }

  const buttonLabel = !isSupported
    ? t.Voice.unsupported
    : enabled
    ? t.Voice.toggleOnLabel
    : t.Voice.toggleOffLabel
  const toggleTitle = enabled ? t.Voice.turnOffTitle : t.Voice.turnOnTitle
  const iconAlt = enabled ? t.Voice.iconAltOn : t.Voice.iconAltOff
  const visibleError = error || (!isSupported ? t.Voice.unsupported : null)

  const showSliderWithCancel = () => {
    if (!enabled) return
    if (hideSliderTimeout.current) {
      clearTimeout(hideSliderTimeout.current)
      hideSliderTimeout.current = null
    }
    setShowSlider(true)
  }

  const hideSliderWithDelay = () => {
    if (hideSliderTimeout.current) {
      clearTimeout(hideSliderTimeout.current)
    }
    hideSliderTimeout.current = setTimeout(() => {
      setShowSlider(false)
      hideSliderTimeout.current = null
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (hideSliderTimeout.current) {
        clearTimeout(hideSliderTimeout.current)
      }
      if (volumeSpeakTimeout.current) {
        clearTimeout(volumeSpeakTimeout.current)
      }
    }
  }, [])

  return (
    <div
      className={styles.voiceControls}
      onMouseEnter={showSliderWithCancel}
      onMouseLeave={hideSliderWithDelay}
      onFocus={showSliderWithCancel}
      onBlur={hideSliderWithDelay}
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
        <Image
          src={enabled ? volumeOnIcon : volumeOffIcon}
          alt={iconAlt}
          width={16}
          height={16}
        />
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
            onChange={(event) => handleVolumeChange(Number(event.target.value))}
            className={styles.slider}
            aria-label={t.Voice.volumeLabel}
          />
        </div>
      )}

      {visibleError && (
        <div className={styles.errorMessage} role='alert'>
          {visibleError}
        </div>
      )}
    </div>
  )
}
