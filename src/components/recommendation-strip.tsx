import { Sparkles } from "lucide-react";
import { matchTopic, TOPIC_GRAPH } from "@/lib/dsa-topic-graph";

type Accent = "violet" | "amber" | "emerald" | "cyan" | "orange";

const ACCENT_PILL: Record<Accent, string> = {
  violet:  "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  amber:   "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  cyan:    "bg-cyan-500/10 text-cyan-300 ring-cyan-500/20",
  orange:  "bg-orange-500/10 text-orange-300 ring-orange-500/20",
};

const PREREQ_PILL = "bg-red-500/10 text-red-300 ring-red-500/20";
const RELATED_PILL = "bg-zinc-700/50 text-zinc-400 ring-white/5";

function PillRow({
  label,
  ids,
  pillClass,
}: { label: string; ids: string[]; pillClass: string }) {
  const items = ids.map((id) => TOPIC_GRAPH[id]).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t) => (
          <span
            key={t.id}
            className={`rounded-full px-2.5 py-1 text-[11px] ring-1 ${pillClass}`}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RecommendationStrip({
  lectureTitle,
  accent = "violet",
}: { lectureTitle: string; accent?: Accent }) {
  const node = matchTopic(lectureTitle);
  if (!node) return null;

  const hasAny =
    node.prerequisites.length > 0 ||
    node.nextTopics.length > 0 ||
    node.relatedTopics.length > 0;
  if (!hasAny) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        <Sparkles className="h-3.5 w-3.5" /> What to study next
      </div>
      <div className="space-y-3">
        <PillRow label="Prerequisites" ids={node.prerequisites} pillClass={PREREQ_PILL} />
        <PillRow label="Up Next" ids={node.nextTopics} pillClass={ACCENT_PILL[accent]} />
        <PillRow label="Related" ids={node.relatedTopics} pillClass={RELATED_PILL} />
      </div>
    </div>
  );
}
