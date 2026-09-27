export function renderConfigurePage(currentOrigin: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuvio Subs - Custom Ad-Free Subtitle Plugin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-6">
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-6">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/30">
        🎬
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Nuvio Subs Cleaner</h1>
        <p class="text-xs text-slate-400">Personalized Ad-Free Subtitles for Stremio & Nuvio</p>
      </div>
    </div>

    <!-- Info banner -->
    <div class="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3.5 mb-6 text-xs text-indigo-200 flex items-center gap-2">
      <span class="text-base">🛡️</span>
      <span>Otomatis membersihkan iklan judi (slot, 1xbet), link telegram, dan watermark spam secara realtime!</span>
    </div>

    <form id="configForm" class="space-y-5">
      <!-- Languages -->
      <div>
        <label class="block text-sm font-semibold text-slate-300 mb-1.5">Pilihan Bahasa (Urutan Prioritas)</label>
        <input 
          type="text" 
          id="languages" 
          value="id,en" 
          placeholder="contoh: id,en,ja" 
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
        <p class="text-[11px] text-slate-500 mt-1">Pisahkan dengan koma (id = Indonesia, en = Inggris, dll).</p>
      </div>

      <!-- SubDL API Key -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-sm font-semibold text-slate-300">SubDL API Key</label>
          <a href="https://subdl.com" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300">Dapatkan Key &rarr;</a>
        </div>
        <input 
          type="password" 
          id="subdlApiKey" 
          placeholder="Masukkan SubDL API Key kamu" 
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      <!-- OpenSubtitles API Key -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-sm font-semibold text-slate-300">OpenSubtitles.com API Key</label>
          <a href="https://www.opensubtitles.com/en/consumers" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300">Dapatkan Key &rarr;</a>
        </div>
        <input 
          type="password" 
          id="openSubtitlesApiKey" 
          placeholder="Masukkan OpenSubtitles v3 API Key" 
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      <!-- Subsource API Key -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-sm font-semibold text-slate-300">Subsource API Key (Opsional)</label>
          <a href="https://subsource.net" target="_blank" class="text-xs text-indigo-400 hover:text-indigo-300">Dapatkan Key &rarr;</a>
        </div>
        <input 
          type="password" 
          id="subsourceToken" 
          placeholder="Masukkan Subsource API Key (dari menu Profile)" 
          class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      <!-- Toggle Ad Clean -->
      <div class="flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl">
        <div>
          <div class="text-sm font-medium text-slate-200">Aktifkan Pembersih Iklan (Ad-Cleaner)</div>
          <div class="text-xs text-slate-400">Hapus baris iklan judi, link, dan credit spam dari file SRT</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="cleanAds" checked class="sr-only peer">
          <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <!-- Live Provider Diagnostics / Test Button -->
      <div class="border border-slate-800 bg-slate-900/80 rounded-xl p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold text-slate-200">🛠️ Diagnostic Tool: Tes Status Source</div>
          <button 
            type="button" 
            onclick="testProviders()" 
            id="testBtn"
            class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <span>🔍 Tes Sekarang</span>
          </button>
        </div>
        <p class="text-[11px] text-slate-400 mb-3">Tes apakah API key milikmu valid dan bisa mengambil subtitle untuk film contoh (Inception - <code>tt1375666</code>).</p>
        
        <div id="debugResults" class="space-y-2 hidden">
          <!-- SubDL Status -->
          <div id="debugSubdl" class="p-2.5 rounded-lg text-xs bg-slate-800/60 border border-slate-700/60">
            <span class="font-bold">SubDL:</span> <span id="debugSubdlStatus" class="text-slate-400">Menunggu tes...</span>
          </div>
          <!-- OpenSubtitles Status -->
          <div id="debugOS" class="p-2.5 rounded-lg text-xs bg-slate-800/60 border border-slate-700/60">
            <span class="font-bold">OpenSubtitles:</span> <span id="debugOSStatus" class="text-slate-400">Menunggu tes...</span>
          </div>
          <!-- Subsource Status -->
          <div id="debugSubsource" class="p-2.5 rounded-lg text-xs bg-slate-800/60 border border-slate-700/60">
            <span class="font-bold">Subsource:</span> <span id="debugSubsourceStatus" class="text-slate-400">Menunggu tes...</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex flex-col sm:flex-row gap-3">
        <button 
          type="button" 
          onclick="installAddon()" 
          class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🚀</span>
          <span>Install ke Stremio / Nuvio</span>
        </button>

        <button 
          type="button" 
          onclick="copyAddonUrl()" 
          id="copyBtn"
          class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium py-3 px-4 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>📋</span>
          <span id="copyBtnText">Salin Link</span>
        </button>
      </div>
    </form>
  </div>

  <script>
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
      textSpan.innerText = 'Tersalin!';
      setTimeout(() => {
        textSpan.innerText = 'Salin Link';
      }, 2000);
    }

    async function testProviders() {
      const btn = document.getElementById('testBtn');
      const resultsDiv = document.getElementById('debugResults');
      resultsDiv.classList.remove('hidden');

      const subdlKey = document.getElementById('subdlApiKey').value.trim();
      const osKey = document.getElementById('openSubtitlesApiKey').value.trim();
      const subsource = document.getElementById('subsourceToken').value.trim();
      const langs = document.getElementById('languages').value.trim();

      const subdlStatus = document.getElementById('debugSubdlStatus');
      const osStatus = document.getElementById('debugOSStatus');
      const subsourceStatus = document.getElementById('debugSubsourceStatus');

      subdlStatus.innerHTML = '<span class="text-yellow-400">⏳ Sedang memeriksa...</span>';
      osStatus.innerHTML = '<span class="text-yellow-400">⏳ Sedang memeriksa...</span>';
      subsourceStatus.innerHTML = '<span class="text-yellow-400">⏳ Sedang memeriksa...</span>';
      btn.disabled = true;

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

        // Render SubDL
        renderItemStatus(subdlStatus, data.providers.subdl);
        // Render OpenSubtitles
        renderItemStatus(osStatus, data.providers.opensubtitles);
        // Render Subsource
        renderItemStatus(subsourceStatus, data.providers.subsource);
      } catch (err) {
        subdlStatus.innerHTML = '<span class="text-red-400">Gagal tes: ' + err.message + '</span>';
      } finally {
        btn.disabled = false;
      }
    }

    function renderItemStatus(el, info) {
      if (!info.enabled) {
        el.innerHTML = '<span class="text-slate-400">⚪ Key belum diisi</span>';
        return;
      }
      if (info.count > 0) {
        el.innerHTML = '<span class="text-emerald-400 font-semibold">🟢 Aktif (Ditemukan ' + info.count + ' subtitle)</span>';
      } else if (info.status === 200) {
        el.innerHTML = '<span class="text-amber-400">🟡 Terhubung, tetapi 0 subtitle ditemukan untuk bahasa ini</span>';
      } else {
        el.innerHTML = '<span class="text-red-400 font-semibold">🔴 Error: ' + (info.error || 'HTTP ' + info.status) + '</span>';
      }
    }
  </script>
</body>
</html>`;
}
