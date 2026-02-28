"use client";
import { ActivityItem, ProjectOption, SavedCohort } from "@/lib/types";
import { SavedCohortsList } from "./SavedCohortsList";
import { AuditLog } from "./AuditLog";

export function LeftSidebar({
  projects,
  projectId,
  setProjectId,
  cohorts,
  onLoad,
  onDelete,
  onDuplicate,
  history,
  audit
}: {
  projects: ProjectOption[];
  projectId: string;
  setProjectId: (id: string) => void;
  cohorts: SavedCohort[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  history: string[];
  audit: ActivityItem[];
}) {
  const channels = ["Cohorts", "Templates", "History"];

  return (
    <aside className="h-full w-[280px] shrink-0 border-r border-[var(--border)] bg-[#080d19]/95 p-4">
      <div className="mb-6 flex items-center gap-2">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button className="h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm hover:border-[var(--border-hover)]">
          +
        </button>
      </div>

      <section className="mb-6">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-[var(--muted)]">Channels</p>
        <ul className="space-y-1.5 text-sm">
          {channels.map((name, idx) => (
            <li
              key={name}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 ${
                idx === 0 ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/70"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full border border-[var(--muted)] ${
                  idx === 0 ? "bg-[var(--accent)] border-[var(--accent)]" : ""
                }`}
              />
              {name}
            </li>
          ))}
        </ul>
      </section>

      <details open className="mb-4">
        <summary className="cursor-pointer text-xs font-semibold text-[var(--muted)]">Saved Cohorts</summary>
        <div className="mt-2">
          <input
            placeholder="buscar / tags"
            className="mb-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs"
          />
          <SavedCohortsList cohorts={cohorts} onLoad={onLoad} onDelete={onDelete} onDuplicate={onDuplicate} />
        </div>
      </details>

      <details open className="mb-4">
        <summary className="cursor-pointer text-xs font-semibold text-[var(--muted)]">Query History</summary>
        <ul className="mt-2 space-y-1 text-xs">
          {history.slice(0, 6).map((h, idx) => (
            <li key={idx} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-[var(--muted)]">
              {h}
            </li>
          ))}
        </ul>
      </details>

      <details open>
        <summary className="cursor-pointer text-xs font-semibold text-[var(--muted)]">Activity Log / Audit Trail</summary>
        <div className="mt-2">
          <AuditLog items={audit} />
        </div>
      </details>
    </aside>
  );
}
