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
  const {
    enabled,
    volume,
    preferredVoices,
    setIsSupported,
    setEnabled,
    setSpeechState,
    clearSpeechState,
  } = useVoiceStore()

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
      clearSpeechState()
      return
    }

    loadVoices()
      .then((voices) => {
        const supported = voices.length > 0
        setIsSupported(supported)
        if (!supported) {
          setEnabled(false)
          clearSpeechState()
        }
      })
      .catch(() => {
        setIsSupported(false)
        setEnabled(false)
        clearSpeechState()
      })

    return () => {
      stopSpeakingWithFade()
      clearSpeechState()
    }
  }, [setEnabled, setIsSupported, clearSpeechState])

  useEffect(() => {
    if (!enabled) {
      stopSpeakingWithFade()
      lastEventIdRef.current = null
      clearSpeechState()
      return
    }

    if (!selectedEvent || currentId === 'about') {
      stopSpeakingWithFade()
      clearSpeechState()
      return
    }

    const shouldReplay =
      lastEventIdRef.current !== selectedEvent.id || lastLanguageRef.current !== currentLanguageCode

    if (!shouldReplay) {
      return
    }

    lastEventIdRef.current = selectedEvent.id
    lastLanguageRef.current = currentLanguageCode
    const speechToken = Date.now()

    const speechPromise = speakEvent({
      event: selectedEvent,
      formattedDate,
      languageCode: currentLanguageCode,
      preferredVoices,
    })

    setSpeechState(speechToken, speechPromise)

    speechPromise
      .then(() => {
        setSpeechState(speechToken, null)
      })
      .catch(() => {
        setSpeechState(speechToken, null)
        setIsSupported(false)
        setEnabled(false)
      })
  }, [
    enabled,
    selectedEvent,
    currentId,
    formattedDate,
    currentLanguageCode,
    preferredVoices,
    setEnabled,
    setIsSupported,
    setSpeechState,
    clearSpeechState,
  ])

  return null
}
