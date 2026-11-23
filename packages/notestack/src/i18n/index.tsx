import { Fragment, type ReactNode } from 'react';
import { en, zhCN, type NotesText, type Plural } from './text.js';

export type { NotesText, Plural } from './text.js';

/** The language part of site.config.ts that text and dates depend on */
export interface LanguageConfig {
  /** BCP 47 language tag, e.g. "en", "zh-CN". Default "en". */
  language?: string;
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

export const languageOf = (site?: LanguageConfig) => site?.language ?? 'en';

/** All of Notestack's text for a site: its language's built-in text (English if none), then `site.text` on top */
export function notesText(site?: LanguageConfig): NotesText {
  return { ...(builtInFor(languageOf(site)) ?? en), ...site?.text };
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
