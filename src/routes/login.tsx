import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Loader2, ArrowLeft, CheckCircle2, BookOpen, PlayCircle, ClipboardList,
  Eye, EyeOff, Ghost,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Brand } from "@/components/brand";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode as "login" | "signup") ?? "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Focused" },
      { name: "description", content: "Sign in to Focused to track your DSA progress." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const { session, exitGuest, enterGuest } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(search.mode ?? "login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  useEffect(() => { setMode(search.mode ?? "login"); }, [search.mode]);

  useEffect(() => {
    if (session) navigate({ to: "/course", replace: true });
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/course",
            data: { full_name: name },
          },
        });
        if (error) throw error;
        sessionStorage.removeItem("focused.modal-seen");
        toast.success("Account created — check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        exitGuest();
        sessionStorage.removeItem("focused.modal-seen");
        toast.success("Welcome back!");
        navigate({ to: "/course" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    enterGuest();
    sessionStorage.setItem("focused.modal-seen", "1");
    navigate({ to: "/" });
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-zinc-950">
      {/* Glassmorphism background — soft animated ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-3xl animate-pulse [animation-duration:9s]" />
        <div className="absolute top-1/3 -right-24 h-[24rem] w-[24rem] rounded-full bg-blue-500/12 blur-3xl animate-pulse [animation-duration:11s]" />
        <div className="absolute -bottom-24 left-1/3 h-[26rem] w-[26rem] rounded-full bg-teal-500/10 blur-3xl animate-pulse [animation-duration:13s]" />
        <div className="absolute inset-0 bg-zinc-950/55 backdrop-blur-2xl" />
      </div>

      {/* Left: form panel */}
      <div className="relative z-10 flex w-full flex-col justify-center px-5 py-12 sm:px-8 lg:w-1/2">
        <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-zinc-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>

          <div className="mb-8">
            <Brand size="md" />
          </div>

          {/* Mode toggle tabs */}
          <div className="mb-6 flex gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10 backdrop-blur">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-white/10 text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/55 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
              {mode === "login" ? "Welcome back" : "Start your DSA journey"}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {mode === "login"
                ? "Resume exactly where you left off."
                : "Create a free account and track your progress."}
            </p>

            <form onSubmit={submit} className="mt-5 space-y-3.5">
              {mode === "signup" && (
                <Input
                  label="Your name"
                  value={name}
                  onChange={setName}
                  type="text"
                  placeholder="Rahul Sharma"
                  autoComplete="name"
                />
              )}
              <Input
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="you@example.com"
                required
                autoComplete={mode === "login" ? "username" : "email"}
              />
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                show={showPw}
                onToggle={() => setShowPw((v) => !v)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-zinc-600">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGuest}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
            >
              <Ghost className="h-4 w-4" />
              Continue as guest
            </button>

            <p className="mt-4 text-center text-sm text-zinc-500">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="font-medium text-cyan-400 hover:underline"
              >
                {mode === "login" ? "Create a free account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right: feature showcase */}
      <div className="relative z-10 hidden lg:flex w-1/2 flex-col justify-center border-l border-white/5 bg-zinc-950/40 px-12 backdrop-blur-xl">
        <div className="max-w-sm animate-in fade-in slide-in-from-right-2 duration-700">
          <div className="mb-8">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-cyan-300">
              Free · No ads · Mobile-friendly
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight leading-snug text-zinc-50">
            Everything you need to<br />
            <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
              master DSA.
            </span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400">
            Three expert-curated tracks, organized into a distraction-free study platform.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: PlayCircle,    title: "Embedded lectures",   desc: "Watch without leaving the app. No YouTube rabbit holes." },
              { icon: BookOpen,      title: "Topic-wise notes",    desc: "PDFs, diagrams and markdown notes per topic." },
              { icon: ClipboardList, title: "Practice assignments", desc: "Mark tasks complete and track your streak." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-200">{title}</div>
                  <div className="text-xs text-zinc-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2">
            {["Sync progress across devices", "Resume exactly where you left off", "Free forever — no subscription"].map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-400" />
                {perk}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

function Input({ label, value, onChange, ...rest }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
      />
    </label>
  );
}

type PwProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
};

function PasswordInput({ label, value, onChange, show, onToggle, ...rest }: PwProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      <div className="relative">
        <input
          {...rest}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}
