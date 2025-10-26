'use client'

import Image from 'next/image'
import autoSwitchIcon from '@/app/assets/icons/auto-switch.svg'

interface AutoSwitchProps {
    onToggle: (isActive: boolean) => void
    isActive: boolean
    remainingSeconds?: number
    duration?: number
    speedMultiplier?: number
    onSpeedChange?: (speed: number) => void
}

export default function AutoSwitch({ onToggle, isActive, remainingSeconds, duration = 10, speedMultiplier = 1, onSpeedChange }: AutoSwitchProps) {
    const speedOptions = [0.5, 1, 1.5, 2]

    const handleTimerClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        onToggle(!isActive)
    }

    const handleSpeedClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (onSpeedChange) {
            const currentIndex = speedOptions.indexOf(speedMultiplier)
            const nextIndex = (currentIndex + 1) % speedOptions.length
            const nextSpeed = speedOptions[nextIndex]
            onSpeedChange(nextSpeed)
        }
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1rem',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
        }}>
            {/* Main Timer Button */}
            <button
                onClick={handleTimerClick}
                data-auto-switch-button="true"
                style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    padding: '0.5rem',
                    transition: 'all 0.2s ease-in-out',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    boxShadow: isActive ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)'
                        e.currentTarget.style.transform = 'scale(1.1)'
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'scale(1)'
                    }
                }}
                title={isActive ? 'Otomatik geçişi durdur (Space)' : `Otomatik geçiş (${duration}s)`}
            >
                {isActive && remainingSeconds !== undefined ? (
                    <span style={{
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        minWidth: '16px',
                        textAlign: 'center',
                        display: 'inline-block',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                    }}>
                        {remainingSeconds}
                    </span>
                ) : (
                    <Image src={autoSwitchIcon} alt='Otomatik Geçiş Iconu' width={16} height={16} />
                )}
            </button>

            {/* Speed Button */}
            <button
                onClick={handleSpeedClick}
                data-auto-switch-button="true"
                style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    padding: '2px 6px',
                    minWidth: '24px',
                    height: '16px',
                    transition: 'all 0.2s ease-in-out',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    opacity: 1
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.transform = 'scale(1)'
                }}
                title={`Hız: ${speedMultiplier}x - Tıkla değiştir`}
            >
                <span style={{
                    color: 'black',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                }}>
                    {speedMultiplier}x
                </span>
            </button>
        </div>
    )
}
