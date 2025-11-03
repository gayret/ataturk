import Image from 'next/image'
import Link from 'next/link'
import directionIcon from '@/app/assets/icons/direction.svg'
import { useLanguageStore } from '@/app/stores/languageStore'

type Props = {
  lat: number
  lon: number
}

export default function Direction(props: Props) {
  const { t } = useLanguageStore()
  const url = `https://www.google.com/maps/dir/?api=1&destination=${props.lat},${props.lon}`

  if (!props.lat || !props.lon || props.lat === 0 || props.lon === 0) return null

  return (
    <Link
      className='direction'
      target='_blank'
      href={url}
      rel='noopener noreferrer'
      title={t.ActionButtons.directionTitle}
    >
      <button>
        <Image src={directionIcon} alt={t.ActionButtons.directionIconAlt} width={16} height={16} />
      </button>
    </Link>
  )
}
