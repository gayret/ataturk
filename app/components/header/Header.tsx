import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import HeaderPicture from '@/app/assets/images/header.jpg'
import Search from './widgets/Search'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href='/?id=about' className={styles.link}>
        <Image className={styles.logo} src={HeaderPicture} alt='logo' width={200} height={200} />
        <h1 className={styles.title}>Atatürk Kronolojisi</h1>
      </Link>

      <Search />
    </header>
  )
}
