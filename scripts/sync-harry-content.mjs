#!/usr/bin/env node
/* eslint-disable */
// Sync CodeWithHarry playlists → src/lib/harry-metadata.generated.json
// Source of truth for topic mapping: CodeWithHarry curriculum architecture (Excel).
// Run with: YOUTUBE_API_KEY=... node scripts/sync-harry-content.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.YOUTUBE_API_KEY;
if (!KEY) { console.error("YOUTUBE_API_KEY missing"); process.exit(1); }

const PLAYLISTS = {
  java: "PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q",
  cpp:  "PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
  dsa:  "PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi",
};

// Curriculum topics — derived from CodeWithHarry_Complete_Curriculum_Architecture.xlsx
// Each topic owns an inclusive lecture-index range within its track's playlist.
const CURRICULUM = {
  java: [
    { id: "java-basics",     title: "Java Basics",         emoji: "☕", range: [1, 7] },
    { id: "java-strings",    title: "Strings",             emoji: "📝", range: [8, 15] },
    { id: "java-control",    title: "Conditionals & Loops",emoji: "🔁", range: [16, 25] },
    { id: "java-arrays",     title: "Arrays & Matrices",   emoji: "🗂️", range: [26, 30] },
    { id: "java-methods",    title: "Methods & Functions", emoji: "⚙️", range: [31, 35] },
    { id: "java-oop",        title: "OOP",                 emoji: "🎯", range: [36, 69] },
    { id: "java-advanced",   title: "Advanced Java",       emoji: "🚀", range: [70, 9999] },
  ],
  cpp: [
    { id: "cpp-basics",      title: "Basics & IO",         emoji: "⚡", range: [1, 8] },
    { id: "cpp-control",     title: "Conditionals & Loops",emoji: "🔁", range: [9, 10] },
    { id: "cpp-pointers",    title: "Pointers & Memory",   emoji: "🔗", range: [11, 12] },
    { id: "cpp-functions",   title: "Functions & Structs", emoji: "⚙️", range: [13, 20] },
    { id: "cpp-oop",         title: "OOP",                 emoji: "🎯", range: [21, 58] },
    { id: "cpp-advanced",    title: "Advanced C++ & STL",  emoji: "🧰", range: [59, 9999] },
  ],
  dsa: [
    { id: "dsa-intro",       title: "Introduction & Complexity", emoji: "📊", range: [1, 5] },
    { id: "dsa-arrays",      title: "Arrays & Searching",  emoji: "📦", range: [6, 12] },
    { id: "dsa-linked-list", title: "Linked Lists",        emoji: "⛓️", range: [13, 22] },
    { id: "dsa-stack-queue", title: "Stacks & Queues",     emoji: "🚶", range: [23, 40] },
    { id: "dsa-sorting",     title: "Sorting Algorithms",  emoji: "🔀", range: [41, 59] },
    { id: "dsa-trees",       title: "Trees, BST & Graphs", emoji: "🌳", range: [60, 84] },
    { id: "dsa-hashing",     title: "Hashing",             emoji: "🔷", range: [85, 9999] },
  ],
};

function classifyByIndex(track, idx) {
  const t = CURRICULUM[track].find((x) => idx >= x.range[0] && idx <= x.range[1]);
  return t ? t.id : CURRICULUM[track][CURRICULUM[track].length - 1].id;
}

