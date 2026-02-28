"use client";
import { useMemo, useState } from "react";
import { CohortResultRow } from "@/lib/types";

export function TableViewDrawer({ open, onClose, rows }: { open: boolean; onClose: () => void; rows: CohortResultRow[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-8">
      <div className="mx-auto h-full max-w-5xl overflow-auto rounded-xl bg-white p-4 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Table View <span className="text-xs text-accent-600">Mock</span></h3><button onClick={onClose}>Close</button></div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="mb-3 w-full rounded border px-2 py-1" />
        <table className="w-full text-xs">
          <thead><tr>{Object.keys(rows[0] ?? {}).map((k) => <th key={k} className="border p-2 text-left">{k}</th>)}</tr></thead>
          <tbody>{slice.map((r, i) => <tr key={i}>{Object.values(r).map((v, j) => <td key={j} className="border p-2">{v}</td>)}</tr>)}</tbody>
        </table>
        <div className="mt-3 flex gap-2"><button className="border px-2" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button><span>{page}</span><button className="border px-2" onClick={() => setPage((p) => p + 1)}>Next</button></div>
      </div>
    </div>
  );
}
