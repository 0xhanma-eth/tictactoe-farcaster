'use client'

import dynamic from 'next/dynamic'

// Dynamic import agar SDK hanya jalan di client
const TicTacToeGame = dynamic(() => import('@/components/TicTacToeGame'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a2e',
        color: '#fff',
        fontSize: '18px',
      }}
    >
      Memuat permainan...
    </div>
  ),
})

export default function Home() {
  return <TicTacToeGame />
}
