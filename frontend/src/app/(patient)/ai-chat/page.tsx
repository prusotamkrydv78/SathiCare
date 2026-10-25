"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, MessageCircleHeart, Phone, Plus, Send, Trash2 } from "lucide-react";
import { get, post, del } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface Msg { id?: string; role: "user" | "assistant"; content: string; danger?: boolean; createdAt?: string }
interface ChatMeta { id: string; title: string; updatedAt: string }
interface ChatResponse { chatId: string; reply: string; redFlag: boolean; actions: { label: string; phone: string }[] }

const SUGGESTIONS = [
  "How can I ease period cramps?",
  "My cycle is irregular — when should I worry?",
  "What should I eat during pregnancy?",
  "I feel sad and tired lately",
];

export default function AiChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatMeta[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await get<{ data: { chats: ChatMeta[] } }>("/api/health/chats");
        setChats(res.data.chats);
      } catch { /* no chats yet */ }
      setListLoading(false);
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (id: string) => {
    setActiveChat(id);
    try {
      const res = await get<{ data: { messages: Msg[] } }>(`/api/health/chat/${id}`);
      setMessages(res.data.messages);
    } catch { setMessages([]); }
  };

  const newChat = () => {
    setActiveChat(null);
    setMessages([]);
    setInput("");
  };

  const removeChat = async (id: string) => {
    await del(`/api/health/chat/${id}`).catch(() => undefined);
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChat === id) newChat();
  };

  const send = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      const res = await post<{ data: ChatResponse }>("/api/health/chat", {
        chatId: activeChat,
        message,
      });
      const { chatId, reply, redFlag, actions } = res.data;
      if (!activeChat) {
        setActiveChat(chatId);
        const meta = await get<{ data: { chats: ChatMeta[] } }>("/api/health/chats").catch(() => null);
        if (meta) setChats(meta.data.chats);
      } else {
        setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, updatedAt: new Date().toISOString() } : c)));
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          danger: redFlag,
          ...(redFlag && actions?.length ? { id: `actions-${Date.now()}` } : {}),
        },
      ]);
      (window as unknown as { __lastActions?: { label: string; phone: string }[] }).__lastActions = redFlag ? actions : undefined;
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const lastActions = (window as unknown as { __lastActions?: { label: string; phone: string }[] }).__lastActions;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saathi AI</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ask anything about your cycle, pregnancy or wellbeing. In emergencies it points you to real help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Chat list */}
        <aside className="rounded-2xl border border-gray-100 bg-white p-3 lg:self-start">
          <button
            type="button"
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FF6B9D] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e]"
          >
            <Plus className="w-4 h-4" aria-hidden /> New chat
          </button>
          {listLoading ? (
            <p className="text-xs text-gray-400 text-center mt-3">Loading…</p>
          ) : chats.length ? (
            <ul className="mt-3 space-y-1">
              {chats.map((c) => (
                <li key={c.id} className="group flex items-center">
                  <button
                    type="button"
                    onClick={() => void openChat(c.id)}
                    className={`flex-1 min-w-0 text-left px-3 py-2 rounded-lg text-xs truncate ${
                      activeChat === c.id ? "bg-[#FFE9F0] text-[#c2446f] font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c.title}
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete chat: ${c.title}`}
                    onClick={() => void removeChat(c.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 text-center mt-3">No conversations yet</p>
          )}
        </aside>

        {/* Chat area */}
        <section className="rounded-2xl border border-gray-100 bg-white flex flex-col h-[560px]">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B9D] to-[#7C3AED] text-white flex items-center justify-center">
              <MessageCircleHeart className="w-4 h-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">Saathi</p>
              <p className="text-[11px] text-gray-400">General guidance · not a medical diagnosis</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 font-medium">Namaste{user ? `, ${user.name.split(" ")[0]}` : ""} 👋 How can I help today?</p>
                <div className="mt-4 grid gap-2 max-w-sm mx-auto">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs text-gray-600 hover:border-[#FF6B9D] hover:text-[#c2446f] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={m.id ?? i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#FF6B9D] text-white rounded-br-md"
                      : m.danger
                        ? "bg-red-50 border border-red-200 text-red-800 rounded-bl-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {m.danger && (
                    <p className="flex items-center gap-1.5 font-semibold mb-1.5">
                      <AlertTriangle className="w-4 h-4" aria-hidden /> Urgent — seek care now
                    </p>
                  )}
                  {m.content}
                  {m.danger && lastActions?.length && i === messages.length - 1 ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {lastActions.map((a) => (
                        <a
                          key={a.phone}
                          href={`tel:${a.phone}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold px-3 py-1.5 hover:bg-red-700"
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden /> {a.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5" aria-label="Saathi is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="border-t border-gray-100 p-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label htmlFor="chat-input" className="sr-only">Message Saathi</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              autoComplete="off"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label="Send message"
              className="rounded-xl bg-[#FF6B9D] px-4 text-white hover:bg-[#f43f8e] disabled:opacity-50"
            >
              <Send className="w-4 h-4" aria-hidden />
            </button>
          </form>
        </section>
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        Saathi gives general information, not medical advice. For emergencies call 102 (ambulance) or 1115 (health helpline).
      </p>
    </div>
  );
}
