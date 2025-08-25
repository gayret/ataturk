import styles from './StreetView.module.css'
import iconStreetView from '@/app/assets/icons/street-view.svg'
import Image from 'next/image'
import Link from 'next/link'

type StreetViewProps = {
  url: string
}

export default function StreetView(props: StreetViewProps) {
  if (!props.url) return

  return (
    <Link className={styles.streetView} target='_blank' href={props.url}>
      <Image src={iconStreetView} alt='Street View ikonu' width={16} height={16} />
    </Link>
  )
}
