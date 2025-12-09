import Link from 'next/link'
import Image from 'next/image'
import pencilIcon from '@/app/assets/icons/pencil-alt.svg'
import { useSearchParams } from 'next/navigation'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function EditThisContent() {
  const { t } = useLanguageStore()
  const searchParams = useSearchParams()

  const url = `https://github.com/gayret/ataturk/blob/main/data/events/${searchParams.get(
    'language'
  )}/${searchParams.get('id') ?? 1}.md`

  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      title={t.ActionButtons.editThisContent}
    >
      <button>
        <Image src={pencilIcon} alt='Edit this content' width={16} height={16} />
      </button>
    </Link>
  )
}
