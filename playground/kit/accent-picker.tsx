'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import { Check, Palette, RotateCcw } from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';

export interface AccentSwatch {
  name: string;
  light: string;
  dark: string;
}

/** Ready-made accents, each with a deeper shade for light mode and a lighter one for dark mode */
export const accentSwatches: AccentSwatch[] = [
  { name: 'Ocean', light: '#0092b3', dark: '#3ad1ff' },
  { name: 'Blue', light: '#2563eb', dark: '#93c5fd' },
  { name: 'Violet', light: '#7c3aed', dark: '#c4b5fd' },
  { name: 'Rose', light: '#e11d48', dark: '#fda4af' },
  { name: 'Amber', light: '#d97706', dark: '#fcd34d' },
  { name: 'Emerald', light: '#059669', dark: '#6ee7b7' },
  { name: 'Mono', light: '#404040', dark: '#e5e5e5' },
];

const KEY = 'fs-accent';
const STYLE_ID = 'fs-accent-picked';

type Picked = { light: string; dark: string };

// `html:root` / `html.dark` outrank the site's own accent (`:root` / `.dark` from <SiteStyle />)
const css = (picked: Picked) => `html:root{--fs-accent:${picked.light}}html.dark{--fs-accent:${picked.dark}}`;

function apply(picked: Picked | null) {
  let style = document.getElementById(STYLE_ID);
  if (!picked) return style?.remove();
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css(picked);
}

function load(): Picked | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return value && typeof value.light === 'string' && typeof value.dark === 'string' ? value : null;
  } catch {
    return null;
  }
}

function save(picked: Picked | null) {
  try {
    if (picked) localStorage.setItem(KEY, JSON.stringify(picked));
    else localStorage.removeItem(KEY);
  } catch {
    // private mode or storage blocked: the choice just lasts until the page reloads
  }
}

// Runs before the page paints, so a saved accent shows without a flash of the default one
const earlyScript = `try{var p=JSON.parse(localStorage.getItem('${KEY}')||'null');if(p&&p.light&&p.dark){var s=document.createElement('style');s.id='${STYLE_ID}';s.textContent='html:root{--fs-accent:'+p.light+'}html.dark{--fs-accent:'+p.dark+'}';document.head.appendChild(s)}}catch(e){}`;

/** Put first in <body>: applies a saved accent before the page paints, so there is no flash */
export function AccentPickerScript() {
  return <script dangerouslySetInnerHTML={{ __html: earlyScript }} />;
}

/**
 * A live accent picker for demo sites: a round button in the bottom-right
 * corner opens a small panel of ready-made accents plus a custom colour.
 * The whole theme follows (glow, beam, logo, links, cards). The choice is
 * kept in this browser only (localStorage); "Reset" goes back to the
 * site's own accent. Opt-in: notes sites leave it out.
 */
export function AccentPicker({ swatches = accentSwatches }: { swatches?: AccentSwatch[] }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setPicked(load()), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (next: Picked | null) => {
    setPicked(next);
    apply(next);
    save(next);
  };

  // A custom colour is used as is in light mode; dark mode gets a lighter version of it
  const custom = (hex: string) =>
    choose({ light: hex, dark: CSS.supports('color', 'oklch(from red l c h)') ? `oklch(from ${hex} max(l, 0.82) c h)` : hex });

  return (
    <div ref={root} className="fs-picker" data-open={open}>
      {open && (
        <div className="fs-picker-panel" role="dialog" aria-label="Accent colour">
          <div className="fs-picker-head">
            <span>Accent</span>
            <button type="button" className="fs-picker-reset" onClick={() => choose(null)} disabled={!picked}>
              <RotateCcw />
              Reset
            </button>
          </div>
          <div className="fs-picker-swatches">
            {swatches.map((swatch) => {
              const active = picked?.light === swatch.light && picked?.dark === swatch.dark;
              return (
                <button
                  key={swatch.name}
                  type="button"
                  className="fs-picker-swatch"
                  style={{ '--fs-swatch-light': swatch.light, '--fs-swatch-dark': swatch.dark } as CSSProperties}
                  aria-label={swatch.name}
                  aria-pressed={active}
                  title={swatch.name}
                  onClick={() => choose({ light: swatch.light, dark: swatch.dark })}
                >
                  {active && <Check />}
                </button>
              );
            })}
          </div>
          <label className="fs-picker-custom">
            <input type="color" defaultValue={picked?.light ?? '#0092b3'} onChange={(e) => custom(e.target.value)} />
            Custom colour
          </label>
          <p className="fs-picker-note">Only changes this browser. The site&apos;s own accent comes from site.config.ts.</p>
        </div>
      )}
      <button
        type="button"
        className="fs-picker-button"
        aria-label="Change the accent colour"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Palette />
      </button>
    </div>
  );
}
