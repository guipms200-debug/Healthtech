"use client";
import { AppMode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModeToggle({ mode, setMode }: { mode: AppMode; setMode: (m: AppMode) => void }) {
  return (
    <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 text-xs">
      {(["feasibility", "extract"] as AppMode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            "rounded-full px-3 py-1 capitalize text-[var(--muted)]",
            mode === m && "bg-[var(--accent)] text-white"
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
