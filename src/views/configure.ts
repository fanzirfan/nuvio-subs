import { UserConfig } from "../types";

export function renderConfigurePage(currentOrigin: string, initialConfig?: UserConfig): string {
  const defaultLangs = initialConfig?.languages?.join(",") || "id,en";
  const defaultSubdl = initialConfig?.subdlApiKey || "";
  const defaultOS = initialConfig?.openSubtitlesApiKey || "";
  const defaultSubsource = initialConfig?.subsourceToken || "";
  const defaultClean = initialConfig?.cleanAds !== false;

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuvio Subs &mdash; Configuration</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/logo.svg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
          },
          colors: {
            lavender: {
              DEFAULT: '#B8A9FF',
              hover: '#A594FF',
              dark: '#2A244D',
            },
            mint: {
              DEFAULT: '#A7F3D0',
              hover: '#86EFAC',
              dark: '#133929',
            },
            neo: {
              bg: '#0D0E13',
              card: '#161720',
              cardHeader: '#12131A',
              input: '#0A0B0F',
              border: '#2A2C3C',
              borderDark: '#050608',
              muted: '#9496A8',
            }
          },
          boxShadow: {
            'neo-sm': '2px 2px 0px #050608',
            'neo': '4px 4px 0px #050608',
            'neo-lg': '6px 6px 0px #050608',
            'neo-lavender': '3px 3px 0px #B8A9FF',
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #0D0E13;
      background-image: radial-gradient(#26283A 1px, transparent 1px);
      background-size: 20px 20px;
      color: #EDEDF2;
    }
    code, .font-mono { font-family: 'JetBrains Mono', monospace; }
    input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear { display: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between antialiased selection:bg-[#B8A9FF] selection:text-black">
  <!-- Top Navigation / Brand Bar -->
  <header class="border-b-2 border-black bg-[#12131A]/90 backdrop-blur-md sticky top-0 z-30">
    <div class="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <!-- Logo Emblem -->
        <div class="w-9 h-9 rounded-lg bg-[#161720] border-2 border-black shadow-neo-sm flex items-center justify-center p-1.5 transition-transform hover:-rotate-3">
          <svg class="w-full h-full text-zinc-100" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="36" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 76 192 L 76 98 C 76 60 104 60 116 84 L 140 172 C 152 196 180 196 180 158 L 180 64" />
          </svg>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-base font-extrabold tracking-tight text-white">nuvio-subs</span>
          <span class="text-[11px] font-mono font-bold bg-[#A7F3D0] text-black border-2 border-black px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_#000]">v1.0.0</span>
        </div>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <a href="https://github.com/fanzirfan/nuvio-subs" target="_blank" class="font-mono font-bold bg-[#161720] hover:bg-[#1E202B] text-zinc-200 border-2 border-black px-3 py-1.5 rounded-lg shadow-neo-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
    <!-- Hero / Headline Box -->
    <div class="mb-8 bg-[#161720] border-2 border-black rounded-2xl p-6 shadow-neo">
      <div class="inline-block bg-[#B8A9FF] text-black border-2 border-black font-mono font-bold text-xs uppercase px-2.5 py-1 rounded shadow-neo-sm mb-3">
        Subtitle Engine Setup
      </div>
      <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">Configure Providers &amp; Filters</h1>
      <p class="text-sm font-medium text-zinc-400 mt-2 leading-relaxed">
        Prioritize languages, attach your subtitle credentials, and filter out promotional junk on the fly.
      </p>
    </div>

    <form id="configForm" class="space-y-6">
      <!-- Section 1: Language Priority -->
      <div class="bg-[#161720] border-2 border-black rounded-2xl p-5 sm:p-6 shadow-neo">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 bg-[#B8A9FF] border border-black rounded-sm inline-block"></span>
            Language Priority
          </label>
          <span class="text-[11px] text-zinc-400 font-mono font-bold bg-[#0A0B0F] border border-black px-1.5 py-0.5 rounded">ISO 639-1</span>
        </div>
        <p class="text-xs text-zinc-400 font-medium mb-3">
          Subtitles will be sorted and delivered according to this sequence.
        </p>
        
        <!-- Preset Chips -->
        <div class="flex flex-wrap gap-2 mb-3" id="quickLangChips">
          <button type="button" onclick="toggleLang('id')" data-lang="id" class="lang-chip text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono font-bold transition-all shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#0A0B0F] text-zinc-300">id (Indonesian)</button>
          <button type="button" onclick="toggleLang('en')" data-lang="en" class="lang-chip text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono font-bold transition-all shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#0A0B0F] text-zinc-300">en (English)</button>
          <button type="button" onclick="toggleLang('ja')" data-lang="ja" class="lang-chip text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono font-bold transition-all shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#0A0B0F] text-zinc-300">ja (Japanese)</button>
          <button type="button" onclick="toggleLang('ko')" data-lang="ko" class="lang-chip text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono font-bold transition-all shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#0A0B0F] text-zinc-300">ko (Korean)</button>
          <button type="button" onclick="toggleLang('es')" data-lang="es" class="lang-chip text-xs px-3 py-1.5 rounded-lg border-2 border-black font-mono font-bold transition-all shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none bg-[#0A0B0F] text-zinc-300">es (Spanish)</button>
        </div>

        <div class="relative">
          <input 
            type="text" 
            id="languages" 
            value="${defaultLangs}" 
            placeholder="id,en,ja" 
            class="w-full bg-[#0A0B0F] border-2 border-black rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#B8A9FF] focus:shadow-neo-lavender transition"
          />
        </div>
      </div>

      <!-- Section 2: Subtitle Source Credentials -->
      <div class="bg-[#161720] border-2 border-black rounded-2xl p-5 sm:p-6 shadow-neo space-y-4">
        <div>
          <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 mb-1 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 bg-[#A7F3D0] border border-black rounded-sm inline-block"></span>
            Provider Credentials
          </h2>
          <p class="text-xs text-zinc-400 font-medium">Provide keys for the sources you wish to query. Unconfigured providers are skipped automatically.</p>
        </div>

        <!-- SubDL Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-200 font-bold flex items-center gap-1.5">
              <span>SubDL</span>
              <span class="text-[10px] text-zinc-300 font-mono bg-[#0A0B0F] border border-black px-1.5 py-0.2 rounded font-bold">API Key</span>
            </span>
            <a href="https://subdl.com" target="_blank" class="text-zinc-400 hover:text-[#B8A9FF] font-mono font-bold text-[11px] underline inline-flex items-center gap-0.5 transition">
              <span>Get API Key</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="subdlApiKey" 
              value="${defaultSubdl}"
              placeholder="Paste SubDL API Key" 
              class="w-full bg-[#0A0B0F] border-2 border-black rounded-xl pl-4 pr-11 py-2.5 text-xs font-mono font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#B8A9FF] focus:shadow-neo-lavender transition"
            />
            <button type="button" onclick="toggleVisibility('subdlApiKey', this)" class="absolute right-3 w-6 h-6 border border-black bg-[#161720] hover:bg-[#232533] rounded flex items-center justify-center text-zinc-400 hover:text-zinc-200 shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- OpenSubtitles Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-200 font-bold flex items-center gap-1.5">
              <span>OpenSubtitles.com</span>
              <span class="text-[10px] text-zinc-300 font-mono bg-[#0A0B0F] border border-black px-1.5 py-0.2 rounded font-bold">v3 REST</span>
            </span>
            <a href="https://www.opensubtitles.com/en/consumers" target="_blank" class="text-zinc-400 hover:text-[#B8A9FF] font-mono font-bold text-[11px] underline inline-flex items-center gap-0.5 transition">
              <span>Dashboard</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="openSubtitlesApiKey" 
              value="${defaultOS}"
              placeholder="Paste OpenSubtitles v3 API Key" 
              class="w-full bg-[#0A0B0F] border-2 border-black rounded-xl pl-4 pr-11 py-2.5 text-xs font-mono font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#B8A9FF] focus:shadow-neo-lavender transition"
            />
            <button type="button" onclick="toggleVisibility('openSubtitlesApiKey', this)" class="absolute right-3 w-6 h-6 border border-black bg-[#161720] hover:bg-[#232533] rounded flex items-center justify-center text-zinc-400 hover:text-zinc-200 shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- Subsource Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-200 font-bold flex items-center gap-1.5">
              <span>Subsource</span>
              <span class="text-[10px] text-zinc-300 font-mono bg-[#0A0B0F] border border-black px-1.5 py-0.2 rounded font-bold">X-API-Key</span>
            </span>
            <a href="https://subsource.net" target="_blank" class="text-zinc-400 hover:text-[#B8A9FF] font-mono font-bold text-[11px] underline inline-flex items-center gap-0.5 transition">
              <span>Profile Key</span>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="subsourceToken" 
              value="${defaultSubsource}"
              placeholder="Paste Subsource API Key" 
              class="w-full bg-[#0A0B0F] border-2 border-black rounded-xl pl-4 pr-11 py-2.5 text-xs font-mono font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-[#B8A9FF] focus:shadow-neo-lavender transition"
            />
            <button type="button" onclick="toggleVisibility('subsourceToken', this)" class="absolute right-3 w-6 h-6 border border-black bg-[#161720] hover:bg-[#232533] rounded flex items-center justify-center text-zinc-400 hover:text-zinc-200 shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 3: Ad-Sanitization Preference -->
      <div class="bg-[#161720] border-2 border-black rounded-2xl p-5 sm:p-6 shadow-neo flex items-center justify-between">
        <div class="space-y-1 pr-4">
          <div class="text-sm font-bold text-white flex items-center gap-2">
            <span>On-the-fly Ad Sanitization</span>
            <span class="text-[10px] font-mono font-bold bg-[#A7F3D0] text-black border border-black px-1.5 py-0.2 rounded">Zero Ads</span>
          </div>
          <div class="text-xs text-zinc-400 font-medium leading-relaxed">
            Automatically strip gambling promos, URL hyperlinks, and spam watermarks without shifting dialogue timecodes.
          </div>
        </div>
        <!-- Neubrutalist Toggle Checkbox -->
        <label class="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" id="cleanAds" ${defaultClean ? "checked" : ""} class="sr-only peer">
          <div class="w-12 h-7 bg-[#0A0B0F] border-2 border-black rounded-full shadow-neo-sm peer peer-checked:bg-[#A7F3D0] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-400 peer-checked:after:bg-black after:border-2 after:border-black after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>

      <!-- Section 4: Live Diagnostics Terminal -->
      <div class="bg-[#161720] border-2 border-black rounded-2xl overflow-hidden shadow-neo">
        <div class="px-5 py-3.5 border-b-2 border-black bg-[#12131A] flex items-center justify-between">
          <div class="flex items-center space-x-2.5">
            <span class="w-3 h-3 rounded-full border border-black bg-zinc-600 inline-block shadow-[1px_1px_0px_#000]" id="diagIndicator"></span>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">Live Provider Healthcheck</span>
          </div>
          <button 
            type="button" 
            onclick="testProviders()" 
            id="testBtn"
            class="text-xs bg-[#A7F3D0] hover:bg-[#86EFAC] text-black px-3 py-1.5 rounded-lg font-mono font-bold transition-all border-2 border-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none inline-flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            <span>Run Test</span>
          </button>
        </div>

        <div class="p-5 space-y-3" id="diagContainer">
          <div class="text-xs text-zinc-400 font-mono font-medium">
            Target sample: Inception (<code class="bg-[#0A0B0F] border border-black px-1.5 py-0.5 rounded font-bold text-[#A7F3D0]">tt1375666</code>). Click "Run Test" to query all configured providers.
          </div>

          <div id="debugResults" class="space-y-2 hidden pt-1">
            <!-- SubDL Status Row -->
            <div id="debugSubdl" class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl text-xs bg-[#0A0B0F] border-2 border-black gap-1 font-mono shadow-[2px_2px_0px_#050608]">
              <span class="text-zinc-300 font-bold">SubDL</span>
              <span id="debugSubdlStatus" class="text-zinc-500 font-semibold">Idle</span>
            </div>
            <!-- OpenSubtitles Status Row -->
            <div id="debugOS" class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl text-xs bg-[#0A0B0F] border-2 border-black gap-1 font-mono shadow-[2px_2px_0px_#050608]">
              <span class="text-zinc-300 font-bold">OpenSubtitles</span>
              <span id="debugOSStatus" class="text-zinc-500 font-semibold">Idle</span>
            </div>
            <!-- Subsource Status Row -->
            <div id="debugSubsource" class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl text-xs bg-[#0A0B0F] border-2 border-black gap-1 font-mono shadow-[2px_2px_0px_#050608]">
              <span class="text-zinc-300 font-bold">Subsource</span>
              <span id="debugSubsourceStatus" class="text-zinc-500 font-semibold">Idle</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-2 flex flex-col sm:flex-row gap-3">
        <button 
          type="button" 
          onclick="installAddon()" 
          class="flex-1 bg-[#B8A9FF] hover:bg-[#A594FF] text-black font-extrabold text-sm py-3.5 px-5 rounded-xl border-2 border-black shadow-neo transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>Install to Stremio / Nuvio</span>
        </button>

        <button 
          type="button" 
          onclick="copyAddonUrl()" 
          id="copyBtn"
          class="bg-[#161720] hover:bg-[#1E202B] text-zinc-100 font-bold text-sm py-3.5 px-5 rounded-xl border-2 border-black shadow-neo transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          <span id="copyBtnText">Copy Manifest URL</span>
        </button>
      </div>
    </form>
  </main>

  <!-- Footer -->
  <footer class="border-t-2 border-black bg-[#12131A] py-5 text-center text-xs text-zinc-500 font-mono font-semibold">
    <span>Zero ads. Edge cached. Powered by Cloudflare Workers.</span>
  </footer>

  <script>
    function toggleVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.classList.add('bg-[#B8A9FF]', 'text-black');
        btn.classList.remove('bg-[#161720]', 'text-zinc-400');
      } else {
        input.type = 'password';
        btn.classList.remove('bg-[#B8A9FF]', 'text-black');
        btn.classList.add('bg-[#161720]', 'text-zinc-400');
      }
    }

    function toggleLang(code) {
      const input = document.getElementById('languages');
      let current = input.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const idx = current.indexOf(code);
      if (idx > -1) {
        current.splice(idx, 1);
      } else {
        current.push(code);
      }
      input.value = current.join(',');
      syncLangChips();
    }

    function syncLangChips() {
      const input = document.getElementById('languages');
      const current = input.value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      document.querySelectorAll('.lang-chip').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (current.includes(lang)) {
          btn.classList.remove('bg-[#0A0B0F]', 'text-zinc-300');
          btn.classList.add('bg-[#B8A9FF]', 'text-black', 'border-black');
        } else {
          btn.classList.remove('bg-[#B8A9FF]', 'text-black');
          btn.classList.add('bg-[#0A0B0F]', 'text-zinc-300', 'border-black');
        }
      });
    }

    document.getElementById('languages').addEventListener('input', syncLangChips);
    syncLangChips();

    function getConfigPayload() {
      const langs = document.getElementById('languages').value.split(',').map(s => s.trim()).filter(Boolean);
      const subdlKey = document.getElementById('subdlApiKey').value.trim();
      const osKey = document.getElementById('openSubtitlesApiKey').value.trim();
      const subsource = document.getElementById('subsourceToken').value.trim();
      const clean = document.getElementById('cleanAds').checked;

      const config = {
        languages: langs.length > 0 ? langs : ['id', 'en'],
        subdlApiKey: subdlKey || undefined,
        openSubtitlesApiKey: osKey || undefined,
        subsourceToken: subsource || undefined,
        cleanAds: clean
      };

      return btoa(JSON.stringify(config));
    }

    function getAddonUrls() {
      const encoded = getConfigPayload();
      const origin = window.location.origin;
      const host = window.location.host;
      const manifestPath = encoded + '/manifest.json';
      
      const httpsUrl = origin + '/' + manifestPath;
      const stremioUrl = 'stremio://' + host + '/' + manifestPath;
      return { httpsUrl, stremioUrl };
    }

    function installAddon() {
      const { stremioUrl } = getAddonUrls();
      window.location.href = stremioUrl;
    }

    async function copyAddonUrl() {
      const { httpsUrl } = getAddonUrls();
      await navigator.clipboard.writeText(httpsUrl);
      const textSpan = document.getElementById('copyBtnText');
      textSpan.innerText = 'Copied to Clipboard!';
      setTimeout(() => {
        textSpan.innerText = 'Copy Manifest URL';
      }, 2000);
    }

    async function testProviders() {
      const btn = document.getElementById('testBtn');
      const resultsDiv = document.getElementById('debugResults');
      const diagIndicator = document.getElementById('diagIndicator');
      resultsDiv.classList.remove('hidden');

      const subdlKey = document.getElementById('subdlApiKey').value.trim();
      const osKey = document.getElementById('openSubtitlesApiKey').value.trim();
      const subsource = document.getElementById('subsourceToken').value.trim();
      const langs = document.getElementById('languages').value.trim();

      const subdlStatus = document.getElementById('debugSubdlStatus');
      const osStatus = document.getElementById('debugOSStatus');
      const subsourceStatus = document.getElementById('debugSubsourceStatus');

      subdlStatus.innerHTML = '<span class="text-zinc-500 font-bold animate-pulse">QUERYING...</span>';
      osStatus.innerHTML = '<span class="text-zinc-500 font-bold animate-pulse">QUERYING...</span>';
      subsourceStatus.innerHTML = '<span class="text-zinc-500 font-bold animate-pulse">QUERYING...</span>';
      btn.disabled = true;
      diagIndicator.className = 'w-3 h-3 rounded-full border border-black bg-amber-400 animate-pulse inline-block shadow-[1px_1px_0px_#000]';

      try {
        const queryParams = new URLSearchParams({
          id: 'tt1375666',
          langs: langs || 'id,en',
          subdl_key: subdlKey,
          os_key: osKey,
          subsource_key: subsource,
        });

        const res = await fetch('/debug?' + queryParams.toString());
        const data = await res.json();

        renderItemStatus(subdlStatus, data.providers.subdl);
        renderItemStatus(osStatus, data.providers.opensubtitles);
        renderItemStatus(subsourceStatus, data.providers.subsource);

        const hasActive = [data.providers.subdl, data.providers.opensubtitles, data.providers.subsource].some(p => p.count > 0);
        diagIndicator.className = hasActive ? 'w-3 h-3 rounded-full border border-black bg-emerald-400 inline-block shadow-[1px_1px_0px_#000]' : 'w-3 h-3 rounded-full border border-black bg-zinc-600 inline-block shadow-[1px_1px_0px_#000]';
      } catch (err) {
        subdlStatus.innerHTML = '<span class="text-rose-400 font-bold">Failed: ' + err.message + '</span>';
        diagIndicator.className = 'w-3 h-3 rounded-full border border-black bg-rose-500 inline-block shadow-[1px_1px_0px_#000]';
      } finally {
        btn.disabled = false;
      }
    }

    function renderItemStatus(el, info) {
      if (!info.enabled) {
        el.innerHTML = '<span class="text-zinc-600 font-bold">NOT CONFIGURED</span>';
        return;
      }
      const detailsHtml = info.details ? '<span class="text-[10px] text-zinc-500 font-medium block mt-0.5">' + info.details + '</span>' : '';
      if (info.count > 0) {
        el.innerHTML = '<span class="text-emerald-300 font-bold bg-[#133929] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">READY (' + info.count + ' subs)</span>' + detailsHtml;
      } else if (info.status === 200) {
        el.innerHTML = '<span class="text-amber-300 font-bold bg-[#382E14] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">CONNECTED (0 matches)</span>' + detailsHtml;
      } else {
        el.innerHTML = '<span class="text-rose-300 font-bold bg-[#3D1418] border border-black px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000]">' + (info.error || 'HTTP ' + info.status) + '</span>' + detailsHtml;
      }
    }
  </script>
</body>
</html>`;
}
