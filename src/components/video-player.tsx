import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Maximize2, Minimize2, Volume2, VolumeX, Loader2 } from "lucide-react";

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: object) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
  interface Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => void;
  }
  interface HTMLElement {
    webkitRequestFullscreen?: () => void;
    webkitEnterFullscreen?: () => void;
  }
}

interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getIframe(): HTMLIFrameElement;
  destroy(): void;
}

// ─── YT API loader (singleton, safe to call many times) ──────────────────────
let ytApiReady = false;
let ytApiCallbacks: Array<() => void> = [];

function loadYTApi(onReady: () => void) {
  if (ytApiReady) { onReady(); return; }
  ytApiCallbacks.push(onReady);
  if (document.getElementById("yt-iframe-api")) return;
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    prev?.();
    ytApiReady = true;
    ytApiCallbacks.forEach((cb) => cb());
    ytApiCallbacks = [];
  };
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

async function requestFullscreen(el: HTMLElement) {
  if (el.requestFullscreen) return el.requestFullscreen();
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
}

async function exitFullscreen() {
  if (document.exitFullscreen) return document.exitFullscreen();
  if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
}

const HIDE_DELAY_MS = 1500;

// ─── Component ───────────────────────────────────────────────────────────────
export function VideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mountRef  = useRef<HTMLDivElement>(null);
  const ytRef     = useRef<YTPlayerInstance | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const readyRef  = useRef(false);

  const [playing,      setPlaying]      = useState(false);
  const [buffering,    setBuffering]    = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [muted,        setMuted]        = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [apiReady,     setApiReady]     = useState(false);

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setShowControls(false), HIDE_DELAY_MS);
  }, [clearHideTimer]);

  const revealControls = useCallback((isPlaying: boolean) => {
    setShowControls(true);
    if (isPlaying) scheduleHide();
  }, [scheduleHide]);

  // ── Load YT API ────────────────────────────────────────────────────────────
  useEffect(() => { loadYTApi(() => setApiReady(true)); }, []);

  // ── Build/rebuild player whenever videoId or API readiness changes ─────────
  useEffect(() => {
    if (!apiReady || !mountRef.current) return;

    if (ytRef.current) { ytRef.current.destroy(); ytRef.current = null; readyRef.current = false; }

    setPlaying(false); setBuffering(false); setShowControls(true);
    setCurrentTime(0); setDuration(0); clearHideTimer();

    const div = document.createElement("div");
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(div);

    ytRef.current = new window.YT.Player(div, {
      videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        controls: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        iv_load_policy: 3,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
      },
      events: {
        onReady: (e: { target: YTPlayerInstance }) => {
          readyRef.current = true;
          // Force the iframe to fill its absolutely-positioned container
          const iframe = e.target.getIframe();
          Object.assign(iframe.style, {
            position: "absolute", inset: "0", width: "100%", height: "100%", border: "0",
          });
          setDuration(e.target.getDuration());
        },
        onStateChange: (e: { data: number }) => {
          if (e.data === 1 /* PLAYING */) {
            setPlaying(true); setBuffering(false); scheduleHide();
          } else if (e.data === 2 /* PAUSED */ || e.data === 0 /* ENDED */) {
            setPlaying(false); setBuffering(false); setShowControls(true); clearHideTimer();
          } else if (e.data === 3 /* BUFFERING */) {
            setBuffering(true);
          }
        },
      },
    } as object);

    return () => {
      ytRef.current?.destroy();
      ytRef.current = null;
      readyRef.current = false;
      clearHideTimer();
    };
  }, [apiReady, videoId, clearHideTimer, scheduleHide]);

  // ── Progress polling ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) {
      if (progTimer.current) { clearInterval(progTimer.current); progTimer.current = null; }
      return;
    }
    progTimer.current = setInterval(() => {
      if (ytRef.current && readyRef.current) {
        setCurrentTime(ytRef.current.getCurrentTime());
        setDuration(ytRef.current.getDuration());
      }
    }, 500);
    return () => { if (progTimer.current) { clearInterval(progTimer.current); progTimer.current = null; } };
  }, [playing]);

  // ── Fullscreen change (both standard + webkit for Safari/iOS) ─────────────
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!getFullscreenElement());
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // ── Orientation change: force layout recalc ────────────────────────────────
  useEffect(() => {
    const onOrientationChange = () => {
      // Tiny delay so the browser finishes the rotation before we recalc
      setTimeout(() => setIsFullscreen(!!getFullscreenElement()), 100);
    };
    window.addEventListener("orientationchange", onOrientationChange);
    screen.orientation?.addEventListener("change", onOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", onOrientationChange);
      screen.orientation?.removeEventListener("change", onOrientationChange);
    };
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearHideTimer();
      if (progTimer.current) clearInterval(progTimer.current);
    };
  }, [clearHideTimer]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (!ytRef.current || !readyRef.current) return;
    playing ? ytRef.current.pauseVideo() : ytRef.current.playVideo();
  }, [playing]);

  const toggleMute = useCallback(() => {
    if (!ytRef.current || !readyRef.current) return;
    if (muted) { ytRef.current.unMute(); setMuted(false); }
    else        { ytRef.current.mute();   setMuted(true);  }
  }, [muted]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    ytRef.current?.seekTo(val, true);
  }, []);

  const handleFullscreen = useCallback(async () => {
    if (getFullscreenElement()) {
      await exitFullscreen();
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // 1. Standard API on our wrapper div (works on Android + desktop)
    if (typeof wrapper.requestFullscreen === "function" || typeof (wrapper as any).webkitRequestFullscreen === "function") {
      try { await requestFullscreen(wrapper); return; } catch { /* fall through */ }
    }

    // 2. iOS Safari: requestFullscreen is not available on arbitrary divs.
    //    Call webkitEnterFullscreen on the <video> element inside the iframe.
    const iframe = ytRef.current?.getIframe();
    if (iframe) {
      try {
        // Try the iframe element itself first
        if (iframe.requestFullscreen)       { await iframe.requestFullscreen(); return; }
        if (iframe.webkitRequestFullscreen) { iframe.webkitRequestFullscreen(); return; }
        // Last resort: native video element inside the iframe (cross-origin, may fail)
        const video = iframe.contentDocument?.querySelector("video") as (HTMLVideoElement & { webkitEnterFullscreen?(): void }) | null;
        if (video?.webkitEnterFullscreen)   { video.webkitEnterFullscreen(); return; }
      } catch { /* silently ignore cross-origin errors */ }
    }
  }, []);

  // ── Keyboard: spacebar ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
        revealControls(!playing);
      }
      if (e.code === "Escape" && getFullscreenElement()) {
        exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay, revealControls, playing]);

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Layout: switch between 16:9 aspect-ratio box and fullscreen fill ───────
  //
  //  Normal mode:  wrapper is inline, inner uses padding-bottom trick for 16:9.
  //  Fullscreen:   browser sets wrapper to 100vw × 100vh. Inner must be
  //                position:absolute inset:0 to fill it — padding trick fails
  //                here because it would set height = 56.25vw, not 100vh.
  //
  const innerStyle: React.CSSProperties = isFullscreen
    ? { position: "absolute", inset: 0, paddingBottom: 0 }
    : { paddingBottom: "56.25%" };

  return (
    <div
      ref={wrapperRef}
      className="vp-wrapper group relative w-full select-none bg-black"
      style={{ cursor: showControls ? "default" : "none" }}
      onMouseMove={() => revealControls(playing)}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onTouchStart={() => revealControls(playing)}
    >
      {/*
        Outer shell: in normal mode this has no explicit height (the inner's
        padding-bottom sets it).  In fullscreen the browser sets this to
        100vw × 100vh, so we add h-full so children can use inset-0.
      */}
      <div
        className={`relative w-full${isFullscreen ? " h-full" : ""}`}
        style={innerStyle}
      >
        {/* ── YouTube iframe mount point ──────────────────────────────────── */}
        <div
          ref={mountRef}
          className="absolute inset-0"
          style={{ contain: "strict" }}
        />

        {/* ── Buffering spinner ───────────────────────────────────────────── */}
        {buffering && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-white/60" />
          </div>
        )}

        {/* ── Click-to-play area (above the controls bar) ─────────────────── */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ bottom: "3.5rem" }}
          onClick={togglePlay}
          role="button"
          aria-label={playing ? "Pause" : "Play"}
        />

        {/* ── Centred play icon (shown only before first play) ────────────── */}
        {!playing && !buffering && currentTime === 0 && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center"
            style={{ bottom: "3.5rem" }}
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-black/50 ring-2 ring-white/20">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>
        )}

        {/* ── Controls overlay ────────────────────────────────────────────── */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Gradient scrim */}
          <div className="h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Controls bar */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-2.5">
            {/* Seek row */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tabular-nums text-white/70">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1">
                {/* Filled track */}
                <div
                  className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cyan-400"
                  style={{ width: `${pct}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="seek-bar relative h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20"
                  aria-label="Seek"
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums text-white/70">
                {formatTime(duration)}
              </span>
            </div>

            {/* Button row */}
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:text-cyan-400"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing
                  ? <Pause className="h-4 w-4 fill-current" />
                  : <Play  className="h-4 w-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:text-cyan-400"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <div className="flex-1 truncate px-1">
                <span className="line-clamp-1 text-[11px] text-white/50">{title}</span>
              </div>

              <button
                onClick={handleFullscreen}
                className="grid h-8 w-8 place-items-center rounded-full text-white transition-colors hover:text-cyan-400"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen
                  ? <Minimize2 className="h-4 w-4" />
                  : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
