// Regex patterns for detecting ads, gambling, spam promo links, and translator watermarks in subtitles

export const AD_PATTERNS: RegExp[] = [
  // 1. Gambling & Betting sites / keywords
  /\b(1xbet|melbet|parimatch|bet365|sbobet|m88|w88|fun88|bk8|dafabet|1win)\b/i,
  /\b(slot88|slot\s*gacor|judi\s*online|situs\s*slot|maxwin|pragmatic\s*play|zeus|olympus|sweet\s*bonanza|togel\s*online|bandar\s*togel|agen\s*judi|taruhan\s*bola|poker\s*online|casino\s*online|live\s*casino)\b/i,
  /\b(depo\s*pulsa|bonus\s*new\s*member|freebet|jackpot|rtp\s*live|pasti\s*cuan|hoki\s*slot)\b/i,

  // 2. URLs, Domains & Social handles
  /https?:\/\/[^\s]+/i,
  /www\.[a-z0-9-]+\.[a-z]{2,}/i,
  /\b[a-z0-9-_]+(\.(com|net|org|xyz|online|tv|ru|cc|to|vip|site|club|me|link|top|win|live|pro|space))\b/i,
  /\b(t\.me\/[a-z0-9_-]+|telegram\s*:\s*@[a-z0-9_-]+)\b/i,
  /\b(instagram|tiktok|twitter|fb|facebook)\.com\/[a-z0-9_.-]+/i,
  /@[a-z0-9_]{4,}\b/i,

  // 3. Subtitle download site self-promos
  /\b(subdl(\.com)?|opensubtitles(\.org|\.com)?|subsource(\.net)?|addic7ed(\.com)?|podnapisi(\.net)?|yify(-subtitles)?|lebahganteng|pein\s*akatsuki|idfl(\.me)?|subscene(\.com)?)\b/i,
  /\b(downloaded\s+from|subtitles\s+downloaded\s+from|get\s+subtitles\s+from|unduh\s+subtitle\s+dari)\b/i,

  // 4. Advertising sentences
  /\b(advertise\s+your\s+product|support\s+us\s+and\s+become\s+vip|pasang\s+iklan|iklan\s+murah|hubungi\s+admin)\b/i,

  // 5. Spam translator / encoder credits at the start or end
  /\b(sync(ed|hronized)?\s+by|ripped\s+by|encoded\s+by|corrected\s+by|resync(ed)?\s+by)\b/i,
  /\b(translated\s+by|diterjemahkan\s+oleh|sub\s+by|subtitle\s+oleh|alih\s+bahasa\s+oleh)\b/i,
];

/**
 * Checks if a given subtitle cue text contains any advertising or spam pattern
 */
export function isAdCue(text: string): boolean {
  if (!text) return false;
  // Clean HTML/VTT formatting tags like <i>, <font>, <b> for accurate pattern matching
  const cleanText = text.replace(/<[^>]+>/g, " ").trim();
  if (!cleanText) return false;

  return AD_PATTERNS.some((pattern) => pattern.test(cleanText));
}
