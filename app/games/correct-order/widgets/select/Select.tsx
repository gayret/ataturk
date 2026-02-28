import { ItemType } from '@/app/components/content/Content'
import styles from './Select.module.css'

export default function CorrectOrderSelect({ randomEvents }: { randomEvents: ItemType[] }) {
  return (
    <select className={styles.select}>
      <option value=''>Seçim yapınız</option>
      {randomEvents.map((event) => (
        <option key={event.id} value={event.id}>
          {event.title}
        </option>
      ))}
    </select>
  )
}
