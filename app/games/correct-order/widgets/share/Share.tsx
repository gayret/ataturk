'use client'

import styles from './Share.module.css'
import { ItemType } from '@/app/components/content/Content'
import { useLanguageStore } from '@/app/stores/languageStore'

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
  const { t } = useLanguageStore()

  const shareText = t.correctOrder?.shareText
    ? t.correctOrder.shareText
        .replace('{{attempts}}', attempts.toString())
        .replace('{{score}}', score.toString())
    : `Atatürk Olay Sıralama Oyunu: ${attempts}. denemede doğru sıraladım! Skor: ${score} puan. #AtaturkGame`

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
        <h2 className={styles.title}>{t.correctOrder?.winTitle || '🎉 Tebrikler!'}</h2>
        <p className={styles.resultText}>
          {t.correctOrder?.attemptsText?.replace('{{count}}', attempts.toString()) ||
            `${attempts}. denemede başarıyla tamamladınız.`}
        </p>
        <p className={styles.scoreText}>
          {t.correctOrder?.scoreText || 'Skor:'} <span className={styles.score}>{score}</span>
        </p>
        <p className={styles.totalScoreText}>
          {t.correctOrder?.totalScoreText || 'Toplam Skor:'}{' '}
          <span className={styles.totalScore}>{totalScore}</span>
        </p>

        <div className={styles.historySection}>
          <h3 className={styles.historyTitle}>
            {t.correctOrder?.historyTitle || 'Sıralama Geçmişi'}
          </h3>
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
            {t.correctOrder?.shareTwitter || "𝕏 Twitter'da Paylaş"}
          </a>
          <a
            href={facebookUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.shareButton}
          >
            {t.correctOrder?.shareFacebook || "f Facebook'ta Paylaş"}
          </a>
          <a
            href={linkedinUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.shareButton}
          >
            {t.correctOrder?.shareLinkedin || "in LinkedIn'de Paylaş"}
          </a>
        </div>

        <button className={styles.newGameButton} onClick={onNewGame}>
          {t.correctOrder?.newGame || 'Yeni Oyun Başla'}
        </button>
      </div>
    </div>
  )
}
