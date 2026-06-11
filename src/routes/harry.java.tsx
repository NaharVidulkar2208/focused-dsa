import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Sparkles, Menu, X, ArrowLeft,
} from "lucide-react";
import { LectureResources } from "@/components/lecture-resources";
import { VideoPlayer } from "@/components/video-player";
import { AccountMenu } from "@/components/account-menu";
import { RecommendationStrip } from "@/components/recommendation-strip";
import { CourseSidebar } from "@/components/course-sidebar";
import { HARRY_JAVA_THEME } from "@/lib/course-theme";
import {
  HARRY_JAVA_PROGRESS_KEY, HARRY_JAVA_LAST_KEY,
  type HarryLecture,
} from "@/lib/harry-content";
import { useHarryLectures } from "@/hooks/use-harry-lectures";

export const Route = createFileRoute("/harry/java")({
  head: () => ({
    meta: [
      { title: "Java + DSA — CodeWithHarry · DSA Focus" },
      { name: "description", content: "CodeWithHarry's complete Java tutorial — topic-wise." },
    ],
  }),
  component: HarryJavaLayout,
});

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(HARRY_JAVA_PROGRESS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}
function saveProgress(set: Set<string>) {
  try { localStorage.setItem(HARRY_JAVA_PROGRESS_KEY, JSON.stringify([...set])); } catch {}
}
function useHarryProgress() {
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

function HarryJavaLayout() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { lectureId?: string };
  const { completed, toggle } = useHarryProgress();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { lectures, topics, byTopic, isLoading } = useHarryLectures("java");

  const pct = lectures.length
    ? Math.round((completed.size / lectures.length) * 100)
    : 0;

  useEffect(() => {
    if (params.lectureId) return;
    if (lectures.length === 0) return;
    const last = localStorage.getItem(HARRY_JAVA_LAST_KEY);
    const target = (last && lectures.find((l) => l.id === last)) ?? lectures[0];
    if (target) navigate({ to: "/harry/java/$lectureId", params: { lectureId: target.id }, replace: true });
  }, [params.lectureId, navigate, lectures]);

  useEffect(() => { setDrawerOpen(false); }, [params.lectureId]);

  const currentLecture = lectures.find((l) => l.id === params.lectureId);
  const isEmpty = !isLoading && lectures.filter((l) => l.videoId !== "TODO").length === 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/8 bg-zinc-950/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {!isEmpty && (
            <button
              aria-label="Open course menu"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link to="/harry" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">CodeWithHarry</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 ${HARRY_JAVA_THEME.iconBg} ${HARRY_JAVA_THEME.iconRing}`}>
              <Sparkles className={`h-3.5 w-3.5 ${HARRY_JAVA_THEME.iconColor}`} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-zinc-100">Java + DSA</span>
              <span className="ml-2 text-[11px] text-zinc-500">CodeWithHarry</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isEmpty && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/8">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${HARRY_JAVA_THEME.progressBar} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-zinc-500">
                {completed.size}/{HARRY_JAVA_LECTURES.length}
              </span>
            </div>
          )}
          <AccountMenu />
        </div>
      </header>

      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <div className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl ring-1 ${HARRY_JAVA_THEME.emptyIconBg} ${HARRY_JAVA_THEME.emptyIconRing}`}>
              <Sparkles className={`h-5 w-5 ${HARRY_JAVA_THEME.emptyIconColor}`} />
            </div>
            <h2 className="text-base font-semibold text-zinc-200">
              Java video IDs are being added — check back soon!
            </h2>
            <Link
              to="/harry"
              className={`mt-5 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${HARRY_JAVA_THEME.emptyBtn}`}
            >
              <ArrowLeft className="h-4 w-4" /> Back to CodeWithHarry
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-white/8 bg-zinc-900/50">
            <CourseSidebar
              topics={HARRY_JAVA_TOPICS}
              byTopic={HARRY_JAVA_BY_TOPIC}
              activeLectureId={params.lectureId}
              completed={completed}
              onNavigate={(id) => navigate({ to: "/harry/java/$lectureId", params: { lectureId: id } })}
              theme={HARRY_JAVA_THEME}
            />
          </aside>

          {drawerOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
              <aside className="relative z-10 flex w-[85vw] max-w-xs flex-col bg-zinc-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">☕</span>
                    <span className="text-sm font-semibold">Java + DSA</span>
                  </div>
                  <button onClick={() => setDrawerOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <CourseSidebar
                  topics={HARRY_JAVA_TOPICS}
                  byTopic={HARRY_JAVA_BY_TOPIC}
                  activeLectureId={params.lectureId}
                  completed={completed}
                  onNavigate={(id) => navigate({ to: "/harry/java/$lectureId", params: { lectureId: id } })}
                  onSelect={() => setDrawerOpen(false)}
                  theme={HARRY_JAVA_THEME}
                />
              </aside>
            </div>
          )}

          <main className="flex flex-1 flex-col overflow-y-auto">
            {currentLecture ? (
              <LectureView
                lecture={currentLecture}
                allLectures={HARRY_JAVA_LECTURES}
                completed={completed}
                onToggle={toggle}
              />
            ) : (
              <div className="flex flex-1 items-center justify-center text-zinc-500 text-sm">Loading…</div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function LectureView({
  lecture, allLectures, completed, onToggle,
}: {
  lecture: HarryLecture;
  allLectures: HarryLecture[];
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  const navigate = useNavigate();
  const idx = allLectures.findIndex((l) => l.id === lecture.id);
  const prev = allLectures[idx - 1];
  const next = allLectures[idx + 1];
  const topic = HARRY_JAVA_TOPICS.find((t) => t.id === lecture.topicId);
  const isDone = completed.has(lecture.id);
  const isLast = idx === allLectures.length - 1;

  useEffect(() => {
    try { localStorage.setItem(HARRY_JAVA_LAST_KEY, lecture.id); } catch {}
  }, [lecture.id]);

  const handleToggle = () => {
    onToggle(lecture.id);
    toast.success(isDone ? "Marked as incomplete" : "Lecture completed! 🎉");
    if (!isDone && next) {
      setTimeout(() => navigate({ to: "/harry/java/$lectureId", params: { lectureId: next.id } }), 600);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-full bg-black">
        {lecture.videoId === "TODO" ? (
          <div className="mx-auto flex aspect-video w-full max-w-5xl items-center justify-center bg-zinc-900 text-center text-sm text-zinc-400 px-6">
            Video coming soon — add videoId in harry-content.ts
          </div>
        ) : (
          <VideoPlayer videoId={lecture.videoId} title={lecture.title} />
        )}
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

        {lecture.duration && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span>{lecture.duration}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isDone
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20"
                : HARRY_JAVA_THEME.markCompleteBtn
            }`}
          >
            {isDone
              ? <><CheckCircle2 className="h-4 w-4" /> Completed</>
              : <><Circle className="h-4 w-4" /> Mark Complete</>
            }
          </button>

          {prev && (
            <button
              onClick={() => navigate({ to: "/harry/java/$lectureId", params: { lectureId: prev.id } })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/8 hover:text-zinc-200 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
          )}
          {next && (
            <button
              onClick={() => navigate({ to: "/harry/java/$lectureId", params: { lectureId: next.id } })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400 hover:bg-white/8 hover:text-zinc-200 transition"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isLast && isDone && (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-200">Java complete! Ready for DSA?</p>
            <Link
              to="/harry/dsa"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25 transition"
            >
              Continue to DSA <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <LectureResources
          videoId={lecture.videoId}
          theme={HARRY_JAVA_THEME}
          youtubeUrl={lecture.videoId !== "TODO" ? `https://www.youtube.com/watch?v=${lecture.videoId}` : undefined}
          channelUrl="https://www.youtube.com/@CodeWithHarry"
        />

        <div className="mt-4">
          <RecommendationStrip lectureTitle={lecture.title} accent="amber" />
        </div>
      </div>
    </div>
  );
}
