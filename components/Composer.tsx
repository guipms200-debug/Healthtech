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
    <form onSubmit={submit} className="flex gap-2">
      <input
        aria-label="query input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Descreva sua coorte..."
        className="flex-1 rounded-lg border bg-transparent px-3 py-2 focus:border-accent-500 focus:outline-none"
      />
      <button disabled={disabled} className="rounded-lg bg-accent-600 px-4 py-2 text-white hover:bg-accent-500 disabled:opacity-60">
        Send
      </button>
    </form>
  );
}
