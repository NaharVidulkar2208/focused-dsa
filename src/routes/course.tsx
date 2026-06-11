import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { AccountMenu } from "@/components/account-menu";
import { BottomNav } from "@/components/bottom-nav";
import { VideoPlayer } from "@/components/video-player";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight, Loader2,
  Sparkles, PlayCircle, Search, Menu, X, ArrowLeft,
} from "lucide-react";

const GUEST_LECTURE_KEY = "lectures-guest-progress";

function useGuestLectureProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(GUEST_LECTURE_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(GUEST_LECTURE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  return { guestCompleted: completed, toggleGuest: toggle };
}

type Lecture = {
  id: string;
  position: number;
  video_id: string;
  title: string;
  duration: string | null;
};

type Progress = {
  lecture_id: string;
  completed: boolean;
  last_watched_at: string;
};

export const Route = createFileRoute("/course")({
  component: CourseLayout,
});

function useLectures() {
  return useQuery({
    queryKey: ["lectures-full"],
    queryFn: async (): Promise<Lecture[]> => {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, position, video_id, title, duration")
        .order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

function useProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["progress", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Progress[]> => {
      const { data, error } = await supabase
        .from("lecture_progress")
        .select("lecture_id, completed, last_watched_at");
      if (error) throw error;
      return data ?? [];
    },
  });
}

function CourseLayout() {
  const { user, guest } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { lectureId?: string };
  const { data: lectures = [], isLoading } = useLectures();
  const { data: progress = [] } = useProgress(user?.id);
  const { guestCompleted, toggleGuest } = useGuestLectureProgress();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const progressMap = useMemo(() => {
    const m = new Map<string, Progress>();
    progress.forEach((p) => m.set(p.lecture_id, p));
    return m;
  }, [progress]);

  const completedCount = user
    ? progress.filter((p) => p.completed).length
    : guestCompleted.size;
  const pct = lectures.length ? Math.round((completedCount / lectures.length) * 100) : 0;

  useEffect(() => {
    if (params.lectureId || !lectures.length) return;
    const lastWatched = [...progress].sort(
      (a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime()
    )[0];
    const target = lastWatched
      ? lectures.find((l) => l.id === lastWatched.lecture_id) ?? lectures[0]
      : lectures[0];
    if (target) navigate({ to: "/course/$lectureId", params: { lectureId: target.id }, replace: true });
  }, [lectures, progress, params.lectureId, navigate]);

  useEffect(() => { setDrawerOpen(false); }, [params.lectureId]);

  const filtered = useMemo(() => {
    if (!query) return lectures;
    const q = query.toLowerCase();
    return lectures.filter((l) => l.title.toLowerCase().includes(q));
  }, [lectures, query]);

  const sidebar = (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-semibold tracking-tight">DSA Focus</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-md text-zinc-400 md:hidden"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {(user || guest) && (
        <div className="border-b border-white/10 px-4 py-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Your progress</span>
            <span className="font-mono text-zinc-200">{completedCount}/{lectures.length}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">{pct}% complete</p>
          {guest && !user && (
            <p className="mt-2 text-[11px] text-zinc-500">
              <Link to="/login" className="text-cyan-400 hover:underline">Sign in</Link> to sync across devices.
            </p>
          )}
        </div>
      )}

      <div className="border-b border-white/10 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lectures…"
            className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-2 text-xs outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {isLoading && (
          <div className="grid place-items-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          </div>
        )}
        {filtered.map((l) => {
          const p = progressMap.get(l.id);
          const isCompleted = user ? (p?.completed ?? false) : guestCompleted.has(l.id);
          const active = params.lectureId === l.id;
          return (
            <Link
              key={l.id}
              to="/course/$lectureId"
              params={{ lectureId: l.id }}
              className={`group flex items-start gap-3 px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-cyan-500/10 border-l-2 border-cyan-400"
                  : "border-l-2 border-transparent hover:bg-white/5"
              }`}
              title={l.title}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                ) : (
                  <Circle className={`h-4 w-4 ${active ? "text-cyan-400" : "text-zinc-500"}`} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-500">
                    {String(l.position).padStart(2, "0")}
                  </span>
                  {l.duration && (
                    <span className="font-mono text-[10px] text-zinc-500">· {l.duration}</span>
                  )}
                </div>
                <div className={`mt-0.5 line-clamp-2 text-[13px] leading-snug ${active ? "text-zinc-100" : "text-zinc-300"}`}>
                  {l.title}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 pb-20 md:pb-0">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 flex-col border-r border-white/10 bg-zinc-950/80 backdrop-blur md:flex">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-zinc-950">
            {sidebar}
          </div>
        </div>
      )}

      <main className="md:ml-80">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/85 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
              aria-label="Open lectures"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
          <AccountMenu />
        </div>
        {params.lectureId ? (
          <LectureView
            lectureId={params.lectureId}
            lectures={lectures}
            userId={user?.id}
            guestCompleted={guestCompleted}
            onGuestToggle={toggleGuest}
          />
        ) : (
          <div className="grid place-items-center py-32 text-center">
            <div>
              <PlayCircle className="mx-auto h-10 w-10 text-cyan-400" />
              <p className="mt-3 text-zinc-400">Loading your course…</p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function LectureView({
  lectureId, lectures, userId, guestCompleted, onGuestToggle,
}: {
  lectureId: string;
  lectures: Lecture[];
  userId: string | undefined;
  guestCompleted: Set<string>;
  onGuestToggle: (id: string) => void;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const idx = lectures.findIndex((l) => l.id === lectureId);
  const lecture = lectures[idx];
  const prev = lectures[idx - 1];
  const next = lectures[idx + 1];

  const { data: progress = [] } = useProgress(userId);
  const supabaseCompleted = progress.find((p) => p.lecture_id === lectureId)?.completed ?? false;
  const completed = userId ? supabaseCompleted : guestCompleted.has(lectureId);

  useEffect(() => {
    if (!userId || !lecture) return;
    supabase
      .from("lecture_progress")
      .upsert(
        { user_id: userId, lecture_id: lecture.id, last_watched_at: new Date().toISOString() },
        { onConflict: "user_id,lecture_id" }
      )
      .then(({ error }) => {
        if (error) console.error(error);
        qc.invalidateQueries({ queryKey: ["progress", userId] });
      });
  }, [lecture?.id, userId]);

  const toggleComplete = useMutation({
    mutationFn: async () => {
      if (!userId) {
        onGuestToggle(lectureId);
        return;
      }
      if (!lecture) return;
      const { error } = await supabase
        .from("lecture_progress")
        .upsert(
          { user_id: userId, lecture_id: lecture.id, completed: !completed, last_watched_at: new Date().toISOString() },
          { onConflict: "user_id,lecture_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      if (!userId) {
        toast.success(completed ? "Marked as incomplete" : "Lecture completed");
        return;
      }
      qc.invalidateQueries({ queryKey: ["progress", userId] });
      toast.success(completed ? "Marked as incomplete" : "Lecture completed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (!lecture) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 md:px-6">
      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
        <span className="font-mono">Lecture {String(lecture.position).padStart(2, "0")}</span>
        {lecture.duration && <span>· {lecture.duration}</span>}
      </div>
      <h1 className="mt-2 text-xl font-semibold tracking-tight md:text-3xl">{lecture.title}</h1>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black">
        <VideoPlayer key={lecture.video_id} videoId={lecture.video_id} title={lecture.title} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => toggleComplete.mutate()}
          disabled={toggleComplete.isPending}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
            completed
              ? "border border-cyan-500/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/20"
              : "bg-gradient-to-r from-cyan-500 to-teal-500 text-zinc-950 hover:scale-[1.02]"
          }`}
        >
          {toggleComplete.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4" />
          )}
          {completed ? "Completed" : "Mark complete"}
        </button>

        <div className="flex items-center gap-2">
          <button
            disabled={!prev}
            onClick={() => prev && navigate({ to: "/course/$lectureId", params: { lectureId: prev.id } })}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button
            disabled={!next}
            onClick={() => next && navigate({ to: "/course/$lectureId", params: { lectureId: next.id } })}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {next && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Up next</div>
          <Link
            to="/course/$lectureId"
            params={{ lectureId: next.id }}
            className="mt-1 flex items-center justify-between gap-3 hover:text-cyan-300"
          >
            <span className="font-medium">{next.title}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      )}
    </div>
  );
}
