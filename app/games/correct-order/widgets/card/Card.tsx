import styles from './Card.module.css'
import { ItemType } from '@/app/components/content/Content'
import { formatDate } from '@/app/helpers/date'

export default function Card({
  event,
  showDate = true,
  onDragStart,
}: {
  event: ItemType
  showDate?: boolean
  onDragStart?: (id: number) => void
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', event.id.toString())
    onDragStart?.(event.id)
  }

  return (
    <li key={event.id} className={styles.card} draggable onDragStart={handleDragStart}>
      <span>{event.title}</span>
      <span>{event?.description}</span>
      {showDate && <span>{formatDate(event.date)}</span>}
    </li>
  )
}
