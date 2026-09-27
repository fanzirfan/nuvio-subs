import { isAdCue } from "./patterns";

export interface SubtitleCue {
  id?: string;
  timecode: string;
  text: string;
}

/**
 * Parses raw SRT or WebVTT content, removes ad cues, re-indexes, and re-serializes as clean SRT
 */
export function cleanSubtitleContent(rawContent: string): string {
  // Normalize newline characters
  const normalized = rawContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Check if it's WebVTT format
  const isVtt = normalized.startsWith("WEBVTT");

  // Regex to match timestamp line in SRT (00:01:20,000 --> 00:01:23,000) or VTT (00:01:20.000 --> 00:01:23.000)
  const timecodeRegex = /(?:(\d{2}:)?\d{2}:\d{2}[,.]\d{3})\s*-->\s*(?:(\d{2}:)?\d{2}:\d{2}[,.]\d{3})/;

  // Split into blocks by double newlines
  const blocks = normalized.split(/\n\s*\n/);
  const cleanCues: SubtitleCue[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (isVtt && trimmed.startsWith("WEBVTT")) continue;
    if (trimmed.startsWith("NOTE")) continue; // VTT comment

    const lines = trimmed.split("\n");
    let timecodeLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (timecodeRegex.test(lines[i])) {
        timecodeLineIndex = i;
        break;
      }
    }

    // If no valid timecode found in this block, skip
    if (timecodeLineIndex === -1) continue;

    const timecode = lines[timecodeLineIndex].trim();
    // Subtitle text is all subsequent lines
    const textLines = lines.slice(timecodeLineIndex + 1);
    const text = textLines.join("\n").trim();

    if (!text) continue;

    // Check if the text matches any ad patterns
    if (isAdCue(text)) {
      // Ad detected! Drop this cue completely.
      continue;
    }

    // Format timestamp to standard SRT format with commas instead of periods if needed
    const srtTimecode = timecode.replace(/\./g, ",");

    cleanCues.push({
      timecode: srtTimecode,
      text,
    });
  }

  // Re-serialize into standard SRT format with sequential numbering (1, 2, 3, ...)
  return cleanCues
    .map((cue, index) => `${index + 1}\n${cue.timecode}\n${cue.text}\n`)
    .join("\n");
}
