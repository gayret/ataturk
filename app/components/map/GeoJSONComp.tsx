import { useEffect, useMemo, useState } from 'react'
import { convertDateFormat } from '@/app/helpers/date'
import { GeoJSON } from 'react-leaflet'

type GeoFeature = {
  properties: {
    gwsdate: string
    gwedate: string
  }
}

type GeoData = {
  features: GeoFeature[]
}

interface Event {
  id: number
  date: string
}

interface GeoJSONProps {
  events: Event[]
  searchParams: URLSearchParams
}

const GeoJSONComp = ({ events, searchParams }: GeoJSONProps) => {
  const [geoData, setGeoData] = useState<GeoData | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchGeoJSON = async () => {
      try {
        const res = await fetch('/data/worldBorder.json', {
          cache: 'force-cache',
        })
        if (!cancelled) {
          const data = await res.json()
          setGeoData(data)
        }
      } catch (err) {
        console.error('Failed to load GeoJSON:', err)
      }
    }
    fetchGeoJSON()

    return () => {
      cancelled = true
    }
  }, [])

  const year = useMemo(() => {
    const event = events?.find((e) => e.id === Number(searchParams.get('id')))
    return event ? new Date(event.date).getTime() : null
  }, [events, searchParams])

  const filteredData = useMemo(() => {
    if (!year) return { ...geoData, type: 'FeatureCollection' as const, features: [] }
    return {
      ...geoData,
      type: 'FeatureCollection' as const,
      features:
        geoData?.features?.filter((f: GeoFeature) => {
          const start = f.properties.gwsdate
          const end = f.properties.gwedate
          return (
            year >= new Date(convertDateFormat(start)).getTime() &&
            year <= new Date(convertDateFormat(end)).getTime()
          )
        }) ?? [],
    }
  }, [year, geoData])

  const geoJsonKey = useMemo(() => {
    return `geojson-${year || 'no-year'}-${filteredData.features?.length}`
  }, [year, filteredData.features?.length])

  if (filteredData.features.length === 0) return null

  return (
    <GeoJSON
      key={geoJsonKey}
      data={filteredData}
      style={(feature) => {
        const countryName = feature?.properties.cntry_name.toLowerCase() || ''
        return {
          color: '#22222225',
          weight: 1,
          fillColor: countryName.includes('turkey') ? '#ff0000' : '#fff',
          fillOpacity: 0.05,
        }
      }}
    />
  )
}

export default GeoJSONComp
