'use client'

import { useMemo, useState } from 'react'
import { useLanguageStore } from '@/app/stores/languageStore'
import styles from './QuoteWidgetShowcase.module.css'

const FALLBACK_LANGUAGE = 'tr'

export default function QuoteWidgetShowcase() {
  const { t, currentLanguageCode } = useLanguageStore()
  const [isEmbedVisible, setIsEmbedVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const language = currentLanguageCode || FALLBACK_LANGUAGE
  const widgetCopy = t.About.Widget

  const widgetSrc = useMemo(() => {
    const params = new URLSearchParams({
      language,
      theme: 'light',
      random: 'true',
    })
    return `/widget/quote?${params.toString()}`
  }, [language])

  const embedCode = useMemo(
    () =>
      `<div data-ataturk-quote-widget data-language="${language}" data-theme="light"></div>
<script async src="https://ataturk-kronolojisi.org/widget/quote.js" data-language="${language}" data-theme="light"></script>`,
    [language]
  )

  const toggleEmbed = () => {
    setIsEmbedVisible((prev) => !prev)
    setCopied(false)
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(embedCode)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = embedCode
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Unable to copy widget embed code', error)
    }
  }

  return (
    <section className={styles.section} aria-label={widgetCopy.sectionLabel}>
      <h2 className={styles.title}>{widgetCopy.title}</h2>
      <p className={styles.description}>{widgetCopy.description}</p>
      <button
        type='button'
        onClick={toggleEmbed}
        className={styles.embedTrigger}
        aria-expanded={isEmbedVisible}
      >
        {widgetCopy.cta}
      </button>
      <iframe
        className={styles.previewFrame}
        title={widgetCopy.previewFrameTitle}
        src={widgetSrc}
        loading='lazy'
      />

      {isEmbedVisible && (
        <div className={styles.overlay} role='presentation' onClick={toggleEmbed}>
          <div
            className={styles.modal}
            role='dialog'
            aria-modal='true'
            aria-label={widgetCopy.embedTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              className={styles.closeButton}
              onClick={toggleEmbed}
              aria-label={widgetCopy.closeCta}
            >
              &times;
            </button>
            <div className={styles.modalContent}>
              <p className={styles.embedTitle}>{widgetCopy.embedTitle}</p>
              <p className={styles.embedDescription}>{widgetCopy.embedDescription}</p>
              <pre className={styles.codeBlock} aria-live='polite'>
                <code>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;div</span>
                    <span className={styles.codeAttr}> data-ataturk-quote-widget</span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-language=
                      <span className={styles.codeValue}>&quot;{language}&quot;</span>
                    </span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-theme=<span className={styles.codeValue}>&quot;light&quot;</span>
                    </span>
                    <span className={styles.codeTag}>&gt;</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;/div&gt;</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;script</span>
                    <span className={styles.codeAttr}> async</span>
                    <span className={styles.codeAttr}>
                      {' '}
                      src=
                      <span className={styles.codeValue}>
                        &quot;https://ataturk-kronolojisi.org/widget/quote.js&quot;
                      </span>
                    </span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-language=
                      <span className={styles.codeValue}>&quot;{language}&quot;</span>
                    </span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-theme=<span className={styles.codeValue}>&quot;light&quot;</span>
                    </span>
                    <span className={styles.codeTag}>&gt;</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;/script&gt;</span>
                  </span>
                </code>
              </pre>
            </div>
            <div className={styles.modalActions}>
              <button type='button' onClick={handleCopy} className={styles.copyButton}>
                {copied ? widgetCopy.copied : widgetCopy.copy}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
