import { useSearchParams, useRouter } from 'next/navigation'
import iconShowAllLocations from '../../../../assets/icons/show-all-locations.svg'
import Image from 'next/image'

export default function ShowAllLocations() {
  const searchParams = useSearchParams()
  const showAllLocations = searchParams.get('show-all-locations') === 'true'
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          if (showAllLocations) {
            params.delete('show-all-locations')
          } else {
            params.set('show-all-locations', 'true')
          }
            router.replace(`?${params.toString()}`, { scroll: false })
        }}
        title={showAllLocations ? 'Tüm konumları gizle' : 'Tüm konumları göster'}
        aria-pressed={showAllLocations}
      >
        <Image src={iconShowAllLocations} alt='' width={16} height={16} />
      </button>
    </>
  )
}
