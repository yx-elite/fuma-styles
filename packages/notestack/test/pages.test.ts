import { describe, expect, it } from 'vitest';
import { pageImage, pageMarkdownUrl } from '../src/routes/urls.js';
import { pageLastModified } from '../src/source/last-modified.js';

describe('pageImage', () => {
  it('puts each page share image under /og/docs', () => {
    expect(pageImage({ slugs: ['networking', 'vpc'] })).toEqual({
      segments: ['networking', 'vpc', 'image.png'],
      url: '/og/docs/networking/vpc/image.png',
    });
    expect(pageImage({ slugs: [] }).url).toBe('/og/docs/image.png');
  });

  it('puts the language first on a site with languages', () => {
    expect(pageImage({ slugs: ['networking'], locale: 'zh-CN' }).url).toBe('/zh-CN/og/docs/networking/image.png');
  });
});

describe('pageMarkdownUrl', () => {
  it('serves each page as Markdown under /llms.mdx', () => {
    expect(pageMarkdownUrl({ url: '/docs/networking/vpc' })).toBe('/llms.mdx/docs/networking/vpc.md');
  });
});

describe('pageLastModified', () => {
  const day = '2026-11-23T10:00:00.000Z';

  it('reads the date from a Date, a string or a number', () => {
    expect(pageLastModified({ data: { lastModified: new Date(day) } })?.toISOString()).toBe(day);
    expect(pageLastModified({ data: { lastModified: day } })?.toISOString()).toBe(day);
    expect(pageLastModified({ data: { lastModified: Date.parse(day) } })?.toISOString()).toBe(day);
  });

  it('gives nothing for a page without a usable date', () => {
    expect(pageLastModified({ data: {} })).toBeUndefined();
    expect(pageLastModified({ data: { lastModified: 'not a date' } })).toBeUndefined();
    expect(pageLastModified({ data: { lastModified: null } })).toBeUndefined();
  });
});
