'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import styles from './Modal.module.css'
import closeIcon from '../../assets/icons/close.svg'
import Image from 'next/image'

export default function Modal({
  isOpen,
  setIsOpen,
  children,
  title,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
  title?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
            <Image src={closeIcon} alt='close' width={16} height={16} />
          </button>
        </header>

        <main>{children}</main>
      </div>
    </div>,
    document.body,
  )
}
