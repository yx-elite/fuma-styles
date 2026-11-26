import Link from "fumadocs-core/link";
import type * as PageTree from "fumadocs-core/page-tree";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "../components/copy-button.js";
import { DocsPreview } from "./home-preview.js";
import { HomeEffects } from "./home-effects.js";
import { HomeFooter } from "./home-footer.js";
import { StartTabs } from "./start-tabs.js";
import { SearchButton } from "../components/search-button.js";
import { pageLastModified } from "../source/last-modified.js";
import {
  repoUrl,
  type AgentStart,
  type SiteConfig,
  type StartSection,
} from "../config/site.js";
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
} from "../i18n/index.js";
import { NotesLogo } from "./logo.js";
import { lucideIcon } from "../icons.js";
import { agents } from "./agents.js";
import {
  isNotestackSite,
  notestack,
  stackFor,
  type StackItem,
} from "./stack.js";
import { StarButton } from "./star-button.js";

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
    if (node.type === "page") out.push(node);
    else if (node.type === "folder") {
      if (node.index) out.push(node.index);
      collectPages(node.children, out);
    }
  }
}

/**
 * Sections of the docs, in sidebar order. Each separator starts a section with the
 * loose pages under it. A separator's only folder, when no loose page comes before
 * it, belongs to the separator's section; every other folder is a section of its own,
 * so a separator over several folders (`---Notes---`, then one folder per topic) is a
 * heading and each folder gets its own card.
 */
export function groupPageTree(
  tree: PageTree.Root,
  firstSection = "Start here",
): HomeGroup[] {
  // Split the sidebar at its separators; the nodes before the first one have none
  const blocks: { separator?: PageTree.Separator; nodes: PageTree.Node[] }[] = [
    { nodes: [] },
  ];
  for (const node of tree.children) {
    if (node.type === "separator") blocks.push({ separator: node, nodes: [] });
    else blocks[blocks.length - 1].nodes.push(node);
  }

  const groups: HomeGroup[] = [];
  for (const { separator, nodes } of blocks) {
    const own: HomeGroup = {
      name: separator?.name ?? firstSection,
      icon: separator?.icon,
      pages: [],
    };
    // The separator's own section takes its place where its first page is, so the
    // sections keep the sidebar's order (folder A, loose page, folder B)
    let placed = false;
    const place = () => {
      if (!placed) groups.push(own);
      placed = true;
    };
    const onlyFolder =
      separator !== undefined &&
      nodes.filter((node) => node.type === "folder").length === 1;

    for (const node of nodes) {
      if (node.type === "folder") {
        if (onlyFolder && own.pages.length === 0) {
          place();
          own.icon ??= node.icon;
          collectPages([node], own.pages);
        } else {
          const group: HomeGroup = {
            name: node.name,
            icon: node.icon,
            pages: [],
          };
          collectPages([node], group.pages);
          groups.push(group);
        }
      } else if (node.type === "page") {
        place();
        own.pages.push(node);
      }
    }
  }

  return groups.filter((group) => group.pages.length > 0);
}

function latestUpdate(source: HomeSource, language?: string): Date | undefined {
  let latest: number | undefined;
  for (const page of source.getPages(language)) {
    const time = pageLastModified(page)?.getTime();
    if (time !== undefined && (latest === undefined || time > latest))
      latest = time;
  }
  return latest === undefined ? undefined : new Date(latest);
}

/** Notestack's own site: the command that makes a new notes site */
const CREATE_COMMAND = "npm create notestack@latest";

/** Notestack's own site: the theme's changelog, for the version pill */
const changelogUrl = (site: SiteConfig) =>
  `${repoUrl(site)}/blob/main/packages/notestack/CHANGELOG.md`;

/**
 * Notestack's own site: the description's last word highlighted
 * ("…reads *beautifully*."). Chinese, Japanese and Korean text, which has no spaces
 * between words, stays as it is.
 */
