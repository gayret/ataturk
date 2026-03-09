'use client'

import styles from './CorrectOrder.module.css'
import { useEventsData } from '@/app/helpers/data'
import { ItemType } from '@/app/components/content/Content'
import { useEffect, useState } from 'react'
import Select from './widgets/select/Select'
import Card from './widgets/card/Card'
import Share from './widgets/share/Share'

interface AttemptResult {
  attempt: number
  results: { cardId: number; position: number; isCorrect: boolean }[]
}

export default function CorrectOrder() {
  const events = useEventsData()
  const [randomEvents, setRandomEvents] = useState<ItemType[]>([])
  const [selectedEvents, setSelectedEvents] = useState<(number | '')[]>(['', '', ''])
  const [feedback, setFeedback] = useState<string>('')
  const [showDates, setShowDates] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [attempts, setAttempts] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [lockedPositions, setLockedPositions] = useState<Set<number>>(new Set())
  const [attemptHistory, setAttemptHistory] = useState<AttemptResult[]>([])
  const [totalScore, setTotalScore] = useState<number>(0)

  const fetchRandomEvents = (count: number, excludeLast = 40) => {
    const pool = events.slice(0, -excludeLast)

    const shuffled = [...pool]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setRandomEvents(shuffled.slice(0, count))
    setSelectedEvents(['', '', ''])
    setFeedback('')
    setShowDates(false)
    setSuccess(false)
    setAttempts(0)
    setLockedPositions(new Set())
    setAttemptHistory([])
  }

  const handleSelectChange = (index: number, value: number) => {
    const newSelected = [...selectedEvents]
    newSelected[index] = value
    setSelectedEvents(newSelected)
  }

  const handleDrop = (index: number, id: number) => {
    const newSelected = [...selectedEvents]
    newSelected[index] = id
    setSelectedEvents(newSelected)
  }

  const checkOrder = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (selectedEvents.includes('')) {
      setFeedback('Lütfen tüm alanları doldurunuz.')
      return
    }

    const selectedItems = selectedEvents.map((id) => randomEvents.find((e) => e.id === id)!)
    const sortedSelected = [...selectedItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Her pozisyon için kontrol et
    const results = selectedItems.map((item, index) => ({
      cardId: item.id,
      position: index,
      isCorrect: item.id === sortedSelected[index].id,
    }))

    setAttemptHistory([...attemptHistory, { attempt: newAttempts, results }])

    const correctOrder = results.every((r) => r.isCorrect)

    if (correctOrder) {
      setShowDates(true)
      setSuccess(true)
      const newScore = Math.max(100 - newAttempts * 10, 10)
      setScore(newScore)
      setFeedback(`Tebrikler! Doğru sıraladınız. Skor: ${newScore}`)
      const totalScore = parseInt(localStorage.getItem('correctOrderScore') || '0') + newScore
      localStorage.setItem('correctOrderScore', totalScore.toString())
    } else {
      // Doğru yapılan pozisyonları kilitle
      const newLocked = new Set(lockedPositions)
      results.forEach((result) => {
        if (result.isCorrect) {
          newLocked.add(result.position)
        }
      })
      setLockedPositions(newLocked)
      setFeedback('Yanlış sıralama. Doğru yapılan kartlar kilitlendi. Diğerlerini deneyin.')
      // Seçimleri yanlış olanlar için sıfırla
      const newSelected = [...selectedEvents]
      results.forEach((result) => {
        if (!result.isCorrect) {
          newSelected[result.position] = ''
        }
      })
      setSelectedEvents(newSelected)
    }
  }

  useEffect(() => {
    fetchRandomEvents(3)
    setTotalScore(parseInt(localStorage.getItem('correctOrderScore') || '0'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.totalScoreCard}>
        <span className={styles.totalScoreLabel}>Toplam Skor</span>
        <span className={styles.totalScoreValue}>{totalScore}</span>
      </div>
      {success ? (
        <Share
          attempts={attempts}
          score={score}
          onNewGame={() => fetchRandomEvents(3)}
          attemptHistory={attemptHistory}
          randomEvents={randomEvents}
          totalScore={totalScore}
        />
      ) : (
        <>
          <main className={styles.main}>
            <div className={styles.eventsContainer}>
              <div className={styles.randomEvents}>
                <h3 className={styles.subtitle}>Etkinlikler</h3>
                <ul className={styles.list}>
                  {randomEvents.map((event) => (
                    <Card event={event} key={event.id} showDate={showDates} />
                  ))}
                </ul>
              </div>

              <div className={styles.randomEvents}>
                <h3 className={styles.subtitle}>Sıralama</h3>
                <p className={styles.attempts}>Deneme: {attempts}</p>
                <ol className={styles.dropzoneList}>
                  {selectedEvents.map((selected, index) => {
                    const isLocked = lockedPositions.has(index)
                    return (
                      <li key={index} className={isLocked ? styles.lockedItem : ''}>
                        {!isLocked && (
                          <Select
                            randomEvents={randomEvents}
                            selectedEvents={selectedEvents}
                            value={selected}
                            onChange={(value) => handleSelectChange(index, value)}
                            index={index}
                            onDrop={handleDrop}
                          />
                        )}
                        {isLocked && selected && (
                          <div className={styles.lockedCard}>
                            <span className={styles.checkIcon}>✓</span>
                            <span className={styles.lockedTitle}>
                              {randomEvents.find((e) => e.id === selected)?.title}
                            </span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
                {feedback && <p className={styles.feedback}>{feedback}</p>}
              </div>
            </div>
          </main>

          <footer className={styles.footer}>
            <button className={styles.button} onClick={checkOrder}>
              Onaylıyorum
            </button>
          </footer>
        </>
      )}
    </div>
  )
}
