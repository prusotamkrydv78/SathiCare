"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MessageSquare, Phone, Send, Video } from "lucide-react";
import { get, post } from "@/lib/api";
import { createConsultationConnection } from "@/lib/signalr";
import { useAuth } from "@/context/auth-context";

interface Message {
  id?: string;
  senderType: "user" | "doctor";
  senderId?: string;
  senderName?: string;
  content: string | null;
  sentAt?: string;
  isRead?: boolean;
}

interface AppointmentInfo {
  id: string;
  doctorName?: string | null;
  patientName?: string | null;
  date: string;
  time: string;
  status: string;
}

export default function ConsultationChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const [info, setInfo] = useState<AppointmentInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"connecting" | "connected" | "closed" | "error">("connecting");
  const [error, setError] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const connRef = useRef<ReturnType<typeof createConsultationConnection> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, peerTyping]);

  const load = useCallback(async () => {
    try {
      const [a, m] = await Promise.all([
        get<{ data: AppointmentInfo }>(`/api/appointments/${id}`),
        get<{ data: { messages: Message[] } }>(`/api/consultations/${id}/messages`),
      ]);
      setInfo(a.data);
      setMessages(m.data.messages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open this consultation");
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    if (!user) return;
    void load();

    const conn = createConsultationConnection();
    connRef.current = conn;

    conn.on("consultation-joined", () => setStatus("connected"));
    conn.on("message-received", (m: { id: string; senderType: "user" | "doctor"; senderName: string; content: string; sentAt: string }) => {
      setMessages((prev) =>
        prev.some((p) => p.id === m.id) ? prev : [...prev, { ...m, senderName: m.senderName }]
      );
      setPeerTyping(null);
    });
    conn.on("user-typing", (t: { senderName?: string | null }) => {
      if (!t?.senderName) return;
      setPeerTyping(t.senderName);
      setTimeout(() => setPeerTyping(null), 2500);
    });
    conn.on("consultation-ended", () => setStatus("closed"));
    conn.onclose(() => setStatus((s) => (s === "error" ? s : "closed")));

    void (async () => {
      try {
        await conn.start();
        await conn.invoke("JoinConsultation", id);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not connect to the chat");
        setStatus("error");
      }
    })();

    return () => {
      void conn.stop().catch(() => undefined);
    };
  }, [user, id, load]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !connRef.current) return;
    setInput("");
    setSending(true);
    try {
      await connRef.current.invoke("SendMessage", id, text);
    } catch (e) {
      setMessages((prev) => [...prev, { senderType: isDoctor ? "doctor" : "user", content: text }]);
      setError(e instanceof Error ? e.message : "Message failed to send");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSending(false);
    }
  };

  const onType = () => {
    const conn = connRef.current;
    if (conn?.state === "Connected") void conn.invoke("Typing", id).catch(() => undefined);
  };

  const endConsultation = async () => {
    try { await connRef.current?.invoke("EndConsultation", id); } catch { /* ignore */ }
    setStatus("closed");
  };

  const peerName = isDoctor ? info?.patientName : info?.doctorName;
  const backHref = isDoctor ? "/doctor/appointments" : "/consultations";
  const selfId = isDoctor ? user?.doctorId : user?.id;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => router.push(backHref)}
              aria-label="Back to appointments"
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden />
            </button>
            <span className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-sm shrink-0">
              {peerName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "?"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{peerName ?? "Consultation"}</p>
              <p className="text-xs text-gray-400">
                {status === "connected" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden /> Connected
                  </span>
                ) : status === "connecting" ? "Connecting…" : status === "closed" ? "Consultation ended" : "Connection lost"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wide text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 mr-2">
              Demo
            </span>
            <button type="button" aria-label="Voice call (coming soon)" className="p-2 text-gray-400 hover:text-gray-600" disabled>
              <Phone className="w-5 h-5" aria-hidden />
            </button>
            <button type="button" aria-label="Video call (coming soon)" className="p-2 text-gray-400 hover:text-gray-600" disabled>
              <Video className="w-5 h-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
          {info && (
            <div className="rounded-xl bg-white border border-gray-100 px-4 py-3 text-xs text-gray-500 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-accent" aria-hidden />
                {new Date(info.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })} · {info.time}
              </span>
              <span className="capitalize font-medium">{info.status}</span>
            </div>
          )}

          {messages.map((m, i) => {
            const own = m.senderType === (isDoctor ? "doctor" : "user") ||
              (selfId && m.senderId && m.senderId === selfId);
            return (
              <div key={m.id ?? i} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  own ? "bg-accent text-white rounded-br-md" : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
                }`}>
                  {!own && m.senderName && (
                    <p className="text-[11px] font-semibold text-gray-400 mb-0.5">{m.senderName}</p>
                  )}
                  {m.content}
                </div>
              </div>
            );
          })}

          {peerTyping && (
            <p className="text-xs text-gray-400 px-2">{peerTyping} is typing…</p>
          )}

          {status === "connecting" && !error && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-gray-300 animate-spin" aria-hidden />
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 text-center">
              {error}
            </div>
          )}

          {status === "closed" && (
            <div className="rounded-xl bg-gray-100 text-gray-600 text-sm px-4 py-3 text-center">
              This consultation has ended. {isDoctor ? "Add notes from the appointment page." : "Check the notes in your appointments."}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100">
        <form
          className="max-w-3xl mx-auto p-3 flex items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); void send(); }}
        >
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => { setInput(e.target.value); onType(); }}
            placeholder={status === "closed" ? "Consultation ended" : "Type a message…"}
            disabled={status !== "connected"}
            autoComplete="off"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || status !== "connected"}
            aria-label="Send message"
            className="rounded-xl bg-accent px-4 py-2.5 text-white hover:bg-accent-strong disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Send className="w-4 h-4" aria-hidden />}
          </button>
          {isDoctor && status === "connected" && (
            <button
              type="button"
              onClick={() => void endConsultation()}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              End
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-gray-300 pb-2">
          SaathiCare consultations are not emergency care. In an emergency call 102.
        </p>
      </footer>
    </div>
  );
}
