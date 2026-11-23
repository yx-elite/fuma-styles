import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { CopyButton } from '../components/copy-button.js';
import { DocsPreview } from './home-preview.js';
import { HomeEffects } from './home-effects.js';
import { SearchButton } from '../components/search-button.js';
import { pageLastModified } from '../source/index.js';
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
  type NotesText,
} from '../i18n/index.js';
import { notesStack, type StackItem } from './stack.js';

/** The parts of a Fumadocs `loader()` source the home page reads. */
export interface HomeSource {
  getPageTree(language?: string): PageTree.Root;
  getPages(language?: string): { data: object; absolutePath?: string }[];
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
          <span>{fillNodes(plural(language, pageCount, text.pageCount), { n: <b data-ns-count={pageCount}>{pageCount}</b> })}</span>
          <span>
            {fillNodes(plural(language, groups.length, text.sectionCount), {
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

      <StackStrip items={notesStack} label={text.builtWith} />

      {groups.length > 0 && (
        <section className="ns-home-section" aria-labelledby="ns-home-contents">
          <SectionHead id="ns-home-contents" eyebrow={text.contentsEyebrow} title={text.contentsTitle}>
            {fill(text.contentsText, {
              pages: plural(language, pageCount, text.pageCount),
              sections: plural(language, groups.length, text.sectionCount),
            })}
          </SectionHead>
          <div className="ns-home-cards" data-count={Math.min(groups.length, 4)}>
            {groups.map((group, i) => (
              <SectionCard key={i} group={group} index={i} text={text} language={language} />
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

      <footer className="ns-home-footer">
        <span>
          {site.name}
          {site.author && <> · {fill(text.byAuthor, { author: site.author })}</>}
        </span>
        <nav aria-label={text.footerNav}>
          <a href={repoUrl(site)} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://fumadocs.dev" target="_blank" rel="noreferrer">
            {text.builtWithFumadocs}
          </a>
        </nav>
      </footer>

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

function SectionCard({
  group,
  index,
  text,
  language,
}: {
  group: HomeGroup;
  index: number;
  text: NotesText;
  language: string;
}) {
  const first = group.pages[0];
  const items = repeat(group.pages, 6);
  const more = group.pages.length - 3;

  const list = (copy: boolean) => (
    <ul className="ns-marquee-group" aria-hidden={copy || undefined}>
      {items.map((page, i) => (
        <li key={i}>
          <Link href={page.url} className="ns-page-chip" tabIndex={copy || i >= group.pages.length ? -1 : undefined}>
            <b>{page.name}</b>
            {page.description && <span>{page.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <article className="ns-card ns-reveal" style={vars({ '--i': index })}>
      <div
        className="ns-card-visual ns-marquee"
        data-vertical
        data-reverse={index % 2 === 1 || undefined}
        style={vars({ '--ns-duration': `${items.length * 3.5}s` })}
      >
        {list(false)}
        {list(true)}
      </div>
      <div className="ns-card-body">
        <div className="ns-card-head">
          <span className="ns-card-icon" data-number={group.icon ? undefined : true}>
            {group.icon ?? String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="ns-card-title">{group.name}</h3>
          <span className="ns-card-count">{plural(language, group.pages.length, text.pageCount)}</span>
        </div>
        <p className="ns-card-text">
          {group.pages.slice(0, 3).map((page, i) => (
            <span key={i}>
              {i > 0 && text.listSeparator}
              {page.name}
            </span>
          ))}
          {more > 0 && fill(text.andMore, { n: more })}
          {text.listEnd}
        </p>
        {first && (
          <Link href={first.url} className="ns-card-start">
            {fillNodes(text.startWith, { page: first.name })}
            <ArrowRight aria-hidden />
          </Link>
        )}
      </div>
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
