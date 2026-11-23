'use client';
import Link from 'fumadocs-core/link';
import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { en, type NotesText } from '../i18n/text.js';
import { fill } from '../i18n/index.js';

export interface GlossaryTerm {
  term: string;
  definition: string;
  /** Link to the note that explains the term */
  href?: string;
  /** Link text, e.g. the note's title */
  label?: string;
}

export type GlossaryText = Pick<
  NotesText,
  | 'glossaryFilter'
  | 'glossaryFilterLabel'
  | 'glossaryFound'
  | 'glossaryLetters'
  | 'glossaryLetter'
  | 'glossaryEmpty'
  | 'glossaryOther'
  | 'readMore'
>;

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
/** Section for terms that don't start with A–Z: digits, Chinese, other scripts */
const OTHER = '#';
const withoutAccents = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '');
const letterOf = (term: string) => {
  const first = withoutAccents(term.trim())[0]?.toUpperCase() ?? '';
  return LETTERS.includes(first) ? first : OTHER;
};
/** Anchor for a term: "Amazon S3" → "amazon-s3", "Résumé" → "resume", "可用区" → "可用区" */
const slug = (text: string) =>
  withoutAccents(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
const sectionId = (letter: string) => `glossary-${letter === OTHER ? 'other' : letter.toLowerCase()}`;

/**
 * A–Z glossary: a sticky letter bar (click to jump), a filter box,
 * and the terms grouped by first letter, A–Z first, then every other term under "#".
 * Terms come from the site's glossary.json.
 */
export function Glossary({
  terms,
  text = en,
  language = 'en',
}: {
  terms: GlossaryTerm[];
  /** Labels; getMDXComponents() passes the site's */
  text?: GlossaryText;
  /** The site's language, for sorting and filtering */
  language?: string;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  // After a click, keep the clicked letter highlighted while the page scrolls there
  const lockedUntil = useRef(0);

  const groups = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(language);
    const collator = new Intl.Collator(language);
    const matches = [...terms]
      .filter((t) => !q || t.term.toLocaleLowerCase(language).includes(q))
      .sort((a, b) => collator.compare(a.term, b.term));
    const byLetter = new Map<string, GlossaryTerm[]>();
    for (const t of matches) {
      const letter = letterOf(t.term);
      byLetter.set(letter, [...(byLetter.get(letter) ?? []), t]);
    }
    // A–Z first, then "#"
    const map = new Map<string, GlossaryTerm[]>();
    for (const letter of [...LETTERS, OTHER]) {
      const list = byLetter.get(letter);
      if (list) map.set(letter, list);
    }
    return map;
  }, [terms, query, language]);

  const shown = [...groups.values()].reduce((n, list) => n + list.length, 0);

  // Highlight the letter whose section is at the top of the screen
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-glossary-letter]')];
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (Date.now() < lockedUntil.current) return;
        if (visible[0]) setActive(visible[0].target.getAttribute('data-glossary-letter'));
      },
      { rootMargin: '-140px 0px -60% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [groups]);

  const jump = (letter: string) => {
    const el = document.getElementById(sectionId(letter));
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    lockedUntil.current = Date.now() + 1200;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setActive(letter);
    history.replaceState(null, '', `#${sectionId(letter)}`);
  };

  return (
    <div className="ns-glossary not-prose">
      <div className="ns-glossary-bar">
        <label className="ns-glossary-filter">
          <Search aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={fill(text.glossaryFilter, { n: terms.length })}
            aria-label={text.glossaryFilterLabel}
          />
          {query && <span className="ns-glossary-count">{fill(text.glossaryFound, { n: shown })}</span>}
        </label>
        <nav className="ns-glossary-letters" aria-label={text.glossaryLetters}>
          {[...LETTERS, ...(terms.some((t) => letterOf(t.term) === OTHER) ? [OTHER] : [])].map((letter) => {
            const has = groups.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={!has}
                data-active={has && active === letter}
                onClick={() => jump(letter)}
                aria-label={letter === OTHER ? text.glossaryOther : fill(text.glossaryLetter, { letter })}
              >
                {letter}
              </button>
            );
          })}
        </nav>
      </div>

      {shown === 0 ? (
        <p className="ns-glossary-empty">{fill(text.glossaryEmpty, { query })}</p>
      ) : (
        [...groups.entries()].map(([letter, list]) => (
          <section
            key={letter}
            id={sectionId(letter)}
            data-glossary-letter={letter}
            className="ns-glossary-section"
          >
            <h2 className="ns-glossary-letter">{letter}</h2>
            <dl className="ns-glossary-terms">
              {list.map((t) => (
                <div key={t.term} id={`term-${slug(t.term)}`} className="ns-glossary-term">
                  <dt>{t.term}</dt>
                  <dd>
                    <p>{t.definition}</p>
                    {t.href && (
                      <Link href={t.href} className="ns-glossary-link">
                        {t.label ?? text.readMore}
                        <ArrowRight aria-hidden />
                      </Link>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </div>
  );
}
