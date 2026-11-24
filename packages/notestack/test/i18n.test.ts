import { describe, expect, it } from 'vitest';
import type { SiteConfig } from '../src/config/site.js';
import {
  defaultLanguageOf,
  fill,
  formatDate,
  languageOf,
  localizeHref,
  notesText,
  plural,
  siteFor,
  withoutLanguageFolder,
} from '../src/i18n/index.js';

// A page on the Chinese side of an English + Chinese site
const chinesePage = { languages: ['en', 'zh-CN'], language: 'zh-CN' };

describe('localizeHref', () => {
  it('adds the language to links into the docs', () => {
    expect(localizeHref('/docs/networking', chinesePage)).toBe('/zh-CN/docs/networking');
    expect(localizeHref('/docs', chinesePage)).toBe('/zh-CN/docs');
    expect(localizeHref('/docs#intro', chinesePage)).toBe('/zh-CN/docs#intro');
  });

  it('sends the home page to the language home', () => {
    expect(localizeHref('/', chinesePage)).toBe('/zh-CN/');
  });

  it('leaves every other link alone', () => {
    expect(localizeHref('/docsify', chinesePage)).toBe('/docsify');
    expect(localizeHref('/en/docs/networking', chinesePage)).toBe('/en/docs/networking');
    expect(localizeHref('https://example.com/docs', chinesePage)).toBe('https://example.com/docs');
    expect(localizeHref('/diagrams/vpc.svg', chinesePage)).toBe('/diagrams/vpc.svg');
    expect(localizeHref(undefined, chinesePage)).toBeUndefined();
  });

  it('changes nothing on a one-language site', () => {
    expect(localizeHref('/docs/networking', { language: 'fr' })).toBe('/docs/networking');
    expect(localizeHref('/', undefined)).toBe('/');
  });
});

describe('withoutLanguageFolder', () => {
  const site = { languages: ['en', 'zh-CN'] };

  it('drops the language folder from a file path', () => {
    expect(withoutLanguageFolder('en/showcase/cards.mdx', site)).toBe('showcase/cards.mdx');
    expect(withoutLanguageFolder('zh-CN/index.mdx', site)).toBe('index.mdx');
  });

  it('keeps paths without a language folder, and every path on a one-language site', () => {
    expect(withoutLanguageFolder('showcase/cards.mdx', site)).toBe('showcase/cards.mdx');
    expect(withoutLanguageFolder('en/index.mdx', { language: 'en' })).toBe('en/index.mdx');
  });
});

describe('languageOf and defaultLanguageOf', () => {
  it('default to English', () => {
    expect(languageOf()).toBe('en');
    expect(defaultLanguageOf()).toBe('en');
  });

  it('tell the page language apart from the site default', () => {
    expect(languageOf(chinesePage)).toBe('zh-CN');
    expect(defaultLanguageOf(chinesePage)).toBe('en');
  });
});

describe('notesText', () => {
  it('is English by default', () => {
    expect(notesText().backToTop).toBe('Back to top');
  });

  it('ships Simplified Chinese, including other tags for it', () => {
    expect(notesText({ language: 'zh-CN' }).backToTop).toBe('回到顶部');
    expect(notesText({ language: 'zh-Hans-SG' }).backToTop).toBe('回到顶部');
  });

  it('falls back to English for languages it does not ship', () => {
    expect(notesText({ language: 'fr' }).backToTop).toBe('Back to top');
    expect(notesText({ language: 'zh-TW' }).backToTop).toBe('Back to top');
  });

  it('lets a site change any text and keeps the rest', () => {
    const text = notesText({ language: 'fr', text: { backToTop: 'Haut de page' } });
    expect(text.backToTop).toBe('Haut de page');
    expect(text.lastUpdated).toBe('Last updated on {date}');
  });
});

describe('siteFor', () => {
  const site: SiteConfig = {
    name: 'Networking Notes',
    description: 'Notes on networking.',
    repo: 'your-name/networking-notes',
    languages: ['en', 'fr'],
    links: [{ text: 'Glossary', url: '/docs/glossary' }],
    bannerLink: { label: 'Source', href: 'https://github.com/your-name/networking-notes' },
    translations: { fr: { name: 'Notes réseau' } },
  };

  it('uses the translation where there is one, and the default elsewhere', () => {
    const french = siteFor(site, 'fr');
    expect(french.name).toBe('Notes réseau');
    expect(french.description).toBe('Notes on networking.');
    expect(french.language).toBe('fr');
  });

  it('points the site links inside that language', () => {
    expect(siteFor(site, 'fr').links?.[0].url).toBe('/fr/docs/glossary');
    expect(siteFor(site, 'en').links?.[0].url).toBe('/en/docs/glossary');
    expect(siteFor(site, 'fr').bannerLink?.href).toBe('https://github.com/your-name/networking-notes');
  });

  it('changes text for the default language only; other languages set their own', () => {
    const renamed: SiteConfig = {
      ...site,
      languages: ['en', 'zh-CN', 'fr'],
      text: { startReading: 'Open the notes' },
      translations: { fr: { text: { startReading: 'Ouvrir les notes' } } },
    };
    expect(notesText(siteFor(renamed, 'en')).startReading).toBe('Open the notes');
    expect(notesText(siteFor(renamed, 'zh-CN')).startReading).toBe('开始阅读');
    expect(notesText(siteFor(renamed, 'fr')).startReading).toBe('Ouvrir les notes');
  });
});

describe('fill and plural', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(fill('{pages} in {sections}', { pages: '3 pages' })).toBe('3 pages in {sections}');
  });

  it('picks the plural form for the language', () => {
    const pages = { one: '{n} page', other: '{n} pages' };
    expect(plural('en', 1, pages)).toBe('1 page');
    expect(plural('en', 5, pages)).toBe('5 pages');
    expect(plural('zh-CN', 1, { other: '{n} 页' })).toBe('1 页');
  });
});

describe('formatDate', () => {
  const date = new Date('2026-11-23T12:00:00Z');
  const long = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' } as const;

  it('writes English dates day first', () => {
    expect(formatDate('en', date, long)).toBe('23 November 2026');
  });

  it('writes dates in the site language', () => {
    expect(formatDate('zh-CN', date, long)).toBe('2026年11月23日');
  });
});
