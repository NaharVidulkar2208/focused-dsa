// Static topic index for DSA Bootcamp. Files exist at:
//   https://raw.githubusercontent.com/kunal-kushwaha/DSA-Bootcamp-Java/main/assignments/<file>
// We don't query GitHub API at runtime — just fetch raw markdown.
export type Topic = {
  id: string;       // slug used in URL + localStorage key
  file: string;     // raw filename in the repo
  title: string;    // human title
  number: number;
};

const RAW_ASSIGN_BASE =
  "https://raw.githubusercontent.com/kunal-kushwaha/DSA-Bootcamp-Java/main/assignments";
const LECTURE_HTML_BASE =
  "https://github.com/kunal-kushwaha/DSA-Bootcamp-Java/tree/main/lectures";

export const SYLLABUS_URL =
  "https://raw.githubusercontent.com/kunal-kushwaha/DSA-Bootcamp-Java/main/SYLLABUS.md";

const FILES = [
  "01-flow-of-program.md",
  "02-first-java.md",
  "03-conditionals-loops.md",
  "04-functions.md",
  "05-arrays.md",
  "06-searching.md",
  "07-sorting.md",
  "08-strings.md",
  "09-patterns.md",
  "10-recursion.md",
  "11-bitwise.md",
  "12-math.md",
  "13-complexities.md",
  "14-oop.md",
  "15-linkedlist.md",
  "16-stack-queue.md",
  "17-trees.md",
  "18-heaps.md",
];

// Map topic → matching lecture folder slug for the PDF notes
const LECTURE_FOLDERS: Record<string, string> = {
  "01-flow-of-program": "03-flow of program",
  "02-first-java": "05-first-java-program",
  "03-conditionals-loops": "06-conditions-loops",
  "04-functions": "07-methods",
  "05-arrays": "08-arrays",
  "06-searching": "10-binary search",
  "07-sorting": "11-sorting",
  "08-strings": "12-strings",
  "09-patterns": "13-patterns",
  "10-recursion": "14-recursion",
  "11-bitwise": "16-math",
  "12-math": "16-math",
  "13-complexities": "15-complexity",
  "14-oop": "17-oop",
  "15-linkedlist": "18-linkedlist",
  "16-stack-queue": "19-stacks-n-queues",
  "17-trees": "20-trees",
  "18-heaps": "24-heaps",
};

function toTitle(slug: string): string {
  return slug
    .replace(/\.md$/, "")
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export const TOPICS: Topic[] = FILES.map((file, i) => {
  const id = file.replace(/\.md$/, "");
  return { id, file, title: toTitle(file), number: i + 1 };
});

export function rawUrl(file: string) {
  return `${RAW_ASSIGN_BASE}/${file}`;
}

export function lectureFolderUrl(id: string): string | null {
  const f = LECTURE_FOLDERS[id];
  return f ? `${LECTURE_HTML_BASE}/${encodeURIComponent(f)}` : null;
}

// ---------------------------------------------------------------------------
// GitHub API helpers for per-topic lecture files
// ---------------------------------------------------------------------------

const GITHUB_API_BASE =
  "https://api.github.com/repos/kunal-kushwaha/DSA-Bootcamp-Java/contents";

export type RepoFile = {
  name: string;
  type: "file" | "dir";
  download_url: string | null;
  html_url: string;
  path: string;
};

export type FileKind = "pdf" | "md" | "txt" | "img" | "other";

const SUPPORTED_EXTS = [".pdf", ".md", ".txt", ".png", ".jpg", ".jpeg", ".gif", ".webp"];

export function isSupportedFile(name: string): boolean {
  const lower = name.toLowerCase();
  return SUPPORTED_EXTS.some((ext) => lower.endsWith(ext));
}

export function fileKind(name: string): FileKind {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".md")) return "md";
  if (lower.endsWith(".txt")) return "txt";
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].some((e) => lower.endsWith(e))) return "img";
  return "other";
}

/** Returns GitHub API URL for a topic's lecture folder, or null if no mapping. */
export function lectureApiUrl(id: string): string | null {
  const f = LECTURE_FOLDERS[id];
  return f ? `${GITHUB_API_BASE}/lectures/${encodeURIComponent(f)}` : null;
}

/** Fetches all supported files for a topic, including one level of subdirectories. */
export async function fetchTopicFiles(id: string): Promise<RepoFile[]> {
  const url = lectureApiUrl(id);
  if (!url) return [];

  const r = await fetch(url, { headers: { Accept: "application/vnd.github.v3+json" } });
  if (!r.ok) return [];

  const items: RepoFile[] = await r.json();
  if (!Array.isArray(items)) return [];

  const files = items.filter((i) => i.type === "file" && isSupportedFile(i.name));

  // Recurse into subdirectories (e.g. lectures/17-oop/notes/)
  const subdirs = items.filter((i) => i.type === "dir");
  for (const dir of subdirs.slice(0, 3)) {
    const sr = await fetch(`${GITHUB_API_BASE}/${dir.path}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!sr.ok) continue;
    const subitems: RepoFile[] = await sr.json();
    if (Array.isArray(subitems)) {
      files.push(...subitems.filter((i) => i.type === "file" && isSupportedFile(i.name)));
    }
  }

  return files;
}

// ---------------------------------------------------------------------------
// Per-topic syllabus filtering
// ---------------------------------------------------------------------------

// Each value is an ordered list of substrings to search for (first match wins).
// Strings are matched case-insensitively against each line of the markdown.
const TOPIC_SYLLABUS_KEYWORDS: Record<string, string[]> = {
  "01-flow-of-program":    ["flow of the program"],
  "02-first-java":         ["introduction to java"],
  "03-conditionals-loops": ["conditionals & loops in java"],
  "04-functions":          ["[functions]"],
  "05-arrays":             ["[arrays]"],
  "06-searching":          ["    - searching"],
  "07-sorting":            ["    - sorting"],
  "08-strings":            ["[strings]"],
  "09-patterns":           ["pattern questions"],
  "10-recursion":          ["[recursion]"],
  "11-bitwise":            ["maths for dsa"],
  "12-math":               ["maths for dsa"],
  "13-complexities":       ["space and time complexity"],
  "14-oop":                ["object oriented programming"],
  "15-linkedlist":         ["linked list"],
  "16-stack-queue":        ["stacks & queues"],
  "17-trees":              ["[trees]"],
  "18-heaps":              ["- heaps"],
};

/**
 * Extract the section of the SYLLABUS.md that corresponds to `topicId`.
 * Returns the matched line plus all deeper-indented lines that follow it,
 * stopping at the next line with equal or lower indentation.
 * Falls back to the full markdown if no keyword matches.
 */
export function filterSyllabusForTopic(markdown: string, topicId: string): string {
  const keywords = TOPIC_SYLLABUS_KEYWORDS[topicId];
  if (!keywords?.length) return markdown;

  const lines = markdown.split("\n");

  let startLine = -1;
  let startIndent = 0;

  outer: for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const lower = line.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        startLine = i;
        startIndent = line.search(/\S/);
        break outer;
      }
    }
  }

  if (startLine === -1) return markdown;

  // Collect this line + all children (deeper indent) until same-or-lower indent
  let endLine = lines.length;
  for (let i = startLine + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.search(/\S/) <= startIndent) {
      endLine = i;
      break;
    }
  }

  return lines.slice(startLine, endLine).join("\n").trim();
}
