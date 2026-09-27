import { Hono } from "hono";
import { cors } from "hono/cors";
import { Bindings, StremioManifest, UserConfig } from "./types";
import { parseConfig } from "./config";
import { aggregateSubtitles, debugProviders } from "./providers";
import { fetchAndCleanSubtitle } from "./cleaner";
import { renderConfigurePage } from "./views/configure";

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for all routes (Stremio and Nuvio require this)
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Range", "User-Agent"],
  })
);

function getManifest(configurable: boolean = true): StremioManifest {
  return {
    id: "community.nuviosubs.cleaner",
    version: "1.0.0",
    name: "Nuvio Subs (Zero Ads)",
    description: "Personalized multi-provider subtitle plugin with on-the-fly ad blocker & cleaner (SubDL, OpenSubtitles, Subsource).",
    logo: "https://raw.githubusercontent.com/stremio/stremio-addon-sdk/master/docs/logo.png",
    resources: ["subtitles"],
    types: ["movie", "series"],
    catalogs: [],
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
}

// Redirect root to configuration page
app.get("/", (c) => {
  return c.redirect("/configure");
});

// Configuration Web Page
app.get("/configure", (c) => {
  const origin = new URL(c.req.url).origin;
  const html = renderConfigurePage(origin);
  return c.html(html);
});

// Default Manifest
app.get("/manifest.json", (c) => {
  return c.json(getManifest());
});

// Configured Manifest
app.get("/:config/manifest.json", (c) => {
  return c.json(getManifest());
});

// Debug endpoint handler
async function handleDebug(c: any, configParam?: string) {
  const imdbId = c.req.query("id") || "tt1375666"; // Inception as default test
  const type = c.req.query("type") || "movie";

  // Support config from URL path, query params, or worker env
  const userConfig: UserConfig = parseConfig(configParam, c.env);
  if (c.req.query("subdl_key")) userConfig.subdlApiKey = c.req.query("subdl_key");
  if (c.req.query("os_key")) userConfig.openSubtitlesApiKey = c.req.query("os_key");
  if (c.req.query("subsource_key")) userConfig.subsourceToken = c.req.query("subsource_key");
  if (c.req.query("langs")) {
    userConfig.languages = c.req.query("langs").split(",").map((l: string) => l.trim().toLowerCase()).filter(Boolean);
  }

  const debugResult = await debugProviders(imdbId, type, userConfig);
  return c.json(debugResult, 200, {
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  });
}

app.get("/debug", (c) => handleDebug(c));
app.get("/:config/debug", (c) => handleDebug(c, c.req.param("config")));

// Subtitles endpoint handler
async function handleSubtitles(c: any, configParam?: string) {
  const type = c.req.param("type");
  const rawId = c.req.param("id"); // e.g. "tt1234567.json" or "tt1234567:1:2.json"
  
  const id = rawId.replace(/\.json$/, "");
  const parts = id.split(":");
  const imdbId = parts[0];
  const season = parts[1] ? parseInt(parts[1], 10) : undefined;
  const episode = parts[2] ? parseInt(parts[2], 10) : undefined;

  const userConfig = parseConfig(configParam, c.env);
  const origin = new URL(c.req.url).origin;

  try {
    const subtitles = await aggregateSubtitles(
      imdbId,
      type,
      season,
      episode,
      userConfig,
      origin
    );

    return c.json(
      { subtitles },
      200,
      {
        "Cache-Control": "public, max-age=3600", // cache search result for 1 hour
      }
    );
  } catch (err: any) {
    console.error("Subtitle resolution error:", err);
    return c.json({ subtitles: [] });
  }
}

// Subtitles routes
app.get("/subtitles/:type/:id", (c) => handleSubtitles(c));
app.get("/:config/subtitles/:type/:id", (c) => handleSubtitles(c, c.req.param("config")));

// On-the-fly Ad Cleaner Proxy endpoint
app.get("/clean-sub", async (c) => {
  const url = c.req.query("url");
  const osFileId = c.req.query("os_file_id");
  const osApiKey = c.req.query("os_api_key");
  const subName = c.req.query("name") || "subtitle";

  try {
    let downloadUrl = url;

    // Handle OpenSubtitles download API
    if (osFileId && osApiKey) {
      const osRes = await fetch("https://api.opensubtitles.com/api/v1/download", {
        method: "POST",
        headers: {
          "Api-Key": osApiKey,
          "User-Agent": "NuvioSubs v1.0.0",
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ file_id: parseInt(osFileId, 10) }),
      });

      if (osRes.ok) {
        const osData = (await osRes.json()) as any;
        if (osData?.link) {
          downloadUrl = osData.link;
        }
      }
    }

    if (!downloadUrl) {
      return c.text("Missing or invalid subtitle source URL", 400);
    }

    // Access Cloudflare default cache
    let cfCache: Cache | undefined;
    try {
      // @ts-ignore
      cfCache = typeof caches !== "undefined" ? caches.default : undefined;
    } catch {
      // no-op if caches is not available in local test
    }

    const cleanSrt = await fetchAndCleanSubtitle(downloadUrl, cfCache);

    return new Response(cleanSrt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `inline; filename="${encodeURIComponent(subName)}.srt"`,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Clean sub proxy error:", err);
    return c.text(`Error processing subtitle: ${err?.message || err}`, 500);
  }
});

export default app;
