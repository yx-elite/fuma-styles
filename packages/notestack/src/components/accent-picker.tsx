'use client';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { Check, Palette, RotateCcw } from 'lucide-react';
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { en, type NotesText } from '../i18n/text.js';

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

const KEY = 'ns-accent';
const STYLE_ID = 'ns-accent-picked';

type Picked = { light: string; dark: string };

// `html:root` / `html.dark` outrank the site's own accent (`:root` / `.dark` from <SiteStyle />)
const css = (picked: Picked) => `html:root{--ns-accent:${picked.light}}html.dark{--ns-accent:${picked.dark}}`;

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
const earlyScript = `try{var p=JSON.parse(localStorage.getItem('${KEY}')||'null');if(p&&p.light&&p.dark){var s=document.createElement('style');s.id='${STYLE_ID}';s.textContent='html:root{--ns-accent:'+p.light+'}html.dark{--ns-accent:'+p.dark+'}';document.head.appendChild(s)}}catch(e){}`;

/** Put first in <body>: applies a saved accent before the page paints, so there is no flash */
export function AccentPickerScript() {
  return <script dangerouslySetInnerHTML={{ __html: earlyScript }} />;
}

export type AccentPickerText = Pick<
  NotesText,
  'accent' | 'accentPanel' | 'accentOpen' | 'accentReset' | 'accentCustom' | 'accentNote'
>;

/** Set by <NotesRoot accentPicker>: the picker's labels, or null when the site has no picker */
const PickerContext = createContext<AccentPickerText | null>(null);

/** Turns the picker on for everything inside, in the language of `text` */
export function AccentPickerProvider({ text, children }: { text: AccentPickerText; children: ReactNode }) {
  return <PickerContext.Provider value={text}>{children}</PickerContext.Provider>;
}

/**
 * The header's theme switch (Fumadocs' `slots.themeSwitch`): the light/dark/system
 * switch, with the accent picker before it on demo sites. Fumadocs also puts it at the
 * bottom of the phone menu; the picker is hidden there (theme.css), since phones have
 * the floating one from <NotesRoot>.
 */
export function NotesThemeSwitch(props: ComponentProps<'div'>) {
  const text = useContext(PickerContext);
  return (
    <>
      {text && <AccentPicker text={text} />}
      <ThemeSwitch mode="light-dark-system" {...props} />
    </>
  );
}

/**
 * A live accent picker for demo sites: an icon in the header, next to the theme
 * switch (a round button floating bottom-right on phones, where the header has no
 * theme switch), opens a small panel of ready-made accents plus a custom colour.
 * The whole theme follows (glow, beam, logo, links, cards). The choice is
 * kept in this browser only (localStorage); "Reset" goes back to the
 * site's own accent. Opt-in: notes sites leave it out.
 */
export function AccentPicker({
  swatches = accentSwatches,
  text = en,
  floating = false,
}: {
  swatches?: AccentSwatch[];
  /** Labels; pass notesText(site) for the site's language */
  text?: AccentPickerText;
  /** Phones: a round button floating in the bottom-right corner, its panel above it */
  floating?: boolean;
}) {
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
    <div ref={root} className="ns-picker" data-open={open} data-floating={floating || undefined}>
      {open && (
        <div className="ns-picker-panel" role="dialog" aria-label={text.accentPanel}>
          <div className="ns-picker-head">
            <span>{text.accent}</span>
            <button type="button" className="ns-picker-reset" onClick={() => choose(null)} disabled={!picked}>
              <RotateCcw />
              {text.accentReset}
            </button>
          </div>
          <div className="ns-picker-swatches">
            {swatches.map((swatch) => {
              const active = picked?.light === swatch.light && picked?.dark === swatch.dark;
              return (
                <button
                  key={swatch.name}
                  type="button"
                  className="ns-picker-swatch"
                  style={{ '--ns-swatch-light': swatch.light, '--ns-swatch-dark': swatch.dark } as CSSProperties}
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
          <label className="ns-picker-custom">
            <input type="color" defaultValue={picked?.light ?? '#0092b3'} onChange={(e) => custom(e.target.value)} />
            {text.accentCustom}
          </label>
          <p className="ns-picker-note">{text.accentNote}</p>
        </div>
      )}
      <button
        type="button"
        className="ns-picker-button"
        aria-label={text.accentOpen}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Palette />
      </button>
    </div>
  );
}
