'use client'

import { useEffect, useState, useCallback } from 'react'

// ─── Tipe Data ────────────────────────────────────────────────────────────────
type Sel = 'X' | 'O' | null
type Board = Sel[]
type Difficulty = 'mudah' | 'sedang' | 'sulit'

// ─── Konstanta ────────────────────────────────────────────────────────────────
const SIZE = 4
const TOTAL = SIZE * SIZE

// Semua kombinasi menang (baris, kolom, diagonal) untuk papan 4x4
function buatKombinasi(): number[][] {
  const hasil: number[][] = []
  // Baris
  for (let r = 0; r < SIZE; r++) {
    hasil.push([r * SIZE, r * SIZE + 1, r * SIZE + 2, r * SIZE + 3])
  }
  // Kolom
  for (let c = 0; c < SIZE; c++) {
    hasil.push([c, c + SIZE, c + SIZE * 2, c + SIZE * 3])
  }
  // Diagonal kiri-atas ke kanan-bawah
  hasil.push([0, 5, 10, 15])
  // Diagonal kanan-atas ke kiri-bawah
  hasil.push([3, 6, 9, 12])
  return hasil
}

const KOMBINASI_MENANG = buatKombinasi()

// ─── Fungsi Logika Game ───────────────────────────────────────────────────────
function cekPemenang(papan: Board): { pemenang: Sel; garis: number[] | null } {
  for (const garis of KOMBINASI_MENANG) {
    const [a, b, c, d] = garis
    if (papan[a] && papan[a] === papan[b] && papan[a] === papan[c] && papan[a] === papan[d]) {
      return { pemenang: papan[a], garis }
    }
  }
  return { pemenang: null, garis: null }
}

function cekSeri(papan: Board): boolean {
  return papan.every((sel) => sel !== null)
}

// ─── Logika Bot ───────────────────────────────────────────────────────────────

// Hitung skor posisi - tengah > tepi > pojok
function skorPosisi(idx: number): number {
  const r = Math.floor(idx / SIZE)
  const c = idx % SIZE
  const tengah = Math.abs(r - 1.5) + Math.abs(c - 1.5)
  return -tengah // semakin dekat tengah, skor lebih tinggi
}

// Cek apakah bot bisa menang / blokir pemain dalam satu langkah
function cariLangkahKritis(papan: Board, simbol: Sel): number | null {
  for (const garis of KOMBINASI_MENANG) {
    const selGaris = garis.map((i) => papan[i])
    const milikKita = selGaris.filter((s) => s === simbol).length
    const kosong = selGaris.filter((s) => s === null).length
    if (milikKita === 3 && kosong === 1) {
      return garis[selGaris.indexOf(null)]
    }
  }
  return null
}

// Hitung nilai papan untuk minimax
function evaluasiPapan(papan: Board): number {
  const { pemenang } = cekPemenang(papan)
  if (pemenang === 'O') return 100
  if (pemenang === 'X') return -100
  return 0
}

// Minimax dengan alpha-beta pruning (kedalaman terbatas)
function minimax(
  papan: Board,
  kedalaman: number,
  maks: boolean,
  alpha: number,
  beta: number,
  batasDalam: number
): number {
  const skor = evaluasiPapan(papan)
  if (skor !== 0) return skor - kedalaman * (skor > 0 ? 1 : -1)
  if (cekSeri(papan) || kedalaman >= batasDalam) return 0

  const kosong = papan.map((s, i) => (s === null ? i : -1)).filter((i) => i >= 0)

  if (maks) {
    let terbaik = -Infinity
    for (const idx of kosong) {
      papan[idx] = 'O'
      terbaik = Math.max(terbaik, minimax(papan, kedalaman + 1, false, alpha, beta, batasDalam))
      papan[idx] = null
      alpha = Math.max(alpha, terbaik)
      if (beta <= alpha) break
    }
    return terbaik
  } else {
    let terbaik = Infinity
    for (const idx of kosong) {
      papan[idx] = 'X'
      terbaik = Math.min(terbaik, minimax(papan, kedalaman + 1, true, alpha, beta, batasDalam))
      papan[idx] = null
      beta = Math.min(beta, terbaik)
      if (beta <= alpha) break
    }
    return terbaik
  }
}

