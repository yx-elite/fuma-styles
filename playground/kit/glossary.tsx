'use client';
// PROTOTYPE of the package's components/ entry. Moves to packages/notestack/src/ at migration.
import Link from 'fumadocs-core/link';
import { ArrowRight, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface GlossaryTerm {
  term: string;
  definition: string;
  /** Link to the note that explains the term */
  href?: string;
  /** Link text, e.g. the note's title */
  label?: string;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterOf = (term: string) => {
  const first = term.trim()[0]?.toUpperCase() ?? '#';
  return LETTERS.includes(first) ? first : '#';
};
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * A–Z glossary: a sticky letter bar (click to jump), a filter box,
 * and the terms grouped by first letter. Terms come from the site's glossary.json.
 */
export function Glossary({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  // After a click, keep the clicked letter highlighted while the page scrolls there
  const lockedUntil = useRef(0);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = [...terms]
      .filter((t) => !q || t.term.toLowerCase().includes(q))
      .sort((a, b) => a.term.localeCompare(b.term));
    const map = new Map<string, GlossaryTerm[]>();
    for (const t of matches) {
      const letter = letterOf(t.term);
      map.set(letter, [...(map.get(letter) ?? []), t]);
    }
    return map;
  }, [terms, query]);

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
    const el = document.getElementById(`glossary-${letter.toLowerCase()}`);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    lockedUntil.current = Date.now() + 1200;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setActive(letter);
    history.replaceState(null, '', `#glossary-${letter.toLowerCase()}`);
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
            placeholder={`Filter ${terms.length} terms…`}
            aria-label="Filter terms"
          />
          {query && <span className="ns-glossary-count">{shown} found</span>}
        </label>
        <nav className="ns-glossary-letters" aria-label="Jump to letter">
          {LETTERS.map((letter) => {
            const has = groups.has(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={!has}
                data-active={has && active === letter}
                onClick={() => jump(letter)}
                aria-label={`Terms starting with ${letter}`}
              >
                {letter}
              </button>
            );
          })}
        </nav>
      </div>

      {shown === 0 ? (
        <p className="ns-glossary-empty">No terms match “{query}”.</p>
      ) : (
        [...groups.entries()].map(([letter, list]) => (
          <section
            key={letter}
            id={`glossary-${letter.toLowerCase()}`}
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
                        {t.label ?? 'Read more'}
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
