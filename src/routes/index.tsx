import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, ArrowRight, Lock, BookOpen, PlayCircle,
  CheckCircle2, Clock, Users, ChevronRight,
} from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { WelcomeModal } from "@/components/welcome-modal";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { APNA_LECTURES, APNA_PROGRESS_KEY, APNA_TOPICS } from "@/lib/apna-content";
import {
  HARRY_JAVA_PROGRESS_KEY,
  HARRY_CPP_PROGRESS_KEY,
} from "@/lib/harry-content";
import { useHarryLectures } from "@/hooks/use-harry-lectures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DSA Focus — Your learning dashboard" },
      { name: "description", content: "Premium mobile-first DSA learning platform with expert-curated courses." },
    ],
  }),
  component: Home,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting(name: string | null): string {
  const hour = new Date().getHours();
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return name ? `${time}, ${name} 👋` : `${time} 👋`;
}

function useKunalProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["progress-home", userId],
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lecture_progress")
        .select("lecture_id, completed");
      if (error) throw error;
      return (data ?? []).filter((p) => p.completed).length;
    },
  });
}

const KUNAL_TOTAL = 69;
const KUNAL_TOPICS = 18;
const APNA_TOTAL = APNA_LECTURES.length;
const APNA_TOPICS_COUNT = APNA_TOPICS.length;

// ── Component ─────────────────────────────────────────────────────────────────

function Home() {
  const { user, guest, displayName } = useAuth();
  const { data: kunalDone = 0 } = useKunalProgress(user?.id);
  const javaData = useHarryLectures("java");
  const cppData = useHarryLectures("cpp");
  const dsaData = useHarryLectures("dsa");

  const kunalGuestDone = useMemo(() => {
    try {
      const raw = localStorage.getItem("lectures-guest-progress");
      return raw ? (JSON.parse(raw) as string[]).length : 0;
    } catch { return 0; }
  }, []);

  const [apnaDone, setApnaDone] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(APNA_PROGRESS_KEY);
      setApnaDone(raw ? (JSON.parse(raw) as string[]).length : 0);
    } catch {}
  }, []);

  const [harryDone, setHarryDone] = useState(0);
  useEffect(() => {
    try {
      const j = localStorage.getItem(HARRY_JAVA_PROGRESS_KEY);
      const c = localStorage.getItem(HARRY_CPP_PROGRESS_KEY);
      const d = localStorage.getItem(HARRY_DSA_PROGRESS_KEY);
      setHarryDone(
        (j ? (JSON.parse(j) as string[]).length : 0) +
        (c ? (JSON.parse(c) as string[]).length : 0) +
        (d ? (JSON.parse(d) as string[]).length : 0)
      );
    } catch {}
  }, []);

  const kunalCompleted = user ? kunalDone : kunalGuestDone;
  const kunalPct = Math.round((kunalCompleted / KUNAL_TOTAL) * 100);
  const apnaPct = Math.round((apnaDone / APNA_TOTAL) * 100);
  const harryTotal = javaData.lectures.length + cppData.lectures.length + dsaData.lectures.length;
  const harryPct = harryTotal > 0 ? Math.round((harryDone / harryTotal) * 100) : 0;

  const greeting = getGreeting(displayName);
  const subtitle = user
    ? "Ready to continue your learning journey?"
    : guest
    ? "Explore courses — sign in to save progress across devices."
    : "Start learning with expert-curated DSA courses.";

  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Ambient glow top-left */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />

      <WelcomeModal />

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-zinc-950/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-semibold tracking-tight">DSA Focus</span>
        </div>
        <AccountMenu />
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-8 sm:px-6">

        {/* ── Greeting ──────────────────────────────────────────────────────── */}
        <section className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p>

          {/* Overall progress mini-summary */}
          {(kunalCompleted > 0 || apnaDone > 0 || harryDone > 0) && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-zinc-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
              <span>
                <span className="font-medium text-zinc-300">
                  {kunalCompleted + apnaDone + harryDone}
                </span>{" "}
                lectures completed across all courses
              </span>
            </div>
          )}
        </section>

        {/* ── Available Courses ──────────────────────────────────────────── */}
        <SectionHeader label="Available Courses" count={3} />

        <div className="mt-3 space-y-4">
          {/* Kunal Kushwaha card */}
          <CourseCard
            href="/course"
            theme="cyan"
            banner={
              <KunalBanner />
            }
            title="DSA Bootcamp"
            instructor="Kunal Kushwaha"
            language="Java"
            stats={[
              { icon: PlayCircle, value: `${KUNAL_TOTAL} lectures` },
              { icon: BookOpen,   value: `${KUNAL_TOPICS} topics` },
              { icon: Clock,      value: "79h 35m" },
            ]}
            completed={kunalCompleted}
            total={KUNAL_TOTAL}
            pct={kunalPct}
          />

          {/* Apna College card */}
          <CourseCard
            href="/apna"
            theme="violet"
            banner={<ApnaBanner />}
            title="DSA in C++"
            instructor="Shradha Khapra"
            language="C++"
            stats={[
              { icon: PlayCircle, value: `${APNA_TOTAL} lectures` },
              { icon: BookOpen,   value: `${APNA_TOPICS_COUNT} topics` },
              { icon: Users,      value: "Apna College" },
            ]}
            completed={apnaDone}
            total={APNA_TOTAL}
            pct={apnaPct}
          />

          {/* CodeWithHarry card */}
          <CourseCard
            href="/harry"
            theme="amber"
            banner={<HarryBanner />}
            title="Java / C++ + DSA"
            instructor="CodeWithHarry"
            language="Java · C++"
            stats={[
              { icon: PlayCircle, value: `${harryTotal} lectures` },
              { icon: BookOpen,   value: "3 courses" },
              { icon: Users,      value: "CodeWithHarry" },
            ]}
            completed={harryDone}
            total={harryTotal}
            pct={harryPct}
          />
        </div>

        {/* ── Coming Soon ────────────────────────────────────────────────── */}
        <SectionHeader label="Coming Soon" className="mt-10" />

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ComingSoonCard
            title="Striver's A2Z DSA Sheet"
            instructor="Raj Vikramaditya"
            theme="amber"
            emoji="🔥"
            desc="450+ curated problems from beginner to advanced."
          />
          <ComingSoonCard
            title="NeetCode 150"
            instructor="NeetCode"
            theme="emerald"
            emoji="💡"
            desc="Blind 75 expanded — most asked interview questions."
          />
        </div>
      </main>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────

