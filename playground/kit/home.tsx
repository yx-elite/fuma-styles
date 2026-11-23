// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { CopyButton } from './copy-button';
import { DocsPreview } from './home-preview';
import { HomeEffects } from './home-effects';
import { SearchButton } from './search-button';
import { pageLastModified } from './source';
import { repoUrl, type SiteConfig, type StartSection } from './site';
import { notesStack, type StackItem } from './stack';

/** The parts of a Fumadocs `loader()` source the home page reads. */
export interface HomeSource {
  getPageTree(): PageTree.Root;
  getPages(): { data: object; absolutePath?: string }[];
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
export function groupPageTree(tree: PageTree.Root): HomeGroup[] {
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
        current = { name: 'Start here', pages: [] };
        groups.push(current);
      }
      current.pages.push(node);
    }
  }

  return groups.filter((group) => group.pages.length > 0);
}

function latestUpdate(source: HomeSource): Date | undefined {
  let latest: number | undefined;
  for (const page of source.getPages()) {
    const time = pageLastModified(page)?.getTime();
    if (time !== undefined && (latest === undefined || time > latest)) latest = time;
  }
  return latest === undefined ? undefined : new Date(latest);
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** Repeat a short list until it has at least `min` items, so a looping strip never shows a gap */
function fill<T>(items: T[], min: number): T[] {
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
  docsPath = '/docs',
}: {
  site: SiteConfig;
  source: HomeSource;
  docsPath?: string;
}) {
  const groups = groupPageTree(source.getPageTree());
  const pageCount = groups.reduce((sum, group) => sum + group.pages.length, 0);
  const updated = latestUpdate(source);
  const firstUrl = groups[0]?.pages[0]?.url ?? docsPath;
  const words = site.name.split(/\s+/);

  return (
    <main className="fs-home">
      <section className="fs-home-hero">
        {site.tag && (
          <span className="fs-home-badge">
            <span className="fs-home-badge-dot" aria-hidden />
            <span className="fs-shiny">{site.tag}</span>
          </span>
        )}
        <h1 className="fs-home-title" aria-label={site.name}>
          {words.map((word, i) => (
            <span key={i} className="fs-home-word" style={vars({ '--i': i })} aria-hidden>
              {word}
            </span>
          ))}
        </h1>
        <p className="fs-home-text">{site.description}</p>
        <div className="fs-home-actions">
          <Link href={docsPath} className="fs-button fs-button-primary">
            Start reading
            <ArrowRight />
          </Link>
          <a href={repoUrl(site)} className="fs-button fs-button-secondary" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
        <p className="fs-home-stats">
          <span>
            <b data-fs-count={pageCount}>{pageCount}</b> pages
          </span>
          <span>
            <b data-fs-count={groups.length}>{groups.length}</b> sections
          </span>
          {updated && (
            <span>
              Updated <time dateTime={updated.toISOString()}>{dateFormat.format(updated)}</time>
            </span>
          )}
        </p>
      </section>

      <div className="fs-home-preview">
        <DocsPreview site={site} groups={groups} href={firstUrl} />
      </div>

      <StackStrip items={notesStack} />

      {groups.length > 0 && (
        <section className="fs-home-section" aria-labelledby="fs-home-contents">
          <SectionHead id="fs-home-contents" eyebrow="Contents" title="What's inside">
            {plural(pageCount, 'page')} in {plural(groups.length, 'section')}. Jump into any of them, or start
            from the first page.
          </SectionHead>
          <div className="fs-home-cards" data-count={Math.min(groups.length, 4)}>
            {groups.map((group, i) => (
              <SectionCard key={i} group={group} index={i} />
            ))}
          </div>
        </section>
      )}

      {site.start !== false && <GetStarted section={site.start ?? runLocally(site)} />}

      <section className="fs-home-cta fs-reveal">
        <div>
          <h2 className="fs-home-h2">Find anything in seconds</h2>
          <p className="fs-home-lead">Every page is searchable. Search runs in your browser, so results show as you type.</p>
        </div>
        <div className="fs-home-actions">
          <SearchButton />
          <Link href={docsPath} className="fs-button fs-button-primary">
            Start reading
            <ArrowRight />
          </Link>
        </div>
      </section>

      <footer className="fs-home-footer">
        <span>
          {site.name}
          {site.author && <> · by {site.author}</>}
        </span>
        <nav aria-label="Footer">
          <a href={repoUrl(site)} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://fumadocs.dev" target="_blank" rel="noreferrer">
            Built with Fumadocs
          </a>
        </nav>
      </footer>

      <HomeEffects />
    </main>
  );
}