async function fetchPlaylist(playlistId) {
  const out = [];
  let pageToken;
  for (let i = 0; i < 20; i++) {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("key", KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YT API ${res.status}: ${await res.text()}`);
    const j = await res.json();
    for (const it of j.items ?? []) {
      const sn = it.snippet;
      const vid = sn?.resourceId?.videoId;
      if (!vid) continue;
      if (sn.title === "Private video" || sn.title === "Deleted video") continue;
      out.push({
        videoId: vid,
        title: sn.title,
        description: sn.description ?? "",
        position: sn.position, // 0-based
      });
    }
    pageToken = j.nextPageToken;
    if (!pageToken) break;
  }
  // Sort by position to keep playlist order
  out.sort((a, b) => a.position - b.position);
  return out;
}

// Notes filter: keep only learning-related links.
const URL_RE = /https?:\/\/[^\s)>\]"]+/g;
const KEEP_HOSTS = [
  "codewithharry.com",
  "github.com",
  "drive.google.com",
  "docs.google.com",
  "notion.so",
  "leetcode.com",
  "geeksforgeeks.org",
  "hackerrank.com",
];
const DROP_HOSTS = [
  "instagram.com", "facebook.com", "twitter.com", "x.com",
  "discord.com", "discord.gg", "t.me", "telegram.me", "telegram.org",
  "youtube.com", "youtu.be", "linkedin.com", "tiktok.com",
  "amazon.in", "amazon.com", "amzn.to", "skillshare.com", "udemy.com",
  "patreon.com", "buymeacoffee.com", "bit.ly", "rb.gy", "spoti.fi",
];
const KEEP_LABEL = /\b(notes?|pdf|slides?|cheat\s*sheet|study\s*material|code|source|repo|repository|practice|exercise|assignment|solution|playlist\s*notes?)\b/i;

function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } }

function extractNotes(description) {
  const seen = new Set();
  const items = [];
  for (const rawLine of description.split("\n")) {
    const line = rawLine.trim();
    const urls = line.match(URL_RE);
    if (!urls) continue;
    for (const url of urls) {
      if (seen.has(url)) continue;
      seen.add(url);
      const h = host(url);
      if (!h) continue;
      if (DROP_HOSTS.some((d) => h === d || h.endsWith("." + d))) continue;
      const labelText = line.replace(URL_RE, "").replace(/[:\-–|•*👉▶➡️◆►◀🔥📌📝⭐]+/g, "").trim();
      const isKeepHost = KEEP_HOSTS.some((d) => h === d || h.endsWith("." + d));
      const isKeepLabel = KEEP_LABEL.test(labelText) || KEEP_LABEL.test(url);
      if (!isKeepHost && !isKeepLabel) continue;
      let label = labelText;
      if (!label) label = h;
      if (label.length > 80) label = label.slice(0, 77) + "…";
      items.push({ label, url });
    }
  }
  return items;
}

async function main() {
  const out = { generatedAt: new Date().toISOString(), tracks: {} };
  for (const [track, pid] of Object.entries(PLAYLISTS)) {
    console.log(`Fetching ${track}…`);
    const raw = await fetchPlaylist(pid);
    const lectures = raw.map((v, i) => {
      const idx = i + 1;
      const topicId = classifyByIndex(track, idx);
      return {
        id: `hw${track[0]}-${idx}`,
        index: idx,
        videoId: v.videoId,
        title: v.title,
        topicId,
        notes: extractNotes(v.description),
      };
    });
    const topics = CURRICULUM[track].map((t) => ({ id: t.id, title: t.title, emoji: t.emoji }));
    out.tracks[track] = { topics, lectures };
    console.log(`  → ${lectures.length} lectures, ${topics.length} topics`);
  }

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const file = resolve(__dirname, "..", "src", "lib", "harry-metadata.generated.json");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(out, null, 2));
  console.log("Wrote", file);

  // Report
  console.log("\n=== Curriculum Mapping Report ===");
  for (const [track, data] of Object.entries(out.tracks)) {
    const total = data.lectures.length;
    const perTopic = {};
    for (const l of data.lectures) perTopic[l.topicId] = (perTopic[l.topicId] ?? 0) + 1;
    const notesCount = data.lectures.reduce((a, l) => a + l.notes.length, 0);
    console.log(`${track}: ${total} lectures, ${notesCount} notes links`);
    for (const t of data.topics) console.log(`  ${t.title}: ${perTopic[t.id] ?? 0}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
