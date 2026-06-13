import { Sparkles } from "lucide-react";

type BrandSize = "sm" | "md" | "lg";

const sizes: Record<BrandSize, { icon: string; iconWrap: string; title: string; sub: string; gap: string }> = {
  sm: {
    iconWrap: "h-8 w-8 rounded-lg",
    icon: "h-4 w-4",
    title: "text-[15px] leading-none",
    sub: "text-[10px] mt-0.5 tracking-[0.18em]",
    gap: "gap-2",
  },
  md: {
    iconWrap: "h-9 w-9 rounded-xl",
    icon: "h-4 w-4",
    title: "text-base leading-none",
    sub: "text-[10px] mt-0.5 tracking-[0.2em]",
    gap: "gap-2.5",
  },
  lg: {
    iconWrap: "h-12 w-12 rounded-2xl",
    icon: "h-6 w-6",
    title: "text-3xl sm:text-4xl leading-none",
    sub: "text-xs sm:text-sm mt-1.5 tracking-[0.25em]",
    gap: "gap-3",
  },
};

export function Brand({
  size = "sm",
  showIcon = true,
  className = "",
}: {
  size?: BrandSize;
  showIcon?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {showIcon && (
        <div className={`grid place-items-center ${s.iconWrap} bg-cyan-500/15 ring-1 ring-cyan-500/30`}>
          <Sparkles className={`${s.icon} text-cyan-400`} />
        </div>
      )}
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-zinc-50 ${s.title}`}>Focused</span>
        <span className={`font-medium uppercase text-zinc-500 ${s.sub}`}>v1 — DSA</span>
      </div>
    </div>
  );
}
