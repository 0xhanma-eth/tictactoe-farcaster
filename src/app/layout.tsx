import type { Metadata } from 'next'
import './globals.css'

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://your-app.vercel.app'

export const metadata: Metadata = {
  title: 'TicTacToe 4x4',
  description: 'Game TicTacToe di papan 4x4 lawan bot. Siapa yang menang?',
  openGraph: {
    title: 'TicTacToe 4x4 - Farcaster Mini App',
    description: 'Tantang bot di game TicTacToe papan 4x4!',
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    // Farcaster Mini App embed metadata
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: `${appUrl}/og-image.png`,
      button: {
        title: '🎮 Main Sekarang!',
        action: {
          type: 'launch_frame',
          name: 'TicTacToe 4x4',
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: '#1a1a2e',
        },
      },
    }),
    // Backward compat
    'fc:frame': 'vNext',
    'fc:frame:image': `${appUrl}/og-image.png`,
    'fc:frame:button:1': '🎮 Main Sekarang!',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': JSON.stringify({
      type: 'launch_frame',
      name: 'TicTacToe 4x4',
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#1a1a2e',
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
