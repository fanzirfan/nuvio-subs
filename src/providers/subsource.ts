import { ProviderDebugInfo, SubtitleItem, UserConfig } from "../types";

const LANG_MAP: Record<string, string[]> = {
  id: ["id", "ind", "indonesian", "bahasa indonesia", "indonesia"],
  en: ["en", "eng", "english"],
  ja: ["ja", "jp", "jpn", "japanese"],
  ko: ["ko", "kor", "korean"],
  es: ["es", "spa", "spanish", "espanol"],
  fr: ["fr", "fra", "fre", "french", "francais"],
  de: ["de", "deu", "ger", "german"],
  ar: ["ar", "ara", "arabic"],
  ru: ["ru", "rus", "russian"],
  zh: ["zh", "chi", "zho", "chinese"],
};

function isLanguageMatch(subLang: string | undefined, userLangs: string[]): boolean {
  if (!subLang) return true;
  const cleanSub = subLang.toLowerCase().trim();
  for (const userLang of userLangs) {
    const cleanUser = userLang.toLowerCase().trim();
    if (cleanSub === cleanUser || cleanSub.startsWith(cleanUser)) return true;
    const aliases = LANG_MAP[cleanUser] || [];
    if (aliases.some((a) => cleanSub === a || cleanSub.includes(a))) {
      return true;
    }
  }
  return false;
}

