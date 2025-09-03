'use client'

import About from '@/app/components/about/About'
import Header from '@/app/components/header/Header'
import Timeline from '@/app/components/timeline/Timeline'
import { useEventsData } from '@/app/helpers/data'
import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import Content from '@/app/components/content/Content'
import ActionButtons from '@/app/components/action-buttons/ActionButtons'
import LanguageSelector from '@/app/components/language-selector/LanguageSelector'

export default function Home() {
    const { lang } = useParams<{ lang: string }>()
    const events = useEventsData()
    const searchParams = useSearchParams()
    const MapWithNoSSR = useMemo(
        () =>
            dynamic(() => import('@/app/components/map/Map'), {
                ssr: false,
            }),
        []
    )

    // Eğer id yoksa, searchParams'a id=1 ekle
    if (typeof window !== 'undefined' && searchParams.get('id') === null) {
        const params = new URLSearchParams(window.location.search)
        params.set('id', '1')
        window.location.search = params.toString()
        return null
    }

    // Eğer searchParams 'about' ise
    if (searchParams.get('id') === 'about') {
        return (
            <>
                <LanguageSelector />
                <Header lang={lang} />
                <Timeline />
                <About lang={lang} />
            </>
        )
    }

    // Eğer searchParams 'about' değilse ve null değilse, normal render et
    if (searchParams.get('id') !== 'about' && searchParams.get('id') !== null) {
        return (
            <>
                <MapWithNoSSR
                    location={
                        events.find((item) => item.id === Number(searchParams.get('id')))?.location || {
                            lat: 0,
                            lon: 0,
                        }
                    }
                />
                <Header lang={lang} />
                <Content lang={lang} />
                <ActionButtons />
                <LanguageSelector />
                <Timeline />
            </>
        )
    }
}
