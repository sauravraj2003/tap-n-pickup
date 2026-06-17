import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TopNav } from "@/components/web/TopNav";
import { useAuth } from "@/lib/store";
import { useTickets, type TicketCategory } from "@/lib/extras";
import { Mic, Square, Paperclip, Send, LifeBuoy, Play } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Contact Admin — BookIt" }] }),
  component: Support,
});

const categories: { id: TicketCategory; label: string }[] = [
  { id: "technical", label: "Technical Issue" },
  { id: "payment", label: "Payment Issue" },
  { id: "vendor", label: "Vendor Complaint" },
  { id: "barber", label: "Barber Complaint" },
  { id: "feature", label: "Feature Request" },
  { id: "feedback", label: "General Feedback" },
];

function Support() {
  const { user } = useAuth();
  const { tickets, open } = useTickets(user?.id);

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [message, setMessage] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [voiceUrl, setVoiceUrl] = useState<string | undefined>();
  const [recording, setRecording] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const submit = () => {
    if (!user) { toast.error("Sign in to contact admin"); return; }
    if (!subject.trim() || !message.trim()) { toast.error("Subject and message are required"); return; }
    open({ userId: user.id, userName: user.name, subject: subject.trim(), category, message: message.trim(), attachmentName, voiceUrl });
    toast.success("Ticket submitted — admin will respond shortly");
    setSubject(""); setMessage(""); setAttachmentName(undefined); setVoiceUrl(undefined);
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => setVoiceUrl(reader.result as string);
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone access denied");
    }
  };
  const stopRec = () => { recRef.current?.stop(); setRecording(false); };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TopNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><LifeBuoy className="size-7" /> Contact Admin</h1>
          <p className="text-sm text-zinc-600 mt-2">Send a message or record a voice note. We respond within 24 hours.</p>

          <div className="mt-6 bg-white ring-1 ring-zinc-200 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-2 w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Brief summary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className="mt-2 w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-2 w-full bg-zinc-50 ring-1 ring-zinc-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Tell us what happened…" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer px-3 py-2 ring-1 ring-zinc-300 rounded-xl">
                <Paperclip className="size-4" />
                {attachmentName ?? "Attach file"}
                <input type="file" className="hidden" onChange={(e) => setAttachmentName(e.target.files?.[0]?.name)} />
              </label>

              {!recording ? (
                <button onClick={startRec} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 ring-1 ring-zinc-300 rounded-xl">
                  <Mic className="size-4" /> Record voice
                </button>
              ) : (
                <button onClick={stopRec} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-rose-600 text-white rounded-xl animate-pulse">
                  <Square className="size-4" /> Stop
                </button>
              )}

              {voiceUrl && (
                <audio src={voiceUrl} controls className="h-9 max-w-[200px]" />
              )}

              <button onClick={submit} className="ml-auto inline-flex items-center gap-2 bg-zinc-900 text-zinc-50 px-5 py-2.5 rounded-xl text-sm font-semibold">
                <Send className="size-4" /> Submit ticket
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-3">
          <h2 className="font-bold tracking-tight">Your tickets</h2>
          {!tickets.length && <p className="text-xs text-zinc-500">No tickets yet.</p>}
          {tickets.map((t) => (
            <div key={t.id} className="bg-white ring-1 ring-zinc-200 rounded-2xl p-4">
              <div className="flex justify-between gap-3 items-start">
                <p className="font-semibold text-sm truncate">{t.subject}</p>
                <span className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded ${
                  t.status === "open" ? "bg-amber-100 text-amber-800" :
                  t.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                  t.status === "resolved" ? "bg-emerald-100 text-emerald-800" :
                  "bg-zinc-100 text-zinc-600"
                }`}>{t.status.replace("_", " ")}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{categories.find((c) => c.id === t.category)?.label} · {new Date(t.at).toLocaleDateString()}</p>
              <p className="text-xs text-zinc-600 mt-2 line-clamp-3">{t.message}</p>
              {t.voiceUrl && (
                <div className="mt-2 text-[11px] text-zinc-500 inline-flex items-center gap-1"><Play className="size-3" /> Voice attached</div>
              )}
            </div>
          ))}
          {!user && <Link to="/signin" className="block text-xs text-zinc-600 underline">Sign in to view your tickets</Link>}
        </aside>
      </div>
    </div>
  );
}
