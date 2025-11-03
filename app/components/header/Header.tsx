"use client"
import styles from './Header.module.css'
import Image from 'next/image'
import Link from 'next/link'
import HeaderPicture from '@/app/assets/images/header.jpg'
import { useLanguageStore } from '@/app/stores/languageStore';

export default function Header() {
  const { t, currentLanguageCode } = useLanguageStore()
  return (
    <header className={styles.header}>
      <Link
        href={{ pathname: '/', query: { id: 'about', language: currentLanguageCode } }}
        className={styles.link}
      >
        <Image className={styles.logo} src={HeaderPicture} alt='logo' width={200} height={200} />
        <h2 className={styles.title}>{t.Header.title}</h2>
      </Link>
    </header>
  )
}
