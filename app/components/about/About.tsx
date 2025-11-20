import { useLanguageStore } from '@/app/stores/languageStore'
import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/contributors/Contributors'
import ActionButtons from '../action-buttons/ActionButtons'
import Translators from './widgets/translators/Translators'
import QuoteWidgetShowcase from './widgets/quote-widget/QuoteWidgetShowcase'

export default function About() {
  const { t } = useLanguageStore()
  return (
    <SwipeWrapper onlyNext>
      <div className={styles.content}>
        <div className={styles.description}>
          <h1 className={styles.title}>{t.About.title}</h1>
          <p>{t.About.description}</p>

          <p>{t.About.mission}</p>

          <h2>{t.About.usageTitle}</h2>
          <p>{t.About.usageDescription}</p>

          <Contributors />

          <Translators />

          <QuoteWidgetShowcase />

          <h2>{t.About.Story.title}</h2>
          <iframe
            src='https://www.linkedin.com/embed/feed/update/urn:li:share:7357917656097730560?collapsed=1'
            height='950px'
            width='100%'
            className={styles.borderNone}
            title={t.About.Story.iframeTitle}
          ></iframe>

        </div>
      </div>
      <ActionButtons showOnlyLanguageSelector={true} />
    </SwipeWrapper>
  )
}
