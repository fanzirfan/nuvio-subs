export interface UserConfig {
  languages: string[];
  subdlApiKey?: string;
  openSubtitlesApiKey?: string;
  subsourceToken?: string;
  cleanAds: boolean;
}

export interface SubtitleItem {
  id: string;
  url: string;
  lang: string;
  title?: string;
}

export interface SubtitlesResponse {
  subtitles: SubtitleItem[];
}

export interface StremioManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  logo?: string;
  resources: Array<"subtitles" | string>;
  types: Array<"movie" | "series" | string>;
  catalogs: any[];
  behaviorHints?: {
    configurable?: boolean;
    configurationRequired?: boolean;
  };
}

export interface Bindings {
  DEFAULT_LANGUAGES?: string;
  SUBDL_API_KEY?: string;
  OPENSUBTITLES_API_KEY?: string;
  SUBSOURCE_TOKEN?: string;
}
