import { describe, expect, it } from 'vitest';
import * as main from '../src/index.js';
import * as mdx from '../src/mdx.js';
import * as next from '../src/next.js';
import * as routes from '../src/routes/index.js';
import * as source from '../src/source/index.js';

// The package's public API: what notes sites can import. Removing a name after a
// release breaks the sites that use it, so this list changes only on purpose.
// (Types are not listed: TypeScript removes them before the tests run.)
const names = (entry: object) => Object.keys(entry).sort();

describe('public exports', () => {
  it('notestack', () => {
    expect(names(main)).toEqual([
      'Callout',
      'Glossary',
      'LanguageRedirect',
      'NotesHome',
      'NotesHomeLayout',
      'NotesLayout',
      'NotesRoot',
      'defaultLanguageOf',
      'defineSiteConfig',
      'notesLanguages',
      'notesMetadata',
      'siteFor',
    ]);
  });

  it('notestack/routes', () => {
    expect(names(routes)).toEqual([
      'createNotesPage',
      'llmsFullRoute',
      'llmsPageRoute',
      'llmsTxtRoute',
      'ogImageRoute',
      'searchRoute',
    ]);
  });

  it('notestack/mdx, /source and /next', () => {
    expect(names(mdx)).toEqual(['getMDXComponents']);
    expect(names(source)).toEqual(['notesSourcePlugins']);
    expect(names(next)).toEqual(['withNotestack']);
  });
});
