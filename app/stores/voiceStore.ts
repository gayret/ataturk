"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type VoicePreferences = {
  femaleVoice?: string
  maleVoice?: string
}

type VoiceState = {
  enabled: boolean
  volume: number
  preferredVoices: VoicePreferences
  isSupported: boolean
  forceReplayToken: number
  setEnabled: (value: boolean) => void
  setVolume: (value: number) => void
  setPreferredVoices: (prefs: VoicePreferences) => void
  setIsSupported: (supported: boolean) => void
  triggerReplay: () => void
}

const DEFAULT_VOLUME = 0.8

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      enabled: false,
      volume: DEFAULT_VOLUME,
      preferredVoices: {},
      isSupported: true,
      forceReplayToken: 0,
      setEnabled: (value: boolean) =>
        set({
          enabled: value,
        }),
      setVolume: (value: number) =>
        set({
          volume: Math.min(1, Math.max(0, value)),
        }),
      setPreferredVoices: (prefs: VoicePreferences) =>
        set({
          preferredVoices: {
            ...prefs,
          },
        }),
      setIsSupported: (supported: boolean) =>
        set({
          isSupported: supported,
        }),
      triggerReplay: () =>
        set((state) => ({
          forceReplayToken: state.forceReplayToken + 1,
        })),
    }),
    {
      name: 'voice-settings',
      partialize: (state) => ({
        enabled: state.enabled,
        volume: state.volume,
        preferredVoices: state.preferredVoices,
      }),
    }
  )
)
