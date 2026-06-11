import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, PlayCircle, BookOpen, ChevronRight, CheckCircle2, Layers } from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import {
  HARRY_JAVA_LECTURES, HARRY_CPP_LECTURES, HARRY_DSA_LECTURES,
  HARRY_JAVA_TOPICS, HARRY_CPP_TOPICS, HARRY_DSA_TOPICS,
  HARRY_JAVA_PROGRESS_KEY, HARRY_CPP_PROGRESS_KEY, HARRY_DSA_PROGRESS_KEY,
} from "@/lib/harry-content";

export const Route = createFileRoute("/harry")({
  head: () => ({
    meta: [
      { title: "CodeWithHarry · DSA Focus" },
      { name: "description", content: "CodeWithHarry's Java, C++ and DSA tracks — all in one place." },
    ],
  }),
  component: HarryHome,
});

function readCount(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]).length : 0;
  } catch { return 0; }
}

function HarryHome() {
  const [javaDone, setJavaDone] = useState(0);
  const [cppDone, setCppDone] = useState(0);
  const [dsaDone, setDsaDone] = useState(0);

  useEffect(() => {
    setJavaDone(readCount(HARRY_JAVA_PROGRESS_KEY));
    setCppDone(readCount(HARRY_CPP_PROGRESS_KEY));
    setDsaDone(readCount(HARRY_DSA_PROGRESS_KEY));
  }, []);

  const javaLastId = (() => { try { return localStorage.getItem(HARRY_JAVA_PROGRESS_KEY.replace("progress", "last")); } catch { return null; } })();
  const dsaLastId = (() => { try { return localStorage.getItem(HARRY_DSA_PROGRESS_KEY.replace("progress", "last")); } catch { return null; } })();

  const totalAll = HARRY_JAVA_LECTURES.length + HARRY_CPP_LECTURES.length + HARRY_DSA_LECTURES.length;
  const doneAll = javaDone + cppDone + dsaDone;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-zinc-950/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-sm font-semibold text-zinc-100">CodeWithHarry</span>
        </div>
        <AccountMenu />
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* ── Hero banner ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/assets/harry-banner.png"
              alt=""
              className="h-full w-full object-cover object-center opacity-25"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/60 via-zinc-950/80 to-zinc-950" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 py-10 sm:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              CodeWithHarry
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Master Java, C++ & DSA
            </h1>
            <p className="mt-2 text-sm text-zinc-400 max-w-md">
              Industry-grade programming courses by Harry — from basics to advanced data structures and algorithms.
            </p>

            {/* Stats row */}
            <div className="mt-6 flex flex-wrap gap-4 text-[12px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5 text-zinc-400" />
                <span>{totalAll} lectures total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-zinc-400" />
                <span>
                  {HARRY_JAVA_TOPICS.length + HARRY_CPP_TOPICS.length + HARRY_DSA_TOPICS.length} topics
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{doneAll} completed</span>
              </div>
            </div>

            {/* Overall progress bar */}
            {doneAll > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-zinc-300 transition-all"
                    style={{ width: `${Math.round((doneAll / totalAll) * 100)}%` }}
                  />
                </div>
                <span className="text-[11px] text-zinc-500">{Math.round((doneAll / totalAll) * 100)}% across all tracks</span>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-16">
          {/* ── Choose Track ───────────────────────────────────────── */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Language Tracks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TrackCard
                href="/harry/java"
                accent="amber"
                label="Java + DSA"
                tagline="Complete Java from scratch to OOP, Collections, and DSA integration."
                topics={HARRY_JAVA_TOPICS.length}
                total={HARRY_JAVA_LECTURES.length}
                done={javaDone}
                lastId={javaLastId}
                resumeTo="/harry/java"
                what={["Variables, types & control flow", "OOP — classes, inheritance", "Arrays, methods & recursion", "DSA integration"]}
              />
              <TrackCard
                href="/harry/cpp"
                accent="orange"
                label="C++ + DSA"
                tagline="Master C++ from basics through pointers, OOP, and the STL."
                topics={HARRY_CPP_TOPICS.length}
                total={HARRY_CPP_LECTURES.length}
                done={cppDone}
                lastId={null}
                resumeTo="/harry/cpp"
                what={["Variables, operators & I/O", "Conditions, loops & patterns", "Pointers & memory model", "OOP in C++ + STL"]}
              />
            </div>
          </section>

          {/* ── Shared DSA ─────────────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              Shared DSA Track
            </h2>
            <TrackCard
              href="/harry/dsa"
              accent="emerald"
              label="Data Structures & Algorithms"
              tagline="Language-agnostic DSA — sorting, trees, graphs, heaps, dynamic programming and more."
              topics={HARRY_DSA_TOPICS.length}
              total={HARRY_DSA_LECTURES.length}
              done={dsaDone}
              lastId={dsaLastId}
              resumeTo="/harry/dsa"
              wide
              what={["Complexity analysis", "Sorting & searching", "Trees, Graphs & Heaps", "DP & advanced topics"]}
            />
          </section>

          {/* ── Notes & Assignments ────────────────────────────────── */}
          <section className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
              Notes & Assignments
            </h2>
            <Link
              to="/harry/notes"
              className="block rounded-2xl border border-white/8 bg-zinc-900/40 p-5 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:border-white/15 transition"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 shrink-0 text-blue-300" />
                <div className="flex-1">
                  <div className="font-medium text-zinc-100">Notes, PDFs & Assignment links</div>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Auto-extracted from lecture descriptions — Java, C++ and DSA, fully separated.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

const TRACK_STYLES = {
  amber: {
    glow: "from-amber-500/20 to-orange-500/10",
    glowDot: "bg-amber-500/30",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
    bar: "from-amber-400 to-orange-400",
    resumeBtn: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30 hover:bg-amber-500/25",
    checkColor: "text-amber-400",
  },
  orange: {
    glow: "from-orange-500/20 to-red-500/10",
    glowDot: "bg-orange-500/30",
    badge: "bg-orange-500/15 text-orange-300 ring-orange-500/25",
    bar: "from-orange-400 to-red-400",
    resumeBtn: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30 hover:bg-orange-500/25",
    checkColor: "text-orange-400",
  },
  emerald: {
    glow: "from-emerald-500/20 to-teal-500/10",
    glowDot: "bg-emerald-500/30",
    badge: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
    bar: "from-emerald-400 to-teal-400",
    resumeBtn: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25",
    checkColor: "text-emerald-400",
  },
} as const;

function TrackCard({
  href, accent, label, tagline, topics, total, done, lastId, resumeTo, wide = false, what,
}: {
  href: string;
  accent: keyof typeof TRACK_STYLES;
  label: string;
  tagline: string;
  topics: number;
  total: number;
  done: number;
  lastId: string | null;
  resumeTo: string;
  wide?: boolean;
  what: string[];
}) {
  const s = TRACK_STYLES[accent];
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const hasProgress = done > 0;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/60 p-5 transition hover:border-white/15 hover:bg-zinc-900/80 ${wide ? "sm:col-span-2" : ""}`}>
      {/* Subtle gradient glow */}
      <div className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.glow} blur-3xl`} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${s.badge}`}>
              <span className={`h-1 w-1 rounded-full ${s.glowDot}`} />
              {label}
            </span>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tagline}</p>
          </div>
          <Link
            to={href}
            className="shrink-0 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
          <div className="flex items-center gap-1">
            <PlayCircle className="h-3 w-3" />
            {total} lectures
          </div>
          <div className="flex items-center gap-1">
            <Layers className="h-3 w-3" />
            {topics} topics
          </div>
          {hasProgress && (
            <div className={`flex items-center gap-1 ${s.checkColor}`}>
              <CheckCircle2 className="h-3 w-3" />
              {done} done
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-all duration-500`}
              style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
            />
          </div>
          {total > 0 && (
            <div className="mt-1 text-[10px] text-zinc-600">{pct}% complete</div>
          )}
        </div>

        {/* What you'll learn */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {what.map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className={`h-1 w-1 shrink-0 rounded-full ${s.glowDot}`} />
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 flex gap-2">
          <Link
            to={href}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/8 hover:text-zinc-100 transition"
          >
            {hasProgress ? "Continue Learning" : "Start Course"}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
