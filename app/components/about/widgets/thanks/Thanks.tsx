import styles from './Thanks.module.css'
import Link from 'next/link'

export default function Thanks({ lang }: { lang: string }) {
  return (
    <div>
      <h4 className={styles.title}>
        {
          lang === 'tr' ?
            'Emek verenler'
            :
            'Those who work hard'
        }
      </h4>
      <ul className={styles.thanksList}>
        <li className={styles.listItem}>
          İrem Çiftler Gayret <i className={styles.detail}>({lang === 'tr' ? 'Kullanıcı testleri ve analiz' : 'User testing and analysis'})</i>
        </li>
        <li className={styles.listItem}>
          <Link
            href='https://www.linkedin.com/in/osman-emre-hac%C4%B1arap-a1182a23b'
            target='_blank'
          >
            Osman Emre Hacıarap <i className={styles.detail}>({lang === 'tr' ? 'Seslendirme Yönetmeni' : 'Voice Director'})</i>
          </Link>
        </li>
        <li className={styles.listItem}>
          <Link href='https://marasavucumda.com' target='_blank'>
            Yusuf Köleli <i className={styles.detail}>({lang === 'tr' ? 'Konsept Danışmanı' : 'Concept Consultant'})</i>
          </Link>
        </li>
      </ul>
    </div>
  )
}
