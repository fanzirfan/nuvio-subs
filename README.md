# 🎬 Nuvio Subs (Zero Ads) - Stremio & Nuvio Custom Subtitle Plugin

Plugin subtitle kustom untuk **Stremio & Nuvio** yang berjalan di atas **Cloudflare Workers (Serverless Edge)** menggunakan TypeScript & Hono.

Plugin ini secara otomatis mencari subtitle dari berbagai provider dan membersihkan iklan yang mengganggu (judi/slot gacor, 1xbet, link telegram/web, dan watermark spam) secara *on-the-fly* sebelum disajikan ke video player.

---

## ✨ Fitur Unggulan

- 🚫 **On-the-fly Ad & Spam Cleaner**: Menghapus teks iklan judi, link website/telegram, promo sponsor, dan watermark translator tanpa menggeser sinkronisasi waktu (timecode).
- 📦 **Multi-Provider Parallel Aggregator**:
  - **SubDL API** (Support film & series, IMDB ID, Season/Episode)
  - **OpenSubtitles v3 REST API**
  - **Subsource API**
- ⚡ **Super Cepat & Serverless**: Berjalan di Cloudflare Workers Edge Network (latency sub-millisecond) dengan Cloudflare Cache API gratis.
- ⚙️ **Web Configuration UI (`/configure`)**: Halaman web modern untuk memasukkan API Key, mengatur urutan prioritas bahasa, dan meng-install plugin ke Stremio dengan 1 klik (`stremio://...`).
- 🗜️ **Auto ZIP / GZIP Decompression**: Mengekstrak subtitle yang dikemas dalam file archive `.zip` langsung di memori worker (`fflate`).

---

## 🚀 Cara Menjalankan Secara Lokal (Development)

1. **Install Dependensi:**
   ```bash
   bun install
   # atau
   npm install
   ```

2. **Jalankan Dev Server:**
   ```bash
   bun run dev
   # atau
   npm run dev
   ```

3. Buka browser di `http://localhost:8787/configure` untuk membuka Web Configuration UI.

---

## 🌐 Cara Deploy ke Cloudflare Workers (Gratis)

1. Login ke akun Cloudflare (cukup sekali):
   ```bash
   npx wrangler login
   ```

2. Deploy worker:
   ```bash
   bun run deploy
   # atau
   npm run deploy
   ```

3. Kamu akan mendapatkan URL publik seperti `https://nuvio-subs.<username>.workers.dev`.
4. Buka URL tersebut di browser, masukkan API key subtitle milikmu di halaman `/configure`, lalu klik tombol **"Install ke Stremio / Nuvio"**!

---

## 📁 Struktur Kode

```
├── src/
│   ├── index.ts               # Hono entrypoint & route Stremio protocol
│   ├── config.ts              # Parser parameter konfigurasi
│   ├── types.ts               # Type definition Stremio manifest & subtitle
│   ├── cleaner/
│   │   ├── index.ts           # Pipeline download, unzipper & cleaner
│   │   ├── srtParser.ts       # Parser SRT/VTT & rekalkulasi cue number
│   │   └── patterns.ts        # Kumpulan regex deteksi iklan & spam
│   ├── providers/
│   │   ├── index.ts           # Multi-provider aggregator & sorting
│   │   ├── subdl.ts           # SubDL adapter
│   │   ├── opensubtitles.ts   # OpenSubtitles v3 adapter
│   │   └── subsource.ts       # Subsource adapter
│   └── views/
│       └── configure.ts       # Tampilan antarmuka Web UI /configure
└── tests/
    └── cleaner.test.ts        # Unit test otomatis ad-cleaner
```
