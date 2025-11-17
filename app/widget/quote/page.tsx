import Image from "next/image";
import styles from "./QuoteWidget.module.css";
import ataturkSketch from "@/app/assets/images/404-ataturk.png";
import { mapToPublicQuote, resolveQuotes } from "@/app/helpers/quotes";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

type Language = "tr" | "en";

const UI_COPY: Record<
  Language,
  { cta: string; widgetLabel: string; signature: string }
> = {
  tr: {
    cta: "Kronolojide oku",
    widgetLabel: "Atatürk Sözü",
    signature: "Mustafa Kemal Atatürk",
  },
  en: {
    cta: "Read in the chronology",
    widgetLabel: "Quote by Atatürk",
    signature: "Mustafa Kemal Atatürk",
  },
};

const getSingleValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value ?? undefined;
};

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value === "true";
};

const parseNumber = (value: string | undefined) => {
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const selectLanguage = (raw: string | undefined): Language => {
  if (raw === "en") return "en";
  return "tr";
};

const THEME_CLASSNAMES = {
  light: styles.light,
  dark: styles.dark,
};

const resolveTheme = (value: string | undefined) => {
  if (value === "dark") return "dark";
  return "light";
};

export default function QuoteWidgetPage({ searchParams }: PageProps) {
  const language = selectLanguage(getSingleValue(searchParams.language));
  const theme = resolveTheme(getSingleValue(searchParams.theme));
  const hideImage = parseBoolean(getSingleValue(searchParams.hideImage), false);
  const hideSignature = parseBoolean(
    getSingleValue(searchParams.hideSignature),
    false
  );

  const quoteId = getSingleValue(searchParams.quoteId);
  const eventId = parseNumber(getSingleValue(searchParams.eventId));
  const date = getSingleValue(searchParams.date);
  const random = parseBoolean(getSingleValue(searchParams.random), true);

  const quoteRecords = resolveQuotes(language, {
    quoteId,
    eventId,
    date,
    random,
    count: 1,
  });
  const selectedQuote = quoteRecords[0];
  const publicQuote = selectedQuote
    ? mapToPublicQuote(selectedQuote, language)
    : null;
  const figureImage = selectedQuote?.image ?? null;
  const copy = UI_COPY[language];

  if (!publicQuote) {
    return (
      <div className={`${styles.widget} ${THEME_CLASSNAMES[theme]}`}>
        <p className={styles.empty}>Gösterilecek söz bulunamadı.</p>
      </div>
    );
  }

  const widgetContent = (
    <div
      className={`${styles.widget} ${THEME_CLASSNAMES[theme]}`}
      data-theme={theme}
    >
      <div className={styles.header}>
        {!hideImage && (
          <div className={styles.figure}>
            {figureImage ? (
              <Image
                src={figureImage.url}
                alt={figureImage.alt}
                width={120}
                height={120}
                sizes="120px"
                className={styles.figureImage}
              />
            ) : (
              <Image
                src={ataturkSketch}
                alt="Mustafa Kemal Atatürk"
                width={120}
                height={120}
                className={styles.figureImage}
              />
            )}
          </div>
        )}
      </div>

      <blockquote className={styles.quote}>
        <span aria-hidden="true" className={styles.quoteMark}>
          &ldquo;
        </span>
        <p className={styles.quoteText}>{publicQuote.text}</p>
      </blockquote>

      <div className={styles.footer}>
        {!hideSignature && <p className={styles.signature}>{copy.signature}</p>}
      </div>
    </div>
  );

  if (publicQuote.permalink) {
    return (
      <a
        href={publicQuote.permalink}
        className={styles.cardLink}
        aria-label="Alıntıya git"
      >
        {widgetContent}
      </a>
    );
  }

  return widgetContent;
}
