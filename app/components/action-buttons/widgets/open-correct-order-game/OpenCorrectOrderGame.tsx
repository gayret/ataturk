import styles from './OpenCorrectOrderGame.module.css'
import Image from 'next/image'
import gameIcon from '@/app/assets/icons/game.svg'
import { useLanguageStore } from '@/app/stores/languageStore'
import { useState } from 'react'
import Modal from '@/app/components/modal/Modal'
import CorrectOrder from '@/app/games/correct-order/CorrectOrder'

export default function OpenCorrectOrderGame() {
  const { t } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={t.correctOrder?.title || ''}>
        <CorrectOrder />
      </Modal>

      <button onClick={() => setIsOpen(true)} className={styles.button}>
        <Image src={gameIcon} alt={t.ActionButtons.directionIconAlt} width={16} height={16} />
      </button>
    </section>
  )
}
