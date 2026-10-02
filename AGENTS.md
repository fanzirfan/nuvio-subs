# Repository Guidelines

Practical reference and engineering guidelines for AI coding assistants working in the `nuvio-subs` codebase.

---

## Project Overview

`nuvio-subs` is a high-performance, ad-free subtitle aggregator addon for **Stremio** and **Nuvio** media centers, architected to run serverless on the **Cloudflare Workers** edge runtime.

Public subtitle repositories (SubDL, OpenSubtitles, Subsource) frequently bundle promotional spam into subtitle files, such as online gambling / slot machine advertisements, sports betting links (1XBET), Telegram channels, and encoder/translator watermarks. `nuvio-subs` solves this by:
1. Querying multiple upstream subtitle providers concurrently.
2. Ranking and sorting results according to user-configured language priorities.
3. Proxying and sanitizing subtitle streams on the fly to strip all promotional cues while preserving dialogue timecodes, cue numbering, and text formatting.

---

## Architecture & Data Flow

```
[ Stremio / Nuvio Client ]
       │
       ├─► GET /manifest.json (or /:config/manifest.json)
       │     └─ Returns addon capabilities ("resources": ["subtitles"], "types": ["movie", "series"])
       │
       ├─► GET /configure (or /:config/configure)
       │     └─ Serves interactive Dark Neubrutalist HTML dashboard to generate Base64 config
       │
       ├─► GET /subtitles/:type/:id.json (or /:config/subtitles/:type/:id.json)
       │     │
       │     ▼
       │   [ Hono App / Router: src/index.ts ]
       │     │
       │     ├─► parseConfig() (src/config.ts)
       │     │     └─ Decodes Base64/URL config and merges with Worker env bindings (c.env)
       │     │
       │     ├─► aggregateSubtitles() (src/providers/index.ts)
       │     │     │
       │     │     ├─► Promise.allSettled([
       │     │     │     fetchSubDLSubtitles()       (src/providers/subdl.ts)
       │     │     │     fetchOpenSubtitles()        (src/providers/opensubtitles.ts)
       │     │     │     fetchSubsourceSubtitles()   (src/providers/subsource.ts)
       │     │     │   ])
       │     │     │
       │     │     ├─► Language scoring & sorting by config.languages (default: ["id", "en"])
       │     │     └─► Rewrites subtitle URLs to origin + /clean-sub?url=...
       │     │
       │     └─► Returns JSON { subtitles: [...] } (Cached 1h: max-age=3600)
       │
       └─► GET /clean-sub?url=<encoded_url>
             │
             ▼
           [ Cleaner Engine: src/cleaner/index.ts ]
             │
             ├─► Check Cloudflare Cache API (caches.default, TTL 24h) -> return if hit
             ├─► Fetch upstream file (HTTP GET)
             ├─► Detect container by magic bytes
             │     ├─ ZIP  (0x50, 0x4B, 0x03, 0x04) -> fflate.unzipSync() -> extract .srt / .vtt
             │     └─ GZIP (0x1F, 0x8B)             -> fflate.gunzipSync()
             ├─► Text decode: strict UTF-8 (fatal) with fallback to Windows-1252
             ├─► cleanSubtitleContent() (src/cleaner/srtParser.ts)
             │     ├─ Parse subtitle blocks and timecodes (HH:MM:SS,mmm --> HH:MM:SS,mmm)
             │     ├─ Strip HTML styling tags (<b>, <i>, <font>)
             │     ├─ Evaluate against AD_PATTERNS regex (src/cleaner/patterns.ts)
             │     ├─ Drop matching ad/spam blocks
             │     └─ Re-index remaining cues sequentially (1, 2, 3...)
             ├─► Write to Cloudflare Cache API (caches.default, TTL 24h)
             └─► Return sanitized SRT (text/plain; charset=utf-8, CORS *)
```

