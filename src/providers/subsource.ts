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
    };

    // 1. Resolve movieId from IMDb ID via /movies/search
    let movieId: string | number | undefined;
    try {
      const searchRes = await fetch(
        `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(imdbId)}`,
        { headers }
      );
      if (searchRes.ok) {
        const searchData = (await searchRes.json()) as any;
        const movies = Array.isArray(searchData)
          ? searchData
          : searchData?.data || searchData?.movies || [];
        if (movies.length > 0) {
          movieId = movies[0].id || movies[0]._id || movies[0].movieId;
        }
      }
    } catch (e) {
      console.warn("Subsource movie search failed:", e);
    }

    // 2. Query subtitles using movieId or fallback to releaseInfo
    const subUrl = movieId
      ? `https://api.subsource.net/api/v1/subtitles?movieId=${movieId}`
      : `https://api.subsource.net/api/v1/subtitles?releaseInfo=${encodeURIComponent(imdbId)}`;

    const res = await fetch(subUrl, { headers });
    if (!res.ok) {
      console.warn(`Subsource returned status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as any;
    const subs = Array.isArray(data) ? data : data.subtitles || data.data || [];

    if (Array.isArray(subs)) {
      for (const item of subs) {
        const lang = (item.lang || item.language || item.lang_code || "en").toLowerCase();
        const matchesLang = langs.some(
          (l) =>
            l.toLowerCase() === lang ||
            lang.startsWith(l.toLowerCase()) ||
            (l.toLowerCase() === "id" && (lang === "ind" || lang === "indonesian")) ||
            (l.toLowerCase() === "en" && (lang === "eng" || lang === "english"))
        );
        if (!matchesLang) continue;

        if (type === "series" && season !== undefined && episode !== undefined) {
          if (item.season && item.season !== season) continue;
          if (item.episode && item.episode !== episode) continue;
        }

        // Subsource download URL
        const downloadEndpoint = item.id
          ? `https://api.subsource.net/api/v1/subtitles/${item.id}/download?api_key=${encodeURIComponent(token)}`
          : item.downloadUrl || item.url || (item.link ? `https://subsource.net${item.link}` : "");

        if (!downloadEndpoint) continue;

        const proxyUrl = originUrl
          ? `${originUrl}/clean-sub?url=${encodeURIComponent(downloadEndpoint)}&name=${encodeURIComponent(item.releaseName || item.title || item.name || "subsource")}`
          : downloadEndpoint;

        results.push({
          id: `subsource-${item.id || Math.random().toString(36).substring(7)}`,
          url: config?.cleanAds ? proxyUrl : downloadEndpoint,
          lang: lang === "id" || lang === "indonesian" ? "ind" : lang === "en" || lang === "english" ? "eng" : lang,
          title: `[Subsource] ${item.releaseName || item.title || item.name || "Subtitle"}`,
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
    };

    // 1. Search movie ID
    let movieId: string | number | undefined;
    const movieSearchUrl = `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(imdbId)}`;
    const searchRes = await fetch(movieSearchUrl, { headers });

    if (searchRes.ok) {
      const searchData = (await searchRes.json()) as any;
      const movies = Array.isArray(searchData)
        ? searchData
        : searchData?.data || searchData?.movies || [];
      if (movies.length > 0) {
        movieId = movies[0].id || movies[0]._id || movies[0].movieId;
      }
    }

    // 2. Fetch subtitles
    const subUrl = movieId
      ? `https://api.subsource.net/api/v1/subtitles?movieId=${movieId}`
      : `https://api.subsource.net/api/v1/subtitles?releaseInfo=${encodeURIComponent(imdbId)}`;

    const res = await fetch(subUrl, { headers });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        enabled: true,
        status: res.status,
        count: 0,
        error: `HTTP ${res.status}: ${body.slice(0, 150) || res.statusText}`,
      };
    }

    const data = (await res.json()) as any;
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
