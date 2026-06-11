import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, ClipboardList, Link2, ExternalLink, BookOpen } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { fetchHarryNotesIndex } from "@/lib/harry-playlists.functions";

export const Route = createFileRoute("/harry/notes")({
  head: () => ({
    meta: [
      { title: "Notes — CodeWithHarry · DSA Focus" },
      { name: "description", content: "Notes, assignments and resources for CodeWithHarry's Java, C++ and DSA tracks." },
    ],
  }),
  component: HarryNotesPage,
});

type Track = "java" | "cpp" | "dsa";
const TRACK_LABEL: Record<Track, string> = {
  java: "Java Notes",
  cpp: "C++ Notes",
  dsa: "DSA Notes",
};

function HarryNotesPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-zinc-950/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/harry" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">CodeWithHarry</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-semibold text-zinc-100">Notes & Resources</span>
        </div>
        <AccountMenu />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-8">
          <p className="text-xs text-zinc-500">
            Notes, assignments and resources are extracted from each lecture's YouTube description.
            Separated by track.
          </p>
          <TrackNotes track="java" />
          <TrackNotes track="cpp" />
          <TrackNotes track="dsa" />
        </div>
      </main>
    </div>
  );
}

function TrackNotes({ track }: { track: Track }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["harry-notes", track],
    queryFn: () => fetchHarryNotesIndex({ data: { track } }),
    staleTime: 6 * 60 * 60 * 1000,
  });

  const lectures = data ?? [];
  const withResources = lectures.filter(
    (l) => l.notes.length + l.assignments.length + l.links.length > 0,
  );

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        <BookOpen className="h-3.5 w-3.5" /> {TRACK_LABEL[track]}
      </h2>
      <div className="rounded-2xl border border-white/8 bg-zinc-900/40">
        {isLoading ? (
          <p className="p-5 text-xs text-zinc-500">Loading from YouTube…</p>
        ) : error ? (
          <p className="p-5 text-xs text-zinc-500">Could not load resources (YouTube API unavailable).</p>
        ) : withResources.length === 0 ? (
          <p className="p-5 text-xs text-zinc-600">
            No resources found in lecture descriptions for this track.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {withResources.map((l) => (
              <li key={l.id} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-zinc-200 line-clamp-1">{l.title}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${l.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Open ↗
                  </a>
                </div>
                <ResourceList icon={FileText} label="Notes" items={l.notes} accent="text-blue-300" />
                <ResourceList icon={ClipboardList} label="Assignments" items={l.assignments} accent="text-amber-300" />
                <ResourceList icon={Link2} label="Links" items={l.links} accent="text-zinc-300" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ResourceList({
  icon: Icon,
  label,
  items,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  items: { label: string; url: string }[];
  accent: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <ul className="space-y-1 pl-4">
        {items.map((r, i) => (
          <li key={i}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs ${accent} hover:underline`}
            >
              <ExternalLink className="h-3 w-3 shrink-0" />
              <span className="truncate">{r.label || r.url}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
