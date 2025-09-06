'use client'
import { useEffect, useState } from 'react'
import styles from './Clouds.module.css'

export default function Clouds() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 2500) // 2.5s animasyon süresi
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${styles.overlay} ${!isAnimating ? styles.overlayHidden : ''}`}>
      <img src='/images/clouds/cloud1.png' className={`${styles.cloud} ${styles.cloudTop}`} />
      <img src='/images/clouds/cloud2.png' className={`${styles.cloud} ${styles.cloudBottom}`} />
      <img src='/images/clouds/cloud1.png' className={`${styles.cloud} ${styles.cloudLeft}`} />
      <img src='/images/clouds/cloud2.png' className={`${styles.cloud} ${styles.cloudRight}`} />
    </div>
  )
}
