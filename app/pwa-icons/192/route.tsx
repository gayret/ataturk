import { createPwaIconResponse } from '@/app/lib/pwaIcon'

export const runtime = 'nodejs'

export async function GET() {
  return createPwaIconResponse(192)
}
