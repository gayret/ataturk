import { ItemType } from '@/app/components/content/Content'
import styles from './Select.module.css'

interface SelectProps {
  randomEvents: ItemType[]
  selectedEvents: (number | '')[]
  value: number | ''
  onChange: (value: number) => void
  index: number
  onDrop?: (index: number, id: number) => void
}

export default function CorrectOrderSelect({
  randomEvents,
  selectedEvents,
  value,
  onChange,
  index,
  onDrop,
}: SelectProps) {
  const otherSelected = selectedEvents.filter((_, i) => i !== index).filter((s) => s !== '')
  const availableEvents = randomEvents.filter(
    (event) => !otherSelected.includes(event.id) || event.id === value,
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData('text/plain'))
    onDrop?.(index, id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className={styles.dropzone} onDrop={handleDrop} onDragOver={handleDragOver}>
      {value ? (
        <span>{randomEvents.find((e) => e.id === value)?.title}</span>
      ) : (
        <span>Buraya bırakın veya seçin</span>
      )}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value=''>Seçim yapınız</option>
        {availableEvents.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </select>
    </div>
  )
}
