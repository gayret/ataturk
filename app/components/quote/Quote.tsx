import { QuoteType } from '../content/Content'
import styles from './Quote.module.css'

interface QuoteProps {
  quote: QuoteType
}

export default function Quote({ quote }: QuoteProps) {
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMark}>"</div>
        <div className={styles.quoteText}>
          {quote.text}
          {quote.source && (
            <span className={styles.sourceInline}>
              <a href={quote.source} target="_blank" rel="noopener noreferrer">
                *
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}