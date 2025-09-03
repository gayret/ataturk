'use client'

export default function Home() {
  // Tarayıcı diline göre yönlendirme yap
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname
    if (currentPath === '/' || currentPath === '') {
      const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase()
      const targetLang = browserLang.startsWith('tr') ? 'tr' : browserLang.startsWith('en') ? 'en' : 'tr'
      const search = window.location.search || ''
      window.location.replace(`/${targetLang}${search}`)
      return null
    }
  }

}
