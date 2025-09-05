'use client'
import { useEffect, useState } from 'react'
import styles from './Balloons.module.css'

export default function Balloons() {
  const [balloons, setBalloons] = useState<number[]>([])

  useEffect(() => {
    setBalloons(Array.from({ length: 10 }, (_, i) => i))
  }, [])

  // rastgele renkler için palet
  const colors = ['skyblue', '#FFD93D', '#6BCB77', '#4D96FF', '#9D4EDD', '#FF924C']

  return (
    <div className={styles.container}>
      {balloons.map((id) => {
        const isFlagBalloon = Math.random() > 0.5 // %50 ihtimal bayraklı
        const randomColor = colors[Math.floor(Math.random() * colors.length)]

        return (
          <div
            key={id}
            className={styles.balloon}
            style={{
              left: `${Math.random() * 100}%`,
              background: isFlagBalloon
                ? "url('/images/bayrak.png') center/cover no-repeat"
                : randomColor,
              animationDuration: '5s',
              animationDelay: `${Math.random() * 3}s`,
              scale: `${0.5 + Math.random() * 0.5}`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundPositionX: '27%',
            }}
          />
        )
      })}
    </div>
  )
}
