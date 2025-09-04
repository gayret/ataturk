import { useSearchParams } from 'next/navigation';
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/contributors/Contributors'
import Thanks from './widgets/thanks/Thanks'
import { useLanguageStore } from '@/app/stores/languageStore'

export default function About() {

  const searchParams = useSearchParams();
  const language = searchParams.get("language");
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

          <h4>
            {t.About.usage}
          </h4>
          <p>
            {t.About.usage2}
          </p>

          <Contributors />

          <Thanks />
        </div>
      </div>
    </SwipeWrapper>
  )
}
