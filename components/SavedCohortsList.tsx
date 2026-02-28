"use client";
import { SavedCohort } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

export function SavedCohortsList({ cohorts, onLoad, onDelete, onDuplicate }: { cohorts: SavedCohort[]; onLoad: (id: string) => void; onDelete: (id: string) => void; onDuplicate: (id: string) => void }) {
  return (
    <div className="space-y-2 text-xs">
      {cohorts.map((c) => (
        <div key={c.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
          <div className="font-medium">{c.name} v{c.version}</div>
          <div className="text-[var(--muted)]">N {c.result.counts.totalN} • {fmtDate(c.updatedAt)}</div>
          <div className="my-1 flex flex-wrap gap-1">{c.tags.map((t) => <span key={t} className="rounded-full border border-[var(--border)] px-2">{t}</span>)}</div>
          <div className="flex gap-2">
            <button onClick={() => onLoad(c.id)} className="text-violet-300">Load</button>
            <button onClick={() => onDuplicate(c.id)}>Duplicate</button>
            <button onClick={() => onDelete(c.id)} className="text-red-300">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
