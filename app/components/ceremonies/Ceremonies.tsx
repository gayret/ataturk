import { useSearchParams } from 'next/navigation'
import Balloons from './widgets/ballons/Balloons'

enum CERENOMIES {
  TBMM_ACILISI = 141,
  CUMHURIYETIN_ILANI = 195,
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
