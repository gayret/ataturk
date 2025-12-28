import type { ItemType } from '@/app/components/content/Content'
import type { VoicePreferences } from '@/app/stores/voiceStore'

const FADE_OUT_DURATION_MS = 400
const FADE_STEPS = 5

let activeUtterances: SpeechSynthesisUtterance[] = []
let currentVolume = 0.8
let stopRequestId = 0
let speakRequestId = 0

export const isSpeechSupported = () =>
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  typeof window.SpeechSynthesisUtterance !== 'undefined'

export const stopSpeakingWithFade = async () => {
  if (!isSpeechSupported()) {
    return
  }

  const requestId = ++stopRequestId

  if (!window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
    if (requestId === stopRequestId) {
      activeUtterances = []
    }
    return
  }

  const startVolume = currentVolume
  const fadingUtterances = [...activeUtterances]
  let step = 0

  await new Promise<void>((resolve) => {
    const interval = window.setInterval(() => {
      step += 1
      const newVolume = Math.max(0, startVolume * (1 - step / FADE_STEPS))
      fadingUtterances.forEach((utterance) => {
        utterance.volume = newVolume
      })

      if (step >= FADE_STEPS) {
        window.clearInterval(interval)
        if (requestId === stopRequestId) {
          window.speechSynthesis.cancel()
          activeUtterances = []
        }
        resolve()
      }
    }, FADE_OUT_DURATION_MS / FADE_STEPS)
  })
}

export const updateSpeechVolume = (volume: number) => {
  currentVolume = Math.min(1, Math.max(0, volume))
  activeUtterances.forEach((utterance) => {
    utterance.volume = currentVolume
  })
}

export const loadVoices = async (): Promise<SpeechSynthesisVoice[]> => {
  if (!isSpeechSupported()) {
    return []
  }

  const initialVoices = window.speechSynthesis.getVoices()
  if (initialVoices.length > 0) {
    return initialVoices
  }

  return new Promise((resolve) => {
    const handleVoicesChanged = () => {
      const voices = window.speechSynthesis.getVoices()
      resolve(voices)
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    window.speechSynthesis.getVoices()

    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices())
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }, 1000)
  })
}

const nameSuggestsFemale = (voice?: SpeechSynthesisVoice | null) => {
  if (!voice?.name) return false
  const lower = voice.name.toLowerCase()
  return lower.includes('female') || lower.includes('woman') || lower.includes('salli') || lower.includes('zira')
}

const pickVoice = (
  voices: SpeechSynthesisVoice[],
  languageCode: string,
  preferredId?: string,
  preferFemale?: boolean
) => {
  if (preferredId) {
    const preferredVoice = voices.find((voice) => voice.voiceURI === preferredId)
    if (preferredVoice) {
      return preferredVoice
    }
  }

  const localeMatches = voices.filter(
    (voice) => voice.lang && voice.lang.toLowerCase().startsWith(languageCode.toLowerCase())
  )

  if (preferFemale) {
    const femaleMatch = localeMatches.find((voice) => nameSuggestsFemale(voice))
    if (femaleMatch) {
      return femaleMatch
    }
  } else {
    const maleMatch = localeMatches.find((voice) => !nameSuggestsFemale(voice))
    if (maleMatch) {
      return maleMatch
    }
  }

  return localeMatches[0] || voices[0]
}

type SpeakEventParams = {
  event: ItemType
  formattedDate: string
  languageCode: string
  preferredVoices: VoicePreferences
}

const buildUtterance = (
  text: string,
  voice: SpeechSynthesisVoice | null,
  languageCode: string,
  pitch: number
) => {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = voice?.lang || languageCode
  if (voice) {
    utterance.voice = voice
  }
  utterance.pitch = pitch
  utterance.volume = currentVolume
  return utterance
}

export const speakEvent = async ({
  event,
  formattedDate,
  languageCode,
  preferredVoices,
}: SpeakEventParams) => {
  if (!isSpeechSupported() || !event) {
    return Promise.resolve()
  }

  await stopSpeakingWithFade()

  const voices = await loadVoices()
  if (!voices || voices.length === 0) {
    throw new Error('No voices available')
  }

  const femaleVoice = pickVoice(voices, languageCode, preferredVoices?.femaleVoice, true)
  const maleVoice = pickVoice(voices, languageCode, preferredVoices?.maleVoice, false)

  const utterances: SpeechSynthesisUtterance[] = []

  if (formattedDate) {
    utterances.push(buildUtterance(formattedDate, femaleVoice, languageCode, 1.05))
  }

  if (event.title) {
    utterances.push(buildUtterance(event.title, maleVoice || femaleVoice, languageCode, 0.95))
  }

  if (event.description) {
    utterances.push(buildUtterance(event.description, femaleVoice || maleVoice, languageCode, 1.05))
  }

  activeUtterances = utterances
  const requestId = ++speakRequestId

  const completionPromise = new Promise<void>((resolve, reject) => {
    if (utterances.length === 0) {
      resolve()
      return
    }

    let finished = 0
    let settled = false

    const finalize = (isError: boolean = false) => {
      if (settled) return
      if (requestId !== speakRequestId) return

      if (isError) {
        settled = true
        reject(new Error('Speech synthesis failed'))
        return
      }

      finished += 1
      if (finished >= utterances.length) {
        settled = true
        resolve()
      }
    }

    utterances.forEach((utterance) => {
      utterance.onend = () => finalize(false)
      utterance.onerror = () => finalize(true)
    })
  })

  utterances.forEach((utterance) => {
    window.speechSynthesis.speak(utterance)
  })

  return completionPromise
}
