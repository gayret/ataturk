import Link from 'next/link'
import styles from './DonateButton.module.css'

export default function DonateButton() {
  return (
    <Link
      className={styles.button}
      href='https://buymeacoffee.com/safagayret'
      target='_blank'
      rel='noopener'
    >
      <span className={styles.icon} aria-hidden='true'>
        🤝🏻
      </span>
      <span className={styles.text}>Projeye destek ol</span>
    </Link>
  )
}
