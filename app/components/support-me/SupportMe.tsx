import styles from './SupportMe.module.css'
import Image from 'next/image'
import Link from 'next/link'
import bookImage from '../../assets/images/kitap.jpeg'

export default function SupportMe() {
  return (
    <Link
      target='_blank'
      href='https://www.kitapyurdu.com/kitap/erken-bulunmus-bir-intihar-mektubu-/561410.html'
      className={styles.book}
    >
      <span className={styles.description}>Kitap satın alarak destek ol</span>
      <Image src={bookImage} width={200} alt='Kitap kapağı' />
    </Link>
  )
}
