import { Bindings, UserConfig } from "./types";

export function parseConfig(configStr?: string, env?: Bindings): UserConfig {
  const defaultConfig: UserConfig = {
    languages: (env?.DEFAULT_LANGUAGES || "id,en")
      .split(",")
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean),
    subdlApiKey: env?.SUBDL_API_KEY || "",
    openSubtitlesApiKey: env?.OPENSUBTITLES_API_KEY || "",
    subsourceToken: env?.SUBSOURCE_TOKEN || "",
    cleanAds: true,
  };

  if (!configStr) {
    return defaultConfig;
  }

  try {
    let jsonStr = configStr;
    // Decode base64 if not starting with {
    if (!configStr.trim().startsWith("{")) {
      try {
        jsonStr = atob(configStr);
      } catch {
        jsonStr = decodeURIComponent(configStr);
        if (!jsonStr.trim().startsWith("{")) {
          try {
            jsonStr = atob(jsonStr);
          } catch {
            // keep as is
          }
        }
      }
    }

    const parsed = JSON.parse(jsonStr);
    return {
      languages: Array.isArray(parsed.languages) && parsed.languages.length > 0
        ? parsed.languages.map((l: string) => l.trim().toLowerCase())
        : defaultConfig.languages,
      subdlApiKey: parsed.subdlApiKey || defaultConfig.subdlApiKey,
      openSubtitlesApiKey: parsed.openSubtitlesApiKey || defaultConfig.openSubtitlesApiKey,
      subsourceToken: parsed.subsourceToken || defaultConfig.subsourceToken,
      cleanAds: parsed.cleanAds !== undefined ? Boolean(parsed.cleanAds) : true,
    };
  } catch (err) {
    console.error("Failed to parse config, falling back to default:", err);
    return defaultConfig;
  }
}

export function encodeConfig(config: Partial<UserConfig>): string {
  const str = JSON.stringify(config);
  return btoa(str);
}
