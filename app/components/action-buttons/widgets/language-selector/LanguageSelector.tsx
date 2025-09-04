'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import styles from './LanguageSelector.module.css'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import languageIcon from '@/app/assets/icons/language.svg'
import { useLanguageStore } from '@/app/stores/languageStore'
import { availableLanguages } from '@/app/stores/languageStore'

export default function LanguageSelector() {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { setLanguage } = useLanguageStore()

    const handleSelect = (langCode: string) => {
        setLanguage(langCode)
        const params = new URLSearchParams(searchParams.toString())
        params.set("language", langCode)
        router.replace(`${pathname}?${params.toString()}`)
        setOpen(false)
    }

    const [open, setOpen] = useState(false)

    // Eğer kullanıcı sayfanın dışına tıklarsa open'ı false yap
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const languageElement = document.querySelector(`.${styles.language}`)
            if (languageElement && !languageElement.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className={styles.language}>
            <button onClick={() => setOpen(!open)} title='Dil seç'>
                <Image src={languageIcon} alt='Dil ikonu' width={16} height={16} />
            </button>

            {open && (
                <div className={styles.opened}>
                    {
                        availableLanguages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleSelect(language.code)}
                                title={language.name}
                                aria-label={language.name}
                            >
                                {language.code.toUpperCase()}
                            </button>
                        ))
                    }
                </div>
            )}
        </div>
    )
}