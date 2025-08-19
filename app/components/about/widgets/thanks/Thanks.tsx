import styles from './Thanks.module.css'

export default function Thanks() {
  return (
    <div>
      <h4 className={styles.title}>Emek verenler</h4>
      <ul className={styles.thanksList}>
        <li className={styles.listItem}>
          İrem Çiftler Gayret <i className={styles.detail}>(Kullanıcı testleri ve analiz)</i>
        </li>
      </ul>
    </div>
  )
}
