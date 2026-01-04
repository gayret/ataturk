import Image from 'next/image'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import iconVoiceOn from '@/app/assets/icons/voice-on.svg'
import iconVoiceOff from '@/app/assets/icons/voice-off.svg'
import { useLanguageStore } from '@/app/stores/languageStore'
import { useEventsData } from '@/app/helpers/data'
import { ItemType } from '@/app/components/content/Content'
import { formatDate } from '@/app/helpers/date'

interface SpeakParams {
  text: string
  lang?: string
}

export default function Voice() {
  const searchParams = useSearchParams()
  const events = useEventsData()
  const { currentLanguageCode, t } = useLanguageStore()

  const [isVoiceOn, setIsVoiceOn] = useState(false)

  const selectedItem = useMemo(() => {
    const itemId = Number(searchParams.get('id'))
    return events.find((item: ItemType) => item.id === itemId) || events[0]
  }, [events, searchParams])

  const voiceLanguage = useMemo(
    () => searchParams.get('language') || currentLanguageCode,
    [searchParams, currentLanguageCode]
  )

  const textToSpeak = useMemo(
    () => `${formatDate(selectedItem.date)} . ${selectedItem.title}`,
    [selectedItem]
  )

  // Ses çal
  const speak = useCallback(
    ({ text, lang = voiceLanguage }: SpeakParams) => {
      // Önceki sesi kapat
      window.speechSynthesis.cancel()

      setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(text)
        msg.lang = lang
        window.speechSynthesis.speak(msg)
      }, 1500)
    },
    [voiceLanguage]
  )

  // Ses durumunu güncelle
  useEffect(() => {
    const voiceEnabled = searchParams.get('voice') === 'enabled'
    setIsVoiceOn(voiceEnabled)

    if (voiceEnabled) {
      speak({ text: textToSpeak, lang: voiceLanguage })
    } else {
      window.speechSynthesis.cancel()
    }
  }, [searchParams, voiceLanguage, textToSpeak, speak])

  // Sesi aç/kapat
  const handleToggleVoice = useCallback(() => {
    const url = new URL(window.location.href)
    const newVoiceState = isVoiceOn ? 'disabled' : 'enabled'
    url.searchParams.set('voice', newVoiceState)
    window.history.pushState({}, '', url.toString())

    if (newVoiceState === 'disabled') window.speechSynthesis.cancel()
  }, [isVoiceOn])

  return (
    <button
      onClick={handleToggleVoice}
      aria-label={isVoiceOn ? t.Voice.voiceOff : t.Voice.voiceOn}
      title={isVoiceOn ? t.Voice.voiceOff : t.Voice.voiceOn}
    >
      <Image
        src={isVoiceOn ? iconVoiceOn : iconVoiceOff}
        alt={isVoiceOn ? t.Voice.isVoiceOn : t.Voice.isVoiceOff}
        width={16}
        height={16}
      />
    </button>
  )
}
