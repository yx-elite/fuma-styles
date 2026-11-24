import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { CopyButton } from '../components/copy-button.js';
import { DocsPreview } from './home-preview.js';
import { HomeEffects } from './home-effects.js';
import { HomeFooter } from './home-footer.js';
import { SearchButton } from '../components/search-button.js';
import { pageLastModified } from '../source/last-modified.js';
import { repoUrl, type SiteConfig, type StartSection } from '../config/site.js';
import {
  fill,
  fillNodes,
  formatDate,
  hasLanguageRoutes,
  languageOf,
  localizeHref,
  notesText,
  plural,
  pluralForm,
  type NotesText,
} from '../i18n/index.js';
import { NotesLogo } from './logo.js';
import { notestack, stackFor, type StackItem } from './stack.js';

/** The parts of a Fumadocs `loader()` source the home page reads. */
export interface HomeSource {
  getPageTree(language?: string): PageTree.Root;
  getPages(language?: string): { data: object }[];
}

export interface HomePage {
  name: ReactNode;
  url: string;
  description?: ReactNode;
  icon?: ReactNode;
}

export interface HomeGroup {
  name: ReactNode;
  icon?: ReactNode;
  pages: HomePage[];
}

function collectPages(nodes: PageTree.Node[], out: HomePage[]) {
  for (const node of nodes) {
    if (node.type === 'page') out.push(node);
    else if (node.type === 'folder') {
      if (node.index) out.push(node.index);
      collectPages(node.children, out);
    }
  }
}

/**
 * Sections of the docs, in sidebar order: each separator starts a section;
 * a folder right after a separator belongs to it, any other folder is a section of its own.
 */
export function groupPageTree(tree: PageTree.Root, firstSection = 'Start here'): HomeGroup[] {
  const groups: HomeGroup[] = [];
  let current: HomeGroup | undefined;

  for (const node of tree.children) {
    if (node.type === 'separator') {
      current = { name: node.name, icon: node.icon, pages: [] };
      groups.push(current);
    } else if (node.type === 'folder') {
      if (!current || current.pages.length > 0) {
        current = { name: node.name, icon: node.icon, pages: [] };
        groups.push(current);
      }
      current.icon ??= node.icon;
      collectPages([node], current.pages);
    } else {
      if (!current) {
        current = { name: firstSection, pages: [] };
        groups.push(current);
      }
      current.pages.push(node);
    }
  }

  return groups.filter((group) => group.pages.length > 0);
}