function gerakanBot(papan: Board, tingkat: Difficulty): number {
  const kosong = papan.map((s, i) => (s === null ? i : -1)).filter((i) => i >= 0)
  if (kosong.length === 0) return -1

  // ── MUDAH: Acak saja ──
  if (tingkat === 'mudah') {
    return kosong[Math.floor(Math.random() * kosong.length)]
  }

  // ── SEDANG & SULIT: Cek langkah kritis dulu ──
  const menang = cariLangkahKritis(papan, 'O')
  if (menang !== null) return menang

  const blokir = cariLangkahKritis(papan, 'X')
  if (blokir !== null) return blokir

  if (tingkat === 'sedang') {
    // 50% acak, 50% pilih posisi terbaik tanpa minimax dalam
    if (Math.random() < 0.5) {
      return kosong[Math.floor(Math.random() * kosong.length)]
    }
    // Pilih posisi dengan skor posisi terbaik
    return kosong.reduce((terbaik, idx) =>
      skorPosisi(idx) > skorPosisi(terbaik) ? idx : terbaik
    )
  }

  // ── SULIT: Minimax ──
  const batasDalam = papan.filter((s) => s === null).length <= 8 ? 5 : 3
  let nilaiTerbaik = -Infinity
  let langkahTerbaik = kosong[0]

  for (const idx of kosong) {
    papan[idx] = 'O'
    const nilai = minimax(papan, 0, false, -Infinity, Infinity, batasDalam)
    papan[idx] = null
    if (nilai > nilaiTerbaik || (nilai === nilaiTerbaik && skorPosisi(idx) > skorPosisi(langkahTerbaik))) {
      nilaiTerbaik = nilai
      langkahTerbaik = idx
    }
  }
  return langkahTerbaik
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────
export default function TicTacToeGame() {
  const [papan, setPapan] = useState<Board>(Array(TOTAL).fill(null))
  const [giliranPemain, setGiliranPemain] = useState(true) // true = giliran X (pemain)
  const [statusGame, setStatusGame] = useState<'bermain' | 'menang' | 'kalah' | 'seri'>('bermain')
  const [garisMenuang, setGarisMenuang] = useState<number[] | null>(null)
  const [tingkat, setTingkat] = useState<Difficulty>('sedang')
  const [skorX, setSkorX] = useState(0)
  const [skorO, setSkorO] = useState(0)
  const [skorSeri, setSkorSeri] = useState(0)
  const [namaUser, setNamaUser] = useState('Kamu')
  const [sedangBerpikir, setSedangBerpikir] = useState(false)

  // Inisialisasi SDK Farcaster
  useEffect(() => {
    async function initSDK() {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk')
        await sdk.actions.ready()
        // Coba ambil nama user dari context
        try {
          const ctx = await sdk.context
          if (ctx?.user?.displayName) {
            setNamaUser(ctx.user.displayName)
          } else if (ctx?.user?.username) {
            setNamaUser(ctx.user.username)
          }
        } catch {
          // Tidak di dalam Farcaster, pakai nama default
        }
      } catch {
        // SDK tidak tersedia (misalnya di browser biasa)
        console.log('Berjalan di luar Farcaster')
      }
    }
    initSDK()
  }, [])

  // Gerakan bot setelah pemain
  const gerakBot = useCallback(
    (papanSekarang: Board) => {
      setSedangBerpikir(true)
      setTimeout(() => {
        const salinan = [...papanSekarang]
        const idx = gerakanBot(salinan, tingkat)
        if (idx === -1) {
          setSedangBerpikir(false)
          return
        }
        salinan[idx] = 'O'
        setPapan(salinan)

        const { pemenang, garis } = cekPemenang(salinan)
        if (pemenang === 'O') {
          setStatusGame('kalah')
          setGarisMenuang(garis)
          setSkorO((s) => s + 1)
        } else if (cekSeri(salinan)) {
          setStatusGame('seri')
          setSkorSeri((s) => s + 1)
        } else {
          setGiliranPemain(true)
        }
        setSedangBerpikir(false)
      }, 400) // Delay supaya terasa natural
    },
    [tingkat]
  )

  // Handler klik sel
  function klikSel(idx: number) {
    if (!giliranPemain || papan[idx] || statusGame !== 'bermain' || sedangBerpikir) return

    const salinan = [...papan]
    salinan[idx] = 'X'
    setPapan(salinan)

    const { pemenang, garis } = cekPemenang(salinan)
    if (pemenang === 'X') {
      setStatusGame('menang')
      setGarisMenuang(garis)
      setSkorX((s) => s + 1)
      return
    }
    if (cekSeri(salinan)) {
      setStatusGame('seri')
      setSkorSeri((s) => s + 1)
      return
    }

    setGiliranPemain(false)
    gerakBot(salinan)
  }

  // Reset game (skor tetap)
  function resetGame() {
    setPapan(Array(TOTAL).fill(null))
    setGiliranPemain(true)
    setStatusGame('bermain')
    setGarisMenuang(null)
    setSedangBerpikir(false)
  }

  // Reset semua termasuk skor
  function resetSemua() {
    resetGame()
    setSkorX(0)
    setSkorO(0)
    setSkorSeri(0)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  const pesanStatus = () => {
    if (statusGame === 'menang') return `🎉 ${namaUser} Menang!`
    if (statusGame === 'kalah') return '🤖 Bot Menang!'
    if (statusGame === 'seri') return '🤝 Seri!'
    if (sedangBerpikir) return '🤔 Bot sedang berpikir...'
    if (giliranPemain) return `⚔️ Giliran ${namaUser} (X)`
    return '⏳ Giliran Bot (O)'
  }

  const warnaStatus = () => {
    if (statusGame === 'menang') return '#4ecdc4'
    if (statusGame === 'kalah') return '#ff6b6b'
    if (statusGame === 'seri') return '#ffd93d'
    return '#a8b2d8'
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.judul}>🎮 TicTacToe 4×4</h1>

        {/* Pilih Tingkat */}
        <div style={styles.tingkatContainer}>
          {(['mudah', 'sedang', 'sulit'] as Difficulty[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTingkat(t); resetGame() }}
              style={{
                ...styles.tombolTingkat,
                ...(tingkat === t ? styles.tombolTingkatAktif : {}),
              }}
            >
              {t === 'mudah' ? '😊 Mudah' : t === 'sedang' ? '😤 Sedang' : '😈 Sulit'}
            </button>
          ))}
        </div>
      </div>

      {/* Skor */}
      <div style={styles.skorContainer}>
        <div style={{ ...styles.skorKotak, borderColor: '#ff6b6b' }}>
          <div style={{ ...styles.skorLabel, color: '#ff6b6b' }}>
            {namaUser} (X)
          </div>
          <div style={styles.skorAngka}>{skorX}</div>
        </div>
        <div style={{ ...styles.skorKotak, borderColor: '#ffd93d' }}>
          <div style={{ ...styles.skorLabel, color: '#ffd93d' }}>Seri</div>
          <div style={styles.skorAngka}>{skorSeri}</div>
        </div>
        <div style={{ ...styles.skorKotak, borderColor: '#4ecdc4' }}>
          <div style={{ ...styles.skorLabel, color: '#4ecdc4' }}>Bot (O)</div>
          <div style={styles.skorAngka}>{skorO}</div>
        </div>
      </div>

      {/* Status */}
      <div style={{ ...styles.status, color: warnaStatus() }}>{pesanStatus()}</div>

      {/* Papan 4x4 */}
      <div style={styles.papan}>
        {papan.map((sel, idx) => {
          const menang = garisMenuang?.includes(idx)
          return (
            <button
              key={idx}
              onClick={() => klikSel(idx)}
              disabled={!!sel || statusGame !== 'bermain' || sedangBerpikir || !giliranPemain}
              style={{
                ...styles.sel,
                ...(menang ? styles.selMenuang : {}),
                ...(sel === 'X' ? styles.selX : {}),
                ...(sel === 'O' ? styles.selO : {}),
                cursor: !sel && statusGame === 'bermain' && giliranPemain && !sedangBerpikir
                  ? 'pointer'
                  : 'default',
              }}
            >
              {sel && (
                <span style={{ fontSize: 32, fontWeight: 'bold', lineHeight: 1 }}>
                  {sel}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tombol Aksi */}
      <div style={styles.tombolContainer}>
        <button onClick={resetGame} style={styles.tombolMain}>
          🔄 Main Lagi
        </button>
        <button onClick={resetSemua} style={styles.tombolReset}>
          🗑️ Reset Skor
        </button>
      </div>

      {/* Petunjuk */}
      <div style={styles.petunjuk}>
        Kamu = X &nbsp;|&nbsp; Bot = O &nbsp;|&nbsp; Menang dengan 4 berturut-turut!
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    gap: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    maxWidth: '360px',
  },
  judul: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    textShadow: '0 0 20px rgba(233, 69, 96, 0.5)',
    letterSpacing: '1px',
  },
  tingkatContainer: {
    display: 'flex',
    gap: '6px',
  },
  tombolTingkat: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '2px solid #2a2a5e',
    background: 'transparent',
    color: '#a8b2d8',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  tombolTingkatAktif: {
    border: '2px solid #e94560',
    background: 'rgba(233, 69, 96, 0.2)',
    color: '#ffffff',
  },
  skorContainer: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '360px',
    justifyContent: 'center',
  },
  skorKotak: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    border: '2px solid',
    padding: '10px 6px',
    textAlign: 'center',
  },
  skorLabel: {
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '4px',
    opacity: 0.9,
  },
  skorAngka: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 1,
  },
  status: {
    fontSize: '16px',
    fontWeight: '700',
    textAlign: 'center',
    minHeight: '24px',
    letterSpacing: '0.5px',
  },
  papan: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
    maxWidth: '360px',
  },
  sel: {
    aspectRatio: '1',
    background: 'rgba(15, 52, 96, 0.8)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    color: '#ffffff',
    outline: 'none',
  },
  selX: {
    color: '#ff6b6b',
    background: 'rgba(255, 107, 107, 0.1)',
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  selO: {
    color: '#4ecdc4',
    background: 'rgba(78, 205, 196, 0.1)',
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  selMenuang: {
    background: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#ffd700',
    boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
  },
  tombolContainer: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '360px',
  },
  tombolMain: {
    flex: 2,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #e94560, #533483)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(233, 69, 96, 0.3)',
  },
  tombolReset: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#a8b2d8',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  petunjuk: {
    fontSize: '11px',
    color: '#4a5568',
    textAlign: 'center',
  },
}
