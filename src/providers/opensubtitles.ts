import { ProviderDebugInfo, SubtitleItem, UserConfig } from "../types";

export async function fetchOpenSubtitles(
  imdbId: string,
  type: string,
  season?: number,
  episode?: number,
  config?: UserConfig,
  originUrl?: string
): Promise<SubtitleItem[]> {
  const apiKey = config?.openSubtitlesApiKey;
  if (!apiKey) {
    return [];
  }

  try {
    const numericImdb = imdbId.replace(/^tt/, "");
    const langs = (config?.languages || ["id", "en"]).join(",");

    const params = new URLSearchParams({
      imdb_id: numericImdb,
      languages: langs,
    });

    if (type === "series" && season !== undefined && episode !== undefined) {
      params.append("type", "episode");
      params.append("season_number", season.toString());
      params.append("episode_number", episode.toString());
    } else {
      params.append("type", "movie");
    }

    const apiUrl = `https://api.opensubtitles.com/api/v1/subtitles?${params.toString()}`;
    const res = await fetch(apiUrl, {
      headers: {
        "Api-Key": apiKey,
        "User-Agent": "NuvioSubs v1.0.0",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`OpenSubtitles returned status ${res.status}`);
      return [];
    }

    const data = await res.json() as any;
    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    const results: SubtitleItem[] = [];

    for (const item of data.data) {
      const attributes = item.attributes;
      if (!attributes || !Array.isArray(attributes.files) || attributes.files.length === 0) {
        continue;
      }

      const file = attributes.files[0];
      const fileId = file.file_id;
      if (!fileId) continue;

      const langCode = (attributes.language || "en").toLowerCase();

      const proxyUrl = originUrl
        ? `${originUrl}/clean-sub?os_file_id=${fileId}&os_api_key=${encodeURIComponent(apiKey)}&name=${encodeURIComponent(attributes.release || file.file_name || "opensubtitles")}`
        : "";

      results.push({
        id: `os-${item.id}`,
        url: proxyUrl || `https://www.opensubtitles.com/en/subtitles/${item.id}`,
        lang: langCode === "id" ? "ind" : langCode === "en" ? "eng" : langCode,
        title: `[OpenSubtitles] ${attributes.release || file.file_name || "Subtitle"}`,
      });
    }

    return results;
  } catch (err) {
    console.error("OpenSubtitles provider error:", err);
    return [];
  }
}

export async function debugOpenSubtitles(
  imdbId: string,
  type: string,
  config?: UserConfig
): Promise<ProviderDebugInfo> {
  const apiKey = config?.openSubtitlesApiKey;
  if (!apiKey) {
    return { enabled: false, count: 0, error: "API Key belum diisi" };
  }

  try {
    const numericImdb = imdbId.replace(/^tt/, "");
    const langs = (config?.languages || ["id", "en"]).join(",");

    const params = new URLSearchParams({
      imdb_id: numericImdb,
      languages: langs,
    });

    if (type === "series") {
      params.append("type", "episode");
    } else {
      params.append("type", "movie");
    }

    const apiUrl = `https://api.opensubtitles.com/api/v1/subtitles?${params.toString()}`;
    const res = await fetch(apiUrl, {
      headers: {
        "Api-Key": apiKey,
        "User-Agent": "NuvioSubs v1.0.0",
        "Accept": "application/json",
      },
    });

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
    const subs = Array.isArray(data.data) ? data.data : [];
    return {
      enabled: true,
      status: res.status,
      count: subs.length,
      sample: subs.slice(0, 3).map((s: any) => ({
        title: s.attributes?.release || s.attributes?.files?.[0]?.file_name,
        lang: s.attributes?.language,
      })),
    };
  } catch (err: any) {
    return { enabled: true, count: 0, error: err?.message || String(err) };
  }
}
