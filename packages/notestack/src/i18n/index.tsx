import { Fragment, type ReactNode } from 'react';
import { en, zhCN, type NotesText, type Plural } from './text.js';
import type { SiteConfig } from '../config/site.js';

export type { NotesText, Plural } from './text.js';

/** The language part of site.config.ts that text, dates and links depend on */
export interface LanguageConfig {
  /** BCP 47 language tag, e.g. "en", "zh-CN". Default "en". */
  language?: string;
  /** Several languages in one site; the first is the default */
  languages?: string[];
  /** Change any of Notestack's text */
  text?: Partial<NotesText>;
}

/** Notestack's text that ships in the package, by language tag (lower case) */
const builtIn: Record<string, NotesText> = { en, 'zh-cn': zhCN };

/** "zh-Hans-CN" → "zh-cn", "zh-SG" → "zh-cn", "en-GB" → "en"; undefined when not shipped */
function builtInFor(language: string): NotesText | undefined {
  const tag = language.toLowerCase();
  if (builtIn[tag]) return builtIn[tag];
  if (/^zh(-hans)?(-(cn|sg|my))?$/.test(tag) || tag.startsWith('zh-hans')) return zhCN;
  return builtIn[tag.split('-')[0]];
}

/** The language a page is in: `language`, else the first of `languages`, else "en" */
export const languageOf = (site?: LanguageConfig) => site?.language ?? site?.languages?.[0] ?? 'en';

/** The site's default language: the first of `languages`, else `language`, else "en" */
export const defaultLanguageOf = (site?: LanguageConfig) => site?.languages?.[0] ?? site?.language ?? 'en';

/** Where the last visited language is kept (localStorage), so `/` opens it next time */
export const languageKey = 'ns-language';

/** True for a site with several languages, whose URLs start with the language */
export const hasLanguageRoutes = (site?: LanguageConfig) => (site?.languages?.length ?? 0) > 0;

/** All of Notestack's text for a site: its language's built-in text (English if none), then `site.text` on top */
export function notesText(site?: LanguageConfig): NotesText {
  return { ...(builtInFor(languageOf(site)) ?? en), ...site?.text };
}

/**
 * Adds the page's language to a link inside the notes, so notes can link to `/docs/…`
 * and the link works in every language: `/docs/risk` → `/zh-CN/docs/risk`.
 * The home page `/` becomes `/zh-CN/`. Other links (files, other sites, already
 * prefixed ones) and every link on a one-language site are left as they are.
 */
export function localizeHref<T extends string | undefined>(href: T, site?: LanguageConfig): T {
  if (!href || !hasLanguageRoutes(site)) return href;
  const language = languageOf(site);
  if (href === '/') return `/${language}/` as T;
  if (/^\/docs(?=$|[/?#])/.test(href)) return `/${language}${href}` as T;
  return href;
}

/**
 * The site config as seen in one language: that language's `translations` on top,
 * `language` set to it, and the site's own links pointing inside it.
 * On a one-language site it returns the config with links unchanged.
 */
export function siteFor<T extends SiteConfig>(site: T, language: string): T {
  const translation = site.translations?.[language];
  const isDefault = language === defaultLanguageOf(site);
  const merged: T = {
    ...site,
    ...translation,
    language,
    text: { ...(isDefault ? site.text : undefined), ...translation?.text },
  };
  return {
    ...merged,
    links: merged.links?.map((link) => ({ ...link, url: localizeHref(link.url, merged) })),
    bannerLink: merged.bannerLink && { ...merged.bannerLink, href: localizeHref(merged.bannerLink.href, merged) },
  };
}

/** Fill `{name}` placeholders with strings or numbers */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Fill `{name}` placeholders with elements, e.g. a <time> or a page name */
export function fillNodes(template: string, values: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return <Fragment key={i}>{key && key in values ? values[key] : part}</Fragment>;
  });
}

/** The right plural form for `n` in this language, with `{n}` filled in */
export function plural(language: string, n: number, forms: Plural): string {
  const category = new Intl.PluralRules(language).select(n) as keyof Plural;
  return fill(forms[category] ?? forms.other, { n });
}

/**
 * Dates in the site's language. Plain "en" keeps day-month-year ("23 November 2026"),
 * as Notestack showed before languages existed.
 */
export function formatDate(language: string, date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : language, options).format(date);
}
