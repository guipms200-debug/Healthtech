"use client";
import { CohortResult } from "@/lib/types";
import { FunnelChart } from "./FunnelChart";

export function CohortSummary({ name, setName, result, onRemoveCriterion, onSave, onVersion, onClear, onTable }: {
  name: string; setName: (n: string) => void; result: CohortResult | null;
  onRemoveCriterion: (id: string) => void; onSave: () => void; onVersion: () => void; onClear: () => void; onTable: () => void;
}) {
  if (!result) return <aside className="border-l p-4 text-sm text-zinc-500">No cohort yet.</aside>;
  return (
    <aside className="h-full space-y-4 overflow-auto border-l p-4">
      <div>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-2 py-1 font-semibold" />
        <div className="text-3xl font-bold text-accent-600">{result.counts.totalN}</div>
      </div>
      <section><h4 className="mb-1 text-sm font-semibold">Cohort Funnel</h4><FunnelChart steps={result.funnel} /></section>
      <section>
        <h4 className="mb-1 text-sm font-semibold">Criteria</h4>
        <div className="flex flex-wrap gap-2">{result.criteria.map((c) => <div key={c.id} title={`${c.description} | ${c.timeWindow}`} className="rounded-full border px-3 py-1 text-xs">{c.label} <button aria-label="remove criterion" onClick={() => onRemoveCriterion(c.id)} className="ml-1 text-red-500">×</button></div>)}</div>
      </section>
      <section>
        <h4 className="mb-1 text-sm font-semibold">Result Preview <span className="text-xs text-accent-600">Mock Data</span></h4>
        <table className="w-full text-xs"><thead><tr><th className="text-left">patient_id</th><th>sexo</th><th>idade</th></tr></thead><tbody>{result.rows.slice(0, 8).map((r) => <tr key={r.patient_id}><td>{r.patient_id}</td><td>{r.sexo}</td><td>{r.idade}</td></tr>)}</tbody></table>
      </section>
      <section className="rounded border p-2 text-xs">{result.metadata.explanation}</section>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button onClick={onSave} className="rounded bg-accent-600 px-2 py-1 text-white">Save Cohort</button>
        <button onClick={onVersion} className="rounded border px-2 py-1">New Version</button>
        <button onClick={onClear} className="rounded border px-2 py-1">Clear</button>
        <button onClick={onTable} className="rounded border px-2 py-1">Export Table</button>
      </div>
    </aside>
  );
}
