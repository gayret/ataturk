import { useLanguageStore } from '@/app/stores/languageStore'
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/contributors/Contributors'

export default function About() {
  const { t } = useLanguageStore()
  return (
    <SwipeWrapper onlyNext>
      <div className={styles.content}>
        <div className={styles.description}>
          <h1 className={styles.title}>
            {t.About.title}
          </h1>
          <p>
            {t.About.description}
          </p>

          <p>
            {t.About.description2}
          </p>

          <h2>Kullanımı</h2>
          <p>
            {t.About.usage2}
          </p>

          <Contributors />

          <h2>Projenin hikayesi</h2>
          <iframe
            src='https://www.linkedin.com/embed/feed/update/urn:li:share:7357917656097730560?collapsed=1'
            height='950px'
            width='100%'
            className={styles.borderNone}
            title='Gömülü gönderi'
          ></iframe>
        </div>
      </div>
    </SwipeWrapper>
  )
}