### Key Concurrency & Isolation Patterns
- **Fault-Tolerant Provider Fan-Out**: `aggregateSubtitles` uses `Promise.allSettled` across all provider requests. If an upstream service (e.g., SubDL rate limit or OpenSubtitles 503) fails or throws, the error is logged and healthy providers still return their subtitles.
- **In-Memory Streaming & Decompression**: Cloudflare Workers isolates have no disk access (`fs`). Subtitle archive decompression is performed purely in memory using `fflate` (`unzipSync` for `.zip`, `gunzipSync` for `.gz`), dispatched on magic bytes in `decodeSubtitleBuffer()`.
- **Edge Caching**: Search results are cached for 1 hour (`Cache-Control: public, max-age=3600`). Cleaned subtitle files are stored via the Cloudflare Workers Cache API (`caches.default`) for 24 hours (`max-age=86400`).

---

## Key Directories

```
nuvio-subs/
├── src/                      # Core application source code
│   ├── index.ts              # Entry point: Hono server, CORS middleware, API route handlers
│   ├── types.ts              # Core TypeScript interfaces, Worker Bindings, Stremio schemas
│   ├── config.ts             # Configuration parsing, Base64 encoding/decoding, defaults
│   ├── views/                # Server-rendered HTML views
│   │   └── configure.ts      # Configuration web dashboard (Tailwind + Space Grotesk UI)
│   ├── providers/            # Upstream subtitle service integrations
│   │   ├── index.ts          # Provider aggregator, priority language scoring, debug runner
│   │   ├── subdl.ts          # SubDL API integration
│   │   ├── opensubtitles.ts  # OpenSubtitles v1 REST API integration
│   │   └── subsource.ts      # Subsource API integration
│   └── cleaner/              # Subtitle parsing, ad identification, and sanitization
│       ├── index.ts          # HTTP fetcher, ZIP/GZIP extraction (fflate), charset fallback, Cloudflare cache wrapper
│       ├── srtParser.ts      # SRT/WebVTT parser, ad cue elimination, sequential re-indexer
│       └── patterns.ts       # Regular expression catalog for ads, betting, URLs, credits
├── tests/                    # Test suites and regression verification
│   ├── cleaner.test.ts       # Cleaner validation script for ad removal and dialogue retention
│   └── decoding.test.ts      # Container detection, charset fallback, and HTML escaping regressions
├── branding/                 # Brand design assets, master SVGs, and webmanifest icons
├── wrangler.toml             # Cloudflare Workers deployment and environment configuration
├── tsconfig.json             # TypeScript compiler settings for Cloudflare Workers
└── package.json              # Project dependencies and npm lifecycle scripts
```

---

## Development Commands

All package management should use `npm` (to maintain `package-lock.json`).

| Action | Command | Purpose / Notes |
|---|---|---|
| **Local Development** | `npm run dev` | Starts Wrangler edge emulation server on `http://localhost:8787`. |
| **Type Check** | `npm run typecheck` | Executes `tsc --noEmit` against `src/**/*` in strict mode. |
| **Deploy** | `npm run deploy` | Bundles via Wrangler's internal esbuild and deploys to Cloudflare Workers. |
| **Run Unit Tests** | `bun test` | Runs the test suite via Bun runtime. |
| **Run Cleaner Test Directly** | `bun tests/cleaner.test.ts` | Executes the cleaner regression script directly. |
| **Run Test via Node.js** | `npx tsx tests/cleaner.test.ts` | Runs the test script via Node.js using `tsx`. |

*Note: No standalone `npm run build` script exists or is needed; Wrangler automatically handles esbuild bundling during `npm run dev` and `npm run deploy` based on `wrangler.toml`.*

---

## Code Conventions & Common Patterns

### 1. TypeScript & Strictness
- **Strict Mode**: `"strict": true` and `"isolatedModules": true` enabled in `tsconfig.json`.
- **Target & Resolution**: Compiles targeting `ESNext` with `"moduleResolution": "Bundler"`.
- **Typing Third-Party Payloads**: Upstream API payloads from third-party subtitle providers use typed interfaces where known or pragmatic `any` assertions to accommodate fluctuating vendor JSON schemas.
- **Worker Environment Typing**: The Hono instance is explicitly typed with Cloudflare Worker bindings: `new Hono<{ Bindings: Bindings }>()`.

