"use client";

export function ExportModal({ open, onClose, onCSV, onJSON }: { open: boolean; onClose: () => void; onCSV: () => void; onJSON: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-4">
      <div className="w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="mb-2 font-semibold">Exportar</h3>
        <div className="grid gap-2 text-sm">
          <button onClick={onCSV} className="rounded-lg bg-[var(--accent)] px-3 py-2 text-white">CSV</button>
          <button onClick={onJSON} className="rounded-lg border border-[var(--border)] px-3 py-2">JSON</button>
          <button onClick={onClose} className="rounded-lg border border-[var(--border)] px-3 py-2">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
