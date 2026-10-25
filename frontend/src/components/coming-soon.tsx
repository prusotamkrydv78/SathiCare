import { Loader2 } from "lucide-react";

export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" aria-hidden />
        <p className="mt-4 text-sm font-medium text-gray-700">This feature is being built next.</p>
        <p className="mt-1 text-xs text-gray-400">{note}</p>
      </div>
    </div>
  );
}
