import { ItemType } from '@/app/components/content/Content'
import styles from './Select.module.css'
import { useLanguageStore } from '@/app/stores/languageStore'

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
  const { t } = useLanguageStore()

  const otherSelected = selectedEvents.filter((_, i) => i !== index).filter((s) => s !== '')

  // prepare list of options, disabling items that are already chosen elsewhere
  const availableEvents = randomEvents.map((event) => ({
    ...event,
    disabled: otherSelected.includes(event.id) && event.id !== value,
  }))

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const id = parseInt(e.dataTransfer.getData('text/plain'))
    // if this event is already selected in another slot, ignore
    if (otherSelected.includes(id)) return
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
        <span>{t.correctOrder?.dropHere || 'Buraya bırakın veya seçin'}</span>
      )}
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value=''>{t.correctOrder?.selectPlaceholder || 'Seçim yapınız'}</option>
        {availableEvents.map((event) => (
          <option key={event.id} value={event.id} disabled={event.disabled}>
            {event.title}
          </option>
        ))}
      </select>
    </div>
  )
}
