import { useSearchParams } from 'next/navigation'
import iconSoundActive from '../../../../assets/icons/sound-active.svg'
import iconSoundPasive from '../../../../assets/icons/sound-passive.svg'
import Image from 'next/image'
import TextToSpeech from '@/app/components/text-to-speech/TextToSpeech'

export default function ToggleAnnouncement() {
  const searchParams = useSearchParams()
  const isActiveAnnouncement = searchParams.get('announcement') === 'true'

  return (
    <>
      <TextToSpeech />
      <button
        onClick={() => {
          const params = new URLSearchParams(Array.from(searchParams.entries()))
          if (isActiveAnnouncement) {
            params.delete('announcement')
          } else {
            params.set('announcement', 'true')
          }
          const newUrl = `${window.location.pathname}?${params.toString()}`
          window.history.replaceState({}, '', newUrl)
        }}
        title={isActiveAnnouncement ? 'Sesli anonsları kapat' : 'Sesli anonsları aç'}
        aria-pressed={isActiveAnnouncement}
      >
        <Image
          src={isActiveAnnouncement ? iconSoundActive : iconSoundPasive}
          alt=''
          width={16}
          height={16}
        />
      </button>
    </>
  )
}
