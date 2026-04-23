import { createPwaIconResponse } from '@/app/lib/pwaIcon'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default async function AppleIcon() {
  return createPwaIconResponse(size.width)
}
