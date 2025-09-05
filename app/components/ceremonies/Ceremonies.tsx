import { useSearchParams } from 'next/navigation'
import Balloons from '../ballons/Balloons'

enum CERENOMIES {
  CUMHURIYETIN_ILANI = 195,
}

export default function Ceremonies() {
  const searchParams = useSearchParams()
  const id = Number(searchParams.get('id'))

  return <div>{id === CERENOMIES.CUMHURIYETIN_ILANI && <Balloons />}</div>
}