function SectionHeader({ label, count, className = "" }: { label: string; count?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </h2>
      {count !== undefined && (
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-zinc-500">
          {count}
        </span>
      )}
    </div>
  );
}

// ── Course card ─────────────────────────────────────────────────────────────

type StatItem = { icon: React.ElementType; value: string };

type CourseCardProps = {
  href: string;
  theme: "cyan" | "violet" | "amber";
  banner: React.ReactNode;
  title: string;
  instructor: string;
  language: string;
  stats: StatItem[];
  completed: number;
  total: number;
  pct: number;
};

const THEME = {
  cyan: {
    progress: "from-cyan-400 to-teal-400",
    ring: "ring-cyan-500/20",
    btn: "from-cyan-500 to-teal-500 shadow-cyan-500/20 hover:shadow-cyan-500/35",
    badge: "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20",
  },
  violet: {
    progress: "from-violet-500 to-pink-500",
    ring: "ring-violet-500/20",
    btn: "from-violet-500 to-pink-500 shadow-violet-500/20 hover:shadow-violet-500/35",
    badge: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20",
  },
  amber: {
    progress: "from-amber-400 to-orange-400",
    ring: "ring-amber-500/20",
    btn: "from-amber-500 to-orange-500 shadow-amber-500/20 hover:shadow-amber-500/35",
    badge: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20",
  },
};

