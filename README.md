<p align="center">
  <img src="branding/dist/symbol/nuvio-symbol-app-icon.svg" width="96" height="96" alt="Nuvio Subs Logo" />
</p>

# Nuvio Subs

Subtitle aggregator and ad-cleaning addon for Stremio and Nuvio, built with TypeScript and Hono on Cloudflare Workers.

It queries subtitle providers in parallel and strips embedded advertisements (gambling promotions, betting links, Telegram invites, and translator watermarks) on the fly before delivering subtitles to the player.

---

## Features

- **Ad and spam removal**: Filters out gambling promotions, Telegram and website URLs, sponsor messages, and watermark cues while preserving original timecodes.
- **Multi-provider search**: Queries SubDL, OpenSubtitles (REST API v3), and Subsource in parallel.
- **Serverless edge deployment**: Runs on Cloudflare Workers with edge caching via the Cache API.
- **Web configuration (`/configure`)**: Web page to manage API credentials, reorder language preferences, and install the addon into Stremio with a single click.
- **Archive decompression**: Extracts `.zip` and `.gz` subtitle archives in memory using `fflate`, dispatched on magic bytes.
- **Charset recovery**: Decodes UTF-8 strictly and falls back to Windows-1252, so legacy ANSI subtitle files keep their accents and smart quotes instead of turning into replacement characters.

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:8787/configure` in your browser to access the configuration page.

---

## Deployment to Cloudflare Workers

1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Deploy the worker:
   ```bash
   npm run deploy
   ```

3. Open the generated worker URL (`https://nuvio-subs.<subdomain>.workers.dev/configure`), enter your provider API keys, and click **Install to Stremio / Nuvio**.

---

## Project Structure

```
├── src/
│   ├── index.ts               # Hono application entrypoint and Stremio protocol routes
│   ├── config.ts              # Configuration parser and validation
│   ├── types.ts               # Stremio manifest and subtitle type definitions
│   ├── cleaner/
│   │   ├── index.ts           # Fetch, ZIP/GZIP decompression, charset decoding, and cleaning pipeline
│   │   ├── srtParser.ts       # SRT/VTT parser and cue re-indexing
│   │   └── patterns.ts        # Ad detection regular expressions
│   ├── providers/
│   │   ├── index.ts           # Multi-provider aggregator and priority sorter
│   │   ├── subdl.ts           # SubDL provider adapter
│   │   ├── opensubtitles.ts   # OpenSubtitles v3 REST API adapter
│   │   └── subsource.ts       # Subsource provider adapter
│   └── views/
│       └── configure.ts       # Web configuration interface
├── branding/                  # Official logo masters and exported assets
└── tests/
    ├── cleaner.test.ts        # Ad cleaner unit tests
    └── decoding.test.ts       # Container detection, charset fallback, and HTML escaping regressions
```

---

## Testing

Run unit tests:
```bash
bun test
```

Run TypeScript type check:
```bash
npm run typecheck
```

---

## License

GNU General Public License v3.0 (GPL-3.0)
