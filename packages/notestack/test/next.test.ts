import { describe, expect, it } from 'vitest';
import { withNotestack } from '../src/next.js';

describe('withNotestack', () => {
  it('sets up a static export for S3', () => {
    const config = withNotestack();
    expect(config.output).toBe('export');
    expect(config.trailingSlash).toBe(true);
    expect(config.images?.unoptimized).toBe(true);
  });

  it('keeps the site own options', () => {
    const config = withNotestack({ basePath: '/notes', reactStrictMode: false });
    expect(config.basePath).toBe('/notes');
    expect(config.reactStrictMode).toBe(false);
  });

  it('never lets a site turn the static export off', () => {
    const config = withNotestack({ output: 'standalone', trailingSlash: false, images: { unoptimized: false } });
    expect(config.output).toBe('export');
    expect(config.trailingSlash).toBe(true);
    expect(config.images?.unoptimized).toBe(true);
  });

  it('keeps the site image settings next to unoptimized', () => {
    const config = withNotestack({ images: { remotePatterns: [{ hostname: 'example.com' }] } });
    expect(config.images?.remotePatterns).toEqual([{ hostname: 'example.com' }]);
    expect(config.images?.unoptimized).toBe(true);
  });
});
