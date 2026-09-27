import { cleanSubtitleContent } from "../src/cleaner/srtParser";

const sampleDirtySrt = `1
00:00:01,000 --> 00:00:04,000
Downloaded from SubDL.com - Free Subtitles

2
00:00:05,000 --> 00:00:08,000
Daftar situs slot gacor hari ini di WWW.SLOT88GACOR.COM pasti maxwin

3
00:00:10,000 --> 00:00:13,500
Hello detective, we found the suspect in the alley.

4
00:00:14,000 --> 00:00:17,000
1XBET BETTING COMPANY - BEST ODDS ONLINE

5
00:00:18,000 --> 00:00:22,000
He was carrying a black backpack and heading towards the subway.

6
00:00:23,000 --> 00:00:26,000
Join our telegram channel: t.me/filmgratisan_sub

7
00:00:27,000 --> 00:00:30,000
Understood, initiate the perimeter lockdown immediately.

8
00:01:50,000 --> 00:01:55,000
Diterjemahkan oleh Pein Akatsuki & LebahGanteng
`;

console.log("=== ORIGINAL SUBTITLE ===");
console.log(sampleDirtySrt);

const cleaned = cleanSubtitleContent(sampleDirtySrt);

console.log("=== CLEANED SUBTITLE ===");
console.log(cleaned);

// Validations
const hasSubdlAd = cleaned.includes("SubDL.com");
const hasSlotAd = cleaned.includes("SLOT88GACOR");
const has1xbetAd = cleaned.includes("1XBET");
const hasTelegramAd = cleaned.includes("t.me/filmgratisan_sub");
const hasTranslatorAd = cleaned.includes("Pein Akatsuki");
const hasDialog1 = cleaned.includes("Hello detective, we found the suspect in the alley.");
const hasDialog2 = cleaned.includes("He was carrying a black backpack and heading towards the subway.");
const hasDialog3 = cleaned.includes("Understood, initiate the perimeter lockdown immediately.");

if (
  !hasSubdlAd &&
  !hasSlotAd &&
  !has1xbetAd &&
  !hasTelegramAd &&
  !hasTranslatorAd &&
  hasDialog1 &&
  hasDialog2 &&
  hasDialog3
) {
  console.log("✅ ALL TESTS PASSED: All spam/ads removed and all dialogue intact!");
} else {
  console.error("❌ TEST FAILED: Ad leakage or dialogue missing!");
  process.exit(1);
}
