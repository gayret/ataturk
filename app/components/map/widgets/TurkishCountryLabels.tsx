import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import WORLD_COUNTRIES from './WORLD_COUNTRIES.json'

export default function TurkishCountryLabels() {
  const map = useMap()
  const [currentZoom, setCurrentZoom] = useState(3)
  const labelsRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!map) return

    // Zoom değişikliklerini dinle
    const handleZoom = () => {
      setCurrentZoom(map.getZoom())
    }

    map.on('zoomend', handleZoom)
    handleZoom() // İlk zoom değerini al

    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map])

  useEffect(() => {
    if (!map) return

    // Önceki etiketleri temizle
    labelsRef.current.forEach((label) => {
      map.removeLayer(label)
    })
    labelsRef.current = []

    // Mevcut zoom seviyesine uygun ülkeleri göster
    const visibleCountries = WORLD_COUNTRIES.filter((country) => currentZoom >= country.minZoom)

    // Harita sınırlarını al - sadece görünen alandaki ülkeleri göster
    const bounds = map.getBounds()

    // Türkçe ülke etiketlerini ekle
    visibleCountries.forEach((country) => {
      // Ülke koordinatlarının harita görünümünde olup olmadığını kontrol et
      if (bounds.contains([country.lat, country.lng])) {
        // Font boyutunu zoom seviyesine göre ayarla
        const fontSize = Math.max(10, Math.min(16, currentZoom * 2))
        const padding = currentZoom >= 5 ? '4px 8px' : '2px 6px'

        const labelIcon = L.divIcon({
          className: 'turkish-country-label',
          html: `<div style="
            background: transparent;
            padding: ${padding};
            border-radius: 0;
            font-size: ${fontSize}px;
            font-weight: bold;
            color: #000;
            text-shadow:
              -1px -1px 0 #ffffff,
              1px -1px 0 #ffffff,
              -1px 1px 0 #ffffff,
              1px 1px 0 #ffffff,
              0 0 3px #ffffff,
              0 0 6px #ffffff;
            border: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            white-space: nowrap;
            text-align: center;
            letter-spacing: 0.5px;
          ">${country.name}</div>`,
          iconSize: [country.name.length * (fontSize * 0.65), fontSize + 4],
          iconAnchor: [country.name.length * (fontSize * 0.325), (fontSize + 4) / 2],
        })

        const label = L.marker([country.lat, country.lng], {
          icon: labelIcon,
          interactive: false, // Etiketler tıklanabilir olmasın
          zIndexOffset: 1000, // Etiketleri üstte göster
        })

        label.addTo(map)
        labelsRef.current.push(label)
      }
    })

    // Component unmount olduğunda temizle
    return () => {
      labelsRef.current.forEach((label) => {
        if (map.hasLayer(label)) {
          map.removeLayer(label)
        }
      })
    }
  }, [map, currentZoom])

  // Harita hareket ettiğinde de etiketleri güncelle
  useEffect(() => {
    if (!map) return

    const handleMoveEnd = () => {
      // Zoom değişmeden sadece pan yapıldığında da etiketleri güncelle
      setCurrentZoom(map.getZoom())
    }

    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
    }
  }, [map])

  return null
}
