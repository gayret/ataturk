import styles from './Thanks.module.css'
import Link from 'next/link'

export default function Thanks() {
  return (
    <div>
      <h2 className={styles.title}>Emek verenler</h2>
      <ul className={styles.thanksList}>
        <li className={styles.listItem}>
          <Link
            href='https://www.linkedin.com/in/osman-emre-hac%C4%B1arap-a1182a23b'
            target='_blank'
          >
            Osman Emre Hacıarap <i className={styles.detail}>(Seslendirme Yönetmeni)</i>
          </Link>
        </li>
      </ul>
    </div>
  )
}
