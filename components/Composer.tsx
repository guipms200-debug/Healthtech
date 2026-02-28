"use client";
import { FormEvent, useState } from "react";

export function Composer({ onSend, disabled }: { onSend: (t: string) => void; disabled?: boolean }) {
  const [text, setText] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="glass flex items-center gap-2 rounded-2xl p-2">
        <button
          type="button"
          className="hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--muted)] hover:border-[var(--border-hover)] md:inline-flex"
        >
          Explorar conceitos
        </button>

        <input
          aria-label="query input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Descreva sua coorte..."
          className="flex-1 bg-transparent px-2 py-3 text-sm placeholder:text-[var(--muted)] focus:outline-none"
        />

        <button
          aria-label="send query"
          disabled={disabled}
          className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-2)] disabled:opacity-60"
        >
          ↗
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">Dados da própria unidade • LGPD by design</p>
    </form>
  );
}
