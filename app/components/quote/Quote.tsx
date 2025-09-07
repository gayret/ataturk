import { QuoteType } from '../content/Content'
import styles from './Quote.module.css'
import Link from 'next/link'

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
              <Link href={quote.source} target='_blank' rel='noopener noreferrer'>
                *
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
