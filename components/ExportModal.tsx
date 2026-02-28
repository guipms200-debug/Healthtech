"use client";

export function ExportModal({ open, onClose, onCSV, onJSON }: { open: boolean; onClose: () => void; onCSV: () => void; onJSON: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-80 rounded-xl bg-white p-4 dark:bg-zinc-900">
        <h3 className="mb-2 font-semibold">Exportar</h3>
        <div className="grid gap-2 text-sm">
          <button onClick={onCSV} className="rounded bg-accent-600 px-3 py-2 text-white">CSV</button>
          <button onClick={onJSON} className="rounded border px-3 py-2">JSON</button>
          <button onClick={onClose} className="rounded border px-3 py-2">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