async function getTitleFromImdb(imdbId: string, type: string): Promise<string | undefined> {
  try {
    const metaType = type === "series" ? "series" : "movie";
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${metaType}/${imdbId}.json`);
    if (res.ok) {
      const data = (await res.json()) as any;
      return data?.meta?.name;
    }
  } catch {
    // ignore
  }
  return undefined;
}

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

    // 1. Resolve movieId from IMDb ID or Movie Title via Cinemeta
    let movieId: string | number | undefined;
    let movieTitle: string | undefined;

    try {
      // First search by IMDb ID
      const searchRes = await fetch(
        `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(imdbId)}`,
        { headers }
      );
      if (searchRes.ok) {
        const searchData = (await searchRes.json()) as any;
        const movies = Array.isArray(searchData)
          ? searchData
          : searchData?.data || searchData?.movies || searchData?.results || [];
        if (movies.length > 0) {
          movieId = movies[0].id || movies[0]._id || movies[0].movieId;
          movieTitle = movies[0].title || movies[0].name;
        }
      }

      // If not found by IMDb ID, resolve title via Cinemeta and search by title
      if (!movieId) {
        const resolvedTitle = await getTitleFromImdb(imdbId, type);
        if (resolvedTitle) {
          movieTitle = resolvedTitle;
          const titleSearchRes = await fetch(
            `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(resolvedTitle)}`,
            { headers }
          );
          if (titleSearchRes.ok) {
            const titleData = (await titleSearchRes.json()) as any;
            const movies = Array.isArray(titleData)
              ? titleData
              : titleData?.data || titleData?.movies || titleData?.results || [];
            if (movies.length > 0) {
              movieId = movies[0].id || movies[0]._id || movies[0].movieId;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Subsource movie resolution error:", e);
    }

    // 2. Query subtitles
    const subUrl = movieId
      ? `https://api.subsource.net/api/v1/subtitles?movieId=${movieId}`
      : `https://api.subsource.net/api/v1/subtitles?releaseInfo=${encodeURIComponent(movieTitle || imdbId)}`;

    const res = await fetch(subUrl, { headers });
    if (!res.ok) {
      console.warn(`Subsource returned status ${res.status}`);
      return [];
    }

    const data = (await res.json()) as any;
    const subs = Array.isArray(data)
      ? data
      : data?.subtitles || data?.data || data?.results || data?.items || [];

    if (Array.isArray(subs)) {
      for (const item of subs) {
        const rawLang = item.lang || item.language || item.lang_code || item.languageName || item.langName;
        if (!isLanguageMatch(rawLang, langs)) {
          continue;
        }

        if (type === "series" && season !== undefined && episode !== undefined) {
          if (item.season && item.season !== season) continue;
          if (item.episode && item.episode !== episode) continue;
        }

        const downloadEndpoint = item.id
          ? `https://api.subsource.net/api/v1/subtitles/${item.id}/download?api_key=${encodeURIComponent(token)}`
          : item.downloadUrl || item.url || (item.link ? `https://subsource.net${item.link}` : "");

        if (!downloadEndpoint) continue;

        const proxyUrl = originUrl
          ? `${originUrl}/clean-sub?url=${encodeURIComponent(downloadEndpoint)}&name=${encodeURIComponent(item.releaseName || item.title || item.name || "subsource")}`
          : downloadEndpoint;

        const langStr = String(rawLang || "en").toLowerCase();
        const normalizedLang =
          langStr.includes("ind") || langStr === "id"
            ? "ind"
            : langStr.includes("eng") || langStr === "en"
            ? "eng"
            : langStr;

        results.push({
          id: `subsource-${item.id || Math.random().toString(36).substring(7)}`,
          url: config?.cleanAds ? proxyUrl : downloadEndpoint,
          lang: normalizedLang,
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
    const langs = config?.languages || ["id", "en"];
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "User-Agent": "NuvioSubs v1.0.0",
      "X-API-Key": token,
    };

    // 1. Search movie ID
    let movieId: string | number | undefined;
    let movieTitle: string | undefined;

    const searchRes = await fetch(
      `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(imdbId)}`,
      { headers }
    );

    if (searchRes.ok) {
      const searchData = (await searchRes.json()) as any;
      const movies = Array.isArray(searchData)
        ? searchData
        : searchData?.data || searchData?.movies || searchData?.results || [];
      if (movies.length > 0) {
        movieId = movies[0].id || movies[0]._id || movies[0].movieId;
        movieTitle = movies[0].title || movies[0].name;
      }
    }

    if (!movieId) {
      const resolvedTitle = await getTitleFromImdb(imdbId, type);
      if (resolvedTitle) {
        movieTitle = resolvedTitle;
        const titleSearchRes = await fetch(
          `https://api.subsource.net/api/v1/movies/search?query=${encodeURIComponent(resolvedTitle)}`,
          { headers }
        );
        if (titleSearchRes.ok) {
          const titleData = (await titleSearchRes.json()) as any;
          const movies = Array.isArray(titleData)
            ? titleData
            : titleData?.data || titleData?.movies || titleData?.results || [];
          if (movies.length > 0) {
            movieId = movies[0].id || movies[0]._id || movies[0].movieId;
          }
        }
      }
    }

    // 2. Fetch subtitles
    const subUrl = movieId
      ? `https://api.subsource.net/api/v1/subtitles?movieId=${movieId}`
      : `https://api.subsource.net/api/v1/subtitles?releaseInfo=${encodeURIComponent(movieTitle || imdbId)}`;

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
    const subs = Array.isArray(data)
      ? data
      : data?.subtitles || data?.data || data?.results || data?.items || [];

    const matchedSubs = subs.filter((item: any) => {
      const rawLang = item.lang || item.language || item.lang_code || item.languageName || item.langName;
      return isLanguageMatch(rawLang, langs);
    });

    return {
      enabled: true,
      status: res.status,
      count: matchedSubs.length,
      details: `Film: ${movieTitle || imdbId} (MovieId: ${movieId || 'N/A'}), Total subs di Subsource: ${subs.length}`,
      sample: matchedSubs.slice(0, 3).map((s: any) => ({
        title: s.releaseName || s.title || s.name,
        lang: s.lang || s.language || s.lang_code,
      })),
    };
  } catch (err: any) {
    return { enabled: true, count: 0, error: err?.message || String(err) };
  }
}
