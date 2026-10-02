import { unzipSync, gunzipSync } from "fflate";
import { cleanSubtitleContent } from "./srtParser";

/**
 * Decodes subtitle bytes as UTF-8, falling back to Windows-1252 for the legacy
 * ANSI encoders that still dominate Indonesian subtitle uploads.
 *
 * `fatal: true` is load-bearing: the default (non-fatal) UTF-8 decoder replaces
 * invalid bytes with U+FFFD instead of throwing, which would make the
 * Windows-1252 fallback unreachable and silently corrupt the file.
 */
export function decodeSubtitleText(bytes: Uint8Array): string {
  try {
    // ignoreBOM is optional per the WHATWG spec but required by the legacy
    // @cloudflare/workers-types declaration; false is the spec default.
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

/**
 * Normalizes a raw upstream payload into subtitle text: in-memory extraction for
 * .zip archives, inflation for .gz files, charset fallback for plain text.
 */
export function decodeSubtitleBuffer(uint8Array: Uint8Array): string {
  // ZIP magic bytes: 0x50, 0x4B, 0x03, 0x04 -> 'PK\x03\x04'
  const isZip =
    uint8Array.length > 4 &&
    uint8Array[0] === 0x50 &&
    uint8Array[1] === 0x4b &&
    uint8Array[2] === 0x03 &&
    uint8Array[3] === 0x04;

  // GZIP magic bytes: 0x1f, 0x8b
  const isGzip = uint8Array.length > 2 && uint8Array[0] === 0x1f && uint8Array[1] === 0x8b;

  if (isZip) {
    try {
      const unzipped = unzipSync(uint8Array);
      // Find the first .srt or .vtt file in the archive
      const subFilename = Object.keys(unzipped).find(
        (filename) =>
          filename.toLowerCase().endsWith(".srt") ||
          filename.toLowerCase().endsWith(".vtt")
      );

      if (subFilename && unzipped[subFilename]) {
        return decodeSubtitleText(unzipped[subFilename]);
      }

      // Fallback to first available file
      const firstFile = Object.keys(unzipped)[0];
      if (firstFile) {
        return decodeSubtitleText(unzipped[firstFile]);
      }
    } catch (err) {
      console.error("Failed to unzip subtitle archive, trying direct text decoding:", err);
    }
  } else if (isGzip) {
    try {
      return decodeSubtitleText(gunzipSync(uint8Array));
    } catch (err) {
      console.error("Failed to gunzip subtitle file, trying direct text decoding:", err);
    }
  }

  return decodeSubtitleText(uint8Array);
}

export async function fetchAndCleanSubtitle(
  targetUrl: string,
  cache?: Cache
): Promise<string> {
  const cacheKey = new Request(targetUrl);

  // Check cache if provided
  if (cache) {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return await cachedResponse.text();
    }
  }

  // Fetch upstream file
  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch subtitle file from source: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const rawSubtitleText = decodeSubtitleBuffer(uint8Array);

  // Clean ads from the subtitle
  const cleanedText = cleanSubtitleContent(rawSubtitleText);

  // Store in Cloudflare Cache (TTL: 24 hours)
  if (cache) {
    const cacheResponse = new Response(cleanedText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
    // Cloudflare Cache API requires PUT with Request/Response
    try {
      await cache.put(cacheKey, cacheResponse);
    } catch (cacheErr) {
      console.warn("Could not cache cleaned subtitle:", cacheErr);
    }
  }

  return cleanedText;
}
