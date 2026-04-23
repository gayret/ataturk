import { readFile } from 'fs/promises'
import path from 'path'
import { ImageResponse } from 'next/og'

const iconSourcePath = path.join(process.cwd(), 'app', 'assets', 'images', 'logo4-aralik-1921.jpeg')

async function getIconSource() {
  const iconBuffer = await readFile(iconSourcePath)

  return `data:image/jpeg;base64,${iconBuffer.toString('base64')}`
}

export async function createPwaIconResponse(size: number) {
  const iconSource = await getIconSource()

  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#f0f0f0',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <img
        src={iconSource}
        alt='Atatürk Kronolojisi'
        width={size}
        height={size}
        style={{
          borderRadius: Math.round(size * 0.16),
          height: '100%',
          objectFit: 'cover',
          width: '100%',
        }}
      />
    </div>,
    {
      width: size,
      height: size,
    },
  )
}
