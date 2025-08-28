import { useMemo } from 'react'
import jsonData from '../json/events.json'

export const useEventsData = () => {
  return useMemo(() => jsonData, [])
}
