"use client";

const examples = [
  "Pacientes com CID-10 E11 e HbA1c > 8% no último ano",
  "Procedimentos TUSS de artroplastia de joelho em 24 meses",
  "Uso de metformina + creatinina elevada",
  "Feasibility: quantos pacientes com ICC e BNP > X?"
];

export function TagChips({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {examples.map((x) => (
        <button key={x} onClick={() => onPick(x)} className="rounded-full border px-3 py-1 text-xs hover:border-accent-500">
          {x}
        </button>
      ))}
    </div>
  );
}
