import styles from './StreetView.module.css'
import iconStreetView from '@/app/assets/icons/street-view.svg'
import Image from 'next/image'
import Link from 'next/link'

type StreetViewProps = {
  lat: number
  lon: number
}

export default function StreetView(props: StreetViewProps) {
  if (!props.lat || !props.lon || props.lat === 0 || props.lon === 0) return null

  const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${props.lat},${props.lon}`

  return (
    <Link className={styles.streetView} target='_blank' href={url}>
      <Image src={iconStreetView} alt='Street View ikonu' width={16} height={16} />
    </Link>
  )
}