function CourseCard({
  href, theme, banner, title, instructor, language,
  stats, completed, total, pct,
}: CourseCardProps) {
  const t = THEME[theme];
  const started = completed > 0;

  return (
    <Link
      to={href}
      className={`group block overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/80 shadow-lg transition hover:border-white/15 hover:shadow-xl ${t.ring}`}
    >
      {/* Banner */}
      <div className="h-36 w-full overflow-hidden sm:h-40">
        {banner}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-zinc-100">{title}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              {instructor} · <span className={`font-medium ${t.badge.split(" ")[1]}`}>{language}</span>
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${t.badge}`}>
            {pct}%
          </span>
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {stats.map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-1 text-[11px] text-zinc-600">
              <Icon className="h-3 w-3" />
              {value}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-zinc-600">
              {completed} of {total} lectures
            </span>
            <span className="text-[11px] text-zinc-600">{pct}% complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${t.progress} transition-all duration-700`}
              style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className={`mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${t.btn} px-4 py-2.5 text-sm font-semibold text-white shadow-md transition group-hover:shadow-lg group-hover:scale-[1.01] active:scale-100`}>
          {started ? "Continue Learning" : "Start Learning"}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

// ── Banners ──────────────────────────────────────────────────────────────────

function KunalBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-cyan-950 via-zinc-900 to-teal-950">
      {/* Glows */}
      <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl" />
      <div className="absolute -bottom-4 right-12 h-24 w-24 rounded-full bg-teal-500/15 blur-2xl" />
      {/* Kunal image — right side */}
      <img
        src="/assets/kunal-kushwaha.webp"
        alt="Kunal Kushwaha"
        className="absolute bottom-0 right-0 h-full w-auto object-cover opacity-80"
        style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)" }}
      />
      {/* Text overlay left */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-cyan-500/20 px-2.5 py-1 text-[10px] font-medium text-cyan-300 ring-1 ring-cyan-500/30">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400" /> DSA Bootcamp
        </div>
        <p className="text-xs text-zinc-400">Java · Full Course</p>
      </div>
    </div>
  );
}

function ApnaBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900">
      <img
        src="/assets/apna-banner.jpg"
        alt="Apna College — DSA Series"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-500/20 px-2.5 py-1 text-[10px] font-medium text-orange-200 ring-1 ring-orange-500/30">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-400" /> Apna College
        </div>
        <p className="text-xs text-zinc-200">C++ · DSA Series</p>
      </div>
    </div>
  );
}

function HarryBanner() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-900">
      <img
        src="/assets/harry-banner.png"
        alt="CodeWithHarry — C++/Java + DSA"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/15 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-medium text-blue-200 ring-1 ring-blue-500/30">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400" /> CodeWithHarry
        </div>
        <p className="text-xs text-zinc-200">Java · C++ · DSA</p>
      </div>
    </div>
  );
}

// ── Coming Soon card ──────────────────────────────────────────────────────────

const COMING_THEME = {
  amber: {
    glow: "bg-amber-500/8",
    badge: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    dot: "bg-amber-400",
  },
  emerald: {
    glow: "bg-emerald-500/8",
    badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

function ComingSoonCard({
  title, instructor, theme, emoji, desc,
}: {
  title: string;
  instructor: string;
  theme: "amber" | "emerald";
  emoji: string;
  desc: string;
}) {
  const t = COMING_THEME[theme];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-zinc-900/50">
      {/* Subtle glow */}
      <div className={`pointer-events-none absolute inset-0 ${t.glow}`} />

      <div className="relative p-4">
        {/* Lock badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl">{emoji}</span>
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${t.badge}`}>
            <Lock className="h-3 w-3" />
            Coming Soon
          </div>
        </div>

        <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
        <p className="mt-0.5 text-[11px] text-zinc-600">{instructor}</p>
        <p className="mt-2 text-[11px] text-zinc-600 leading-snug">{desc}</p>

        {/* Blurred progress bar */}
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-0 rounded-full" />
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-700">Not yet available</p>
        </div>
      </div>
    </div>
  );
}
