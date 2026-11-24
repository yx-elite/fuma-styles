import type { LoaderConfig, LoaderOutput } from 'fumadocs-core/source';
import { createFromSource } from 'fumadocs-core/search/server';

/**
 * The search index, built once at build time and searched in the browser.
 * One index per language; the default tokenizer splits words with Unicode rules,
 * so Chinese and other languages without spaces are searchable too.
 *
 *   export const revalidate = false;
 *   export const GET = searchRoute(source);
 */
export function searchRoute<C extends LoaderConfig>(source: LoaderOutput<C>) {
  return createFromSource(source).staticGET;
}
