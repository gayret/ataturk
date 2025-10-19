'use client'


import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import autoSwitchIcon from '@/app/assets/icons/auto-switch.svg'

interface AutoSwitchProps {
    onToggle: (isActive: boolean) => void
    isActive: boolean
    remainingSeconds?: number
    duration?: number
    onDurationChange?: (duration: number) => void
}

export default function AutoSwitch({ onToggle, isActive, remainingSeconds, duration = 10, onDurationChange }: AutoSwitchProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [inputValue, setInputValue] = useState(duration.toString())
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        onToggle(!isActive)
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!isActive) {
            setInputValue(duration.toString())
            setShowMenu(true)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // Sadece sayı girişine izin ver
        if (/^\d*$/.test(value)) {
            setInputValue(value)
        }
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit(false)
        } else if (e.key === ' ') {
            e.preventDefault()
            handleSubmit(true) // Space ile kaydedince timer'ı da başlat
        }
    }

    const handleSubmit = (startTimer = false) => {
        const newDuration = parseInt(inputValue)
        if (newDuration >= 5 && newDuration <= 20 && onDurationChange) {
            onDurationChange(newDuration)
        } else {
            // Invalid input, reset to current duration
            setInputValue(duration.toString())
        }
        setShowMenu(false)

        // Space ile kaydedildiyse timer'ı başlat
        if (startTimer && !isActive) {
            onToggle(true)
        }
    }

    // Focus input when menu opens
    useEffect(() => {
        if (showMenu && inputRef.current) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus()
                    inputRef.current.select()
                }
            }, 50)
        }
    }, [showMenu])

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1rem',
            zIndex: 1000
        }}>
            <button
                onClick={handleClick}
                onContextMenu={handleContextMenu}
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
                title={isActive ? 'Otomatik geçişi durdur (Space)' : `Otomatik geçiş (${duration}s) - Sağ tık: Süre ayarla`}
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

            {showMenu && (
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onBlur={() => handleSubmit(false)}
                    placeholder={duration.toString()}
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        right: '0',
                        marginBottom: '8px',
                        width: '40px',
                        padding: '4px 6px',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textAlign: 'center',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    maxLength={2}
                />
            )}
        </div>
    )
}
