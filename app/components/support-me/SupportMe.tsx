import styles from './SupportMe.module.css'
import Image from 'next/image'
import Link from 'next/link'
import bookImage from '../../assets/images/kitap.jpeg'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function SupportMe() {
  const { t } = useLanguageStore()
  return (
    <Link
      target='_blank'
      href='https://www.kitapyurdu.com/kitap/erken-bulunmus-bir-intihar-mektubu-/561410.html'
      className={styles.book}
    >
      <span className={styles.description}>{t.SupportMe.description}</span>
      <Image src={bookImage} width={200} alt={t.SupportMe.imageAlt} />
    </Link>
  )
}
