import { SubtitleItem, UserConfig } from "../types";

export async function fetchSubDLSubtitles(
  imdbId: string,
  type: string,
  season?: number,
  episode?: number,
  config?: UserConfig,
  originUrl?: string
): Promise<SubtitleItem[]> {
  const apiKey = config?.subdlApiKey;
  if (!apiKey) {
    return [];
  }

  try {
    const langs = (config?.languages || ["id", "en"]).join(",");
    const params = new URLSearchParams({
      api_key: apiKey,
      imdb_id: imdbId,
      type: type === "series" ? "series" : "movie",
      languages: langs,
    });

    if (season !== undefined && episode !== undefined) {
      params.append("season_number", season.toString());
      params.append("episode_number", episode.toString());
    }

    const apiUrl = `https://api.subdl.com/api/v1/subtitles?${params.toString()}`;
    const res = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      console.warn(`SubDL returned status ${res.status}`);
      return [];
    }

    const data = await res.json() as any;
    if (!data.status || !Array.isArray(data.subtitles)) {
      return [];
    }

    const results: SubtitleItem[] = [];

    for (const sub of data.subtitles) {
      const downloadPath = sub.url || sub.download_url;
      if (!downloadPath) continue;

      const rawUrl = downloadPath.startsWith("http")
        ? downloadPath
        : `https://dl.subdl.com${downloadPath}`;

      // Clean proxy URL or direct URL
      const proxyUrl = originUrl
        ? `${originUrl}/clean-sub?url=${encodeURIComponent(rawUrl)}&name=${encodeURIComponent(sub.release_name || sub.name || "subdl")}`
        : rawUrl;

      const langCode = (sub.language || sub.lang || "en").toLowerCase();

      results.push({
        id: `subdl-${sub.release_name || sub.name || Math.random().toString(36).substring(7)}`,
        url: config?.cleanAds ? proxyUrl : rawUrl,
        lang: langCode === "id" ? "ind" : langCode === "en" ? "eng" : langCode,
        title: `[SubDL] ${sub.release_name || sub.name || "Subtitle"}`,
      });
    }

    return results;
  } catch (err) {
    console.error("SubDL provider error:", err);
    return [];
  }
}
