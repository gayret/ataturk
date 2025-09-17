import { useMemo } from 'react'
import jsonData from '../json/events.json'

const useEventsData = () => {
  return useMemo(() => jsonData, [])
}

export default useEventsData;
