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
  speechToken: number
  speechPromise: Promise<void> | null
  setEnabled: (value: boolean) => void
  setVolume: (value: number) => void
  setPreferredVoices: (prefs: VoicePreferences) => void
  setIsSupported: (supported: boolean) => void
  triggerReplay: () => void
  setSpeechState: (token: number, promise: Promise<void> | null) => void
  clearSpeechState: () => void
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
      speechToken: 0,
      speechPromise: null,
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
      setSpeechState: (token: number, promise: Promise<void> | null) =>
        set({
          speechToken: token,
          speechPromise: promise,
        }),
      clearSpeechState: () =>
        set({
          speechToken: 0,
          speechPromise: null,
        }),
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
