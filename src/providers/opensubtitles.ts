import { SubtitleItem, UserConfig } from "../types";

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
    // OpenSubtitles uses numeric part of IMDB ID e.g. tt1234567 -> 1234567
    const numericImdb = imdbId.replace(/^tt/, "");
    const langs = (config?.languages || ["id", "en"]).join(",");

    const params = new URLSearchParams({
      imdb_id: numericImdb,
      languages: langs,
    });

    if (type === "series" && season !== undefined && episode !== undefined) {
      params.append("season_number", season.toString());
      params.append("episode_number", episode.toString());
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

      // OpenSubtitles download via proxy or direct link
      // We pass the download request payload to our worker's proxy
      const downloadTriggerUrl = `https://api.opensubtitles.com/api/v1/download`;
      const langCode = (attributes.language || "en").toLowerCase();

      // We can use our clean-sub endpoint with a special flag for OpenSubtitles API download
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
