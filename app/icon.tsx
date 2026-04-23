import { createPwaIconResponse } from '@/app/lib/pwaIcon'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default async function Icon() {
  return createPwaIconResponse(size.width)
}
