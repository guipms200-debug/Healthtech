"use client";
import { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModeToggle({ mode, setMode }: { mode: AppMode; setMode: (m: AppMode) => void }) {
  return (
    <div className="flex rounded-md border p-1 text-sm">
      {(["feasibility", "extract"] as AppMode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn("rounded px-3 py-1 capitalize", mode === m && "bg-accent-600 text-white")}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
