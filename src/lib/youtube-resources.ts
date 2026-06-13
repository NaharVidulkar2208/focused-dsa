import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════════════════════
// YOUTUBE API KEY CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// This service fetches video metadata (descriptions) from YouTube Data API v3.
//
// Environment variable required:
//   YOUTUBE_API_KEY  –  a Google Cloud API key with YouTube Data API enabled
//
// How to obtain a key:
//   1. Visit https://console.cloud.google.com/
//   2. Create or select a project
//   3. Enable "YouTube Data API v3" in the API Library
//   4. Go to Credentials → Create credentials → API key
//   5. Set the key in your .env file (see .env.example for the template)
//
// SECURITY NOTICE:
//   • Do NOT commit real API keys to GitHub.
//   • The key is read server-side ONLY (process.env.YOUTUBE_API_KEY).
//   • It never reaches the browser bundle.
//   • .env files are already in .gitignore.
//
// GRACEFUL DEGRADATION:
//   If the key is missing the app will:
//   • Log a single warning in development (never in production)
//   • Return null so callers fall back to cached / static content
//   • Continue serving Harry / Apna / other courses without crashing
// ═══════════════════════════════════════════════════════════════════════════════

export type ParsedResource = {
  label: string;
  url: string;
  type: "notes" | "assignment" | "code" | "link";
};

export type ParsedResources = {
  notes: ParsedResource[];
  assignments: ParsedResource[];
  links: ParsedResource[];
  fetchedAt: number;
};

let devWarningShown = false;

// ── Server function (key stays server-side) ──────────────────────────────────

export const fetchVideoDescription = createServerFn({ method: "GET" })
  .inputValidator(z.object({ videoId: z.string() }))
  .handler(async ({ data }) => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) {
      if (process.env.NODE_ENV === "development" && !devWarningShown) {
        // eslint-disable-next-line no-console
        console.warn(
          "[Focused] YOUTUBE_API_KEY is not set. " +
            "Video description fetching is disabled. " +
            "The app will use cached / static content instead. " +
            "See .env.example for setup instructions."
        );
        devWarningShown = true;
      }
      return null;
    }
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${data.videoId}&key=${key}`,
      );
      const json = await res.json() as Record<string, unknown>;
      const items = json.items as Array<{ snippet: { description: string } }> | undefined;
      return items?.[0]?.snippet?.description ?? null;
    } catch {
      return null;
    }
  });

// ── Parsing ──────────────────────────────────────────────────────────────────

const NOTES_RE = /\b(notes?|pdf|slides?|lecture\s*notes?|study\s*material)\b/i;
const ASSIGN_RE = /\b(assignment|exercise|practice\s*set|homework|task|quiz)\b/i;
const CODE_RE = /\b(source\s*code|github\.com|github|repo)\b/i;

function classifyLine(line: string): ParsedResource["type"] {
  if (NOTES_RE.test(line)) return "notes";
  if (ASSIGN_RE.test(line)) return "assignment";
  if (CODE_RE.test(line)) return "code";
  return "link";
}

export function parseDescription(description: string | null): ParsedResources {
  if (!description) {
    return { notes: [], assignments: [], links: [], fetchedAt: Date.now() };
  }

  const notes: ParsedResource[] = [];
  const assignments: ParsedResource[] = [];
  const links: ParsedResource[] = [];
  const seen = new Set<string>();

  const urlRe = /https?:\/\/[^\s)>\]"]+/g;

  for (const line of description.split("\n")) {
    const urls = line.match(urlRe);
    if (!urls) continue;
    for (const url of urls) {
      if (seen.has(url)) continue;
      seen.add(url);

      const rawLabel = line.replace(urlRe, "").replace(/[:\-–|•*]+/g, "").trim();
      let label = rawLabel;
      if (!label) {
        try { label = new URL(url).hostname; } catch { label = url; }
      }

      const type = classifyLine(line);
      const resource: ParsedResource = { label, url, type };

      if (type === "notes") notes.push(resource);
      else if (type === "assignment") assignments.push(resource);
      else links.push(resource);
    }
  }

  return { notes, assignments, links, fetchedAt: Date.now() };
}

// ── localStorage cache ───────────────────────────────────────────────────────

const CACHE_PREFIX = "yt-res-v1-";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCachedResources(videoId: string): ParsedResources | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + videoId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ParsedResources;
    if (Date.now() - parsed.fetchedAt > TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + videoId);
      return null;
    }
    return parsed;
  } catch { return null; }
}

export function setCachedResources(videoId: string, data: ParsedResources) {
  try { localStorage.setItem(CACHE_PREFIX + videoId, JSON.stringify(data)); } catch {}
}

export function clearCachedResources(videoId: string) {
  try { localStorage.removeItem(CACHE_PREFIX + videoId); } catch {}
}