function latestUpdate(source: HomeSource, language?: string): Date | undefined {
  let latest: number | undefined;
  for (const page of source.getPages(language)) {
    const time = pageLastModified(page)?.getTime();
    if (time !== undefined && (latest === undefined || time > latest)) latest = time;
  }
  return latest === undefined ? undefined : new Date(latest);
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** Repeat a short list until it has at least `min` items, so a looping strip never shows a gap */
function repeat<T>(items: T[], min: number): T[] {
  if (items.length === 0) return items;
  const out = [...items];
  while (out.length < min) out.push(...items);
  return out;
}

/**
 * Default landing page, top to bottom: hero, a live miniature of the docs, the
 * libraries the site is built with, the sections of the notes, a "Get started"
 * section (site.start), a search call-to-action and a footer. Each notes site can
 * replace it with its own page.
 */
export function NotesHome({
  site,
  source,
  docsPath = localizeHref('/docs', site),
}: {
  /** On a site with `languages`, the config for this page's language: `siteFor(site, lang)` */
  site: SiteConfig;
  source: HomeSource;
  docsPath?: string;
}) {
  const text = notesText(site);
  const language = languageOf(site);
  // Only a site with languages has one page tree per language
  const treeLanguage = hasLanguageRoutes(site) ? language : undefined;
  const groups = groupPageTree(source.getPageTree(treeLanguage), text.firstSection);
  const pageCount = groups.reduce((sum, group) => sum + group.pages.length, 0);
  const updated = latestUpdate(source, treeLanguage);
  const firstUrl = groups[0]?.pages[0]?.url ?? docsPath;
  const words = site.name.split(/\s+/);

  return (
    <main className="ns-home">
      <section className="ns-home-hero">
        {site.tag && (
          <span className="ns-home-badge">
            <span className="ns-home-badge-dot" aria-hidden />
            <span className="ns-shiny">{site.tag}</span>
          </span>
        )}
        <h1 className="ns-home-title" aria-label={site.name}>
          {words.map((word, i) => (
            <span key={i} className="ns-home-word" style={vars({ '--i': i })} aria-hidden>
              {word}
            </span>
          ))}
        </h1>
        <p className="ns-home-text">{site.description}</p>
        <div className="ns-home-actions">
          <Link href={docsPath} className="ns-button ns-button-primary">
            {text.startReading}
            <ArrowRight />
          </Link>
          <a href={repoUrl(site)} className="ns-button ns-button-secondary" target="_blank" rel="noreferrer">
            {text.viewOnGitHub}
          </a>
        </div>
        <p className="ns-home-stats">
          <span>{fillNodes(pluralForm(language, pageCount, text.pageCount), { n: <b data-ns-count={pageCount}>{pageCount}</b> })}</span>
          <span>
            {fillNodes(pluralForm(language, groups.length, text.sectionCount), {
              n: <b data-ns-count={groups.length}>{groups.length}</b>,
            })}
          </span>
          {updated && (
            <span>
              {fillNodes(text.updated, {
                date: (
                  <time dateTime={updated.toISOString()}>
                    {formatDate(language, updated, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}
                  </time>
                ),
              })}
            </span>
          )}
        </p>
      </section>

      <div className="ns-home-preview">
        <DocsPreview site={site} groups={groups} href={firstUrl} text={text} />
      </div>

      <StackStrip items={stackFor(site)} label={text.builtWith} />

      {groups.length > 0 && (
        <section className="ns-home-section" aria-labelledby="ns-home-contents">
          <SectionHead id="ns-home-contents" eyebrow={text.contentsEyebrow} title={text.contentsTitle}>
            {fill(text.contentsText, {
              pages: plural(language, pageCount, text.pageCount),
              sections: plural(language, groups.length, text.sectionCount),
            })}
          </SectionHead>
          <div className="ns-mosaic">
            {mosaic(groups.length).map((tile, i) => (
              <SectionCard key={i} group={groups[i]} index={i} tile={tile} text={text} language={language} />
            ))}
          </div>
        </section>
      )}

      {site.start !== false && <GetStarted section={site.start ?? runLocally(site, text)} text={text} />}

      <section className="ns-home-cta ns-reveal">
        <div>
          <h2 className="ns-home-h2">{text.searchTitle}</h2>
          <p className="ns-home-lead">{text.searchText}</p>
        </div>
        <div className="ns-home-actions">
          <SearchButton label={text.searchButton} />
          <Link href={docsPath} className="ns-button ns-button-primary">
            {text.startReading}
            <ArrowRight />
          </Link>
        </div>
      </section>

      <HomeFooter site={site} groups={groups} updated={updated} text={text} />

      <HomeEffects />
    </main>
  );
}

function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <header className="ns-home-section-head ns-reveal">
      <p className="ns-home-eyebrow">{eyebrow}</p>
      <h2 id={id} className="ns-home-h2">
        {title}
      </h2>
      <p className="ns-home-lead">{children}</p>
    </header>
  );
}

/* ── Built with: library logos flowing sideways ──────────────────────── */

function StackLogo({ item }: { item: StackItem }) {
  if (item === notestack) return <NotesLogo />;
  if (item.path)
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d={item.path} fill="currentColor" />
      </svg>
    );
  // No brand icon: a plain circle with the initial
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
        {item.name[0]}
      </text>
    </svg>
  );
}

