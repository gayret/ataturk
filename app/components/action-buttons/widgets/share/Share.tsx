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
import { useLanguageStore } from '@/app/stores/languageStore'

export default function Share() {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const { t } = useLanguageStore()

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

  const fullUrl = `${baseUrl}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`

  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedText = encodeURIComponent(
    `${t.ActionButtons.shareText}`
  )

  const shareLinks = {
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
  }

  return (
    <div className={styles.share}>
      <button onClick={() => setOpen(!open)} title={t.ActionButtons.shareTitle}>
        <Image src={iconShare} alt={t.ActionButtons.shareIconAlt} width={16} height={16} />
      </button>

      {open && (
        <div className={styles.opened}>
          <Link
            href={shareLinks.linkedin}
            target='_blank'
            rel='noopener noreferrer'
            title={t.ActionButtons.shareLinkedinTitle}
          >
            <Image src={linkedinIcon} alt={t.ActionButtons.shareLinkedinIconAlt} width={16} height={16} />
          </Link>

          <Link href={shareLinks.x} target='_blank' rel='noopener noreferrer' title={t.ActionButtons.shareTwitterTitle}>
            <Image src={twitterIcon} alt={t.ActionButtons.shareTwitterIconAlt} width={16} height={16} />
          </Link>

          <Link
            href={shareLinks.facebook}
            target='_blank'
            rel='noopener noreferrer'
            title={t.ActionButtons.shareFacebookTitle}
          >
            <Image src={facebookIcon} alt={t.ActionButtons.shareFacebookIconAlt} width={16} height={16} />
          </Link>

          <Link
            href={shareLinks.whatsapp}
            target='_blank'
            rel='noopener noreferrer'
            title={t.ActionButtons.shareWhatsappTitle}
          >
            <Image src={whatsappIcon} alt={t.ActionButtons.shareWhatsappIconAlt} width={16} height={16} />
          </Link>
        </div>
      )}
    </div>
  )
}
