import iconStreetView from '@/app/assets/icons/street-view.svg'
import { useLanguageStore } from '@/app/stores/languageStore'
import Image from 'next/image'
import Link from 'next/link'

type StreetViewProps = {
  lat: number
  lon: number
}

export default function StreetView(props: StreetViewProps) {
  const { t } = useLanguageStore()
  if (!props.lat || !props.lon || props.lat === 0 || props.lon === 0) return null

  const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${props.lat},${props.lon}`

  return (
    <Link target='_blank' href={url} rel='noopener noreferrer' title={t.ActionButtons.streetViewTitle}>
      <button>
        <Image src={iconStreetView} alt={t.ActionButtons.streetViewIconAlt} width={16} height={16} />
      </button>
    </Link>
  )
}
