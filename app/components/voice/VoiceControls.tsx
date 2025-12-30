"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './VoiceControls.module.css'
import volumeUpIcon from '@/app/assets/icons/volume-up.svg'
import volumeMuteIcon from '@/app/assets/icons/volume-mute.svg'
import { useVoiceStore } from '@/app/stores/voiceStore'

export default function VoiceControls() {
  const { enabled, setEnabled, volume, setVolume, isSupported } = useVoiceStore()
  const [showSlider, setShowSlider] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setShowSlider(false)
    }
  }, [enabled])

  const handleToggle = () => {
    const nextState = !enabled
    setEnabled(nextState)
    if (nextState) {
      setShowSlider(true)
    }
  }

  const buttonLabel = !isSupported
    ? 'Tarayıcınız sesli okuma desteklemiyor'
    : enabled
    ? 'Sesli okuma açık - kapatmak için tıklayın'
    : 'Sesli okuma kapalı - açmak için tıklayın'
  const toggleTitle = enabled ? 'Sesi Kapat' : 'Sesi Aç'

  return (
    <div
      className={styles.voiceControls}
      onMouseEnter={() => enabled && setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
      onFocus={() => enabled && setShowSlider(true)}
      onBlur={() => setShowSlider(false)}
    >
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

      {enabled && showSlider && (
        <div className={styles.sliderPopup}>
          <label htmlFor='voice-volume' className={styles.label}>
            Ses Seviyesi
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
      )}

      {!isSupported && <div className={styles.tooltip}>Tarayıcı bu özellik için destek vermiyor.</div>}
    </div>
  )
}
