'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import styles from './SourceLink.module.css'

type SourceLinkProps = {
  href: string
  label?: string
  className?: string
}

type MetaResult = {
  title?: string
  favicon?: string
}

const normalizeUrl = (rawUrl: string) => {
  if (!rawUrl) return null
  try {
    return new URL(rawUrl)
  } catch {
    try {
      return new URL(`https://${rawUrl}`)
    } catch {
      return null
    }
  }
}

const metaCache = new Map<string, MetaResult>()

export default function SourceLink({ href, label, className }: SourceLinkProps) {
  const [meta, setMeta] = useState<MetaResult | null>(null)

  const normalizedUrl = useMemo(() => normalizeUrl(href), [href])

  useEffect(() => {
    if (!normalizedUrl) return

    const cached = metaCache.get(normalizedUrl.href)
    if (cached) {
      setMeta(cached)
      return
    }

    const controller = new AbortController()

    const fetchMeta = async () => {
      try {
        const res = await fetch(`/api/source-meta?url=${encodeURIComponent(normalizedUrl.href)}`, {
          signal: controller.signal,
          cache: 'force-cache',
        })
        if (!res.ok) return
        const data = (await res.json()) as MetaResult
        metaCache.set(normalizedUrl.href, data)
        setMeta(data)
      } catch {
        // ignore errors, fall back to defaults
      }
    }

    fetchMeta()

    return () => controller.abort()
  }, [normalizedUrl])

  const tooltipText = meta?.title || label || normalizedUrl?.hostname || href

  const faviconUrl = useMemo(() => {
    if (meta?.favicon) return meta.favicon
    if (normalizedUrl?.hostname) {
      return `https://www.google.com/s2/favicons?sz=32&domain=${normalizedUrl.hostname}`
    }
    return ''
  }, [meta?.favicon, normalizedUrl?.hostname])

  if (!href || !normalizedUrl) return null

  return (
    <span className={`${styles.wrapper} ${className || ''}`}>
      <Link
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={tooltipText ? `Kaynak: ${tooltipText}` : 'Kaynak bağlantısı'}
        className={styles.iconLink}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32'
          height='32'
          viewBox='0 0 24 24'
          className={styles.icon}
          aria-hidden='true'
        >
          <path
            fill='currentColor'
            d='M18 20.75H6A2.75 2.75 0 0 1 3.25 18V6A2.75 2.75 0 0 1 6 3.25h6a.75.75 0 0 1 0 1.5H6A1.25 1.25 0 0 0 4.75 6v12A1.25 1.25 0 0 0 6 19.25h12A1.25 1.25 0 0 0 19.25 18v-6a.75.75 0 0 1 1.5 0v6A2.75 2.75 0 0 1 18 20.75m2-12a.76.76 0 0 1-.75-.75V4.75H16a.75.75 0 0 1 0-1.5h4a.76.76 0 0 1 .75.75v4a.76.76 0 0 1-.75.75'
          />
          <path
            fill='currentColor'
            d='M13.5 11.25A.74.74 0 0 1 13 11a.75.75 0 0 1 0-1l6.5-6.5a.75.75 0 1 1 1.06 1.06L14 11a.74.74 0 0 1-.5.25'
          />
        </svg>
      </Link>

      <span className={styles.tooltip} role='tooltip'>
        {faviconUrl && (
          <img
            src={faviconUrl}
            alt=''
            className={styles.favicon}
            loading='lazy'
            width={14}
            height={14}
          />
        )}
        <span className={styles.tooltipText} title={tooltipText}>
          {tooltipText}
        </span>
      </span>
    </span>
  )
}