function accentLastWord(description: string): ReactNode {
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(description)) {
    return description;
  }
  const match = /^(.*\s)(\S+?)([.!?…]?)$/.exec(description);
  if (!match) return description;
  return (
    <>
      {match[1]}
      <span className="ns-home-accent">{match[2]}</span>
      {match[3]}
    </>
  );
}

const vars = (values: Record<string, string | number>) =>
  values as CSSProperties;

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
  docsPath = localizeHref("/docs", site),
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
  const groups = groupPageTree(
    source.getPageTree(treeLanguage),
    text.firstSection,
  );
  const pageCount = groups.reduce((sum, group) => sum + group.pages.length, 0);
  // The mosaic shows the first sections as cards; the rest get one row under it
  const shown = groups.slice(0, MOSAIC_MAX);
  const hidden = groups.slice(MOSAIC_MAX);
  const updated = latestUpdate(source, treeLanguage);
  const firstUrl = groups[0]?.pages[0]?.url ?? docsPath;
  const words = site.name.split(/\s+/);
  const own = isNotestackSite(site);
  // Set by withNotestack() from the installed package (next.config.mjs)
  const version = process.env.NOTESTACK_VERSION;

  return (
    <main className="ns-home">
      <section className="ns-home-hero">
        {own ? (
          // Notestack's own site: the theme's version and a link to what changed
          <a href={changelogUrl(site)} className="ns-home-badge" target="_blank" rel="noreferrer">
            <span className="ns-home-badge-dot" aria-hidden />
            <span className="ns-shiny">
              {version ? `v${version} · ` : ""}
              {text.pageCardStarLabel}
            </span>
          </a>
        ) : (
          site.tag && (
            <span className="ns-home-badge">
              <span className="ns-home-badge-dot" aria-hidden />
              <span className="ns-shiny">{site.tag}</span>
            </span>
          )
        )}
        <h1 className="ns-home-title" aria-label={site.name}>
          {words.map((word, i) => (
            <span
              key={i}
              className="ns-home-word"
              style={vars({ "--ns-i": i })}
              aria-hidden
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="ns-home-text">{own ? accentLastWord(site.description) : site.description}</p>
        <div className="ns-home-actions">
          <Link href={docsPath} className="ns-button ns-button-primary">
            {text.startReading}
            <ArrowRight />
          </Link>
          {isNotestackSite(site) ? (
            <StarButton
              repo={site.repo}
              label={text.starOnGitHub}
              language={language}
            />
          ) : (
            <a
              href={repoUrl(site)}
              className="ns-button ns-button-secondary"
              target="_blank"
              rel="noreferrer"
            >
              {text.viewOnGitHub}
            </a>
          )}
        </div>
        {own ? (
          // Notestack's own site: how to start a site, ready to copy
          <div className="ns-home-command">
            <code>
              <span aria-hidden>$ </span>
              {CREATE_COMMAND}
            </code>
            <CopyButton
              text={CREATE_COMMAND}
              label={text.copy}
              copiedLabel={text.copied}
            />
          </div>
        ) : (
        <p className="ns-home-stats">
          <span>
            {fillNodes(pluralForm(language, pageCount, text.pageCount), {
              n: <b data-ns-count={pageCount}>{pageCount}</b>,
            })}
          </span>
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
                    {formatDate(language, updated, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                ),
              })}
            </span>
          )}
        </p>
        )}
      </section>

      <div className="ns-home-preview">
        <DocsPreview site={site} groups={groups} href={firstUrl} text={text} />
      </div>

      <StackStrip items={stackFor(site)} label={text.builtWith} />

      {groups.length > 0 && (
        <section className="ns-home-section" aria-labelledby="ns-home-contents">
          <SectionHead
            id="ns-home-contents"
            eyebrow={text.contentsEyebrow}
            title={text.contentsTitle}
          >
            {fill(text.contentsText, {
              pages: plural(language, pageCount, text.pageCount),
              sections: plural(language, groups.length, text.sectionCount),
            })}
          </SectionHead>
          <div className="ns-mosaic">
            {mosaic(shown.length).map((tile, i) => (
              <SectionCard
                key={i}
                group={shown[i]}
                index={i}
                tile={tile}
                text={text}
                language={language}
              />
            ))}
            {hidden.length > 0 && (
              <MoreSections
                groups={hidden}
                href={firstUrl}
                text={text}
                language={language}
                index={shown.length}
              />
            )}
          </div>
        </section>
      )}

      {site.start !== false && (
        <GetStarted
          section={site.start ?? runLocally(site, text)}
          text={text}
        />
      )}

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

