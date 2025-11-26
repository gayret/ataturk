import styles from './Translators.module.css'
import { useLanguageStore } from '@/app/stores/languageStore'

import Image from 'next/image'
import AEnesSolProfilePicture from '@/app/assets/images/a-enes-sol.jpeg'
import KaanKarakocProfilePicture from '@/app/assets/images/kaan-karakoc.jpeg'
import Link from 'next/link'

export default function Translators() {
  const { t } = useLanguageStore()

  return (
    <div>
      <h2 className={styles.title}>{t.About.translatorsTitle}</h2>
      <ul className={styles.list}>
        <li>
          <Link target='_blank' href='https://www.linkedin.com/in/a-enes-sol/'>
            <Image src={AEnesSolProfilePicture} alt='A. Enes Söl' width={50} height={50} />
            <span>A. Enes Söl</span>
          </Link>
          - English
        </li>
        <li>
          <Link target='_blank' href='https://www.linkedin.com/in/kaan-karakoc/'>
            <Image src={KaanKarakocProfilePicture} alt='Kaan Karakoç' width={50} height={50} />
            <span>Kaan Karakoç</span>
          </Link>
          - Deutsch
        </li>
      </ul>
    </div>
  )
}
