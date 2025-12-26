import { QuoteType } from '../content/Content'
import styles from './Quote.module.css'
import SourceLink from '@/app/components/source-link/SourceLink'
import { useLanguageStore } from '@/app/stores/languageStore'
import { ataturk } from '../../fonts'

interface QuoteProps {
  quote: QuoteType
}

export default function Quote({ quote }: QuoteProps) {
  const { t } = useLanguageStore()
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMark} aria-hidden='true'>
          &quot;
        </div>
        <div className={styles.quoteText}>
          <blockquote className={ataturk.variable}>{quote.text}</blockquote>
          {quote.source && <SourceLink href={quote.source} label={t.InformationSource} />}
        </div>
      </div>
    </div>
  )
}
