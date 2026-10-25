"use client";

import { useCallback, useEffect, useState } from "react";
import { Flag, Heart, Loader2, MessageCircle, Send, Share2, UserRound } from "lucide-react";
import { get, post } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

interface Post {
  id: string; title: string; content: string; category: string;
  authorName: string; likesCount: number; hasLiked: boolean;
  commentsCount: number; createdAt: string;
}
interface Comment { id: string; authorName: string; content: string; createdAt: string }

const CATEGORIES = ["all", "general", "period", "pregnancy", "mental-health", "nutrition"];

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso + (iso.length === 10 ? "T00:00:00Z" : "")).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<Record<string, Comment[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await get<{ data: { posts: Post[] } }>(`/api/community?category=${category}&sort=${sort}`);
    setPosts(res.data.posts);
    setLoading(false);
  }, [category, sort]);

  useEffect(() => { void load(); }, [load]);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const share = async () => {
    if (!content.trim()) return;
    setBusy(true);
    try {
      await post("/api/community", { title: title || null, content, category: category === "all" ? "general" : category, anonymous });
      setContent(""); setTitle(""); setShowCompose(false);
      flash("Shared with the community 💗");
      await load();
    } catch (e) { flash(e instanceof Error ? e.message : "Could not post"); }
    finally { setBusy(false); }
  };

  const like = async (id: string) => {
    const res = await post<{ data: { liked: boolean; likesCount: number } }>(`/api/community/${id}/like`).catch(() => null);
    if (!res) return;
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, hasLiked: res.data.liked, likesCount: res.data.likesCount } : p));
  };

  const openPostComments = async (id: string) => {
    if (openComments[id]) { setOpenComments((p) => { const n = { ...p }; delete n[id]; return n; }); return; }
    const res = await get<{ data: { comments: Comment[] } }>(`/api/community/${id}`);
    setOpenComments((p) => ({ ...p, [id]: res.data.comments }));
  };

  const addComment = async (id: string) => {
    const text = (commentDraft[id] ?? "").trim();
    if (!text) return;
    await post(`/api/community/${id}/comments`, { content: text }).catch(() => undefined);
    setCommentDraft((p) => ({ ...p, [id]: "" }));
    const res = await get<{ data: { comments: Comment[] } }>(`/api/community/${id}`);
    setOpenComments((p) => ({ ...p, [id]: res.data.comments }));
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, commentsCount: res.data.comments.length } : p));
  };

  const report = async (id: string) => {
    await post(`/api/community/${id}/report`, { reason: "Reported from the app" }).catch(() => undefined);
    flash("Reported — thank you");
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white text-sm px-5 py-2.5 shadow-lg">{toast}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community</h1>
          <p className="text-sm text-gray-500 mt-1">Ask, share and support each other — anonymously if you prefer.</p>
        </div>
        <button type="button" onClick={() => setShowCompose((s) => !s)}
          className="rounded-xl bg-[#FF6B9D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#f43f8e]">
          {showCompose ? "Close" : "Share something"}
        </button>
      </div>

      {showCompose && (
        <section className="rounded-2xl border border-gray-100 bg-white p-5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" aria-label="Post title"
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="What would you like to share?" aria-label="Post content"
            className="mt-2.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="accent-[#FF6B9D] w-4 h-4" />
              Post anonymously
            </label>
            <button type="button" onClick={() => void share()} disabled={!content.trim() || busy}
              className="rounded-xl bg-[#FF6B9D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#f43f8e] disabled:opacity-50 inline-flex items-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />} Share
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium border capitalize ${
              category === c ? "bg-[#FF6B9D] border-[#FF6B9D] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}>
            {c.replace("-", " ")}
          </button>
        ))}
        <span className="ml-auto flex rounded-lg border border-gray-200 bg-white text-xs overflow-hidden">
          {(["new", "top"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setSort(s)}
              className={`px-3 py-1.5 font-medium capitalize ${sort === s ? "bg-gray-900 text-white" : "text-gray-500"}`}>
              {s}
            </button>
          ))}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-[#FF6B9D] animate-spin" aria-hidden /></div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <article key={p.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-[#FFE9F0] text-[#c2446f] flex items-center justify-center">
                    <UserRound className="w-4 h-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.authorName}</p>
                    <p className="text-[11px] text-gray-400">{timeAgo(p.createdAt)} · {p.category.replace("-", " ")}</p>
                  </div>
                </div>
                <button type="button" onClick={() => void report(p.id)} aria-label="Report post"
                  className="p-2 text-gray-300 hover:text-amber-500" title="Report">
                  <Flag className="w-4 h-4" aria-hidden />
                </button>
              </div>

              <h2 className="mt-3 font-semibold text-gray-900">{p.title}</h2>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{p.content}</p>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-5 text-xs text-gray-500">
                <button type="button" onClick={() => void like(p.id)}
                  className={`inline-flex items-center gap-1.5 font-medium hover:text-[#e0447d] ${p.hasLiked ? "text-[#e0447d]" : ""}`}
                  aria-pressed={p.hasLiked} aria-label={p.hasLiked ? "Unlike" : "Like"}>
                  <Heart className={`w-4 h-4 ${p.hasLiked ? "fill-[#FF6B9D]" : ""}`} aria-hidden /> {p.likesCount}
                </button>
                <button type="button" onClick={() => void openPostComments(p.id)}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-gray-800">
                  <MessageCircle className="w-4 h-4" aria-hidden /> {p.commentsCount} comments
                </button>
                <span className="ml-auto text-gray-300 flex items-center gap-1"><Share2 className="w-3.5 h-3.5" aria-hidden /> private space</span>
              </div>

              {openComments[p.id] && (
                <div className="mt-3 space-y-2.5">
                  {openComments[p.id].map((c) => (
                    <div key={c.id} className="rounded-xl bg-gray-50 px-3.5 py-2.5">
                      <p className="text-xs font-semibold text-gray-700">{c.authorName} <span className="font-normal text-gray-400">· {timeAgo(c.createdAt)}</span></p>
                      <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
                    </div>
                  ))}
                  <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void addComment(p.id); }}>
                    <input value={commentDraft[p.id] ?? ""} onChange={(e) => setCommentDraft((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      placeholder="Add a kind comment…" aria-label="Add comment"
                      className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B9D]" />
                    <button type="submit" aria-label="Send comment" className="rounded-xl bg-gray-900 text-white px-3.5 hover:bg-gray-800">
                      <Send className="w-4 h-4" aria-hidden />
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))}
          {posts.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No posts yet — be the first to share.</p>}
        </div>
      )}

      {user && <p className="text-[11px] text-gray-400 text-center">Be kind. This is a supportive space for women.</p>}
    </div>
  );
}
