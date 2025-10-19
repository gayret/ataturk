'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './Timer.module.css'

interface TimerProps {
  duration: number // milliseconds
  isActive: boolean
  onComplete: () => void
  onReset?: () => void
  onProgress?: (progress: number, remainingSeconds: number) => void
}

export default function Timer({ duration, isActive, onComplete, onReset, onProgress }: TimerProps) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const onCompleteRef = useRef(onComplete)
  const onProgressRef = useRef(onProgress)

  // Ref'leri güncel tut
  useEffect(() => {
    onCompleteRef.current = onComplete
    onProgressRef.current = onProgress
  }, [onComplete, onProgress])

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now()
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current
          const newProgress = Math.min((elapsed / duration) * 100, 100)
          const remainingMs = Math.max(duration - elapsed, 0)
          const remainingSeconds = Math.ceil(remainingMs / 1000)
          
          setProgress(newProgress)
          
          if (onProgressRef.current) {
            onProgressRef.current(newProgress, remainingSeconds)
          }
          
          if (newProgress >= 100) {
            setProgress(0)
            startTimeRef.current = Date.now() // Yeniden başlat
            onCompleteRef.current()
          }
        }
      }, 16) // ~60fps for smooth animation
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setProgress(0)
      startTimeRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, duration])

  useEffect(() => {
    if (onReset) {
      setProgress(0)
      startTimeRef.current = isActive ? Date.now() : null
    }
  }, [onReset, isActive])

  if (!isActive) {
    return null
  }

  return (
    <div className={styles.timerContainer}>
      <div 
        className={styles.timerBar}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}