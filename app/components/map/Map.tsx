'use client'

import styles from './Map.module.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import TurkishCountryLabels from './widgets/TurkishCountryLabels'

const icon = L.icon({
  iconUrl: '/icons/location.svg',
  iconSize: [25, 41],
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
  // Random zoom level
  const initialZoom = Math.floor(Math.random() * 3) + 6

  return (
    <div className={styles.map}>
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={initialZoom}
        scrollWheelZoom
        keyboard={false}
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[location.lat, location.lon]} icon={icon} />
        <MapCenterUpdater location={location} />
        <TurkishCountryLabels />
      </MapContainer>
    </div>
  )
}
