'use client'

export type VoicePlaybackStatus = 'start' | 'end' | 'cancel' | 'error'

export interface VoicePlaybackDetail {
  status: VoicePlaybackStatus
  eventId?: number
  startedAt?: number
  endedAt?: number
  durationMs?: number
}

export const VOICE_PLAYBACK_EVENT = 'voice-playback'

export function dispatchVoicePlaybackEvent(detail: VoicePlaybackDetail) {
  if (typeof window === 'undefined') return

  const voiceEvent = new CustomEvent<VoicePlaybackDetail>(VOICE_PLAYBACK_EVENT, { detail })
  window.dispatchEvent(voiceEvent)
}
