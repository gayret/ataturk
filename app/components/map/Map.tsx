'use client'

import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import TurkishCountryLabels from './widgets/TurkishCountryLabels'
import { useEventsData } from '@/app/helpers/data'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/app/helpers/date'

const iconActive = L.icon({
  iconUrl: '/icons/location-active.svg',
  iconSize: [50, 66],
  iconAnchor: [21, 50],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [200, 200],
})

const iconPassive = L.icon({
  iconUrl: '/icons/location-passive.svg',
  iconSize: [35, 51],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
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
  const showAllLocations = searchParams.get('show-all-locations') === 'true'
  const events = useEventsData()
  if (events.length === 0) return null
  // Random zoom level
  const initialZoom = Math.floor(Math.random() * 5) + 7

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
          events.map((item) => (
            <Marker
              opacity={0.5}
              key={item.id}
              eventHandlers={{
                click: () => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('id', item.id.toString())
                  window.history.pushState({}, '', url.toString())
                },
              }}
              position={[item.location!.lat, item.location!.lon]}
              icon={iconPassive}
              title={formatDate(item.date) + ' - ' + item.title}
            />
          ))}

        <Marker position={[location.lat, location.lon]} icon={iconActive} zIndexOffset={1} />

        <MapCenterUpdater location={location} />

        <TurkishCountryLabels />
      </MapContainer>
    </div>
  )
}