### 2. Naming Conventions
- **Interfaces & Types**: `PascalCase` (`UserConfig`, `SubtitleItem`, `Bindings`, `SubtitleCue`, `DebugResponse`).
- **Functions & Handlers**: `camelCase` (`parseConfig`, `cleanSubtitleContent`, `aggregateSubtitles`, `handleSubtitles`).
- **Constants & Environment Variables**: `UPPER_SNAKE_CASE` (`AD_PATTERNS`, `DEFAULT_LANGUAGES`, `BRAND_LOGO_SVG`, `SUBDL_API_KEY`).
- **Route File Names**: `camelCase` or lowercase (`subdl.ts`, `srtParser.ts`, `configure.ts`).

### 3. Error Handling & Defensive Fallbacks
- **Zero-Crash Resilience**: Subtitle lookups MUST NEVER throw unhandled 500 errors to Stremio or Nuvio, which can crash the client video player. Catch provider errors internally, log warnings with `console.error`, and return empty arrays `[]`.
- **Archive Extraction Graceful Degradation**: `decodeSubtitleBuffer()` dispatches on magic bytes (`PK\x03\x04` for ZIP, `\x1F\x8B` for GZIP). If `unzipSync`/`gunzipSync` throws, fall back to decoding the raw buffer as text. Decoding MUST use `new TextDecoder("utf-8", { fatal: true })` so malformed legacy ANSI bytes actually throw and the `TextDecoder("windows-1252")` fallback becomes reachable; a non-fatal decoder silently emits U+FFFD instead.
- **Cloudflare Cache Compatibility**: Wrap all `caches.default` operations in `try-catch` blocks so code remains executable in local node/test environments where the Cloudflare Cache API is absent.
- **Configuration Parsing**: In `src/config.ts`, if Base64 or JSON decoding fails, catch the error and return `defaultConfig` instead of failing the request.
- **View Escaping**: Anything derived from user input (the `/:config/` path segment, query params) MUST pass through `escapeHtmlAttribute()` in `src/views/configure.ts` before being interpolated into markup. Unescaped quotes let a crafted shared link inject attributes into the page that collects provider API keys.

### 4. Concurrency & Async
- Use `Promise.allSettled` for aggregating data across distinct remote providers to isolate network failures and latency spikes.
- Use `Promise.all` only when running deliberate diagnostics where all results are required simultaneously (e.g., in `/debug` and `debugProviders`).
- All I/O operations (fetching remote files, reading/writing edge cache, querying provider APIs) MUST use `async`/`await`.

### 5. State Management & Dependency Injection
- **Completely Stateless**: Cloudflare Workers isolates must remain stateless. No global in-memory maps or shared mutating state across requests.
- **Explicit Context Passing**: Pass runtime configuration explicitly through arguments (`c.env`, `userConfig`, `origin`).
- **URL-Encoded User State**: Client preferences (API keys, target languages, ad-cleaning toggles) are encoded as Base64 JSON strings in the URL path segment: `/:config/...`.

---

## Important Files

### Entry Points & Infrastructure
- `src/index.ts`: Application entry point. Configures Hono routes, CORS headers, health checks, `/manifest.json`, `/subtitles/:type/:id`, `/clean-sub`, and `/debug`.
- `wrangler.toml`: Cloudflare Workers deployment configuration. Declares worker name, entry file, `compatibility_date = "2024-09-23"`, `nodejs_compat` flag, and default environment variables under `[vars]`.
- `tsconfig.json`: TypeScript configuration specifying compiler options (`ESNext`, `Bundler`, `noEmit`, `@cloudflare/workers-types`) and includes `src/**/*`.
- `package.json`: NPM package metadata, production dependencies (`hono`, `fflate`), and devDependencies (`wrangler`, `typescript`, `@cloudflare/workers-types`).

