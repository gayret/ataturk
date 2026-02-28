import styles from './CorrectOrder.module.css'
import { useEventsData } from '@/app/helpers/data'
import { ItemType } from '@/app/components/content/Content'
import { useEffect, useState } from 'react'
import Select from './widgets/select/Select'
import Card from './widgets/card/Card'

export default function CorrectOrder() {
  const events = useEventsData()
  const [randomEvents, setRandomEvents] = useState<ItemType[]>([])
  const [correctEvents, setCorrectEvents] = useState<number[]>([])

  const fetchRandomEvents = (count: number, excludeLast = 40) => {
    const pool = events.slice(0, -excludeLast) // son 40 olayı çıkar

    const shuffled = [...pool]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setRandomEvents(shuffled.slice(0, count))
  }

  useEffect(() => {
    fetchRandomEvents(3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <main>
        <div className={styles.randomEvents}>
          <ul className={styles.list}>
            {randomEvents.map((event) => (
              <Card event={event} key={event.id} />
            ))}
          </ul>
        </div>

        <div className={styles.randomEvents}>
          <h3 className={styles.subtitle}>Sıralama</h3>
          <ol className={styles.dropzoneList}>
            <li>
              <Select randomEvents={randomEvents} />
            </li>
            <li>
              <Select randomEvents={randomEvents} />
            </li>
            <li>
              <Select randomEvents={randomEvents} />
            </li>
          </ol>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.button}>Onaylıyorum</button>
      </footer>
    </div>
  )
}
