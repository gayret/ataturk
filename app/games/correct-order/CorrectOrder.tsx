'use client'

import styles from './CorrectOrder.module.css'
import { useEventsData } from '@/app/helpers/data'
import { ItemType } from '@/app/components/content/Content'
import { useEffect, useState } from 'react'
import { useLanguageStore } from '@/app/stores/languageStore'
import Select from './widgets/select/Select'
import Card from './widgets/card/Card'
import Share from './widgets/share/Share'

interface AttemptResult {
  attempt: number
  results: { cardId: number; position: number; isCorrect: boolean }[]
}

export default function CorrectOrder() {
  const events = useEventsData()
  const { t } = useLanguageStore()
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
    // preliminary validation – don't count attempts when input is invalid
    if (selectedEvents.includes('')) {
      setFeedback(t.correctOrder?.pleaseFill || 'Lütfen tüm alanları doldurunuz.')
      return
    }

    // ensure no duplicates are chosen
    if (new Set(selectedEvents).size < selectedEvents.length) {
      setFeedback(t.correctOrder?.duplicateError || 'Aynı etkinlik birden fazla kez seçilemez.')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    const selectedItems = selectedEvents.map((id) => randomEvents.find((e) => e.id === id)!)
    const sortedSelected = [...selectedItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // count occurrences to mark duplicates invalid
    const idCounts: Record<number, number> = {}
    selectedItems.forEach((item) => {
      idCounts[item.id] = (idCounts[item.id] || 0) + 1
    })

    // Her pozisyon için kontrol et
    const results = selectedItems.map((item, index) => ({
      cardId: item.id,
      position: index,
      isCorrect: idCounts[item.id] === 1 && item.id === sortedSelected[index].id,
    }))

    setAttemptHistory([...attemptHistory, { attempt: newAttempts, results }])

    const correctOrder = results.every((r) => r.isCorrect)

    if (correctOrder) {
      setShowDates(true)
      setSuccess(true)
      const newScore = Math.max(100 - newAttempts * 10, 10)
      setScore(newScore)
      setFeedback(
        t.correctOrder?.congratulations.replace('{{score}}', newScore.toString()) ||
          `Tebrikler! Doğru sıraladınız. Skor: ${newScore}`,
      )
      const updatedTotal = parseInt(localStorage.getItem('correctOrderScore') || '0') + newScore
      localStorage.setItem('correctOrderScore', updatedTotal.toString())
      // update state so UI reflects latest total immediately
      setTotalScore(updatedTotal)
    } else {
      // Doğru yapılan pozisyonları kilitle
      const newLocked = new Set(lockedPositions)
      results.forEach((result) => {
        if (result.isCorrect) {
          newLocked.add(result.position)
        }
      })
      setLockedPositions(newLocked)
      setFeedback(
        t.correctOrder?.wrongOrder ||
          'Yanlış sıralama. Doğru yapılan kartlar kilitlendi. Diğerlerini deneyin.',
      )
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
    <>
      <div className={styles.scoreHeader}>
        <span className={styles.attempts}>
          {t.correctOrder?.attemptsLabel?.replace('{{count}}', attempts.toString()) ||
            `${t.correctOrder?.attemptsLabel || 'Attempt'}: ${attempts}`}
        </span>
        <span className={styles.totalScoreLabel}>
          {t.correctOrder?.totalScoreText || 'Total Score'}: {totalScore}
        </span>
      </div>
      <div className={styles.container}>
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
                  <h3 className={styles.subtitle}>
                    {t.correctOrder?.eventsTitle || 'Etkinlikler'}
                  </h3>
                  <ul className={styles.list}>
                    {randomEvents.map((event) => (
                      <Card event={event} key={event.id} showDate={showDates} />
                    ))}
                  </ul>
                </div>

                <div className={styles.randomEvents}>
                  <h3 className={styles.subtitle}>{t.correctOrder?.orderTitle || 'Sıralama'}</h3>
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
                {t.correctOrder?.confirmationTitle || 'Confirm Order'}
              </button>
            </footer>
          </>
        )}
      </div>
    </>
  )
}
