import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

// One index per language. The default tokenizer splits words with Unicode rules,
// so Chinese is searchable too (an English-only setting would not split it).
export const { staticGET: GET } = createFromSource(source);
