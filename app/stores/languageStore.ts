"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import tr from '../locale/tr.json'
import en from '../locale/en.json'

interface Language {
    code: string
    name: string
    file: any
}

export const availableLanguages: Language[] = [
    {
        code: 'tr',
        name: 'Türkçe',
        file: tr,
    },
    {
        code: 'en',
        name: 'English',
        file: en,
    },
]

interface LanguageStore {
    currentLanguageCode: string
    t: any
    setLanguage: (code: string) => void
}

const DEFAULT_LANGUAGE_CODE = 'tr'
const DEFAULT_LANGUAGE_FILE = availableLanguages.find(lang => lang.code === DEFAULT_LANGUAGE_CODE)!.file

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set) => ({
            currentLanguageCode: DEFAULT_LANGUAGE_CODE,
            t: DEFAULT_LANGUAGE_FILE,

            setLanguage: (code: string) => {
                const language = availableLanguages.find(lang => lang.code === code)
                if (language) {
                    set({
                        currentLanguageCode: code,
                        t: language.file
                    })
                }
            },
        }),
        {
            name: 'language-storage', // localStorage key
        }
    )
)