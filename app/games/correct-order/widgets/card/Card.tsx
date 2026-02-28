import styles from './Card.module.css'
import { ItemType } from '@/app/components/content/Content'
import { formatDate } from '@/app/helpers/date'

export default function Card({ event }: { event: ItemType }) {
  return (
    <li key={event.id} className={styles.card}>
      <span>{event.title}</span>
      <span>{event?.description}</span>
      <span>{formatDate(event.date)}</span>
    </li>
  )
}