function SectionHead({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
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
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
      >
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
      <div
        className="ns-marquee"
        style={vars({ "--ns-duration": `${row.length * 4}s` })}
      >
        {strip(false)}
        {strip(true)}
      </div>
    </section>
  );
}

/** Section cards in the mosaic: the feature, three tiles beside it and one row of two strips */
const MOSAIC_MAX = 6;

/**
 * Last row of a full mosaic, a strip across the whole width: the numbers of the
 * sections left, how many, the first few by name, and a link into the docs
 */
function MoreSections({
  groups,
  href,
  text,
  language,
  index,
}: {
  groups: HomeGroup[];
  href: string;
  text: NotesText;
  language: string;
  index: number;
}) {
  const number = (i: number) => String(i + 1).padStart(2, "0");
  const last = index + groups.length - 1;

  return (
    <article
      className="ns-card ns-tile ns-reveal"
      data-style="strip"
      style={vars({ "--ns-i": index, "--ns-area": "auto / 1 / auto / -1" })}
    >
      <span className="ns-tile-meta">
        {last > index ? `${number(index)}–${number(last)}` : number(index)}
      </span>
      <h3 className="ns-tile-title">
        <Link href={href} className="ns-tile-link">
          {plural(language, groups.length, text.moreSections)}
        </Link>
      </h3>
      <ul className="ns-tile-chips">
        {groups.slice(0, 4).map((group, i) => (
          <li key={i} style={vars({ "--ns-j": i })}>
            <Link href={group.pages[0].url} className="ns-tile-chip">
              {group.icon}
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
      <span className="ns-tile-start">
        {text.seeAllSections}
        <ArrowRight aria-hidden />
      </span>
    </article>
  );
}

/* ── Section card: a moving list of the section's pages, then its name ─── */

/** How a section card looks: each shows the same section a different way, so neighbours never match */
type TileStyle = "feature" | "cluster" | "stack" | "stat" | "strip";

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
  if (count === 1) return [{ style: "feature", area: "1 / 1 / 2 / 7" }];
  if (count === 2) {
    return [
      { style: "feature", area: "1 / 1 / 3 / 4" },
      { style: "stack", area: "1 / 4 / 3 / 7" },
    ];
  }
  if (count === 3) {
    return [
      { style: "feature", area: "1 / 1 / 3 / 4" },
      { style: "cluster", area: "1 / 4 / 2 / 7" },
      { style: "cluster", area: "2 / 4 / 3 / 7" },
    ];
  }
  const tiles: Tile[] = [
    { style: "feature", area: "1 / 1 / 4 / 4" },
    { style: "cluster", area: "1 / 4 / 2 / 7" },
    { style: "stack", area: "2 / 4 / 4 / 6" },
    { style: "stat", area: "2 / 6 / 4 / 7" },
  ];
  for (let i = 4; i < count; i++) {
    const row = 4 + Math.floor((i - 4) / 2);
    const left = (i - 4) % 2 === 0;
    const alone = left && i === count - 1;
    tiles.push({
      style: "strip",
      area: `${row} / ${alone ? 1 : left ? 1 : 4} / ${row + 1} / ${alone || !left ? 7 : 4}`,
    });
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
  const number = String(index + 1).padStart(2, "0");
  const count = group.pages.length;
  const more = (shown: number) =>
    count > shown ? (
      <span className="ns-tile-more">
        {fill(text.andMore, { n: count - shown }).replace(/^[\s,，、]+/, "")}
      </span>
    ) : null;
  // The page's own icon, or its number when it has none
  const badge = (page: HomePage, i: number) => (
    <span className="ns-tile-badge" data-number={page.icon ? undefined : true}>
      {page.icon ?? String(i + 1).padStart(2, "0")}
    </span>
  );
  const chips = (shown: number) => (
    <ul className="ns-tile-chips">
      {group.pages.slice(0, shown).map((page, i) => (
        <li key={i} style={vars({ "--ns-j": i })}>
          <Link href={page.url} className="ns-tile-chip">
            {page.icon}
            {page.name}
          </Link>
        </li>
      ))}
      {count > shown && (
        <li style={vars({ "--ns-j": shown })}>{more(shown)}</li>
      )}
    </ul>
  );

  return (
    <article
      className="ns-card ns-tile ns-reveal"
      data-style={tile.style}
      style={vars({ "--ns-i": index, "--ns-area": tile.area })}
    >
      <span className="ns-tile-meta">
        {number}
        {tile.style !== "stat" && (
          <> · {plural(language, count, text.pageCount)}</>
        )}
      </span>

      {tile.style === "stat" && (
        <p className="ns-tile-stat">
          {fillNodes(pluralForm(language, count, text.pageCount), {
            n: <b data-ns-count={count}>{count}</b>,
          })}
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

      {tile.style === "feature" && (
        <>
          {first?.description && (
            <p className="ns-tile-text">{first.description}</p>
          )}
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

      {tile.style === "cluster" && (
        <ul className="ns-tile-cluster">
          {group.pages.slice(0, 5).map((page, i) => (
            <li key={i} style={vars({ "--ns-j": i })}>
              <Link
                href={page.url}
                title={typeof page.name === "string" ? page.name : undefined}
              >
                {badge(page, i)}
                <span className="sr-only">{page.name}</span>
              </Link>
            </li>
          ))}
          {count > 5 && (
            <li
              className="ns-tile-badge ns-tile-badge-more"
              style={vars({ "--ns-j": 5 })}
            >
              +{count - 5}
            </li>
          )}
        </ul>
      )}

      {tile.style === "stack" && (
        <>
          <ul className="ns-tile-stack">
            {group.pages.slice(0, 4).map((page, i) => (
              <li key={i} style={vars({ "--ns-j": i })}>
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

      {tile.style === "stat" && first && (
        <p className="ns-tile-text">
          {group.pages
            .slice(0, 2)
            .map((page) => page.name)
            .filter((name): name is string => typeof name === "string")
            .join(" · ")}
        </p>
      )}

      {tile.style === "strip" && (
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
  const folder = site.repo.split("/").pop() ?? site.repo;
  return {
    title: text.runTitle,
    text: text.runText,
    steps: [
      {
        title: text.runCloneTitle,
        text: text.runCloneText,
        command: `git clone ${repoUrl(site)}.git`,
      },
      {
        title: text.runInstallTitle,
        text: text.runInstallText,
        command: `cd ${folder} && npm install`,
      },
      {
        title: text.runRunTitle,
        text: text.runRunText,
        command: "npm run dev",
      },
    ],
  };
}

function GetStarted({
  section,
  text,
}: {
  section: StartSection;
  text: NotesText;
}) {
  return (
    <section className="ns-home-section" aria-labelledby="ns-home-start">
      <SectionHead
        id="ns-home-start"
        eyebrow={text.getStarted}
        title={section.title}
      >
        {section.text}
      </SectionHead>
      {section.agent ? (
        <StartTabs labels={[text.startByHand, text.startWithAgent]}>
          <ByHand section={section} text={text} />
          <WithAgent agent={section.agent} text={text} />
        </StartTabs>
      ) : (
        <ByHand section={section} text={text} />
      )}
    </section>
  );
}

/** Numbered steps beside a terminal that types the commands */
function ByHand({ section, text }: { section: StartSection; text: NotesText }) {
  const all = section.steps.map((step) => step.command).join("\n");

  return (
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
      <div className="ns-terminal ns-reveal" style={vars({ "--ns-i": 1 })}>
        <div className="ns-terminal-bar">
          <span className="ns-preview-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span>{text.terminal}</span>
          <CopyButton
            text={all}
            label={text.copyCommands}
            copiedLabel={text.copied}
          />
        </div>
        <pre className="ns-terminal-body">
          {section.steps.map((step, i) => (
            <code
              key={i}
              className="ns-terminal-line"
              style={vars({ "--ns-i": i, "--ns-n": step.command.length })}
            >
              <span className="ns-terminal-prompt">$ </span>
              <span className="ns-terminal-type">{step.command}</span>
            </code>
          ))}
          <code
            className="ns-terminal-line ns-terminal-out"
            style={vars({ "--ns-i": section.steps.length })}
          >
            <span className="ns-terminal-ok">✓</span>{" "}
            {section.done ?? text.terminalDone}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * The same layout for an AI agent: numbered steps beside a chat window, and the agents it
 * works with. The prompt types in word by word, then each of the agent's steps spins and
 * ticks off in turn. On wide screens the switch sits in the window's title bar (theme.css).
 */
function WithAgent({ agent, text }: { agent: AgentStart; text: NotesText }) {
  const steps = [
    { title: text.agentCopyTitle, text: text.agentCopyText },
    { title: text.agentPasteTitle, text: text.agentPasteText },
    { title: text.agentCheckTitle, text: text.agentCheckText },
  ];
  let word = 0;
  const prompt = agent.prompt.split(/(\s+)/).map((part, i) =>
    /^\s*$/.test(part) ? (
      part
    ) : (
      <span
        key={i}
        className="ns-agent-word"
        style={vars({ "--ns-i": word++ })}
      >
        {part}
      </span>
    ),
  );
  return (
    <div className="ns-start">
      <ol className="ns-steps">
        {steps.map((step, i) => (
          <li key={i} className="ns-step">
            <span className="ns-step-number">{i + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {i === 0 && (
                <div className="ns-agent-copy">
                  <CopyButton
                    text={agent.prompt}
                    label={text.copyInstructions}
                    copiedLabel={text.copied}
                  >
                    {text.copyInstructions}
                  </CopyButton>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div
        className="ns-terminal ns-agent"
        style={vars({ "--ns-words": word })}
      >
        <div className="ns-terminal-bar">
          <span className="ns-preview-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span>
            <Sparkles className="ns-agent-mark" aria-hidden />
            {text.agentWindow}
          </span>
          <CopyButton
            text={agent.prompt}
            label={text.copyInstructions}
            copiedLabel={text.copied}
          />
        </div>
        <div className="ns-agent-body">
          <p className="ns-agent-prompt">{prompt}</p>
          <ul className="ns-agent-steps">
            {agent.steps.map((step, i) => (
              <li key={i} style={vars({ "--ns-i": i })}>
                <span className="ns-agent-spinner" aria-hidden />
                <Check className="ns-agent-check" aria-hidden />
                {step}
              </li>
            ))}
            <li
              className="ns-agent-done"
              style={vars({ "--ns-i": agent.steps.length })}
            >
              {agent.done ?? text.agentDone}
            </li>
          </ul>
        </div>
      </div>
      <div className="ns-agent-works">
        <span className="ns-agent-works-label">{text.agentWorksWith}</span>
        <ul className="ns-agent-chips">
          {agents.map((item, i) => (
            <li key={item.name} style={vars({ "--ns-i": i })}>
              <a
                className="ns-agent-chip"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.path ? (
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={item.path} fill="currentColor" />
                  </svg>
                ) : (
                  lucideIcon(item.icon)
                )}
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
