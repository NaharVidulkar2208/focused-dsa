import { Link, useRouterState } from "@tanstack/react-router";
import { Home, PlayCircle, FileText, ClipboardList } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/course", label: "Lectures", icon: PlayCircle },
  { to: "/notes", label: "Notes", icon: FileText },
  { to: "/assignments", label: "Tasks", icon: ClipboardList },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/" ? path === "/" : path === to || path.startsWith(to + "/");
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition ${
                  active ? "text-cyan-400" : "text-zinc-400 active:text-zinc-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
