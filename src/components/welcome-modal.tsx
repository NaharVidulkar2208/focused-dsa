import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LogIn, UserPlus, Ghost,
  CheckCircle2, BookOpen, ClipboardList, PlayCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Brand } from "@/components/brand";

// Persists within the current tab session (including refreshes).
// Cleared when the tab or browser is closed — so new sessions see the modal again
// until the user authenticates (at which point user!=null and modal never shows).
const SESSION_MODAL_KEY = "focused.modal-seen";

export function WelcomeModal() {
  const { user, guest, enterGuest, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    // Already authenticated → never show
    if (user) return;
    // Already in a guest session this tab → don't show
    if (guest) return;
    // Already actioned the modal this tab session → don't show
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_MODAL_KEY) === "1") return;
    setOpen(true);
  }, [user, guest, loading]);

  if (!open) return null;

  const dismiss = () => {
    // Mark as seen for this tab session only (not localStorage — lets new sessions re-show for unauthenticated users)
    sessionStorage.setItem(SESSION_MODAL_KEY, "1");
    setOpen(false);
  };

  const handleSignIn = () => {
    dismiss();
    navigate({ to: "/login" });
  };

  const handleSignUp = () => {
    dismiss();
    navigate({ to: "/login", search: { mode: "signup" } as never });
  };

  const handleGuest = () => {
    enterGuest();
    dismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Sheet — slides up on mobile, centered on desktop */}
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/60">

          {/* Header gradient strip */}
          <div className="relative bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-transparent px-6 pt-6 pb-5">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>
            <div className="relative flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/20 ring-1 ring-cyan-500/40">
                <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
              </div>
              <span className="text-base font-semibold tracking-tight text-zinc-100">DSA Focus</span>
            </div>
            <h2 className="relative mt-3 text-xl font-bold tracking-tight text-zinc-50">
              Welcome! How would you<br className="sm:hidden" /> like to continue?
            </h2>
            <p className="relative mt-1.5 text-sm text-zinc-400">
              Two expert DSA courses — Kunal Kushwaha &amp; Shradha Khapra — organized, tracked, and mobile-ready.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 px-6 py-3 border-y border-white/5 bg-white/[0.02]">
            {[
              { icon: PlayCircle,     label: "150+ lectures" },
              { icon: BookOpen,       label: "2 courses" },
              { icon: ClipboardList,  label: "Practice sets" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">
                <Icon className="h-3 w-3 text-cyan-400" />
                {label}
              </div>
            ))}
          </div>

          {/* Auth options */}
          <div className="grid gap-2.5 px-6 py-5">
            {/* Sign In */}
            <button
              onClick={handleSignIn}
              className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-100"
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-black/15">
                <LogIn className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Sign in</div>
                <div className="text-[11px] font-normal text-zinc-950/70">Resume your progress</div>
              </div>
            </button>

            {/* Create Account */}
            <button
              onClick={handleSignUp}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-cyan-500/30 hover:bg-white/8 hover:scale-[1.01] active:scale-100"
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/8 text-cyan-400">
                <UserPlus className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Create a free account</div>
                <div className="text-[11px] text-zinc-400">Track progress across devices</div>
              </div>
            </button>

            {/* Guest */}
            <button
              onClick={handleGuest}
              className="group flex items-center gap-3 rounded-xl border border-white/8 bg-transparent px-4 py-3 text-sm font-medium text-zinc-400 transition hover:border-white/15 hover:text-zinc-300 hover:scale-[1.01] active:scale-100"
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-zinc-400">
                <Ghost className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium text-zinc-300">Continue as guest</div>
                <div className="text-[11px] text-zinc-500">Explore freely — no account needed</div>
              </div>
            </button>
          </div>

          {/* Footer perks */}
          <div className="border-t border-white/5 px-6 pb-5 pt-3">
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              {[
                "Free forever",
                "No ads",
                "Mobile friendly",
              ].map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-teal-500" />
                  {perk}
                </div>
              ))}
            </div>
            <button
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-zinc-600 transition hover:text-zinc-400"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