function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <header className="fs-home-section-head fs-reveal">
      <p className="fs-home-eyebrow">{eyebrow}</p>
      <h2 id={id} className="fs-home-h2">
        {title}
      </h2>
      <p className="fs-home-lead">{children}</p>
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

function StackStrip({ items }: { items: StackItem[] }) {
  const row = fill(items, 10);
  const strip = (copy: boolean) => (
    <ul className="fs-marquee-group" aria-hidden={copy || undefined}>
      {row.map((item, i) => (
        <li key={i}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="fs-stack-item"
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
    <section className="fs-home-stack fs-reveal" aria-label="Built with">
      <p className="fs-home-stack-label">Built with</p>
      <div className="fs-marquee" style={vars({ '--fs-duration': `${row.length * 4}s` })}>
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/* ── Section card: a moving list of the section's pages, then its name ─── */

function SectionCard({ group, index }: { group: HomeGroup; index: number }) {
  const first = group.pages[0];
  const items = fill(group.pages, 6);
  const more = group.pages.length - 3;

  const list = (copy: boolean) => (
    <ul className="fs-marquee-group" aria-hidden={copy || undefined}>
      {items.map((page, i) => (
        <li key={i}>
          <Link href={page.url} className="fs-page-chip" tabIndex={copy || i >= group.pages.length ? -1 : undefined}>
            <b>{page.name}</b>
            {page.description && <span>{page.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <article className="fs-card fs-reveal" style={vars({ '--i': index })}>
      <div
        className="fs-card-visual fs-marquee"
        data-vertical
        data-reverse={index % 2 === 1 || undefined}
        style={vars({ '--fs-duration': `${items.length * 3.5}s` })}
      >
        {list(false)}
        {list(true)}
      </div>
      <div className="fs-card-body">
        <div className="fs-card-head">
          <span className="fs-card-icon" data-number={group.icon ? undefined : true}>
            {group.icon ?? String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="fs-card-title">{group.name}</h3>
          <span className="fs-card-count">{plural(group.pages.length, 'page')}</span>
        </div>
        <p className="fs-card-text">
          {group.pages.slice(0, 3).map((page, i) => (
            <span key={i}>
              {i > 0 && ', '}
              {page.name}
            </span>
          ))}
          {more > 0 && ` and ${more} more`}.
        </p>
        {first && (
          <Link href={first.url} className="fs-card-start">
            Start with {first.name}
            <ArrowRight aria-hidden />
          </Link>
        )}
      </div>
    </article>
  );
}

/* ── Get started: numbered steps and a terminal that types them ────────── */

/** Default "Get started": run this repo locally */
function runLocally(site: SiteConfig): StartSection {
  const folder = site.repo.split('/').pop() ?? site.repo;
  return {
    title: 'Run the notes on your machine',
    text: 'The notes are a plain Fumadocs site. Three commands and you can read them offline, or edit your own copy.',
    steps: [
      { title: 'Clone the repo', text: 'Get your own copy from GitHub.', command: `git clone ${repoUrl(site)}.git` },
      { title: 'Install', text: 'Fumadocs, Next.js and the theme, from npm.', command: `cd ${folder} && npm install` },
      { title: 'Run', text: 'Start the site, then open localhost:3000. Edits show as you save.', command: 'npm run dev' },
    ],
  };
}

function GetStarted({ section }: { section: StartSection }) {
  const all = section.steps.map((step) => step.command).join('\n');

  return (
    <section className="fs-home-section" aria-labelledby="fs-home-start">
      <SectionHead id="fs-home-start" eyebrow="Get started" title={section.title}>
        {section.text}
      </SectionHead>
      <div className="fs-start">
        <ol className="fs-steps fs-reveal">
          {section.steps.map((step, i) => (
            <li key={i} className="fs-step">
              <span className="fs-step-number">{i + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="fs-terminal fs-reveal" style={vars({ '--i': 1 })}>
          <div className="fs-terminal-bar">
            <span className="fs-preview-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            <span>Terminal</span>
            <CopyButton text={all} label="Copy the commands" />
          </div>
          <pre className="fs-terminal-body">
            {section.steps.map((step, i) => (
              <code key={i} className="fs-terminal-line" style={vars({ '--i': i, '--n': step.command.length })}>
                <span className="fs-terminal-prompt">$ </span>
                <span className="fs-terminal-type">{step.command}</span>
              </code>
            ))}
            <code className="fs-terminal-line fs-terminal-out" style={vars({ '--i': section.steps.length })}>
              <span className="fs-terminal-ok">✓</span> {section.done ?? 'Ready on http://localhost:3000'}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
