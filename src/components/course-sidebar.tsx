import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import type { CourseTheme } from "@/lib/course-theme";

export interface SidebarTopic {
  id: string;
  title: string;
  emoji: string;
}

export interface SidebarLecture {
  id: string;
  title: string;
  duration?: string;
  topicId: string;
}

interface CourseSidebarProps {
  topics: SidebarTopic[];
  byTopic: Record<string, SidebarLecture[]>;
  activeLectureId?: string;
  completed: Set<string>;
  onNavigate: (lectureId: string) => void;
  onSelect?: () => void;
  theme: CourseTheme;
}

export function CourseSidebar({
  topics, byTopic, activeLectureId, completed, onNavigate, onSelect, theme,
}: CourseSidebarProps) {
  const [search, setSearch] = useState("");

  const activeTopic = useMemo(() => {
    for (const t of topics) {
      if ((byTopic[t.id] ?? []).some((l) => l.id === activeLectureId)) return t.id;
    }
    return topics[0]?.id;
  }, [activeLectureId, topics, byTopic]);

  const [openTopics, setOpenTopics] = useState<Set<string>>(
    () => new Set(activeTopic ? [activeTopic] : []),
  );

  useEffect(() => {
    if (activeTopic) setOpenTopics((prev) => new Set([...prev, activeTopic]));
  }, [activeTopic]);

  const toggleTopic = (id: string) =>
    setOpenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const q = search.trim().toLowerCase();

  const totalLectures = topics.reduce((sum, t) => sum + (byTopic[t.id]?.length ?? 0), 0);
  const completedCount = topics.reduce(
    (sum, t) => sum + (byTopic[t.id]?.filter((l) => completed.has(l.id)).length ?? 0),
    0,
  );
  const pct = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-2 border-b border-white/8 px-3 py-2.5">
        <input
          type="text"
          placeholder="Search lectures…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full rounded-lg bg-white/5 px-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none ring-1 ring-white/10 transition ${theme.searchRing}`}
        />
        {totalLectures > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.progressBar} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-zinc-500">
              {completedCount}/{totalLectures}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {topics.map((topic) => {
          const allLectures = byTopic[topic.id] ?? [];
          const lectures = q
            ? allLectures.filter((l) => l.title.toLowerCase().includes(q))
            : allLectures;
          if (q && lectures.length === 0) return null;
          const doneCount = lectures.filter((l) => completed.has(l.id)).length;
          const isOpen = q ? true : openTopics.has(topic.id);

          return (
            <div key={topic.id}>
              <button
                onClick={() => toggleTopic(topic.id)}
                className="group flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                <span className="shrink-0 text-base leading-none">{topic.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                      {topic.title}
                    </span>
                    {doneCount === lectures.length && doneCount > 0 && (
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />
                    )}
                  </div>
                  <div className="mt-0.5 text-[10px] text-zinc-600">
                    {doneCount}/{lectures.length} done
                  </div>
                </div>
                {isOpen
                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                  : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                }
              </button>

              {isOpen && (
                <ul className="pb-1">
                  {lectures.map((lecture) => {
                    const isActive = lecture.id === activeLectureId;
                    const isDone = completed.has(lecture.id);
                    return (
                      <li key={lecture.id}>
                        <button
                          onClick={() => { onNavigate(lecture.id); onSelect?.(); }}
                          className={`flex w-full items-start gap-2 border-l-2 px-4 py-1.5 text-left transition-colors ${
                            isActive
                              ? `${theme.activeRowBg} ${theme.activeBorderL}`
                              : "border-transparent hover:bg-white/5"
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                          ) : (
                            <Circle
                              className={`mt-0.5 h-3 w-3 shrink-0 ${
                                isActive ? theme.activeIcon : "text-zinc-600"
                              }`}
                            />
                          )}
                          <div className="min-w-0">
                            <p
                              className={`text-[11px] leading-snug ${
                                isActive
                                  ? `${theme.activeTitle} font-medium`
                                  : isDone
                                  ? "text-zinc-500"
                                  : "text-zinc-300"
                              }`}
                            >
                              {lecture.title}
                            </p>
                            {lecture.duration && (
                              <p className="mt-0.5 text-[10px] text-zinc-600">{lecture.duration}</p>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
