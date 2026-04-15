import Image from 'next/image'
import styles from './QuoteWidget.module.css'
import ataturkSketch from '@/app/assets/images/widget.png'
import { mapToPublicQuote, resolveQuotes, Language } from '@/app/helpers/quotes'
import WidgetFrameSync from './WidgetFrameSync'
import { ataturk } from '@/app/fonts'

type SearchParams = Record<string, string | string[] | undefined>
type PageProps = {
  searchParams: Promise<SearchParams>
}

const UI_COPY: Record<Language, { cta: string; widgetLabel: string; signature: string; empty: string }> = {
  tr: {
    cta: 'Kronolojide oku',
    widgetLabel: 'Atatürk Sözü',
    signature: 'Mustafa Kemal Atatürk',
    empty: 'Gösterilecek söz bulunamadı.',
  },
  en: {
    cta: 'Read in the chronology',
    widgetLabel: 'Quote by Atatürk',
    signature: 'Mustafa Kemal Atatürk',
    empty: 'No quote found to display.',
  },
  de: {
    cta: 'In der Chronologie lesen',
    widgetLabel: 'Atatürk Zitat',
    signature: 'Mustafa Kemal Atatürk',
    empty: 'Kein Zitat zum Anzeigen gefunden.',
  },
  es: {
    cta: 'Leer en la cronología',
    widgetLabel: 'Cita de Atatürk',
    signature: 'Mustafa Kemal Atatürk',
    empty: 'No se encontró ninguna cita para mostrar.',
  },
}

const getSingleParam = (val: string | string[] | undefined): string | undefined => 
  Array.isArray(val) ? val[0] : val;

export default async function QuoteWidgetPage({ searchParams }: PageProps) {
  const params = await searchParams

  const rawLang = getSingleParam(params.language) as Language
  const language = Object.keys(UI_COPY).includes(rawLang) ? rawLang : 'tr'
  const copy = UI_COPY[language]

  const theme = getSingleParam(params.theme) === 'dark' ? 'dark' : 'light'
  const themeClass = theme === 'dark' ? styles.dark : styles.light
  const pageBackground = theme === 'dark' ? '#050608' : '#ffffff'

  const hideImage = getSingleParam(params.hideImage) === 'true'
  const hideSignature = getSingleParam(params.hideSignature) === 'true'
  
  const widgetId = getSingleParam(params.widgetId)
  const quoteId = getSingleParam(params.quoteId)
  
  const eventIdParams = getSingleParam(params.eventId)
  const eventId = eventIdParams ? Number(eventIdParams) : null
  
  const date = getSingleParam(params.date)
  
  // Default to true if not explicitly passed as 'false'
  const random = getSingleParam(params.random) !== 'false'

  const [selectedQuote] = resolveQuotes(language, {
    quoteId,
    eventId: Number.isNaN(eventId) ? null : eventId,
    date,
    random,
    count: 1,
  })
  
  const publicQuote = selectedQuote ? mapToPublicQuote(selectedQuote, language) : null
  const figureImage = selectedQuote?.image ?? null
  const pageStyle = <style>{`html, body { background: ${pageBackground}; }`}</style>

  if (!publicQuote) {
    return (
      <>
        {pageStyle}
        <div className={`${styles.widget} ${themeClass}`}>
          <p className={styles.empty}>{copy.empty}</p>
        </div>
      </>
    )
  }

  const widgetContent = (
    <WidgetFrameSync widgetId={widgetId}>
      <div className={`${styles.widget} ${themeClass}`} data-theme={theme}>
        <div className={styles.header}>
          {!hideImage && (
            <div className={styles.figure}>
              {figureImage ? (
                <Image
                  src={figureImage.url}
                  alt={figureImage.alt}
                  width={120}
                  height={120}
                  sizes='120px'
                  className={styles.figureImage}
                />
              ) : (
                <Image
                  src={ataturkSketch}
                  alt='Mustafa Kemal Atatürk'
                  width={120}
                  height={120}
                  className={styles.figureImage}
                />
              )}
            </div>
          )}
        </div>

        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{publicQuote.text}</p>
        </blockquote>

        <div className={styles.footer}>
          {!hideSignature && (
            <p className={`${styles.signature} ${ataturk.className}`}>{copy.signature}</p>
          )}
        </div>
      </div>
    </WidgetFrameSync>
  )

  if (publicQuote.permalink) {
    return (
      <>
        {pageStyle}
        <a
          href={publicQuote.permalink}
          className={styles.cardLink}
          aria-label={copy.cta}
          target='_blank'
          rel='noopener noreferrer'
        >
          {widgetContent}
        </a>
      </>
    )
  }

  return (
    <>
      {pageStyle}
      {widgetContent}
    </>
  )
}
