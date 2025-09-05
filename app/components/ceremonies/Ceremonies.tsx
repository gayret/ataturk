import { useSearchParams } from 'next/navigation'
import Balloons from '../ballons/Balloons'

enum CERENOMIES {
  CUMHURIYETIN_ILANI = 195,
  TBMM_ACILISI = 141,
}

export default function Ceremonies() {
  const searchParams = useSearchParams()
  const id = Number(searchParams.get('id'))

  return (
    <section>
      {(id === CERENOMIES.TBMM_ACILISI || id === CERENOMIES.CUMHURIYETIN_ILANI) && <Balloons />}
    </section>
  )
}
