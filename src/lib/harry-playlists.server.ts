// Server-only helpers for fetching and classifying CodeWithHarry playlists.
// Imported only from .functions.ts files.

import {
  HARRY_PLAYLIST_IDS,
  YOUTUBE_API_ENV_VAR,
  classifyHarryLecture,
  type HarrySection,
  type HarryTrack,
  type HarryWing,
} from "./harry-config";

export type { HarryTrack } from "./harry-config";

export type RawVideo = {
  videoId: string;
  title: string;
  description: string;
};

export type ClassifiedLecture = {
  id: string;
  videoId: string;
  title: string;
  description: string;
  topicId: string;
  section: HarrySection;
  wing: HarryWing;
  duration: string;
};

let missingKeyWarningShown = false;

// ── Fetch all playlist items with pagination ─────────────────────────────────

export async function fetchPlaylistItems(playlistId: string): Promise<RawVideo[]> {
  const key = process.env[YOUTUBE_API_ENV_VAR];
  if (!key) {
    if (process.env.NODE_ENV === "development" && !missingKeyWarningShown) {
      console.warn(
        `[DSA Focus] ${YOUTUBE_API_ENV_VAR} is not set. Harry live playlist fetching is disabled; using static fallback content.`,
      );
      missingKeyWarningShown = true;
    }
    return [];
  }

  const out: RawVideo[] = [];
  let pageToken: string | undefined;

  for (let i = 0; i < 10; i++) {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("key", key);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString());
    if (!res.ok) break;
    const json = (await res.json()) as {
      items?: Array<{
        snippet: {
          title: string;
          description: string;
          resourceId: { videoId: string };
        };
      }>;
      nextPageToken?: string;
    };

    for (const item of json.items ?? []) {
      const vid = item.snippet?.resourceId?.videoId;
      if (!vid) continue;
      // Skip private/deleted placeholders
      if (item.snippet.title === "Private video" || item.snippet.title === "Deleted video") {
        continue;
      }
      out.push({
        videoId: vid,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
      });
    }

    pageToken = json.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}

// ── Topic classification by keyword regex ────────────────────────────────────

type Rule = { topicId: string; re: RegExp };

const JAVA_RULES: Rule[] = [
  { topicId: "java-strings",  re: /\bstring/i },
  { topicId: "java-arrays",   re: /\b(array|2d|multidimensional|intellij)\b/i },
  { topicId: "java-methods",  re: /\b(method|function|recursion|varargs|overload)/i },
  { topicId: "java-control",  re: /\b(if|else|switch|while|for\b|loop|break|continue|conditional|pattern)/i },
  { topicId: "java-advanced", re: /\b(inherit|polymorphism|override|super|exception|collection|multithread|abstract|interface|generic|file\b|stream|lambda)/i },
  { topicId: "java-oop",      re: /\b(oop|class|object|constructor|encapsulat|access modifier|this keyword|package)/i },
  { topicId: "java-vars",     re: /\b(variable|data type|literal|input|operator|expression|increment|decrement|associativity|practice set|exercise|chapter 1|chapter 2)/i },
  { topicId: "java-intro",    re: /\b(introduction|install|setup|jdk|hello world|first program|basic structure)/i },
];

const CPP_RULES: Rule[] = [
  { topicId: "cpp-pointers",  re: /\b(pointer|reference|memory|address|dynamic memory|new\b|delete\b)/i },
  { topicId: "cpp-arrays",    re: /\b(array|string)/i },
  { topicId: "cpp-functions", re: /\b(function|recursion)/i },
  { topicId: "cpp-control",   re: /\b(if|else|switch|while|for\b|loop|break|continue|conditional|pattern)/i },
  { topicId: "cpp-oop",       re: /\b(oop|class|object|constructor|inherit|polymorphism|stl|template|vector|map\b|set\b|encapsulat)/i },
  { topicId: "cpp-vars",      re: /\b(variable|data type|literal|input|output|cin|cout|operator|expression|increment|practice set|exercise)/i },
  { topicId: "cpp-intro",     re: /\b(introduction|install|setup|hello world|first program|basic|compiler)/i },
];

const DSA_RULES: Rule[] = [
  { topicId: "dsa-linked-list", re: /\b(linked\s*list|singly|doubly|circular list)/i },
  { topicId: "dsa-stack-queue", re: /\b(stack|queue|deque)/i },
  { topicId: "dsa-trees",       re: /\b(tree|bst|binary search tree|avl|trie?)/i },
  { topicId: "dsa-heaps",       re: /\b(heap|priority queue|hash(ing|map|set)?)/i },
  { topicId: "dsa-graphs",      re: /\b(graph|bfs|dfs|dijkstra|kruskal|prim|mst|topological)/i },
  { topicId: "dsa-dp",          re: /\b(dynamic programming|\bdp\b|memoization|tabulation)/i },
  { topicId: "dsa-sorting",     re: /\b(sort|sorting|bubble|merge sort|quick sort|insertion|selection)/i },
  { topicId: "dsa-strings",     re: /\b(string|kmp|rabin|pattern matching)/i },
  { topicId: "dsa-arrays",      re: /\b(array|search|binary search|linear search|two pointer|sliding window)/i },
  { topicId: "dsa-advanced",    re: /\b(segment tree|fenwick|greedy|backtrack|bit manipulation|advanced)/i },
  { topicId: "dsa-intro",       re: /\b(introduction|complexity|big[\s-]?o|time complex|space complex|asymptotic|notation)/i },
];

const RULES: Record<HarryTrack, Rule[]> = {
  java: JAVA_RULES,
  cpp: CPP_RULES,
  dsa: DSA_RULES,
};

const DEFAULT_TOPIC: Record<HarryTrack, string> = {
  java: "java-intro",
  cpp: "cpp-intro",
  dsa: "dsa-intro",
};

const ID_PREFIX: Record<HarryTrack, string> = {
  java: "hwj",
  cpp: "hwc",
  dsa: "hwd",
};

function classify(title: string, track: HarryTrack): string {
  for (const rule of RULES[track]) {
    if (rule.re.test(title)) return rule.topicId;
  }
  return DEFAULT_TOPIC[track];
}

export function classifyPlaylist(videos: RawVideo[], track: HarryTrack): ClassifiedLecture[] {
  return videos.map((v, i) => {
    const mapped = classifyHarryLecture(v.title, track);
    return {
      id: `${ID_PREFIX[track]}-${i + 1}`,
      videoId: v.videoId,
      title: v.title,
      description: v.description,
      topicId: mapped.topicId,
      section: mapped.section,
      wing: mapped.wing,
      duration: "",
    };
  });
}

// ── In-memory cache (per worker instance) ────────────────────────────────────

type CacheEntry = { at: number; data: ClassifiedLecture[] };
const cache = new Map<HarryTrack, CacheEntry>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h

export async function getHarryPlaylist(track: HarryTrack): Promise<ClassifiedLecture[]> {
  const cached = cache.get(track);
  if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;

  const raw = await fetchPlaylistItems(HARRY_PLAYLIST_IDS[track]);
  const classified = classifyPlaylist(raw, track);
  if (classified.length > 0) cache.set(track, { at: Date.now(), data: classified });
  return classified;
}
