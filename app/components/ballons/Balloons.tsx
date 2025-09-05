'use client'
import { useEffect, useState } from 'react'
import styles from './Balloons.module.css'

export default function Balloons() {
  const [balloons, setBalloons] = useState<number[]>([])

  useEffect(() => {
    setBalloons(Array.from({ length: 10 }, (_, i) => i))
  }, [])

  return (
    <div className={styles.container}>
      {balloons.map((id) => (
        <div
          key={id}
          className={styles.balloon}
          style={{
            left: `${Math.random() * 100}%`,
            backgroundImage: "url('/images/bayrak.png')",
            animationDuration: '5s',
            animationDelay: `${Math.random() * 3}s`,
            scale: `${0.5 + Math.random() * 0.5}`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundPositionX: '27%',
          }}
        />
      ))}
    </div>
  )
}
