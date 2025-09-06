'use client'
import { useEffect, useState } from 'react'
import styles from './Clouds.module.css'

type Props = {
  children: React.ReactNode
}

export default function Clouds({ children }: Props) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.overlay} ${!isAnimating ? styles.overlayHidden : ''}`}>
        <img src='/images/clouds/cloud1.png' className={`${styles.cloud} ${styles.cloudTop}`} />
        <img src='/images/clouds/cloud2.png' className={`${styles.cloud} ${styles.cloudBottom}`} />
        <img src='/images/clouds/cloud1.png' className={`${styles.cloud} ${styles.cloudLeft}`} />
        <img src='/images/clouds/cloud2.png' className={`${styles.cloud} ${styles.cloudRight}`} />
      </div>

      <div className={`${styles.content} ${isAnimating ? styles.hidden : styles.visible}`}>
        {children}
      </div>
    </div>
  )
}