function StackStrip({ items, label }: { items: StackItem[]; label: string }) {
  const row = repeat(items, 10);
  const strip = (copy: boolean) => (
    <ul className="ns-marquee-group" aria-hidden={copy || undefined}>
      {row.map((item, i) => (
        <li key={i}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="ns-stack-item"
            tabIndex={copy || i >= items.length ? -1 : undefined}
          >
            <StackLogo item={item} />
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="ns-home-stack ns-reveal" aria-label={label}>
      <p className="ns-home-stack-label">{label}</p>
      <div className="ns-marquee" style={vars({ '--ns-duration': `${row.length * 4}s` })}>
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/* ── Section card: a moving list of the section's pages, then its name ─── */

/** How a section card looks: each shows the same section a different way, so neighbours never match */
type TileStyle = 'feature' | 'cluster' | 'stack' | 'stat' | 'strip';

interface Tile {
  style: TileStyle;
  /** grid-area on the six-column grid of wide screens; phones stack the cards */
  area: string;
}

/**
 * The mosaic: the first section a tall feature on the left, up to three tiles of
 * different shapes on its right, then the rest as strips, two to a row (the last
 * one full width when it is on its own).
 */
function mosaic(count: number): Tile[] {
  if (count === 1) return [{ style: 'feature', area: '1 / 1 / 2 / 7' }];
  if (count === 2) {
    return [
      { style: 'feature', area: '1 / 1 / 3 / 4' },
      { style: 'stack', area: '1 / 4 / 3 / 7' },
    ];
  }
  if (count === 3) {
    return [
      { style: 'feature', area: '1 / 1 / 3 / 4' },
      { style: 'cluster', area: '1 / 4 / 2 / 7' },
      { style: 'cluster', area: '2 / 4 / 3 / 7' },
    ];
  }
  const tiles: Tile[] = [
    { style: 'feature', area: '1 / 1 / 4 / 4' },
    { style: 'cluster', area: '1 / 4 / 2 / 7' },
    { style: 'stack', area: '2 / 4 / 4 / 6' },
    { style: 'stat', area: '2 / 6 / 4 / 7' },
  ];
  for (let i = 4; i < count; i++) {
    const row = 4 + Math.floor((i - 4) / 2);
    const left = (i - 4) % 2 === 0;
    const alone = left && i === count - 1;
    tiles.push({ style: 'strip', area: `${row} / ${alone ? 1 : left ? 1 : 4} / ${row + 1} / ${alone || !left ? 7 : 4}` });
  }
  return tiles;
}

function SectionCard({
  group,
  index,
  tile,
  text,
  language,
}: {
  group: HomeGroup;
  index: number;
  tile: Tile;
  text: NotesText;
  language: string;
}) {
  const first = group.pages[0];
  const number = String(index + 1).padStart(2, '0');
  const count = group.pages.length;
  const more = (shown: number) =>
    count > shown ? <span className="ns-tile-more">{fill(text.andMore, { n: count - shown }).replace(/^[\s,，、]+/, '')}</span> : null;
  // The page's own icon, or its number when it has none
  const badge = (page: HomePage, i: number) => (
    <span className="ns-tile-badge" data-number={page.icon ? undefined : true}>
      {page.icon ?? String(i + 1).padStart(2, '0')}
    </span>
  );
  const chips = (shown: number) => (
    <ul className="ns-tile-chips">
      {group.pages.slice(0, shown).map((page, i) => (
        <li key={i} style={vars({ '--j': i })}>
          <Link href={page.url} className="ns-tile-chip">
            {page.icon}
            {page.name}
          </Link>
        </li>
      ))}
      {count > shown && <li style={vars({ '--j': shown })}>{more(shown)}</li>}
    </ul>
  );

  return (
    <article
      className="ns-card ns-tile ns-reveal"
      data-style={tile.style}
      style={vars({ '--i': index, '--ns-area': tile.area })}
    >
      <span className="ns-tile-meta">
        {number}
        {tile.style !== 'stat' && <> · {plural(language, count, text.pageCount)}</>}
      </span>

      {tile.style === 'stat' && (
        <p className="ns-tile-stat">
          {fillNodes(pluralForm(language, count, text.pageCount), { n: <b data-ns-count={count}>{count}</b> })}
        </p>
      )}

      {/* The title's link covers the whole card; page links inside sit above it */}
      <h3 className="ns-tile-title">
        {first ? (
          <Link href={first.url} className="ns-tile-link">
            {group.name}
          </Link>
        ) : (
          group.name
        )}
      </h3>

      {tile.style === 'feature' && (
        <>
          {first?.description && <p className="ns-tile-text">{first.description}</p>}
          {chips(6)}
          {first && (
            <span className="ns-tile-start">
              {fillNodes(text.startWith, { page: first.name })}
              <ArrowRight aria-hidden />
            </span>
          )}
          <span className="ns-tile-ghost" aria-hidden>
            {number}
          </span>
        </>
      )}

      {tile.style === 'cluster' && (
        <ul className="ns-tile-cluster">
          {group.pages.slice(0, 5).map((page, i) => (
            <li key={i} style={vars({ '--j': i })}>
              <Link href={page.url} title={typeof page.name === 'string' ? page.name : undefined}>
                {badge(page, i)}
                <span className="sr-only">{page.name}</span>
              </Link>
            </li>
          ))}
          {count > 5 && (
            <li className="ns-tile-badge ns-tile-badge-more" style={vars({ '--j': 5 })}>
              +{count - 5}
            </li>
          )}
        </ul>
      )}

      {tile.style === 'stack' && (
        <>
          <ul className="ns-tile-stack">
            {group.pages.slice(0, 4).map((page, i) => (
              <li key={i} style={vars({ '--j': i })}>
                <Link href={page.url}>
                  {badge(page, i)}
                  <span>{page.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          {more(4)}
        </>
      )}

      {tile.style === 'stat' && first && (
        <p className="ns-tile-text">
          {group.pages
            .slice(0, 2)
            .map((page) => page.name)
            .filter((name): name is string => typeof name === 'string')
            .join(' · ')}
        </p>
      )}

      {tile.style === 'strip' && (
        <>
          {chips(5)}
          <ArrowRight className="ns-tile-arrow" aria-hidden />
        </>
      )}
    </article>
  );
}

/* ── Get started: numbered steps and a terminal that types them ────────── */

/** Default "Get started": run this repo locally */
function runLocally(site: SiteConfig, text: NotesText): StartSection {
  const folder = site.repo.split('/').pop() ?? site.repo;
  return {
    title: text.runTitle,
    text: text.runText,
    steps: [
      { title: text.runCloneTitle, text: text.runCloneText, command: `git clone ${repoUrl(site)}.git` },
      { title: text.runInstallTitle, text: text.runInstallText, command: `cd ${folder} && npm install` },
      { title: text.runRunTitle, text: text.runRunText, command: 'npm run dev' },
    ],
  };
}

function GetStarted({ section, text }: { section: StartSection; text: NotesText }) {
  const all = section.steps.map((step) => step.command).join('\n');

  return (
    <section className="ns-home-section" aria-labelledby="ns-home-start">
      <SectionHead id="ns-home-start" eyebrow={text.getStarted} title={section.title}>
        {section.text}
      </SectionHead>
      <div className="ns-start">
        <ol className="ns-steps ns-reveal">
          {section.steps.map((step, i) => (
            <li key={i} className="ns-step">
              <span className="ns-step-number">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="ns-terminal ns-reveal" style={vars({ '--i': 1 })}>
          <div className="ns-terminal-bar">
            <span className="ns-preview-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span>{text.terminal}</span>
            <CopyButton text={all} label={text.copyCommands} copiedLabel={text.copied} />
          </div>
          <pre className="ns-terminal-body">
            {section.steps.map((step, i) => (
              <code key={i} className="ns-terminal-line" style={vars({ '--i': i, '--n': step.command.length })}>
                <span className="ns-terminal-prompt">$ </span>
                <span className="ns-terminal-type">{step.command}</span>
              </code>
            ))}
            <code className="ns-terminal-line ns-terminal-out" style={vars({ '--i': section.steps.length })}>
              <span className="ns-terminal-ok">✓</span> {section.done ?? text.terminalDone}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
