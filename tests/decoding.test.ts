import { describe, it, expect } from "bun:test";
import { gzipSync, zipSync } from "fflate";
import { decodeSubtitleBuffer, decodeSubtitleText } from "../src/cleaner/index";
import { renderConfigurePage } from "../src/views/configure";

const SRT_BODY = "1\n00:00:01,000 --> 00:00:04,000\nDialog yang harus tetap utuh\n";

/** SRT head whose cue text is raw Windows-1252 bytes (0x93/0x94 smart quotes). */
function cp1252Cue(text: string): Uint8Array {
  const head = Array.from(new TextEncoder().encode("1\n00:00:01,000 --> 00:00:04,000\n"));
  const body = text.split("").map((ch) => ch.charCodeAt(0));
  return new Uint8Array([...head, ...body]);
}

describe("decodeSubtitleText", () => {
  it("keeps valid UTF-8 intact", () => {
    const bytes = new TextEncoder().encode(SRT_BODY + "Kucing naïve ✓\n");
    expect(decodeSubtitleText(bytes)).toContain("Kucing naïve ✓");
  });

  it("falls back to Windows-1252 for legacy ANSI bytes", () => {
    const decoded = decodeSubtitleText(cp1252Cue("\u0093Hello\u0094"));
    expect(decoded).toContain("\u201CHello\u201D");
    expect(decoded).not.toContain("\uFFFD");
  });
});

describe("decodeSubtitleBuffer", () => {
  it("extracts the .srt member from a ZIP archive", () => {
    const zip = zipSync({ "subs/id.srt": new TextEncoder().encode(SRT_BODY) });
    expect(decodeSubtitleBuffer(zip)).toContain("Dialog yang harus tetap utuh");
  });

  it("inflates GZIP payloads instead of decoding them as text", () => {
    const gz = gzipSync(new TextEncoder().encode(SRT_BODY));
    expect(gz[0]).toBe(0x1f);
    expect(decodeSubtitleBuffer(gz)).toContain("Dialog yang harus tetap utuh");
  });

  it("inflates GZIP payloads carrying Windows-1252 text", () => {
    expect(decodeSubtitleBuffer(gzipSync(cp1252Cue("\u0093Gacor\u0094")))).toContain("\u201CGacor\u201D");
  });

  it("decodes plain text without archive magic bytes", () => {
    expect(decodeSubtitleBuffer(new TextEncoder().encode(SRT_BODY))).toContain("Dialog");
  });
});

describe("renderConfigurePage", () => {
  const injected = renderConfigurePage("https://nuvio.example", {
    languages: ["id", '"><svg onload=alert(1)>'],
    subdlApiKey: 'x" onfocus=alert(1) autofocus=""',
    openSubtitlesApiKey: "ok-key",
    subsourceToken: "",
    cleanAds: true,
  });

  it("escapes config values so they cannot break out of attribute quotes", () => {
    expect(injected).not.toContain('value="x" onfocus=alert(1)');
    expect(injected).toContain('value="x&quot; onfocus=alert(1) autofocus=&quot;&quot;');
  });

  it("escapes angle brackets coming from language codes", () => {
    expect(injected).not.toContain("<svg onload=alert(1)>");
    expect(injected).toContain("&lt;svg onload=alert(1)&gt;");
  });

  it("renders default values when no config is supplied", () => {
    expect(renderConfigurePage("https://nuvio.example")).toContain('value="id,en"');
  });
});
