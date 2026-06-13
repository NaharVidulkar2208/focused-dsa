import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, CheckCircle2, Circle, ExternalLink, FileText,
  FileType2, Image, Loader2, Menu, Search, X, ChevronLeft,
  BookOpen, AlertCircle,
} from "lucide-react";
import { AccountMenu } from "@/components/account-menu";
import { BottomNav } from "@/components/bottom-nav";
import { MarkdownView } from "@/components/markdown-view";
import {
  TOPICS, lectureFolderUrl, fetchTopicFiles, fileKind,
  type Topic, type RepoFile, type FileKind,
} from "@/lib/dsa-content";

const STORAGE_KEY = "notes-studied-topics";

function useNotesProgress() {
  const [studied, setStudied] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((id: string) => {
    setStudied((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  return { studied, toggle };
}

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Focused" },
      { name: "description", content: "Topic-wise DSA notes and study materials." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [active, setActive] = useState<Topic>(TOPICS[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const { studied, toggle } = useNotesProgress();

  const filtered = useMemo(() => {
    if (!query.trim()) return TOPICS;
    const q = query.toLowerCase();
    return TOPICS.filter((t) => t.title.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    setDrawerOpen(false);
    setSelectedFile(null);
  }, [active.id]);

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ["notes-files", active.id],
    queryFn: () => fetchTopicFiles(active.id),
    staleTime: 1000 * 60 * 60,
    gcTime: Infinity,
    retry: 1,
  });

  // For text/MD files opened inline
  const { data: fileContent, isLoading: fileLoading } = useQuery({
    queryKey: ["notes-file-content", selectedFile?.download_url],
    enabled: !!selectedFile && (fileKind(selectedFile.name) === "md" || fileKind(selectedFile.name) === "txt"),
    queryFn: async () => {
      const r = await fetch(selectedFile!.download_url!);
      if (!r.ok) throw new Error("Failed to load file");
      return r.text();
    },
    staleTime: 1000 * 60 * 60,
  });

  const extra = lectureFolderUrl(active.id);
  const isStudied = studied.has(active.id);
  const studiedCount = TOPICS.filter((t) => studied.has(t.id)).length;
  const progressPct = Math.round((studiedCount / TOPICS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 pb-24 md:pb-0">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-zinc-950/85 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-300 md:hidden"
            aria-label="Open topics"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium">Notes</span>
        </div>
        <AccountMenu />
      </header>

      <div className="mx-auto flex max-w-6xl">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-72 shrink-0 overflow-y-auto border-r border-white/10 px-3 py-4 md:block">
          <Sidebar
            topics={filtered} active={active} onPick={setActive}
            query={query} setQuery={setQuery}
            studied={studied} studiedCount={studiedCount} progressPct={progressPct}
          />
        </aside>

        {/* Drawer (mobile) */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto border-r border-white/10 bg-zinc-950 px-3 py-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-semibold">Topics</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-md text-zinc-400"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Sidebar
                topics={filtered} active={active} onPick={setActive}
                query={query} setQuery={setQuery}
                studied={studied} studiedCount={studiedCount} progressPct={progressPct}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
          {/* Topic header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                Topic {String(active.number).padStart(2, "0")}
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{active.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {extra && (
                <a
                  href={extra}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
                >
                  GitHub folder <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                onClick={() => toggle(active.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  isStudied
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {isStudied
                  ? <><CheckCircle2 className="h-3.5 w-3.5" /> Studied</>
                  : <><Circle className="h-3.5 w-3.5" /> Mark as studied</>
                }
              </button>
            </div>
          </div>

          {/* File viewer / browser */}
          {selectedFile ? (
            <FileViewer
              file={selectedFile}
              content={fileContent}
              loading={fileLoading}
              onBack={() => setSelectedFile(null)}
            />
          ) : (
            <FileBrowser
              files={files}
              loading={isLoading}
              error={!!error}
              onSelect={setSelectedFile}
            />
          )}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

// ---------------------------------------------------------------------------
// File browser — shows all repo files for the active topic
// ---------------------------------------------------------------------------

function FileBrowser({
  files, loading, error, onSelect,
}: {
  files: RepoFile[];
  loading: boolean;
  error: boolean;
  onSelect: (f: RepoFile) => void;
}) {
  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <p className="mt-3 text-xs text-zinc-500">Fetching study materials…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <AlertCircle className="h-8 w-8 text-red-400/60" />
        <p className="mt-3 text-sm text-red-400">Couldn't load files. Check your connection.</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="grid place-items-center py-24 text-center">
        <BookOpen className="h-10 w-10 text-zinc-600" />
        <p className="mt-3 text-sm font-medium text-zinc-400">No study files yet</p>
        <p className="mt-1 text-xs text-zinc-600">This topic doesn't have uploaded notes in the repo.</p>
      </div>
    );
  }

  // Group by kind
  const pdfs = files.filter((f) => fileKind(f.name) === "pdf");
  const docs = files.filter((f) => ["md", "txt"].includes(fileKind(f.name)));
  const imgs = files.filter((f) => fileKind(f.name) === "img");

  return (
    <div className="space-y-6">
      {pdfs.length > 0 && (
        <FileGroup
          title="PDF Notes"
          icon={<FileType2 className="h-4 w-4 text-red-400" />}
          files={pdfs}
          onSelect={onSelect}
        />
      )}
      {docs.length > 0 && (
        <FileGroup
          title="Text / Markdown Notes"
          icon={<FileText className="h-4 w-4 text-cyan-400" />}
          files={docs}
          onSelect={onSelect}
        />
      )}
      {imgs.length > 0 && (
        <FileGroup
          title="Diagrams & Images"
          icon={<Image className="h-4 w-4 text-teal-400" />}
          files={imgs}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

function FileGroup({
  title, icon, files, onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  files: RepoFile[];
  onSelect: (f: RepoFile) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</span>
        <span className="text-[10px] text-zinc-600">({files.length})</span>
      </div>
      <div className="space-y-1.5">
        {files.map((f) => {
          const kind = fileKind(f.name);
          const isPdf = kind === "pdf";
          const isInline = kind === "md" || kind === "txt" || kind === "img";

          const classes =
            "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-cyan-500/30 hover:bg-white/[0.08]";

          const inner = (
            <>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                isPdf ? "bg-red-500/10" : kind === "img" ? "bg-teal-500/10" : "bg-cyan-500/10"
              }`}>
                {isPdf
                  ? <FileType2 className="h-4 w-4 text-red-400" />
                  : kind === "img"
                  ? <Image className="h-4 w-4 text-teal-400" />
                  : <FileText className="h-4 w-4 text-cyan-400" />
                }
              </div>
              <span className="flex-1 truncate text-sm text-zinc-200">{f.name}</span>
              <ExternalLink className={`h-3.5 w-3.5 shrink-0 ${isPdf ? "text-zinc-500" : "hidden"}`} />
            </>
          );

          if (isPdf) {
            return (
              <a
                key={f.path}
                href={f.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
              >
                {inner}
              </a>
            );
          }

          return (
            <button key={f.path} onClick={() => isInline && onSelect(f)} className={classes}>
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline file viewer — MD, TXT, or images
// ---------------------------------------------------------------------------

function FileViewer({
  file, content, loading, onBack,
}: {
  file: RepoFile;
  content: string | undefined;
  loading: boolean;
  onBack: () => void;
}) {
  const kind = fileKind(file.name);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back to files
        </button>
        <span className="truncate text-xs text-zinc-500">{file.name}</span>
        <a
          href={file.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto shrink-0 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-cyan-400"
        >
          View on GitHub <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {kind === "img" ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
          <img
            src={file.download_url ?? file.html_url}
            alt={file.name}
            className="mx-auto max-w-full rounded-lg"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5 md:p-8">
          {loading && (
            <div className="grid place-items-center py-20">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
            </div>
          )}
          {!loading && content && kind === "md" && <MarkdownView source={content} />}
          {!loading && content && kind === "txt" && (
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300">{content}</pre>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function Sidebar({
  topics, active, onPick, query, setQuery,
  studied, studiedCount, progressPct,
}: {
  topics: Topic[]; active: Topic; onPick: (t: Topic) => void;
  query: string; setQuery: (v: string) => void;
  studied: Set<string>; studiedCount: number; progressPct: number;
}) {
  return (
    <>
      {/* Progress bar */}
      <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-zinc-300">Progress</span>
          <span className="font-mono text-cyan-400">{studiedCount}/{TOPICS.length}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-1.5 text-right text-[10px] text-zinc-500">{progressPct}% complete</div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics…"
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-2 text-xs outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Topic list */}
      <ul className="space-y-0.5">
        {topics.map((t) => {
          const isActive = t.id === active.id;
          const done = studied.has(t.id);
          return (
            <li key={t.id}>
              <button
                onClick={() => onPick(t)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-100 ring-1 ring-cyan-500/30"
                    : "text-zinc-300 hover:bg-white/5"
                }`}
              >
                <span className="shrink-0 font-mono text-[10px] text-zinc-500">
                  {String(t.number).padStart(2, "0")}
                </span>
                <span className="flex-1 leading-snug">{t.title}</span>
                {done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />}
              </button>
            </li>
          );
        })}
        {topics.length === 0 && (
          <li className="px-2 py-4 text-center text-xs text-zinc-500">No topics match.</li>
        )}
      </ul>
    </>
  );
}
