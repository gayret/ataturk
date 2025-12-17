'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import styles from './Timer.module.css'

interface TimerProps {
  duration: number
  isActive: boolean
  speedMultiplier?: number
  onComplete: () => void
  onProgress?: (progress: number, remainingMs: number) => void
  resetKey?: string | number
}

export default function Timer({
  duration,
  isActive,
  speedMultiplier = 1,
  onComplete,
  onProgress,
  resetKey,
}: TimerProps) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const totalElapsedRef = useRef<number>(0)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setProgress(0)
    startTimeRef.current = null
    totalElapsedRef.current = 0
  }, [cleanup])

  useEffect(() => {
    if (!isActive) {
      reset()
      return
    }

    startTimeRef.current = Date.now()
    setProgress(0)

    if (onProgress) {
      const remainingMs = Math.max(duration - totalElapsedRef.current, 0)
      onProgress(0, remainingMs)
    }

    return cleanup
  }, [isActive, cleanup, reset, onProgress, duration])

  useEffect(() => {
    if (isActive) {
      totalElapsedRef.current = 0
      setProgress(0)

      if (onProgress) {
        onProgress(0, duration)
      }
    }
  }, [resetKey, isActive, duration, onProgress])

  useEffect(() => {
    if (!isActive || !startTimeRef.current) return

    const intervalStartTime = Date.now()
    const elapsedAtIntervalStart = totalElapsedRef.current

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return

      const realTimeElapsed = Date.now() - intervalStartTime

      const speedAdjustedElapsed = realTimeElapsed * speedMultiplier

      const newTotalElapsed = elapsedAtIntervalStart + speedAdjustedElapsed
      totalElapsedRef.current = newTotalElapsed

      const newProgress = Math.min((newTotalElapsed / duration) * 100, 100)
      const remainingMs = Math.max(duration - newTotalElapsed, 0)

      setProgress(newProgress)

      if (onProgress) {
        onProgress(newProgress, remainingMs)
      }

      if (newTotalElapsed >= duration) {
        cleanup()
        setProgress(100)
        onComplete()
      }
    }, 16)

    return cleanup
  }, [isActive, speedMultiplier, duration, onComplete, onProgress, cleanup])

  if (!isActive) {
    return null
  }

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerBar} style={{ width: `${progress}%` }} />
    </div>
  )
}
