"use client"

import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEventsData } from '@/app/helpers/data'
import { formatDate } from '@/app/helpers/date'
import { useLanguageStore } from '@/app/stores/languageStore'
import { useVoiceStore } from '@/app/stores/voiceStore'
import { isSpeechSupported, loadVoices, speakEvent, stopSpeakingWithFade, updateSpeechVolume } from '@/app/helpers/speech'
import type { ItemType } from '@/app/components/content/Content'

export default function VoiceManager() {
  const searchParams = useSearchParams()
  const events = useEventsData() as ItemType[]
  const { currentLanguageCode } = useLanguageStore()
  const { enabled, volume, preferredVoices, setIsSupported, setEnabled, forceReplayToken } = useVoiceStore()

  const currentId = searchParams?.get('id')

  const selectedEvent = useMemo(() => {
    if (!events || events.length === 0) return null
    const found = events.find((item) => item.id === Number(currentId))
    return found || events[0]
  }, [events, currentId])

  const formattedDate = useMemo(() => {
    if (!selectedEvent?.date) return ''
    return formatDate(selectedEvent.date)
  }, [selectedEvent, currentLanguageCode])

  const lastEventIdRef = useRef<number | null>(null)
  const lastLanguageRef = useRef<string | null>(null)
  const lastReplayTokenRef = useRef<number | null>(null)

  useEffect(() => {
    updateSpeechVolume(volume)
  }, [volume])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!isSpeechSupported()) {
      setIsSupported(false)
      setEnabled(false)
      return
    }

    loadVoices()
      .then((voices) => {
        const supported = voices.length > 0
        setIsSupported(supported)
        if (!supported) {
          setEnabled(false)
        }
      })
      .catch(() => {
        setIsSupported(false)
        setEnabled(false)
      })

    return () => {
      stopSpeakingWithFade()
    }
  }, [setEnabled, setIsSupported])

  useEffect(() => {
    if (!enabled) {
      stopSpeakingWithFade()
      lastEventIdRef.current = null
      return
    }

    if (!selectedEvent || currentId === 'about') {
      stopSpeakingWithFade()
      return
    }

    const shouldReplay =
      lastEventIdRef.current !== selectedEvent.id ||
      lastLanguageRef.current !== currentLanguageCode ||
      lastReplayTokenRef.current !== forceReplayToken

    if (!shouldReplay) {
      return
    }

    lastEventIdRef.current = selectedEvent.id
    lastLanguageRef.current = currentLanguageCode
    lastReplayTokenRef.current = forceReplayToken

    speakEvent({
      event: selectedEvent,
      formattedDate,
      languageCode: currentLanguageCode,
      preferredVoices,
    }).catch(() => {
      setIsSupported(false)
      setEnabled(false)
    })
  }, [enabled, selectedEvent, currentId, formattedDate, currentLanguageCode, preferredVoices, forceReplayToken, setEnabled, setIsSupported])

  return null
}
