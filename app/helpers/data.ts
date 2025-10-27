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

  // Öncelik sırası: URL parametresi > localStorage > varsayılan olarak tr
  const urlLanguage = searchParams.get('language')

  useEffect(() => {
    if (urlLanguage && urlLanguage !== currentLanguageCode) {
      // URL parametresi varsa ve farklıysa store'u güncelle
      setLanguage(urlLanguage)
    } else if (!urlLanguage && currentLanguageCode !== 'tr') {
      // URL'de dil parametresi yoksa ama localStorage'da farklı bir dil varsa, URL'e ekle
      const params = new URLSearchParams(searchParams.toString())
      params.set('language', currentLanguageCode)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [urlLanguage, currentLanguageCode, setLanguage, router, pathname, searchParams])

  // Hangi dili kullanacağını belirle
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