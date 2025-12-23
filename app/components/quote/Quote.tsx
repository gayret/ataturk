import { QuoteType } from '../content/Content'
import styles from './Quote.module.css'
import SourceLink from '@/app/components/common/SourceLink'

interface QuoteProps {
  quote: QuoteType
}

export default function Quote({ quote }: QuoteProps) {
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMark} aria-hidden="true">&quot;</div>
        <div className={styles.quoteText}>
          {quote.text}
          {quote.source && (
            <span className={styles.sourceInline}>
              <SourceLink href={quote.source} label='Kaynak' />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
