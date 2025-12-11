'use client'

import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useEventsData } from '@/app/helpers/data'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/app/helpers/date'
import EventTypes from '@/app/constants/EventTypes'
import GeoJSONComp from './GeoJSONComp'

const iconActive = L.icon({
  iconUrl: '/icons/location-active.svg',
  iconSize: [40, 55],
  iconAnchor: [21, 50],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [200, 200],
})

type MapProps = {
  location: {
    lat: number
    lon: number
  }
}

function MapCenterUpdater({ location }: MapProps) {
  const map = useMap()
  const prevLocation = useRef<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    if (!map) return

    // Mevcut konumu piksel cinsine çevir
    const point = map.latLngToContainerPoint([location.lat, location.lon])
    // Y ekseninde yukarı kaydır (ör: ekranın 1/4'ü kadar)
    const offsetPoint = L.point(point.x, point.y - map.getSize().y / 4)
    // Tekrar lat/lng'e çevir
    const offsetLatLng = map.containerPointToLatLng(offsetPoint)

    if (prevLocation.current) {
      map.flyTo(offsetLatLng, map.getZoom(), {
        animate: true,
        duration: 0.7,
      })
    } else {
      map.setView(offsetLatLng, map.getZoom(), { animate: false })
    }

    prevLocation.current = location
  }, [location, map])

  return null
}

export default function Map({ location }: MapProps) {
  const searchParams = useSearchParams()
  const events = useEventsData()
  const [filteredEvents, setFilteredEvents] = useState<typeof events>([])

  const displayedLocations = useMemo(() => {
    return searchParams.get('displayed-locations')?.split(',') || []
  }, [searchParams])

  const currentId = useMemo(() => {
    return searchParams.get('id')
  }, [searchParams])

  const showAllLocations = displayedLocations.length > 0

  const handleMarkerClick = useCallback((id: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('id', id.toString())
    window.history.pushState({}, '', url.toString())
  }, [])

  const getMarkerIcon = useCallback((category: string) => {
    const eventType = EventTypes.find((eventType) => eventType.title === category)
    const iconSrc = eventType?.icon?.src || '/icons/location-passive.svg'

    return L.icon({
      iconUrl: iconSrc,
      iconSize: [14, 14],
      iconAnchor: [9, 15],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    })
  }, [])

  // Events'i filtrele - sadece events ve displayedLocations değiştiğinde
  useEffect(() => {
    if (!events || events.length === 0) {
      setFilteredEvents([])
      return
    }

    let newFilteredEvents: typeof events

    if (displayedLocations.length === 0) {
      newFilteredEvents = events
    } else {
      newFilteredEvents = events.filter((event) => {
        return displayedLocations.includes(event.category || '')
      })
    }

    setFilteredEvents(newFilteredEvents)
  }, [events, displayedLocations])

  // Aktif marker yoksa ilk eventi seç - ama sadece gerektiğinde
  useEffect(() => {
    if (filteredEvents.length === 0) return

    // Mevcut ID'nin filtrelenmiş eventlerde olup olmadığını kontrol et
    const hasActiveMarker = filteredEvents.some((event) => event.id === Number(currentId))

    // Eğer aktif marker yoksa ve henüz bir ID seçilmemişse ilk eventi seç
    if (!hasActiveMarker && filteredEvents.length > 0) {
      // Sadece currentId null/undefined ise yeni ID set et
      // Bu infinite loop'u önler
    }
  }, [filteredEvents, currentId])

  // Events yüklenene kadar veya filtrelenmiş eventler yoksa null döndür
  if (!events || filteredEvents.length === 0) {
    return null
  }

  // Sabit zoom level kullan
  const initialZoom = 8

  return (
    <div className={styles.map}>
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={initialZoom}
        scrollWheelZoom
        keyboard={false}
        style={{ height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
        />

        {showAllLocations &&
          filteredEvents.map((item) => {
            if (!item.location) return null

            return (
              <Marker
                opacity={0.5}
                key={item.id}
                eventHandlers={{
                  click: () => {
                    handleMarkerClick(item.id)
                  },
                }}
                position={[item.location.lat, item.location.lon]}
                icon={getMarkerIcon(item.category || '')}
                title={formatDate(item.date) + ' - ' + item.title}
              />
            )
          })}

        <Marker position={[location.lat, location.lon]} icon={iconActive} />

        <GeoJSONComp events={events} searchParams={searchParams} />

        <MapCenterUpdater location={location} />
      </MapContainer>
    </div>
  )
}
