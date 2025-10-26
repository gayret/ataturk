import styles from './Thanks.module.css'
import Link from 'next/link'
import { useLanguageStore } from '@/app/stores/languageStore';

export default function Thanks() {

  const { t } = useLanguageStore()

  return (
    <div>
<<<<<<< HEAD
      <h4 className={styles.title}>
        {t.Thanks.title}
      </h4>
      <ul className={styles.thanksList}>
        <li className={styles.listItem}>
          {t.Thanks.description} <i className={styles.detail}>({t.Thanks.description2})</i>
        </li>
        <li className={styles.listItem}>
=======
      <h2 className={styles.title}>Emek verenler</h2>
      <ul className={styles.thanksList}>
        <li className={styles.listItem}>
>>>>>>> main
          <Link
            href='https://www.linkedin.com/in/osman-emre-hac%C4%B1arap-a1182a23b'
            target='_blank'
          >
            {t.Thanks.description3} <i className={styles.detail}>({t.Thanks.description4})</i>
          </Link>
        </li>
<<<<<<< HEAD
        <li className={styles.listItem}>
          <Link href='https://marasavucumda.com' target='_blank'>
            {t.Thanks.description5} <i className={styles.detail}>({t.Thanks.description6})</i>
          </Link>
        </li>
=======
>>>>>>> main
      </ul>
    </div>
  )
}
