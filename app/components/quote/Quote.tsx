import { QuoteType } from '../content/Content'
import styles from './Quote.module.css'

interface QuoteProps {
  quote: QuoteType
}

export default function Quote({ quote }: QuoteProps) {
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMark}>&quot;</div>
        <blockquote className={styles.quoteText}>
          {quote.text}
        </blockquote>
        <div className={styles.author}>
          — Mustafa Kemal Atatürk
          {quote.source && (
            <span className={styles.source} title={`Bilgi kaynağı: ${quote.source}`}>
              <a href={quote.source} target='_blank' >
                *
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}