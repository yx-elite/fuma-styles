'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/notestack/src/ at migration.
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Copies `text` to the clipboard and shows a tick for a moment. */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className="ns-copy"
      aria-label={copied ? 'Copied' : label}
      data-copied={copied}
      onClick={() => {
        // The clipboard only works on https or localhost; elsewhere the button just does nothing
        navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {});
      }}
    >
      {copied ? <Check /> : <Copy />}
    </button>
  );
}
