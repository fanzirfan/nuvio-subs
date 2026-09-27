import { ProviderDebugInfo, SubtitleItem, UserConfig } from "../types";

export async function fetchSubsourceSubtitles(
  imdbId: string,
  type: string,
  season?: number,
  episode?: number,
  config?: UserConfig,
  originUrl?: string
): Promise<SubtitleItem[]> {
  const token = config?.subsourceToken;
  if (!token) {
    return [];
  }

  try {
    const langs = config?.languages || ["id", "en"];
    const results: SubtitleItem[] = [];

    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "NuvioSubs v1.0.0",
      "X-API-Key": token,
      "Authorization": `Bearer ${token}`,
    };

    // Subsource API v1 endpoint
    let url = `https://api.subsource.net/api/v1/subtitles?imdb_id=${encodeURIComponent(imdbId)}`;
    let res = await fetch(url, { headers });

    // Fallback if imdb_id param differs
    if (!res.ok && res.status !== 401 && res.status !== 403) {
      url = `https://api.subsource.net/api/v1/subtitles?imdb=${encodeURIComponent(imdbId)}`;
      res = await fetch(url, { headers });
    }

    if (!res.ok) {
      console.warn(`Subsource returned status ${res.status}`);
      return [];
    }

    const data = await res.json() as any;
    const subs = Array.isArray(data) ? data : data.subtitles || data.data || [];

    if (Array.isArray(subs)) {
      for (const item of subs) {
        const lang = (item.lang || item.language || "en").toLowerCase();
        const matchesLang = langs.some((l) => l.toLowerCase() === lang || lang.startsWith(l.toLowerCase()));
        if (!matchesLang) continue;

        if (type === "series" && season !== undefined && episode !== undefined) {
          if (item.season && item.season !== season) continue;
          if (item.episode && item.episode !== episode) continue;
        }

        const downloadUrl = item.downloadUrl || item.url || (item.link ? `https://subsource.net${item.link}` : "");
        if (!downloadUrl) continue;

        const proxyUrl = originUrl
          ? `${originUrl}/clean-sub?url=${encodeURIComponent(downloadUrl)}&name=${encodeURIComponent(item.releaseName || item.title || "subsource")}`
          : downloadUrl;

        results.push({
          id: `subsource-${item.id || Math.random().toString(36).substring(7)}`,
          url: config?.cleanAds ? proxyUrl : downloadUrl,
          lang: lang === "id" ? "ind" : lang === "en" ? "eng" : lang,
          title: `[Subsource] ${item.releaseName || item.title || "Subtitle"}`,
        });
      }
    }

    return results;
  } catch (err) {
    console.error("Subsource provider error:", err);
    return [];
  }
}

export async function debugSubsource(
  imdbId: string,
  type: string,
  config?: UserConfig
): Promise<ProviderDebugInfo> {
  const token = config?.subsourceToken;
  if (!token) {
    return { enabled: false, count: 0, error: "API Key belum diisi" };
  }

  try {
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "NuvioSubs v1.0.0",
      "X-API-Key": token,
      "Authorization": `Bearer ${token}`,
    };

    let url = `https://api.subsource.net/api/v1/subtitles?imdb_id=${encodeURIComponent(imdbId)}`;
    let res = await fetch(url, { headers });

    if (!res.ok && res.status !== 401 && res.status !== 403) {
      url = `https://api.subsource.net/api/v1/subtitles?imdb=${encodeURIComponent(imdbId)}`;
      res = await fetch(url, { headers });
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        enabled: true,
        status: res.status,
        count: 0,
        error: `HTTP ${res.status}: ${body.slice(0, 150) || res.statusText}`,
      };
    }

    const data = await res.json() as any;
    const subs = Array.isArray(data) ? data : data.subtitles || data.data || [];
    return {
      enabled: true,
      status: res.status,
      count: subs.length,
      sample: subs.slice(0, 3).map((s: any) => ({
        title: s.releaseName || s.title || s.name,
        lang: s.lang || s.language,
      })),
    };
  } catch (err: any) {
    return { enabled: true, count: 0, error: err?.message || String(err) };
  }
}
