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
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
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

      <!-- Subsource Token -->
      <div>
        <label class="block text-sm font-semibold text-slate-300 mb-1.5">Subsource Token (Opsional)</label>
        <input 
          type="password" 
          id="subsourceToken" 
          placeholder="Opsional jika ada" 
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
  </script>
</body>
</html>`;
}
