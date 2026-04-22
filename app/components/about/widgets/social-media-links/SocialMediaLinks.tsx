import styles from './SocialMediaLinks.module.css'
import { useLanguageStore } from '@/app/stores/languageStore'

import Image from 'next/image'
import Link from 'next/link'
import youtubeIcon from '@/app/assets/icons/youtube.svg'
import instagramIcon from '@/app/assets/icons/instagram.svg'
import xIcon from '@/app/assets/icons/x.png'
import tiktokIcon from '@/app/assets/icons/tiktok.svg'

const socialMediaLinks = [
  {
    name: 'YouTube',
    icon: youtubeIcon,
    url: 'https://youtube.com/@Atat%C3%BCrkKronolojisi',
  },
  {
    name: 'Instagram',
    icon: instagramIcon,
    url: 'https://instagram.com/ataturk.kronolojisi',
  },
  {
    name: 'X',
    icon: xIcon,
    url: 'https://x.com/atakronolojisi',
  },
  {
    name: 'TikTok',
    icon: tiktokIcon,
    url: 'https://tiktok.com/@ataturkkronolojisi',
  },
]

export default function SocialMediaLinks() {
  const { t } = useLanguageStore()

  return (
    <div>
      <h2 className={styles.title}>{t.About.socialMediaLinksTitle}</h2>
      <ul className={styles.list}>
        {socialMediaLinks.map((socialLink) => (
          <li key={socialLink.name}>
            <Link
              href={socialLink.url}
              target='_blank'
              rel='noopener noreferrer'
              title={socialLink.name}
              aria-label={socialLink.name}
            >
              <Image src={socialLink.icon} alt={socialLink.name} width={24} height={24} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
