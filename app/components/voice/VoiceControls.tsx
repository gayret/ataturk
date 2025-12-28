"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './VoiceControls.module.css'
import volumeUpIcon from '@/app/assets/icons/volume-up.svg'
import volumeMuteIcon from '@/app/assets/icons/volume-mute.svg'
import settingsIcon from '@/app/assets/icons/settings.svg'
import restartIcon from '@/app/assets/icons/restart.svg'
import { stopSpeakingWithFade } from '@/app/helpers/speech'
import { useVoiceStore } from '@/app/stores/voiceStore'

export default function VoiceControls() {
  const { enabled, setEnabled, volume, setVolume, isSupported, triggerReplay } = useVoiceStore()
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIsPanelOpen(false)
    }
  }, [enabled])

  const handleToggle = () => {
    const nextState = !enabled
    setEnabled(nextState)
    if (nextState) {
      setIsPanelOpen(true)
    }
  }

  const buttonLabel = !isSupported
    ? 'Tarayıcınız sesli okuma desteklemiyor'
    : enabled
    ? 'Sesli okuma açık - kapatmak için tıklayın'
    : 'Sesli okuma kapalı - açmak için tıklayın'
  const toggleTitle = enabled ? 'Sesi Kapat' : 'Sesi Aç'

  const handleReplay = () => {
    stopSpeakingWithFade()
    triggerReplay()
  }

  return (
    <div className={styles.voiceControls}>
      <button
        type='button'
        className={`${styles.toggleButton} ${enabled ? styles.active : ''}`}
        onClick={handleToggle}
        aria-pressed={enabled}
        aria-label={buttonLabel}
        disabled={!isSupported}
        title={toggleTitle}
      >
        <Image
          src={enabled ? volumeUpIcon : volumeMuteIcon}
          alt={enabled ? 'Sesli okuma açık' : 'Sesli okuma kapalı'}
          width={20}
          height={20}
        />
      </button>

      {enabled && (
        <button
          type='button'
          className={`${styles.secondaryButton} ${styles.restartButton}`}
          onClick={handleReplay}
          aria-label='Sesi yeniden oynat'
          title='Tekrar Oynat'
        >
          <Image src={restartIcon} alt='Tekrar oynat' width={20} height={20} />
        </button>
      )}

      {enabled && (
        <button
          type='button'
          className={`${styles.secondaryButton} ${styles.settingsButton}`}
          onClick={() => setIsPanelOpen((prev) => !prev)}
          aria-label={isPanelOpen ? 'Ses ayarını gizle' : 'Ses ayarını aç'}
          title='Ses Seviyesi'
        >
          <Image src={settingsIcon} alt='Ses ayarı' width={20} height={20} />
        </button>
      )}

      {enabled && isPanelOpen && (
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <label htmlFor='voice-volume' className={styles.label}>
              Ses seviyesi
            </label>
            <input
              id='voice-volume'
              type='range'
              min='0'
              max='1'
              step='0.05'
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className={styles.slider}
              title='Ses Seviyesi'
            />
          </div>
        </div>
      )}

      {!isSupported && <div className={styles.tooltip}>Tarayıcı bu özellik için destek vermiyor.</div>}
    </div>
  )
}
