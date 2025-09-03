import { useMemo } from 'react'
import jsonDataTr from '../json/events_tr.json'
import jsonDataEn from '../json/events_en.json'

export const useEventsData = ({ locale }: { locale?: string } = {}) => {
  return useMemo(() => {
    switch (locale) {
      case 'tr':
        return jsonDataTr
      case 'en':
        return jsonDataEn
      default:
        return jsonDataTr
    }
  }, [])
}