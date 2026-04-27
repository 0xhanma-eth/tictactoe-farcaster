import type { Metadata } from 'next'
import './globals.css'

const appUrl = process.env.NEXT_PUBLIC_URL || 'https://tictactoe-farcaster-brown.vercel.app'

export const metadata: Metadata = {
  title: 'TicTacToe 4x4',
  description: 'Game TicTacToe di papan 4x4 lawan bot. Siapa yang menang?',
  openGraph: {
    title: 'TicTacToe 4x4 - Farcaster Mini App',
    description: 'Tantang bot di game TicTacToe papan 4x4!',
    images: [`${appUrl}/og-image.png`],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: `${appUrl}/icon.png`,
      button: {
        title: 'Main Sekarang!',
        action: {
          type: 'launch_frame',
          name: 'TicTacToe 4x4',
          url: appUrl,
          splashImageUrl: `${appUrl}/icon.png`,
          splashBackgroundColor: '#1a1a2e',
        },
      },
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
