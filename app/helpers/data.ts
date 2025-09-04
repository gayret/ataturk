import { useMemo } from 'react'
import jsonDataTr from '../json/events_tr.json'
import jsonDataEn from '../json/events_en.json'
import { useSearchParams } from 'next/navigation'

export const useEventsData = () => {

  const searchParams = useSearchParams()
  const locale = searchParams.get('language') || 'tr'

  return useMemo(() => {
    switch (locale) {
      case 'tr':
        return jsonDataTr
      case 'en':
        return jsonDataEn
      default:
        return jsonDataTr
    }
  }, [locale])
}