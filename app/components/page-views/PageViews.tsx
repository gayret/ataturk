'use client'
import styles from './PageViews.module.css'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PageViews() {
  const searchParams = useSearchParams()
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    async function fetchViews() {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pageId: searchParams.get('id') || 'about' }),
        })
        const data = await res.json()
        setViews(data.count)
      } catch (err) {
        console.error('Ziyaretçi sayısı alınamadı:', err)
      }
    }

    fetchViews()
  }, [searchParams])

  return (
    <div className={styles.count}>{views === null ? 'Yükleniyor...' : `Görüntüleme: ${views}`}</div>
  )
}
