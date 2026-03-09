'use client'

import styles from './Share.module.css'
import { ItemType } from '@/app/components/content/Content'

interface AttemptResult {
  attempt: number
  results: { cardId: number; position: number; isCorrect: boolean }[]
}

interface ShareProps {
  attempts: number
  score: number
  onNewGame: () => void
  attemptHistory: AttemptResult[]
  randomEvents: ItemType[]
  totalScore: number
}

export default function Share({
  attempts,
  score,
  onNewGame,
  attemptHistory,
  randomEvents,
  totalScore,
}: ShareProps) {
  const shareText = `Atatürk Olay Sıralama Oyunu: ${attempts}. denemede doğru sıraladım! Skor: ${score} puan. #AtaturkGame`

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTextEncoded = encodeURIComponent(shareText)

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareUrl}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareTextEncoded}`

  const getCardTitle = (cardId: number) => {
    return randomEvents.find((e) => e.id === cardId)?.title || 'Bilinmeyen'
  }

  return (
    <div className={styles.shareContainer}>
      <div className={styles.content}>
        <h2 className={styles.title}>🎉 Tebrikler!</h2>
        <p className={styles.resultText}>{attempts}. denemede başarıyla tamamladınız.</p>
        <p className={styles.scoreText}>
          Skor: <span className={styles.score}>{score}</span>
        </p>
        <p className={styles.totalScoreText}>
          Toplam Skor: <span className={styles.totalScore}>{totalScore}</span>
        </p>

        <div className={styles.historySection}>
          <h3 className={styles.historyTitle}>Sıralama Geçmişi</h3>
          <div className={styles.attemptsList}>
            {attemptHistory.map((attempt) => (
              <div key={attempt.attempt} className={styles.attemptItem}>
                <span className={styles.attemptLabel}>Deneme {attempt.attempt}:</span>
                <div className={styles.resultIcons}>
                  {attempt.results.map((result, idx) => (
                    <div key={idx} className={styles.resultIcon}>
                      <span className={result.isCorrect ? styles.correct : styles.incorrect}>
                        {result.isCorrect ? '✓' : '✗'}
                      </span>
                      <span className={styles.iconTooltip}>{getCardTitle(result.cardId)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.shareButtons}>
          <a
            href={twitterUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.shareButton}
          >
            𝕏 Twitter&apos;da Paylaş
          </a>
          <a
            href={facebookUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.shareButton}
          >
            f Facebook&apos;ta Paylaş
          </a>
          <a
            href={linkedinUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.shareButton}
          >
            in LinkedIn&apos;de Paylaş
          </a>
        </div>

        <button className={styles.newGameButton} onClick={onNewGame}>
          Yeni Oyun Başla
        </button>
      </div>
    </div>
  )
}
