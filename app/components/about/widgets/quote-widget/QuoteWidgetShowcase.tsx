'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLanguageStore } from '@/app/stores/languageStore'
import styles from './QuoteWidgetShowcase.module.css'

const FALLBACK_LANGUAGE = 'tr'
const FALLBACK_THEME = 'light'
const LANGUAGE_OPTIONS = ['tr', 'en', 'de', 'es'] as const
const THEME_OPTIONS = ['light', 'dark'] as const
type ThemeOption = (typeof THEME_OPTIONS)[number]
const THEME_PRESETS = {
  light: {
    backgroundColor: '#FFFFFF',
    textColor: '#2F2F2F',
  },
  dark: {
    backgroundColor: '#050608',
    textColor: '#F7F7F7',
  },
} as const

export default function QuoteWidgetShowcase() {
  const { t, currentLanguageCode } = useLanguageStore()
  const [isEmbedVisible, setIsEmbedVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(FALLBACK_LANGUAGE)
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(FALLBACK_THEME)
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>(
    THEME_PRESETS[FALLBACK_THEME].backgroundColor
  )
  const [selectedTextColor, setSelectedTextColor] = useState<string>(
    THEME_PRESETS[FALLBACK_THEME].textColor
  )

  const language = currentLanguageCode || FALLBACK_LANGUAGE
  const widgetCopy = t.About.Widget

  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const presetColors = THEME_PRESETS[selectedTheme]
  const hasCustomBackgroundColor = selectedBackgroundColor !== presetColors.backgroundColor
  const hasCustomTextColor = selectedTextColor !== presetColors.textColor

  const handleThemeChange = (theme: string) => {
    const nextTheme = theme as ThemeOption
    setSelectedTheme(nextTheme)
    setSelectedBackgroundColor(THEME_PRESETS[nextTheme].backgroundColor)
    setSelectedTextColor(THEME_PRESETS[nextTheme].textColor)
  }

  const widgetSrc = useMemo(() => {
    const params = new URLSearchParams({
      language: selectedLanguage,
      theme: selectedTheme,
      random: 'true',
    })

    if (hasCustomBackgroundColor) {
      params.set('backgroundColor', selectedBackgroundColor)
    }

    if (hasCustomTextColor) {
      params.set('textColor', selectedTextColor)
    }

    return `/widget/quote?${params.toString()}`
  }, [
    hasCustomBackgroundColor,
    hasCustomTextColor,
    selectedBackgroundColor,
    selectedLanguage,
    selectedTextColor,
    selectedTheme,
  ])

  const embedCode = useMemo(
    () => {
      const divAttributes = [
        'data-ataturk-quote-widget',
        `data-language="${selectedLanguage}"`,
        `data-theme="${selectedTheme}"`,
      ]
      const scriptAttributes = [
        'async',
        'src="https://ataturk-kronolojisi.org/widget/quote.js"',
        `data-language="${selectedLanguage}"`,
        `data-theme="${selectedTheme}"`,
      ]

      if (hasCustomBackgroundColor) {
        const attribute = `data-background-color="${selectedBackgroundColor}"`
        divAttributes.push(attribute)
        scriptAttributes.push(attribute)
      }

      if (hasCustomTextColor) {
        const attribute = `data-text-color="${selectedTextColor}"`
        divAttributes.push(attribute)
        scriptAttributes.push(attribute)
      }

      return `<div ${divAttributes.join(' ')}></div>
<script ${scriptAttributes.join(' ')}></script>`
    },
    [
      hasCustomBackgroundColor,
      hasCustomTextColor,
      selectedBackgroundColor,
      selectedLanguage,
      selectedTextColor,
      selectedTheme,
    ]
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
              <div className={styles.controls}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{widgetCopy.languageLabel}</span>
                  <select
                    className={styles.select}
                    value={selectedLanguage}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {widgetCopy.languages[option]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{widgetCopy.themeLabel}</span>
                  <select
                    className={styles.select}
                    value={selectedTheme}
                    onChange={(event) => handleThemeChange(event.target.value)}
                  >
                    {THEME_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {widgetCopy.themes[option]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{widgetCopy.backgroundColorLabel}</span>
                  <span className={styles.colorControl}>
                    <input
                      type='color'
                      className={styles.colorInput}
                      value={selectedBackgroundColor}
                      onChange={(event) => setSelectedBackgroundColor(event.target.value.toUpperCase())}
                    />
                    <span className={styles.colorValue}>{selectedBackgroundColor}</span>
                  </span>
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{widgetCopy.textColorLabel}</span>
                  <span className={styles.colorControl}>
                    <input
                      type='color'
                      className={styles.colorInput}
                      value={selectedTextColor}
                      onChange={(event) => setSelectedTextColor(event.target.value.toUpperCase())}
                    />
                    <span className={styles.colorValue}>{selectedTextColor}</span>
                  </span>
                </label>
              </div>
              <pre className={styles.codeBlock} aria-live='polite'>
                <code>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;div</span>
                    <span className={styles.codeAttr}> data-ataturk-quote-widget</span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-language=
                      <span className={styles.codeValue}>&quot;{selectedLanguage}&quot;</span>
                    </span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-theme=
                      <span className={styles.codeValue}>&quot;{selectedTheme}&quot;</span>
                    </span>
                    {hasCustomBackgroundColor && (
                      <span className={styles.codeAttr}>
                        {' '}
                        data-background-color=
                        <span className={styles.codeValue}>
                          &quot;{selectedBackgroundColor}&quot;
                        </span>
                      </span>
                    )}
                    {hasCustomTextColor && (
                      <span className={styles.codeAttr}>
                        {' '}
                        data-text-color=
                        <span className={styles.codeValue}>&quot;{selectedTextColor}&quot;</span>
                      </span>
                    )}
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
                      <span className={styles.codeValue}>&quot;{selectedLanguage}&quot;</span>
                    </span>
                    <span className={styles.codeAttr}>
                      {' '}
                      data-theme=
                      <span className={styles.codeValue}>&quot;{selectedTheme}&quot;</span>
                    </span>
                    {hasCustomBackgroundColor && (
                      <span className={styles.codeAttr}>
                        {' '}
                        data-background-color=
                        <span className={styles.codeValue}>
                          &quot;{selectedBackgroundColor}&quot;
                        </span>
                      </span>
                    )}
                    {hasCustomTextColor && (
                      <span className={styles.codeAttr}>
                        {' '}
                        data-text-color=
                        <span className={styles.codeValue}>&quot;{selectedTextColor}&quot;</span>
                      </span>
                    )}
                    <span className={styles.codeTag}>&gt;</span>
                  </span>
                  <span className={styles.codeLine}>
                    <span className={styles.codeTag}>&lt;/script&gt;</span>
                  </span>
                </code>
              </pre>
              <div className={styles.previewPanel}>
                <p className={styles.previewTitle}>{widgetCopy.previewFrameTitle}</p>
                <iframe
                  className={styles.modalPreviewFrame}
                  title={widgetCopy.previewFrameTitle}
                  src={widgetSrc}
                  loading='lazy'
                />
              </div>
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
