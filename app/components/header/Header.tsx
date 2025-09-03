import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import HeaderPicture from '@/app/assets/images/header.jpg'

export default function Header({ lang }: { lang: string }) {
  return (
    <header className={styles.header}>
      <Link href={`/${lang}/?id=about`} className={styles.link}>
        <Image className={styles.logo} src={HeaderPicture} alt='logo' width={200} height={200} />
        <h1 className={styles.title}>
          {
            lang === 'tr' ?
              'Atatürk Kronolojisi'
              :
              'Atatürk Timeline'
          }
        </h1>
      </Link>
    </header>
  )
}
