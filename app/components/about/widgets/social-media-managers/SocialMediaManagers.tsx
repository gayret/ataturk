import styles from './SocialMediaManagers.module.css'
import { useLanguageStore } from '@/app/stores/languageStore'

import Image from 'next/image'
import Link from 'next/link'
import KareIletisimAjansiImage from '@/app/assets/images/kare-iletisim-ajansi.png'

const socialMediaManagers = [
  {
    name: 'Kare İletişim Ajansı',
    image: KareIletisimAjansiImage,
    url: 'https://www.instagram.com/kareiletisimajansi',
  },
]

export default function SocialMediaManagers() {
  const { t } = useLanguageStore()

  return (
    <div>
      <h2 className={styles.title}>{t.About.socialMediaManagersTitle}</h2>
      <ul className={styles.list}>
        {socialMediaManagers.map((manager) => (
          <li key={manager.name}>
            <Link target='_blank' rel='noopener noreferrer' href={manager.url}>
              <Image src={manager.image} alt={manager.name} width={50} height={50} />
              <span>{manager.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
