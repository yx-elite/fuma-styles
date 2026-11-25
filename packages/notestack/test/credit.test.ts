import { describe, expect, it } from 'vitest';
import type { SiteConfig } from '../src/config/site.js';
import { isNotestackSite, stackFor } from '../src/layouts/stack.js';

const site = (repo: string): SiteConfig => ({ name: 'Notes', description: 'Notes.', repo });
const names = (repo: string) => stackFor(site(repo)).map((item) => item.name);

describe('stackFor (the Built with strip and the footer credit)', () => {
  it('credits Notestack first on a notes site', () => {
    expect(names('your-name/my-notes')[0]).toBe('Notestack');
    expect(stackFor(site('your-name/my-notes'))[0].href).toBe('https://github.com/yx-elite/notestack');
  });

  it('leaves Notestack out on its own docs site, which credits Fumadocs', () => {
    expect(names('yx-elite/notestack')).not.toContain('Notestack');
    expect(names('yx-elite/notestack')[0]).toBe('Fumadocs');
    expect(names('YX-Elite/Notestack')[0]).toBe('Fumadocs');
  });

  it('lists the same libraries in the same order on both', () => {
    expect(names('your-name/my-notes').slice(1)).toEqual(names('yx-elite/notestack'));
  });
});

describe('isNotestackSite (the hero\'s star button)', () => {
  it('is true only for the theme\'s own repo, in any case', () => {
    expect(isNotestackSite(site('yx-elite/notestack'))).toBe(true);
    expect(isNotestackSite(site('YX-Elite/Notestack'))).toBe(true);
    expect(isNotestackSite(site('your-name/my-notes'))).toBe(false);
    expect(isNotestackSite(site('yx-elite/notestack-fork'))).toBe(false);
  });
});
