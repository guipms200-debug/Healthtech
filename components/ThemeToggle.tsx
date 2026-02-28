"use client";

export function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  return (
    <button
      aria-label="toggle theme"
      onClick={onToggle}
      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs hover:border-[var(--border-hover)]"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
