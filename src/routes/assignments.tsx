import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, CheckCircle2, Circle, ClipboardList, Loader2, Menu, Search, X,
} from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { BottomNav } from "@/components/bottom-nav";
import { MarkdownView } from "@/components/markdown-view";
import { TOPICS, rawUrl, type Topic } from "@/lib/dsa-content";

const COMPLETED_KEY = "dsa-focus.assignments.completed";

function readCompleted(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(COMPLETED_KEY) || "{}"); }
  catch { return {}; }
}

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — DSA Focus" },
      { name: "description", content: "Practice assignments for the DSA Bootcamp." },
    ],
  }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const [active, setActive] = useState<Topic>(TOPICS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => { setCompleted(readCompleted()); }, []);
  useEffect(() => { setDrawerOpen(false); }, [active.id]);

  const filtered = useMemo(() => {
    if (!query.trim()) return TOPICS;
    const q = query.toLowerCase();
    return TOPICS.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["md", active.file],
    queryFn: async () => {
      const r = await fetch(rawUrl(active.file));
      if (!r.ok) throw new Error("Failed to load assignment");
      return r.text();
    },
    staleTime: 1000 * 60 * 60,
  });

  const isDone = !!completed[active.id];
  const doneCount = Object.values(completed).filter(Boolean).length;

  const toggle = () => {
    const next = { ...completed, [active.id]: !isDone };
    setCompleted(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 pb-28 md:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/85 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
            aria-label="Open assignments"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium">Assignments</span>
        </div>
        <AccountMenu />
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-72 shrink-0 overflow-y-auto border-r border-white/10 px-3 py-4 md:block">
          <Sidebar
            topics={filtered} active={active} onPick={setActive}
            query={query} setQuery={setQuery} completed={completed}
            doneCount={doneCount}
          />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto border-r border-white/10 bg-zinc-950 px-3 py-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-semibold">Assignments</span>
                <button onClick={() => setDrawerOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-zinc-400" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Sidebar
                topics={filtered} active={active} onPick={setActive}
                query={query} setQuery={setQuery} completed={completed}
                doneCount={doneCount}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                Assignment {String(active.number).padStart(2, "0")}
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{active.title}</h1>
            </div>
            <button
              onClick={toggle}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isDone
                  ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/20"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 text-zinc-950 hover:scale-[1.02]"
              }`}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              {isDone ? "Completed" : "Mark as Complete"}
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5 md:p-8">
            {isLoading && (
              <div className="grid place-items-center py-20">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
              </div>
            )}
            {error && (
              <p className="text-sm text-red-400">Couldn't load assignment. Check your connection and retry.</p>
            )}
            {data && <MarkdownView source={data} />}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function Sidebar({
  topics, active, onPick, query, setQuery, completed, doneCount,
}: {
  topics: Topic[]; active: Topic; onPick: (t: Topic) => void;
  query: string; setQuery: (v: string) => void;
  completed: Record<string, boolean>; doneCount: number;
}) {
  const pct = Math.round((doneCount / TOPICS.length) * 100);
  return (
    <>
      <div className="mb-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Completed</span>
          <span className="font-mono text-zinc-200">{doneCount}/{TOPICS.length}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assignments…"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-2 text-xs outline-none focus:border-cyan-500/50"
        />
      </div>
      <ul className="space-y-0.5">
        {topics.map((t) => {
          const isActive = t.id === active.id;
          const done = !!completed[t.id];
          return (
            <li key={t.id}>
              <button
                onClick={() => onPick(t)}
                className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-100 ring-1 ring-cyan-500/30"
                    : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                ) : (
                  <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                )}
                <span className="leading-snug">{t.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
