import styles from './Share.module.css'
import iconShare from '@/app/assets/icons/share.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import linkedinIcon from '@/app/assets/icons/linkedin.svg'
import twitterIcon from '@/app/assets/icons/twitter.svg'
import facebookIcon from '@/app/assets/icons/facebook.svg'
import whatsappIcon from '@/app/assets/icons/whatsapp.svg'

export default function Share() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  // Eğer kullanıcı sayfanın dışına tıklarsa open'ı false yap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const shareElement = document.querySelector(`.${styles.share}`)
      if (shareElement && !shareElement.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const pathname = usePathname()
  const baseUrl = 'https://ataturk-kronolojisi.org'

  const fullUrl = `${baseUrl}${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedText = encodeURIComponent(
    "Atatürk Kronolojisi - Mustafa Kemal Atatürk'ün hayatını haritalar, görsel ve işitsel kaynaklarla keşfedin!"
  )

  const shareLinks = {
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
  }

  return (
    <div className={styles.share}>
      <button onClick={() => setOpen(!open)}>
        <Image src={iconShare} alt='Share ikonu' width={16} height={16} />
      </button>

      {open && (
        <div className={styles.opened}>
          <Link
            href={shareLinks.linkedin}
            target='_blank'
            rel='noopener noreferrer'
            title="LinkedIn'de paylaş"
          >
            <Image src={linkedinIcon} alt='LinkedIn ikonu' width={16} height={16} />
          </Link>

          <Link href={shareLinks.x} target='_blank' rel='noopener noreferrer' title="X'te paylaş">
            <Image src={twitterIcon} alt='X ikonu' width={16} height={16} />
          </Link>

          <Link
            href={shareLinks.facebook}
            target='_blank'
            rel='noopener noreferrer'
            title="Facebook'ta paylaş"
          >
            <Image src={facebookIcon} alt='Facebook ikonu' width={16} height={16} />
          </Link>

          <Link
            href={shareLinks.whatsapp}
            target='_blank'
            rel='noopener noreferrer'
            title="WhatsApp'ta paylaş"
          >
            <Image src={whatsappIcon} alt='Facebook ikonu' width={16} height={16} />
          </Link>
        </div>
      )}
    </div>
  )
}
