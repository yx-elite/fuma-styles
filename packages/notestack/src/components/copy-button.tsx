'use client';
import { Check, Copy } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

/**
 * Copies `text` to the clipboard and shows a tick for a moment.
 * With `children`, a button with a label ("Copy instructions") instead of an icon on its own.
 */
export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  children,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={children ? 'ns-button ns-button-secondary ns-copy-text' : 'ns-copy'}
      aria-label={children ? undefined : copied ? copiedLabel : label}
      data-copied={copied}
      onClick={() => {
        // The clipboard only works on https or localhost; elsewhere the button just does nothing
        navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {});
      }}
    >
      {copied ? <Check /> : <Copy />}
      {children && <span aria-live="polite">{copied ? copiedLabel : children}</span>}
    </button>
  );
}
