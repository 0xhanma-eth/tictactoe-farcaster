# 🎮 TicTacToe 4×4 — Farcaster Mini App

Game TicTacToe di papan 4×4 yang bisa dimainkan di dalam Farcaster. Lawan bot dengan 3 tingkat kesulitan!

## Fitur

- 🎯 Papan 4×4 (menang butuh 4 berturut-turut)
- 🤖 Bot dengan 3 tingkat: Mudah, Sedang, Sulit
- 📊 Papan skor otomatis
- 👤 Nama user diambil dari profil Farcaster
- 📱 Tampilan mobile-friendly
- ⚡ Teknologi: Next.js 15 + `@farcaster/miniapp-sdk`

---

## 🚀 Cara Deploy (Step-by-Step)

### 1. Persiapan

Pastikan kamu punya:
- **Node.js 22.11.0+** → cek dengan `node --version`
- Akun [GitHub](https://github.com)
- Akun [Vercel](https://vercel.com) (gratis)
- Akun [Farcaster / Warpcast](https://farcaster.xyz)

---

### 2. Push ke GitHub

```bash
# Masuk ke folder project
cd tictactoe-farcaster

# Install dependencies
npm install

# Coba jalankan di lokal dulu
npm run dev
# Buka http://localhost:3000

# Inisialisasi git
git init
git add .
git commit -m "feat: TicTacToe 4x4 Farcaster Mini App"

# Buat repo baru di GitHub (bisa lewat website atau CLI)
# Lalu hubungkan:
git remote add origin https://github.com/USERNAME/tictactoe-farcaster.git
git branch -M main
git push -u origin main
```

---

### 3. Deploy ke Vercel

**Cara A — Lewat Website (paling mudah):**

1. Buka [vercel.com/new](https://vercel.com/new)
2. Klik **"Import Git Repository"**
3. Pilih repo `tictactoe-farcaster` yang baru kamu push
4. Klik **Deploy** (Vercel otomatis detect Next.js)
5. Tunggu ~1-2 menit, kamu dapat URL seperti: `https://tictactoe-farcaster-xxx.vercel.app`

**Cara B — Lewat Terminal:**

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

### 4. Atur Environment Variable di Vercel

Setelah deploy:

1. Buka dashboard Vercel → Settings → **Environment Variables**
2. Tambahkan:
   - `NEXT_PUBLIC_URL` = URL Vercel kamu (contoh: `https://tictactoe-farcaster.vercel.app`)
3. Klik **Save** lalu **Redeploy**

---

### 5. Update `farcaster.json`

Edit file `public/.well-known/farcaster.json`, ganti semua `your-app.vercel.app` dengan URL Vercel kamu:

```json
{
  "miniapp": {
    "version": "1",
    "name": "TicTacToe 4x4",
    "iconUrl": "https://tictactoe-farcaster.vercel.app/icon.png",
    "homeUrl": "https://tictactoe-farcaster.vercel.app",
    "splashImageUrl": "https://tictactoe-farcaster.vercel.app/splash.png",
    "splashBackgroundColor": "#1a1a2e",
    "subtitle": "Lawan Bot di papan 4x4",
    "description": "Game TicTacToe seru di papan 4x4. Tantang bot dan buktikan siapa yang lebih jago!",
    "primaryCategory": "games",
    "tags": ["game", "tictactoe", "puzzle", "casual"]
  }
}
```

Commit dan push lagi:

```bash
git add .
git commit -m "fix: update URL ke Vercel"
git push
```

---

### 6. Tambahkan Gambar (Opsional tapi Penting!)

Letakkan gambar di folder `public/`:
- `icon.png` — 1024×1024px, ikon app
- `splash.png` — 200×200px, gambar loading
- `og-image.png` — rasio 3:2, gambar preview di feed

Kamu bisa buat di [Canva](https://canva.com) atau pakai tools desain lain.

---

### 7. Daftarkan sebagai Mini App di Farcaster

1. Aktifkan **Developer Mode**:
   - Buka [farcaster.xyz/~/settings/developer-tools](https://farcaster.xyz/~/settings/developer-tools)
   - Toggle **"Developer Mode"** aktif

2. Buat manifest:
   - Buka [farcaster.xyz/~/developers/mini-apps/manifest](https://farcaster.xyz/~/developers/mini-apps/manifest)
   - Masukkan domain kamu (contoh: `tictactoe-farcaster.vercel.app`)
   - Isi semua info yang diminta
   - Copy `accountAssociation` yang dihasilkan

3. Tambahkan `accountAssociation` ke `farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "miniapp": { ... }
}
```

4. Push lagi dan tunggu Vercel redeploy.

---

### 8. Tes Mini App

1. Buka Warpcast
2. Pergi ke Settings → Developer Tools → **Preview Mini App**
3. Masukkan URL: `https://tictactoe-farcaster.vercel.app`
4. Game harus muncul! 🎉

---

## 📁 Struktur Project

```
tictactoe-farcaster/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout & metadata Farcaster
│   │   ├── page.tsx          # Halaman utama
│   │   └── globals.css       # Style global
│   └── components/
│       └── TicTacToeGame.tsx # Game logic + UI
├── public/
│   └── .well-known/
│       └── farcaster.json    # Manifest Mini App
├── next.config.js
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🛠️ Development Lokal

```bash
npm install
cp .env.example .env.local
# Edit .env.local, isi NEXT_PUBLIC_URL=http://localhost:3000
npm run dev
```

---

## 🤖 Cara Kerja Bot

| Tingkat | Strategi |
|---------|----------|
| Mudah   | Pilih sel secara acak |
| Sedang  | Blokir/menang jika bisa, sisanya semi-acak |
| Sulit   | Minimax dengan alpha-beta pruning |
