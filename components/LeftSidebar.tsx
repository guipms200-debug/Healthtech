"use client";
import { ActivityItem, ProjectOption, SavedCohort } from "@/lib/types";
import { SavedCohortsList } from "./SavedCohortsList";
import { AuditLog } from "./AuditLog";

export function LeftSidebar({
  projects, projectId, setProjectId, cohorts, onLoad, onDelete, onDuplicate, history, audit
}: {
  projects: ProjectOption[]; projectId: string; setProjectId: (id: string) => void; cohorts: SavedCohort[];
  onLoad: (id: string) => void; onDelete: (id: string) => void; onDuplicate: (id: string) => void;
  history: string[]; audit: ActivityItem[];
}) {
  return (
    <aside className="h-full space-y-4 overflow-auto border-r p-3">
      <section>
        <h3 className="mb-2 text-sm font-semibold">Workspace / Project</h3>
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full rounded border p-2 text-sm">
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="mt-2 w-full rounded border px-2 py-1 text-xs">+ New Project</button>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Saved Cohorts</h3>
        <input placeholder="buscar / tags" className="mb-2 w-full rounded border px-2 py-1 text-xs" />
        <SavedCohortsList cohorts={cohorts} onLoad={onLoad} onDelete={onDelete} onDuplicate={onDuplicate} />
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Query History</h3>
        <ul className="space-y-1 text-xs">{history.slice(0, 6).map((h, idx) => <li key={idx} className="rounded border p-2">{h}</li>)}</ul>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Activity Log / Audit Trail</h3>
        <AuditLog items={audit} />
      </section>
    </aside>
  );
}