### Key Modules
- `src/types.ts`: Defines data contracts including `UserConfig`, `SubtitleItem`, `StremioManifest`, and `Bindings`.
- `src/config.ts`: Handles Base64 serialization (`encodeConfig`) and deserialization (`parseConfig`) with environment variable fallbacks.
- `src/providers/index.ts`: Orchestrates multi-provider fan-out and applies language scoring heuristics (mapping aliases like `ind` to `id`).
- `src/cleaner/srtParser.ts`: Implements `cleanSubtitleContent` to parse SRT/VTT timecodes, scrub ad cues, and re-sequence remaining cues.
- `src/cleaner/patterns.ts`: Defines `AD_PATTERNS`, containing regular expressions targeting betting sites, gambling domains, social handles, and promo text.
- `src/cleaner/index.ts`: Implements `fetchAndCleanSubtitle` (network retrieval + caching) plus `decodeSubtitleBuffer`/`decodeSubtitleText` for ZIP/GZIP extraction and UTF-8 → Windows-1252 charset fallback.
- `src/views/configure.ts`: Implements `renderConfigurePage`, generating the interactive HTML configuration dashboard.

---

## Runtime/Tooling Preferences

- **Target Runtime**: Cloudflare Workers (V8 edge isolates).
- **Compatibility Flags**: Requires `nodejs_compat` in `wrangler.toml` for standard Node compatibility APIs.
- **Execution Constraints**:
  - No native C/C++ addons or binaries.
  - No persistent local disk filesystem access (`fs.writeFile`, `fs.readFile`).
  - Strict memory limit (typically 128 MB per isolate).
  - All archive handling must remain purely in-memory via JavaScript (`fflate`).
- **Package Manager**: Use `npm`. Do not commit alternative lockfiles (such as `pnpm-lock.yaml` or `yarn.lock`).
- **Bundling Model**: Wrangler internally uses `esbuild`. Do not introduce custom webpack/rollup configs unless explicitly migrating build pipelines.

---

## Testing & QA

### Test Setup & Execution
The project includes a regression test script validating the subtitle cleaning and parsing engine in `tests/cleaner.test.ts`.

To run tests:
```bash
# Recommended runner
bun test

# Or execute script directly via Bun
bun tests/cleaner.test.ts

# Or run via Node.js
npx tsx tests/cleaner.test.ts
```

### What Is Tested
- **Ad & Spam Removal**: Checks that `cleanSubtitleContent` removes:
  - SubDL self-promotional download credits.
  - Indonesian online slot / gambling promotions (`SLOT88GACOR`, `pasti maxwin`).
  - Sports betting promos (`1XBET`).
  - Telegram channel promo links (`t.me/...`).
  - Indonesian translator watermarks (`Pein Akatsuki & LebahGanteng`).
- **Content Integrity**: Validates that all legitimate dialogue lines are preserved verbatim.
- **Cue Re-numbering**: Ensures that removed cues do not leave gaps in SRT sequential numbers (`1`, `2`, `3`).

### QA & Known Coverage Gaps
When making modifications, be mindful of components not currently covered by automated unit tests:
1. **Hono Route Endpoints**: Route matching, parameter parsing (`:config`, `:type`, `:id`), and error handling in `src/index.ts`.
2. **Provider Integrations**: Upstream API query formatting, authentication headers, and response parsing in `src/providers/*.ts`.
3. **Live Upstream Fetching**: HTTP retrieval, Cloudflare cache read/write, and provider responses for `fetchAndCleanSubtitle` in `src/cleaner/index.ts` (buffer decoding itself is covered by `tests/decoding.test.ts`).
4. **Configuration Edge Cases**: Malformed Base64 strings, URL-encoded entities, and missing keys in `src/config.ts`.
5. **WebVTT Header Handling**: Files starting with `WEBVTT` and `NOTE` comments.
