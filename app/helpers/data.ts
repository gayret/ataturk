import { useMemo, useEffect } from 'react'
import jsonDataTr from '../json/events_tr.json'
import jsonDataEn from '../json/events_en.json'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useLanguageStore } from '../stores/languageStore'

export const useEventsData = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { currentLanguageCode, setLanguage } = useLanguageStore()

  // Öncelik sırası: URL parametresi > localStorage > Tarayıcı dili > tr
  const urlLanguage = searchParams.get('language')

  useEffect(() => {
    // 1. URL parametresi varsa store'u güncelle
    if (urlLanguage && urlLanguage !== currentLanguageCode) {
      setLanguage(urlLanguage)
    }
    // 2. URL'de dil parametresi yoksa, mevcut dili URL'e ekle (tr dahil)
    else if (!urlLanguage && currentLanguageCode) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('language', currentLanguageCode)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [urlLanguage, currentLanguageCode, setLanguage, router, pathname, searchParams])

  // Aktif dili belirle: URL > store (localStorage veya tarayıcı dili)
  const activeLanguage = urlLanguage || currentLanguageCode

  return useMemo(() => {
    // Dil "tr" ise events_tr.json, "en" ise events_en.json, hiçbiri değilse events_tr.json
    switch (activeLanguage) {
      case 'tr':
        return jsonDataTr
      case 'en':
        return jsonDataEn
      default:
        return jsonDataTr
    }
  }, [activeLanguage])
}