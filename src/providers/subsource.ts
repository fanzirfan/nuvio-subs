import { SubtitleItem, UserConfig } from "../types";

export async function fetchSubsourceSubtitles(
  imdbId: string,
  type: string,
  season?: number,
  episode?: number,
  config?: UserConfig,
  originUrl?: string
): Promise<SubtitleItem[]> {
  try {
    const langs = config?.languages || ["id", "en"];
    const results: SubtitleItem[] = [];

    // Subsource API endpoint for movie / series subtitles
    const searchUrl = `https://api.subsource.net/api/v1/subtitles/search?imdb=${encodeURIComponent(imdbId)}`;
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "NuvioSubs v1.0.0",
    };

    if (config?.subsourceToken) {
      headers["X-API-Key"] = config.subsourceToken;
      headers["Authorization"] = `Bearer ${config.subsourceToken}`;
    }

    const res = await fetch(searchUrl, { headers });
    if (!res.ok) {
      return [];
    }

    const data = await res.json() as any;
    const subs = Array.isArray(data) ? data : data.subtitles || data.data;

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
