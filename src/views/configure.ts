export function renderConfigurePage(currentOrigin: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuvio Subs &mdash; Configuration</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
          },
          colors: {
            brand: {
              50: '#f4f4f5',
              100: '#e4e4e7',
              200: '#d4d4d8',
              800: '#27272a',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Geist', sans-serif; }
    code, .font-mono { font-family: 'Geist Mono', monospace; }
    input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear { display: none; }
  </style>
</head>
<body class="bg-[#09090b] text-[#f4f4f5] min-h-screen flex flex-col justify-between antialiased selection:bg-zinc-800 selection:text-white">
  <!-- Top Navigation / Brand Bar -->
  <header class="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-30">
    <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-950 font-bold text-xs tracking-tight">
          N
        </div>
        <span class="text-sm font-semibold tracking-tight text-zinc-100">nuvio-subs</span>
        <span class="text-[11px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">v1.0.0</span>
      </div>
      <div class="flex items-center space-x-3 text-xs text-zinc-400">
        <a href="https://github.com/fanzirfan/nuvio-subs" target="_blank" class="hover:text-zinc-200 transition flex items-center gap-1">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-2xl mx-auto w-full px-4 py-8 flex-1">
    <div class="mb-8">
      <h1 class="text-xl font-medium tracking-tight text-zinc-100">Subtitle Provider Configuration</h1>
      <p class="text-xs text-zinc-400 mt-1 leading-relaxed">
        Personalize subtitle sources, prioritize preferred languages, and sanitize advertising text on the fly.
      </p>
    </div>

    <form id="configForm" class="space-y-6">
      <!-- Section 1: Language Priority -->
      <div class="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5">
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs font-semibold uppercase tracking-wider text-zinc-400">Language Priority</label>
          <span class="text-[11px] text-zinc-500 font-mono">ISO 639-1 / Aliases</span>
        </div>
        <p class="text-xs text-zinc-400 mb-3">
          Subtitles will be sorted and delivered according to this sequence.
        </p>
        
        <!-- Preset Chips -->
        <div class="flex flex-wrap gap-1.5 mb-3" id="quickLangChips">
          <button type="button" onclick="toggleLang('id')" data-lang="id" class="lang-chip text-xs px-2.5 py-1 rounded-md border border-zinc-700 bg-zinc-800/90 text-zinc-200 hover:border-zinc-500 transition font-mono">id (Indonesian)</button>
          <button type="button" onclick="toggleLang('en')" data-lang="en" class="lang-chip text-xs px-2.5 py-1 rounded-md border border-zinc-700 bg-zinc-800/90 text-zinc-200 hover:border-zinc-500 transition font-mono">en (English)</button>
          <button type="button" onclick="toggleLang('ja')" data-lang="ja" class="lang-chip text-xs px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 transition font-mono">ja (Japanese)</button>
          <button type="button" onclick="toggleLang('ko')" data-lang="ko" class="lang-chip text-xs px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 transition font-mono">ko (Korean)</button>
          <button type="button" onclick="toggleLang('es')" data-lang="es" class="lang-chip text-xs px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 transition font-mono">es (Spanish)</button>
        </div>

        <div class="relative">
          <input 
            type="text" 
            id="languages" 
            value="id,en" 
            placeholder="id,en,ja" 
            class="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
          />
        </div>
      </div>

      <!-- Section 2: Subtitle Source Credentials -->
      <div class="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Provider Credentials</h2>
          <p class="text-xs text-zinc-500">Provide keys for the sources you wish to activate. Empty providers will be skipped.</p>
        </div>

        <!-- SubDL Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-300 font-medium flex items-center gap-1.5">
              <span>SubDL</span>
              <span class="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-1 py-0.2 rounded">REST API</span>
            </span>
            <a href="https://subdl.com" target="_blank" class="text-zinc-400 hover:text-zinc-200 text-[11px] inline-flex items-center gap-0.5 transition">
              <span>Get API Key</span>
              <svg class="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="subdlApiKey" 
              placeholder="Paste SubDL API Key" 
              class="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-3.5 pr-10 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
            />
            <button type="button" onclick="toggleVisibility('subdlApiKey', this)" class="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1 text-xs">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- OpenSubtitles Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-300 font-medium flex items-center gap-1.5">
              <span>OpenSubtitles.com</span>
              <span class="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-1 py-0.2 rounded">v3 REST</span>
            </span>
            <a href="https://www.opensubtitles.com/en/consumers" target="_blank" class="text-zinc-400 hover:text-zinc-200 text-[11px] inline-flex items-center gap-0.5 transition">
              <span>Consumers Dashboard</span>
              <svg class="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="openSubtitlesApiKey" 
              placeholder="Paste OpenSubtitles v3 API Key" 
              class="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-3.5 pr-10 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
            />
            <button type="button" onclick="toggleVisibility('openSubtitlesApiKey', this)" class="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1 text-xs">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>

        <!-- Subsource Input -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-zinc-300 font-medium flex items-center gap-1.5">
              <span>Subsource</span>
              <span class="text-[10px] text-zinc-500 font-mono border border-zinc-800 px-1 py-0.2 rounded">X-API-Key</span>
            </span>
            <a href="https://subsource.net" target="_blank" class="text-zinc-400 hover:text-zinc-200 text-[11px] inline-flex items-center gap-0.5 transition">
              <span>Profile Key</span>
              <svg class="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
          <div class="relative flex items-center">
            <input 
              type="password" 
              id="subsourceToken" 
              placeholder="Paste Subsource API Key" 
              class="w-full bg-[#09090b] border border-zinc-800 rounded-lg pl-3.5 pr-10 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition"
            />
            <button type="button" onclick="toggleVisibility('subsourceToken', this)" class="absolute right-2.5 text-zinc-500 hover:text-zinc-300 p-1 text-xs">
              <svg class="w-3.5 h-3.5 eye-show" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 3: Ad-Sanitization Preference -->
      <div class="bg-[#121215] border border-zinc-800/80 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div class="space-y-0.5 pr-4">
          <div class="text-xs font-medium text-zinc-200">On-the-fly Ad Sanitization</div>
          <div class="text-[11px] text-zinc-500">
            Automatically strip gambling promos, URL hyperlinks, and spam watermarks without shifting dialogue timecodes.
          </div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" id="cleanAds" checked class="sr-only peer">
          <div class="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-950 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-300 peer-checked:after:bg-zinc-950 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-100"></div>
        </label>
      </div>

      <!-- Section 4: Live Diagnostics Terminal -->
      <div class="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden">
        <div class="px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-zinc-600 inline-block" id="diagIndicator"></span>
            <span class="text-xs font-medium text-zinc-300">Live Provider Healthcheck</span>
          </div>
          <button 
            type="button" 
            onclick="testProviders()" 
            id="testBtn"
            class="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded-md font-mono transition inline-flex items-center gap-1.5 border border-zinc-700/80 cursor-pointer"
          >
            <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            <span>Run Test</span>
          </button>
        </div>

        <div class="p-4 space-y-2.5" id="diagContainer">
          <div class="text-[11px] text-zinc-500 font-mono">
            Target sample: Inception (<code>tt1375666</code>). Click "Run Test" to query all configured providers.
          </div>

          <div id="debugResults" class="space-y-2 hidden pt-1">
            <!-- SubDL Status Row -->
            <div id="debugSubdl" class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg text-xs bg-[#09090b] border border-zinc-800/80 gap-1 font-mono">
              <span class="text-zinc-400">SubDL</span>
              <span id="debugSubdlStatus" class="text-zinc-500">Idle</span>
            </div>
            <!-- OpenSubtitles Status Row -->
            <div id="debugOS" class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg text-xs bg-[#09090b] border border-zinc-800/80 gap-1 font-mono">
              <span class="text-zinc-400">OpenSubtitles</span>
              <span id="debugOSStatus" class="text-zinc-500">Idle</span>
            </div>
            <!-- Subsource Status Row -->
            <div id="debugSubsource" class="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg text-xs bg-[#09090b] border border-zinc-800/80 gap-1 font-mono">
              <span class="text-zinc-400">Subsource</span>
              <span id="debugSubsourceStatus" class="text-zinc-500">Idle</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="pt-2 flex flex-col sm:flex-row gap-2.5">
        <button 
          type="button" 
          onclick="installAddon()" 
          class="flex-1 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs py-2.5 px-4 rounded-lg shadow-sm transition inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
        >
          <svg class="w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>Install Addon</span>
        </button>

        <button 
          type="button" 
          onclick="copyAddonUrl()" 
          id="copyBtn"
          class="bg-[#121215] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs py-2.5 px-4 rounded-lg transition inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
        >
          <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          <span id="copyBtnText">Copy Manifest URL</span>
        </button>
      </div>
    </form>
  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-600 font-mono">
    <span>Zero ads. Edge cached. Powered by Cloudflare Workers.</span>
  </footer>

  <script>
    function toggleVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (input.type === 'password') {
        input.type = 'text';
        btn.classList.add('text-zinc-200');
        btn.classList.remove('text-zinc-500');
      } else {
        input.type = 'password';
        btn.classList.remove('text-zinc-200');
        btn.classList.add('text-zinc-500');
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
          btn.classList.remove('border-zinc-800', 'bg-zinc-900/60', 'text-zinc-400');
          btn.classList.add('border-zinc-700', 'bg-zinc-800/90', 'text-zinc-200');
        } else {
          btn.classList.remove('border-zinc-700', 'bg-zinc-800/90', 'text-zinc-200');
          btn.classList.add('border-zinc-800', 'bg-zinc-900/60', 'text-zinc-400');
        }
      });
    }

    document.getElementById('languages').addEventListener('input', syncLangChips);

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
      textSpan.innerText = 'Copied to Clipboard';
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

      subdlStatus.innerHTML = '<span class="text-zinc-500 animate-pulse">querying...</span>';
      osStatus.innerHTML = '<span class="text-zinc-500 animate-pulse">querying...</span>';
      subsourceStatus.innerHTML = '<span class="text-zinc-500 animate-pulse">querying...</span>';
      btn.disabled = true;
      diagIndicator.className = 'w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block';

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
        diagIndicator.className = hasActive ? 'w-2 h-2 rounded-full bg-emerald-500 inline-block' : 'w-2 h-2 rounded-full bg-zinc-600 inline-block';
      } catch (err) {
        subdlStatus.innerHTML = '<span class="text-rose-400">Failed: ' + err.message + '</span>';
        diagIndicator.className = 'w-2 h-2 rounded-full bg-rose-500 inline-block';
      } finally {
        btn.disabled = false;
      }
    }

    function renderItemStatus(el, info) {
      if (!info.enabled) {
        el.innerHTML = '<span class="text-zinc-600">NOT CONFIGURED</span>';
        return;
      }
      const detailsHtml = info.details ? '<span class="text-[10px] text-zinc-500 block">' + info.details + '</span>' : '';
      if (info.count > 0) {
        el.innerHTML = '<span class="text-emerald-400 font-medium">READY (' + info.count + ' subs)</span>' + detailsHtml;
      } else if (info.status === 200) {
        el.innerHTML = '<span class="text-amber-400 font-medium">CONNECTED (0 matches)</span>' + detailsHtml;
      } else {
        el.innerHTML = '<span class="text-rose-400 font-medium">' + (info.error || 'HTTP ' + info.status) + '</span>' + detailsHtml;
      }
    }
  </script>
</body>
</html>`;
}
