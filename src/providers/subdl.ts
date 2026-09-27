import { ProviderDebugInfo, SubtitleItem, UserConfig } from "../types";

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
    // SubDL API expects uppercase comma-separated codes, e.g. ID,EN
    const langs = (config?.languages || ["id", "en"])
      .map((l) => l.toUpperCase())
      .join(",");

    const params = new URLSearchParams({
      api_key: apiKey,
      imdb_id: imdbId,
      type: type === "series" ? "tv" : "movie",
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

      const proxyUrl = originUrl
        ? `${originUrl}/clean-sub?url=${encodeURIComponent(rawUrl)}&name=${encodeURIComponent(sub.release_name || sub.name || "subdl")}`
        : rawUrl;

      const langCode = (sub.language || sub.lang || "en").toLowerCase();
      const normalizedLang = langCode === "id" ? "ind" : langCode === "en" ? "eng" : langCode;
      const releaseName = sub.release_name || sub.name || "";
      const displayLabel = releaseName
        ? `[SubDL] ${releaseName}`
        : `[SubDL] ${normalizedLang.toUpperCase()}`;

      results.push({
        id: `subdl-${releaseName || Math.random().toString(36).substring(7)}`,
        url: config?.cleanAds ? proxyUrl : rawUrl,
        lang: normalizedLang,
        label: displayLabel,
        title: displayLabel,
        name: displayLabel,
      });
    }

    return results;
  } catch (err) {
    console.error("SubDL provider error:", err);
    return [];
  }
}

export async function debugSubDL(
  imdbId: string,
  type: string,
  config?: UserConfig
): Promise<ProviderDebugInfo> {
  const apiKey = config?.subdlApiKey;
  if (!apiKey) {
    return { enabled: false, count: 0, error: "API Key belum diisi" };
  }

  try {
    const langs = (config?.languages || ["id", "en"])
      .map((l) => l.toUpperCase())
      .join(",");

    const params = new URLSearchParams({
      api_key: apiKey,
      imdb_id: imdbId,
      type: type === "series" ? "tv" : "movie",
      languages: langs,
    });

    const apiUrl = `https://api.subdl.com/api/v1/subtitles?${params.toString()}`;
    const res = await fetch(apiUrl, {
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        enabled: true,
        status: res.status,
        count: 0,
        error: `HTTP ${res.status}: ${body.slice(0, 150)}`,
      };
    }

    const data = await res.json() as any;
    if (!data.status) {
      return {
        enabled: true,
        status: res.status,
        count: 0,
        error: data.error || data.message || "SubDL mengembalikan status false",
      };
    }

    const subs = Array.isArray(data.subtitles) ? data.subtitles : [];
    return {
      enabled: true,
      status: res.status,
      count: subs.length,
      sample: subs.slice(0, 3).map((s: any) => ({
        title: s.release_name || s.name,
        lang: s.language || s.lang,
      })),
    };
  } catch (err: any) {
    return { enabled: true, count: 0, error: err?.message || String(err) };
  }
}
