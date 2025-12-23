import { QuoteType } from "../content/Content";
import styles from "./Quote.module.css";
import SourceLink from "@/app/components/source-link/SourceLink";
import { useLanguageStore } from "@/app/stores/languageStore";

interface QuoteProps {
  quote: QuoteType;
}

export default function Quote({ quote }: QuoteProps) {
  const { t } = useLanguageStore();
  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteContent}>
        <div className={styles.quoteMark} aria-hidden="true">
          &quot;
        </div>
        <div className={styles.quoteText}>
          {quote.text}
          {quote.source && (
            <span className={styles.sourceInline}>
              <SourceLink href={quote.source} label={t.InformationSource} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
