import { unzipSync, strFromU8 } from "fflate";
import { cleanSubtitleContent } from "./srtParser";

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

  let rawSubtitleText = "";

  // Check if buffer is a ZIP file (Magic bytes: 0x50, 0x4B, 0x03, 0x04 -> 'PK\x03\x04')
  const isZip =
    uint8Array.length > 4 &&
    uint8Array[0] === 0x50 &&
    uint8Array[1] === 0x4b &&
    uint8Array[2] === 0x03 &&
    uint8Array[3] === 0x04;

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
        rawSubtitleText = strFromU8(unzipped[subFilename]);
      } else {
        // Fallback to first available file
        const firstFile = Object.keys(unzipped)[0];
        if (firstFile) {
          rawSubtitleText = strFromU8(unzipped[firstFile]);
        }
      }
    } catch (err) {
      console.error("Failed to unzip subtitle archive, trying direct text decoding:", err);
      rawSubtitleText = new TextDecoder("utf-8").decode(uint8Array);
    }
  } else {
    // Standard text decode
    try {
      rawSubtitleText = new TextDecoder("utf-8").decode(uint8Array);
    } catch {
      // Fallback windows-1252 or iso-8859-1 if utf-8 fails
      rawSubtitleText = new TextDecoder("windows-1252").decode(uint8Array);
    }
  }

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
