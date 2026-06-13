import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, ExternalLink, BookOpen } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { getLecturesWithNotes, type HarryTrack } from "@/lib/harry-data";

export const Route = createFileRoute("/harry/notes")({
  head: () => ({
    meta: [
      { title: "Notes — CodeWithHarry · Focused" },
      { name: "description", content: "Curated notes, PDFs and study material for Java, C++ and DSA." },
    ],
  }),
  component: HarryNotesPage,
});

const TRACK_LABEL: Record<HarryTrack, string> = {
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
            Only study material (notes, PDFs, cheat sheets, source code) is shown.
            Social, promotional and affiliate links are filtered out.
          </p>
          <TrackNotes track="java" />
          <TrackNotes track="cpp" />
          <TrackNotes track="dsa" />
        </div>
      </main>
    </div>
  );
}

function TrackNotes({ track }: { track: HarryTrack }) {
  const lectures = getLecturesWithNotes(track);

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
        <BookOpen className="h-3.5 w-3.5" /> {TRACK_LABEL[track]}
        <span className="text-zinc-600 normal-case tracking-normal text-[10px]">
          · {lectures.length} lectures with notes
        </span>
      </h2>
      <div className="rounded-2xl border border-white/8 bg-zinc-900/40">
        {lectures.length === 0 ? (
          <p className="p-5 text-xs text-zinc-600">No study material found for this track.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {lectures.map((l) => (
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
                <div className="mt-2 space-y-1 pl-1">
                  {l.notes.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-300 hover:underline"
                    >
                      <FileText className="h-3 w-3 shrink-0" />
                      <span className="truncate">{r.label || r.url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
