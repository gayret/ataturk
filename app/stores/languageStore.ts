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

// Desteklenen diller
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

// Dil dosyasını çağırma fonksiyonu
const getLanguageFile = (code: string) => {
    const language = availableLanguages.find(lang => lang.code === code)
    return language ? language.file : tr
}

// Tarayıcı dilini getiren fonksiyon
const getBrowserLanguage = (): string => {
    if (typeof window === 'undefined') return 'tr'

    const browserLang = navigator.language || (navigator as any).userLanguage
    const langCode = browserLang.split('-')[0].toLowerCase()

    // Desteklenen diller arasında yoksa tr kullanılsın
    const isSupported = availableLanguages.some(lang => lang.code === langCode)
    return isSupported ? langCode : 'tr'
}

interface LanguageStore {
    currentLanguageCode: string
    t: any
    setLanguage: (code: string) => void
}

const DEFAULT_LANGUAGE_CODE = 'tr'

export const useLanguageStore = create<LanguageStore>()(
    persist(
        (set) => ({
            currentLanguageCode: DEFAULT_LANGUAGE_CODE,
            t: getLanguageFile(DEFAULT_LANGUAGE_CODE),

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
            name: 'language-storage',
            // Sadece dil kodunu localStorage'a kaydet, t değerini kaydetme
            partialize: (state) => ({ currentLanguageCode: state.currentLanguageCode }),
            // localStorage'tan okurken t dinamik olarak hesaplansın
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.t = getLanguageFile(state.currentLanguageCode)
                }
            },
        }
    )
)

// Hydration sonrası ilk ziyaret kontrolü (istemci tarafında)
if (typeof window !== 'undefined') {
    const checkAndSetInitialLanguage = () => {
        // Öncelik sırası: URL parametresi > localStorage > Tarayıcı dili > tr
        const urlParams = new URLSearchParams(window.location.search)
        const urlLanguage = urlParams.get('language')
        const stored = localStorage.getItem('language-storage')

        // 1. URL parametresi varsa onu kullan
        if (urlLanguage) {
            useLanguageStore.getState().setLanguage(urlLanguage)
        }
        // 2. localStorage varsa onu kullan (zaten Zustand bunu yapıyor, ekstra bir şey yapmaya gerek yok)
        // 3. İkisi de yoksa tarayıcı dilini kullan
        else if (!stored) {
            const browserLang = getBrowserLanguage()
            useLanguageStore.getState().setLanguage(browserLang)
        }
    }

    // Store hydration tamamlandıktan sonra çalıştır
    setTimeout(checkAndSetInitialLanguage, 0)
}