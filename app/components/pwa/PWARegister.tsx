'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    if (!('serviceWorker' in navigator)) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      } catch (error) {
        console.error('Service worker registration failed:', error)
      }
    }

    window.addEventListener('load', registerServiceWorker)

    return () => {
      window.removeEventListener('load', registerServiceWorker)
    }
  }, [])

  return null
}
