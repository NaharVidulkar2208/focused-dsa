import { useEffect, useState } from "react";
import {
  BookOpen, FileText, ClipboardList, Link2, RefreshCw, ExternalLink,
} from "lucide-react";
import type { CourseTheme } from "@/lib/course-theme";
import {
  fetchVideoDescription,
  parseDescription,
  getCachedResources,
  setCachedResources,
  clearCachedResources,
  type ParsedResources,
  type ParsedResource,
} from "@/lib/youtube-resources";

type Tab = "notes" | "assignments" | "links";

const TAB_ICONS: Record<Tab, React.ElementType> = {
  notes: FileText,
  assignments: ClipboardList,
  links: Link2,
};

const TAB_LABELS: Record<Tab, string> = {
  notes: "Notes",
  assignments: "Assignments",
  links: "Links",
};

interface Props {
  videoId: string;
  theme: CourseTheme;
  youtubeUrl?: string;
  channelUrl?: string;
}

export function LectureResources({ videoId, theme, youtubeUrl, channelUrl }: Props) {
  const [tab, setTab] = useState<Tab>("notes");
  const [resources, setResources] = useState<ParsedResources | null>(null);
  const [loading, setLoading] = useState(false);
  const isTodo = videoId === "TODO";

  async function load(force = false) {
    if (isTodo) return;
    if (!force) {
      const cached = getCachedResources(videoId);
      if (cached) { setResources(cached); return; }
    } else {
      clearCachedResources(videoId);
    }
    setLoading(true);
    try {
      const description = await fetchVideoDescription({ data: { videoId } });
      const parsed = parseDescription(description);
      setCachedResources(videoId, parsed);
      setResources(parsed);
    } catch {
      setResources(parseDescription(null));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setResources(null);
    load();
  }, [videoId]);

  const counts: Record<Tab, number> = {
    notes: resources?.notes.length ?? 0,
    assignments: resources?.assignments.length ?? 0,
    links: resources?.links.length ?? 0,
  };

  const items: ParsedResource[] =
    tab === "notes" ? (resources?.notes ?? [])
    : tab === "assignments" ? (resources?.assignments ?? [])
    : (resources?.links ?? []);

  return (
    <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <BookOpen className="h-3.5 w-3.5" /> Resources
        </div>
        {!isTodo && (
          <button
            onClick={() => load(true)}
            disabled={loading}
            title="Refresh from YouTube"
            className="grid h-6 w-6 place-items-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8">
        {(["notes", "assignments", "links"] as Tab[]).map((t) => {
          const Icon = TAB_ICONS[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px ${
                active
                  ? `border-current ${theme.resourceLink}`
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {TAB_LABELS[t]}
              {counts[t] > 0 && (
                <span className={`rounded px-1 py-0.5 text-[10px] leading-none tabular-nums ${
                  active ? "bg-white/10" : "bg-white/8 text-zinc-500"
                }`}>
                  {counts[t]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="p-4 min-h-[72px]">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Fetching from YouTube…
          </div>
        ) : isTodo ? (
          <p className="text-xs text-zinc-600">Resources will appear once the video ID is added.</p>
        ) : items.length === 0 && tab !== "links" ? (
          <p className="text-xs text-zinc-600">
            {resources === null
              ? "Loading…"
              : `No ${TAB_LABELS[tab].toLowerCase()} found in the video description.`}
          </p>
        ) : (
          <ul className="space-y-2">
            {/* Pinned YouTube links on the Links tab */}
            {tab === "links" && youtubeUrl && (
              <li>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition ${theme.resourceLink}`}
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" /> Watch on YouTube
                </a>
              </li>
            )}
            {tab === "links" && channelUrl && (
              <li>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" /> CodeWithHarry YouTube Channel
                </a>
              </li>
            )}
            {items.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm transition ${theme.resourceLink}`}
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{r.label}</span>
                </a>
              </li>
            ))}
            {tab === "links" && items.length === 0 && !youtubeUrl && !channelUrl && (
              <li className="text-xs text-zinc-600">No links found in the video description.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
