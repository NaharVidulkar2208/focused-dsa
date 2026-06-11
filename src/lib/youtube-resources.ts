import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

// ── Server function (key stays server-side) ──────────────────────────────────

export const fetchVideoDescription = createServerFn({ method: "GET" })
  .inputValidator(z.object({ videoId: z.string() }))
  .handler(async ({ data }) => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return null;
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
