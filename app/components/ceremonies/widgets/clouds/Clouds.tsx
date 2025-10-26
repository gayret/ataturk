'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Clouds.module.css'

export default function Clouds() {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 2500) // 2.5s animasyon süresi
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`${styles.overlay} ${!isAnimating ? styles.overlayHidden : ''}`} aria-hidden="true">
      <Image
        alt="Sakin bir gökyüzünde ekranın üst kısmında süzülen beyaz, kabarık bulut"
        src="/images/clouds/cloud1.png"
        className={`${styles.cloud} ${styles.cloudTop}`}
        width={300}
        height={120}
        priority
      />
      <Image
        alt="Huzurlu bir arka planda ekranın altına yakın yumuşak bir bulut süzülüyor"
        src="/images/clouds/cloud2.png"
        className={`${styles.cloud} ${styles.cloudBottom}`}
        width={300}
        height={120}
        priority
      />
      <Image
        alt="Sol tarafta konumlanmış, sakin bir gökyüzünde nazikçe hareket eden bulut"
        src="/images/clouds/cloud1.png"
        className={`${styles.cloud} ${styles.cloudLeft}`}
        width={300}
        height={120}
        priority
      />
      <Image
        alt="Sağ tarafta huzurlu bir atmosferde süzülen bulut"
        src="/images/clouds/cloud2.png"
        className={`${styles.cloud} ${styles.cloudRight}`}
        width={300}
        height={120}
        priority
      />
    </div>
  )
}
