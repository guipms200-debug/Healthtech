"use client";
import { CohortResult } from "@/lib/types";
import { FunnelChart } from "./FunnelChart";

export function CohortSummary({ name, setName, result, onRemoveCriterion, onSave, onVersion, onClear, onTable }: {
  name: string; setName: (n: string) => void; result: CohortResult | null;
  onRemoveCriterion: (id: string) => void; onSave: () => void; onVersion: () => void; onClear: () => void; onTable: () => void;
}) {
  if (!result) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
        No cohort yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 font-semibold" />
        <div className="mt-2 text-3xl font-bold text-violet-400">{result.counts.totalN}</div>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <h4 className="mb-2 text-sm font-semibold">Cohort Funnel</h4>
        <FunnelChart steps={result.funnel} />
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <h4 className="mb-2 text-sm font-semibold">Criteria</h4>
        <div className="flex flex-wrap gap-2">{result.criteria.map((c) => <div key={c.id} title={`${c.description} | ${c.timeWindow}`} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{c.label} <button aria-label="remove criterion" onClick={() => onRemoveCriterion(c.id)} className="ml-1 text-red-400">×</button></div>)}</div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <h4 className="mb-1 text-sm font-semibold">Result Preview <span className="text-xs text-violet-300">Mock Data</span></h4>
        <table className="w-full text-xs"><thead><tr><th className="text-left">patient_id</th><th>sexo</th><th>idade</th></tr></thead><tbody>{result.rows.slice(0, 8).map((r) => <tr key={r.patient_id}><td>{r.patient_id}</td><td>{r.sexo}</td><td>{r.idade}</td></tr>)}</tbody></table>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--muted)]">{result.metadata.explanation}</section>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button onClick={onSave} className="rounded-lg bg-[var(--accent)] px-2 py-2 text-white">Save Cohort</button>
        <button onClick={onVersion} className="rounded-lg border border-[var(--border)] px-2 py-2">New Version</button>
        <button onClick={onClear} className="rounded-lg border border-[var(--border)] px-2 py-2">Clear</button>
        <button onClick={onTable} className="rounded-lg border border-[var(--border)] px-2 py-2">Export Table</button>
      </div>
    </div>
  );
}
