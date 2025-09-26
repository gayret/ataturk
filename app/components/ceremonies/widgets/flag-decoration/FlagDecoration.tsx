'use client'

import Image from 'next/image'
import styles from './FlagDecoration.module.css'

export default function FlagDecoration() {
  const flags = new Array(5).fill(null) // Görselde 9 bayrak var

  // Her bayrak için rastgele küçük rotation açısı (-5° ile +5° arası)
  const rotations = flags.map(() => Math.floor(Math.random() * 30) - 20)

  return (
    <div className={styles.container}>
      {flags.map((_, i) => (
        <div
          key={i}
          className={styles.flagWrapper}
          style={{ transform: `rotate(${rotations[i]}deg)` }}
        >
          <Image
            src='/images/bayrak.png'
            alt='Turkish Flag'
            width={40}
            height={25}
            className={styles.flag}
          />
        </div>
      ))}
    </div>
  )
}
