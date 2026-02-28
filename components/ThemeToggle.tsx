"use client";

export function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  return (
    <button aria-label="toggle theme" onClick={onToggle} className="rounded border px-3 py-1 text-sm hover:border-accent-500">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
