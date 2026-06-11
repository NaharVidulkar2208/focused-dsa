import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Flame, Menu, X, ArrowLeft, ExternalLink, BookOpen,
} from "lucide-react";
import { VideoPlayer } from "@/components/video-player";
import { AccountMenu } from "@/components/account-menu";
import { RecommendationStrip } from "@/components/recommendation-strip";
import { CourseSidebar } from "@/components/course-sidebar";
import { APNA_THEME } from "@/lib/course-theme";
import {
  APNA_TOPICS, APNA_LECTURES, APNA_LECTURES_BY_TOPIC,
  APNA_PROGRESS_KEY, APNA_LAST_WATCHED_KEY,
  type ApnaLecture,
} from "@/lib/apna-content";

export const Route = createFileRoute("/apna")({
  head: () => ({
    meta: [
      { title: "DSA in C++ — Apna College · DSA Focus" },
      { name: "description", content: "Shradha Khapra's complete DSA in C++ course — organized topic-wise." },
    ],
  }),
  component: ApnaLayout,
});

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(APNA_PROGRESS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
function saveProgress(set: Set<string>) {
  try { localStorage.setItem(APNA_PROGRESS_KEY, JSON.stringify([...set])); } catch {}
}
function useApnaProgress() {
  const [completed, setCompleted] = useState<Set<string>>(loadProgress);
  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      saveProgress(next);
      return next;
    });
  }, []);
  return { completed, toggle };
}

function ApnaLayout() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { lectureId?: string };
  const { completed, toggle } = useApnaProgress();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pct = APNA_LECTURES.length
    ? Math.round((completed.size / APNA_LECTURES.length) * 100)
    : 0;

  useEffect(() => {
    if (params.lectureId) return;
    const last = localStorage.getItem(APNA_LAST_WATCHED_KEY);
    const target = (last && APNA_LECTURES.find((l) => l.id === last)) ?? APNA_LECTURES[0];
    if (target) navigate({ to: "/apna/$lectureId", params: { lectureId: target.id }, replace: true });
  }, [params.lectureId, navigate]);

  useEffect(() => { setDrawerOpen(false); }, [params.lectureId]);

  const currentLecture = APNA_LECTURES.find((l) => l.id === params.lectureId);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-zinc-950/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open course menu"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${APNA_THEME.iconBg} ${APNA_THEME.iconRing}`}>
              <Flame className={`h-3.5 w-3.5 ${APNA_THEME.iconColor}`} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-zinc-100">DSA in C++</span>
              <span className="ml-2 text-[11px] text-zinc-500">Apna College</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${APNA_THEME.progressBar} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-zinc-500">
              {completed.size}/{APNA_LECTURES.length}
            </span>
          </div>
          <AccountMenu />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-white/8 bg-zinc-900/50">
          <CourseSidebar
            topics={APNA_TOPICS}
            byTopic={APNA_LECTURES_BY_TOPIC}
            activeLectureId={params.lectureId}
            completed={completed}
            onNavigate={(id) => navigate({ to: "/apna/$lectureId", params: { lectureId: id } })}
            theme={APNA_THEME}
          />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <aside className="relative z-10 flex w-[85vw] max-w-xs flex-col bg-zinc-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <span className="text-sm font-semibold">DSA in C++</span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CourseSidebar
                topics={APNA_TOPICS}
                byTopic={APNA_LECTURES_BY_TOPIC}
                activeLectureId={params.lectureId}
                completed={completed}
                onNavigate={(id) => navigate({ to: "/apna/$lectureId", params: { lectureId: id } })}
                onSelect={() => setDrawerOpen(false)}
                theme={APNA_THEME}
              />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {currentLecture ? (
            <LectureView
              lecture={currentLecture}
              allLectures={APNA_LECTURES}
              completed={completed}
              onToggle={toggle}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">Loading…</div>
          )}
        </main>
      </div>
    </div>
  );
}

function LectureView({
  lecture, allLectures, completed, onToggle,
}: {
  lecture: ApnaLecture;
  allLectures: ApnaLecture[];
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const navigate = useNavigate();
  const idx = allLectures.findIndex((l) => l.id === lecture.id);
  const prev = allLectures[idx - 1];
  const next = allLectures[idx + 1];
  const topic = APNA_TOPICS.find((t) => t.id === lecture.topicId);
  const isDone = completed.has(lecture.id);

  useEffect(() => {
    try { localStorage.setItem(APNA_LAST_WATCHED_KEY, lecture.id); } catch {}
  }, [lecture.id]);

  const handleToggle = () => {
    onToggle(lecture.id);
    toast.success(isDone ? "Marked as incomplete" : "Lecture completed! 🎉");
    if (!isDone && next) {
      setTimeout(() => navigate({ to: "/apna/$lectureId", params: { lectureId: next.id } }), 600);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full bg-black">
        <VideoPlayer videoId={lecture.videoId} title={lecture.title} />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-5">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span>{topic?.emoji}</span>
          <span>{topic?.title}</span>
          <span>·</span>
          <span>#{idx + 1}</span>
        </div>

        <h1 className="mt-1.5 text-lg font-semibold leading-snug text-zinc-100 sm:text-xl">
          {lecture.title}
        </h1>

        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
          <span>{lecture.duration}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isDone
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20"
                : APNA_THEME.markCompleteBtn
            }`}
          >
            {isDone
              ? <><CheckCircle2 className="h-4 w-4" /> Completed</>
              : <><Circle className="h-4 w-4" /> Mark Complete</>
            }
          </button>

          {prev && (
            <button
              onClick={() => navigate({ to: "/apna/$lectureId", params: { lectureId: prev.id } })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/8 hover:text-zinc-200 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
          )}
          {next && (
            <button
              onClick={() => navigate({ to: "/apna/$lectureId", params: { lectureId: next.id } })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/8 hover:text-zinc-200 transition"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            <BookOpen className="h-3.5 w-3.5" /> Resources
          </div>
          <div className="space-y-2 text-sm">
            <a
              href={`https://www.youtube.com/watch?v=${lecture.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 transition ${APNA_THEME.resourceLink}`}
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Watch on YouTube
            </a>
            <a
              href="https://t.me/apnacollegeofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Apna College Telegram — notes & practice sheets
            </a>
            <a
              href="https://www.youtube.com/@ApnaCollegeOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Apna College YouTube Channel
            </a>
          </div>
        </div>

        <div className="mt-4">
          <RecommendationStrip lectureTitle={lecture.title} accent="orange" />
        </div>
      </div>
    </div>
  );
}
