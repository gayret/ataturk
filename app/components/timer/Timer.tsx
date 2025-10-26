'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './Timer.module.css'

interface TimerProps {
  duration: number
  isActive: boolean
  speedMultiplier?: number
  onComplete: () => void
  onReset?: () => void
  onProgress?: (progress: number, remainingSeconds: number) => void
}

export default function Timer({ duration, isActive, speedMultiplier = 1, onComplete, onReset, onProgress }: TimerProps) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const totalElapsedRef = useRef<number>(0)
  const onCompleteRef = useRef(onComplete)
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    onCompleteRef.current = onComplete
    onProgressRef.current = onProgress
  }, [onComplete, onProgress])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isActive) {
      if (startTimeRef.current === null) {
        totalElapsedRef.current = 0
      }
      
      startTimeRef.current = Date.now()
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const sessionElapsed = Date.now() - startTimeRef.current
          
          const speedAdjustedElapsed = sessionElapsed * speedMultiplier
          totalElapsedRef.current += speedAdjustedElapsed
          
          startTimeRef.current = Date.now()
          
          const newProgress = Math.min((totalElapsedRef.current / duration) * 100, 100)
          const remainingMs = Math.max(duration - totalElapsedRef.current, 0)
          const remainingSeconds = Math.ceil(remainingMs / 1000)
          
          setProgress(newProgress)
          
          if (onProgressRef.current) {
            onProgressRef.current(newProgress, remainingSeconds)
          }
          
          if (totalElapsedRef.current >= duration) {
            setProgress(0)
            totalElapsedRef.current = 0
            startTimeRef.current = Date.now()
            onCompleteRef.current()
          }
        }
      }, 16)
    } else {
      setProgress(0)
      totalElapsedRef.current = 0
      startTimeRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, duration, speedMultiplier])

  useEffect(() => {
    if (onReset) {
      setProgress(0)
      totalElapsedRef.current = 0
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