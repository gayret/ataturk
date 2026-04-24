import { useEffect, useMemo, useState } from 'react'
import * as turf from '@turf/turf'
import { convertDateFormat, isHatayOutsideTurkeyPeriod } from '@/app/helpers/date'
import { GeoJSON } from 'react-leaflet'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

const INITIAL_YEAR = '01.01.1881 23:00:00'

type GeoFeatureProperties = {
  gwsdate: string
  gwedate: string
  cntry_name?: string
  [key: string]: unknown
}

type GeoFeature = Feature<Polygon | MultiPolygon, GeoFeatureProperties>
type GeoData = FeatureCollection<Polygon | MultiPolygon, GeoFeatureProperties>

const HATAY_MASK = turf.polygon([
  [
    [36.141, 37.008],
    [36.252, 37.02],
    [36.366, 37.0],
    [36.471, 36.962],
    [36.575, 36.907],
    [36.664, 36.84],
    [36.735, 36.71],
    [36.779, 36.553],
    [36.788, 36.398],
    [36.78, 36.262],
    [36.744, 36.162],
    [36.666, 36.066],
    [36.553, 35.988],
    [36.409, 35.926],
    [36.256, 35.876],
    [36.101, 35.833],
    [35.991, 35.806],
    [35.94, 35.832],
    [35.904, 35.89],
    [35.875, 35.975],
    [35.849, 36.055],
    [35.833, 36.146],
    [35.818, 36.236],
    [35.813, 36.324],
    [35.826, 36.417],
    [35.854, 36.513],
    [35.892, 36.596],
    [35.946, 36.674],
    [36.023, 36.746],
    [36.085, 36.821],
    [36.117, 36.9],
    [36.141, 37.008],
  ],
])

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
    return new Date(event?.date || INITIAL_YEAR).getTime()
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

  const displayData = useMemo(() => {
    if (!isHatayOutsideTurkeyPeriod(year)) return filteredData

    const features = filteredData.features.map((feature) => {
      const countryName = (feature.properties.cntry_name || '').toLowerCase()
      if (!countryName.includes('turkey')) return feature

      try {
        // Turf v7 difference expects a FeatureCollection of [target, mask].
        const clipped = turf.difference(
          turf.featureCollection([feature, HATAY_MASK as Feature<Polygon | MultiPolygon>]),
        )

        if (!clipped) return feature

        return {
          ...feature,
          geometry: clipped.geometry,
        }
      } catch (err) {
        console.error('Failed to clip Hatay geometry:', err)
        return feature
      }
    })

    return {
      ...filteredData,
      features,
    }
  }, [filteredData, year])

  const geoJsonKey = useMemo(() => {
    return `geojson-${year || 'no-year'}-${displayData.features?.length}`
  }, [year, displayData.features?.length])

  if (displayData.features.length === 0) return null

  return (
    <GeoJSON
      key={geoJsonKey}
      data={displayData}
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
