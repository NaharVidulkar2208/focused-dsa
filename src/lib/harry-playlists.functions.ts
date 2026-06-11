import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getHarryPlaylist, type HarryTrack } from "./harry-playlists.server";

export const fetchHarryPlaylist = createServerFn({ method: "GET" })
  .inputValidator(z.object({ track: z.enum(["java", "cpp", "dsa"]) }))
  .handler(async ({ data }) => {
    const lectures = await getHarryPlaylist(data.track as HarryTrack);
    // Strip descriptions from list payload to keep it small;
    // descriptions are fetched per-video via fetchVideoDescription.
    return lectures.map(({ description: _d, ...rest }) => rest);
  });

export const fetchHarryNotesIndex = createServerFn({ method: "GET" })
  .inputValidator(z.object({ track: z.enum(["java", "cpp", "dsa"]) }))
  .handler(async ({ data }) => {
    const lectures = await getHarryPlaylist(data.track as HarryTrack);
    // Extract URLs from each description; classify per line.
    const urlRe = /https?:\/\/[^\s)>\]"]+/g;
    const NOTES_RE = /\b(notes?|pdf|slides?|study\s*material)\b/i;
    const ASSIGN_RE = /\b(assignment|exercise|practice\s*set|homework|quiz)\b/i;

    return lectures.map((l) => {
      const notes: { label: string; url: string }[] = [];
      const assignments: { label: string; url: string }[] = [];
      const links: { label: string; url: string }[] = [];
      const seen = new Set<string>();
      for (const line of (l.description ?? "").split("\n")) {
        const urls = line.match(urlRe);
        if (!urls) continue;
        for (const url of urls) {
          if (seen.has(url)) continue;
          seen.add(url);
          let label = line.replace(urlRe, "").replace(/[:\-–|•*]+/g, "").trim();
          if (!label) {
            try { label = new URL(url).hostname; } catch { label = url; }
          }
          const bucket = NOTES_RE.test(line) ? notes : ASSIGN_RE.test(line) ? assignments : links;
          bucket.push({ label, url });
        }
      }
      return {
        id: l.id,
        videoId: l.videoId,
        title: l.title,
        topicId: l.topicId,
        notes,
        assignments,
        links,
      };
    });
  });
