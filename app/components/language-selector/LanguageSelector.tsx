'use client'

import styles from './LanguageSelector.module.css'

export default function LanguageSelector() {
    const handleSelect = (targetLang: 'tr' | 'en') => {
        if (typeof window === 'undefined') return
        const search = window.location.search || ''
        window.location.href = `/${targetLang}${search}`
    }

    return (
        <div className={styles.container} role='navigation' aria-label='Dil seçici'>
            <button
                className={styles.button}
                onClick={() => handleSelect('tr')}
                title='Türkçe'
                aria-label='Türkçe'
            >
                TR
            </button>
            <button
                className={styles.button}
                onClick={() => handleSelect('en')}
                title='English'
                aria-label='English'
            >
                EN
            </button>
        </div>
    )
}