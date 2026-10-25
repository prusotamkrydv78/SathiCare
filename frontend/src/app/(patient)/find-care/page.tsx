"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Loader2, MapPin, Phone, Search, Star } from "lucide-react";
import { get, post } from "@/lib/api";

interface Facility {
  id: string; name: string; type: string; latitude: number; longitude: number;
  address?: string | null; phone?: string | null; hours?: string | null;
  distanceKm: number; rating: number; reviewCount: number;
}
interface Review { id: string; userName: string; rating: number; comment?: string | null; createdAt: string }

export default function FindCarePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<Facility | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (type !== "all") params.set("type", type);
    const res = await get<{ data: { facilities: Facility[] } }>(`/api/poi/nearby?${params}`);
    setFacilities(res.data.facilities);
    setLoading(false);
  }, [search, type]);

  useEffect(() => { void load(); }, [load]);

  const openFacility = async (f: Facility) => {
    setSelected(f);
    setMyRating(0);
    setMyComment("");
    setMsg(null);
    const res = await get<{ data: { reviews: Review[] } }>(`/api/poi/${f.id}/reviews`).catch(() => null);
    setReviews(res?.data.reviews ?? []);
  };

  const submitReview = async () => {
    if (!selected || !myRating) return;
    try {
      await post(`/api/poi/${selected.id}/reviews`, { rating: myRating, comment: myComment || null });
      setMsg("Thank you for your review 💗");
      const res = await get<{ data: { reviews: Review[] } }>(`/api/poi/${selected.id}/reviews`);
      setReviews(res.data.reviews);
      setMyRating(0); setMyComment("");
    } catch (e) { setMsg(e instanceof Error ? e.message : "Could not save review"); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Care</h1>
        <p className="text-sm text-gray-500 mt-1">Hospitals and health centers near you, with honest reviews.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search facilities…" aria-label="Search facilities"
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["all", "Hospital", "Clinic", "PHC", "Maternity"].map((t) => (
            <button key={t} type="button" onClick={() => setType(t)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border ${type === t ? "bg-accent border-accent text-white" : "border-gray-200 bg-white text-gray-600"}`}>
              {t === "PHC" ? "Health post" : t === "all" ? "All types" : t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 text-accent animate-spin" aria-hidden /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {facilities.map((f) => (
              <button key={f.id} type="button" onClick={() => void openFacility(f)}
                className={`w-full text-left rounded-2xl border bg-white p-5 transition-colors ${selected?.id === f.id ? "border-accent" : "border-gray-100 hover:border-gray-200"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.type} · {f.hours ?? "Hours vary"}</p>
                    </div>
                  </div>
                  {f.reviewCount > 0 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" aria-hidden /> {f.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-xs text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{f.address ?? "—"}</span>
                  <span className="ml-auto shrink-0 font-medium text-gray-700">{f.distanceKm} km</span>
                </p>
              </button>
            ))}
            {facilities.length === 0 && <p className="text-sm text-gray-400 text-center py-10">Nothing found.</p>}
          </div>

          {selected && (
            <aside className="rounded-2xl border border-gray-100 bg-white p-6 lg:sticky lg:top-6 self-start">
              <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{selected.type} · {selected.distanceKm} km away</p>
              <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                {selected.address && <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" aria-hidden />{selected.address}</p>}
                {selected.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" aria-hidden /><a className="hover:text-accent" href={`tel:${selected.phone}`}>{selected.phone}</a></p>}
              </div>

              <h3 className="mt-6 text-sm font-semibold text-gray-900">
                Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal">({reviews.length})</span>}
              </h3>
              <div className="mt-3 space-y-3 max-h-56 overflow-y-auto">
                {reviews.length ? reviews.map((r) => (
                  <div key={r.id} className="rounded-xl bg-gray-50 px-3.5 py-2.5">
                    <p className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      {r.userName}
                      <span className="flex" aria-label={`${r.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} aria-hidden />
                        ))}
                      </span>
                    </p>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                )) : <p className="text-sm text-gray-400">No reviews yet — be the first.</p>}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500">Share your experience</p>
                <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Your rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setMyRating(i + 1)} aria-label={`Rate ${i + 1}`}
                      className="p-1 rounded hover:bg-gray-50">
                      <Star className={`w-5 h-5 ${i < myRating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} aria-hidden />
                    </button>
                  ))}
                </div>
                <textarea value={myComment} onChange={(e) => setMyComment(e.target.value)} rows={2}
                  placeholder="How was your visit? (optional)" aria-label="Review comment"
                  className="mt-2.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <button type="button" onClick={() => void submitReview()} disabled={!myRating}
                  className="mt-2.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong disabled:opacity-50">
                  Post review
                </button>
                {msg && <p className="mt-2 text-xs text-gray-500">{msg}</p>}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
