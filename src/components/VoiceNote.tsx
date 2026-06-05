import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

export function VoiceNote({ label = "Record voice request" }: { label?: string }) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [url]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setDuration(0);
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setError("Microphone permission denied");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const reset = () => {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setDuration(0);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (url) {
    return (
      <div className="w-full bg-surface ring-1 ring-border rounded-2xl p-3 flex items-center gap-3">
        <button onClick={toggle} className="size-10 grid place-items-center rounded-xl bg-zinc-900 text-zinc-50">
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <div className="flex-1 flex items-center gap-1 h-6">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="flex-1 bg-zinc-400 rounded-full"
              style={{ height: `${20 + Math.sin(i * 1.3) * 18 + (i % 3) * 4}%` }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{fmt(duration)}</span>
        <button onClick={reset} className="text-muted-foreground"><Trash2 className="size-4" /></button>
        <audio
          ref={audioRef}
          src={url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          hidden
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={recording ? stop : start}
        className={`w-full ring-1 rounded-2xl py-3 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
          recording ? "bg-zinc-900 text-zinc-50 ring-zinc-900" : "bg-surface ring-border text-muted-foreground"
        }`}
      >
        {recording ? (
          <>
            <Square className="size-4 fill-current" />
            <span>Recording · {fmt(duration)}</span>
            <span className="size-2 rounded-full bg-red-500 animate-pulse ml-1" />
          </>
        ) : (
          <>
            <Mic className="size-4" /> {label}
          </>
        )}
      </button>
      {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
    </div>
  );
}
