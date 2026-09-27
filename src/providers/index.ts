import { DebugResponse, SubtitleItem, UserConfig } from "../types";
import { fetchSubDLSubtitles, debugSubDL } from "./subdl";
import { fetchOpenSubtitles, debugOpenSubtitles } from "./opensubtitles";
import { fetchSubsourceSubtitles, debugSubsource } from "./subsource";

export async function aggregateSubtitles(
  imdbId: string,
  type: string,
  season?: number,
  episode?: number,
  config?: UserConfig,
  originUrl?: string
): Promise<SubtitleItem[]> {
  const promises = [
    fetchSubDLSubtitles(imdbId, type, season, episode, config, originUrl),
    fetchOpenSubtitles(imdbId, type, season, episode, config, originUrl),
    fetchSubsourceSubtitles(imdbId, type, season, episode, config, originUrl),
  ];

  const results = await Promise.allSettled(promises);
  const allSubtitles: SubtitleItem[] = [];

  for (const res of results) {
    if (res.status === "fulfilled" && Array.isArray(res.value)) {
      allSubtitles.push(...res.value);
    }
  }

  // Language priority sorting
  const preferredLangs = config?.languages || ["id", "en"];
  const getLangScore = (lang: string): number => {
    const l = lang.toLowerCase();
    for (let i = 0; i < preferredLangs.length; i++) {
      const pref = preferredLangs[i].toLowerCase();
      if (
        l === pref ||
        (pref === "id" && (l === "ind" || l === "indonesian")) ||
        (pref === "en" && (l === "eng" || l === "english"))
      ) {
        return i;
      }
    }
    return 999;
  };

  allSubtitles.sort((a, b) => getLangScore(a.lang) - getLangScore(b.lang));

  return allSubtitles;
}

export async function debugProviders(
  imdbId: string,
  type: string = "movie",
  config?: UserConfig
): Promise<DebugResponse> {
  const [subdlRes, osRes, subsourceRes] = await Promise.all([
    debugSubDL(imdbId, type, config),
    debugOpenSubtitles(imdbId, type, config),
    debugSubsource(imdbId, type, config),
  ]);

  return {
    imdbId,
    type,
    providers: {
      subdl: subdlRes,
      opensubtitles: osRes,
      subsource: subsourceRes,
    },
    totalSubtitles: (subdlRes.count || 0) + (osRes.count || 0) + (subsourceRes.count || 0),
  };
}
