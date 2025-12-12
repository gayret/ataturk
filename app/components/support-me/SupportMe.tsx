import styles from './SupportMe.module.css'
import Link from 'next/link'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function SupportMe() {
  const { t } = useLanguageStore()

  return (
    <Link
      target='_blank'
      href='https://buymeacoffee.com/safagayret'
      className={styles.supportButton}
    >
      {t.SupportMe.description} 🤝
    </Link>
  )
}
