import { getMDXComponents as notesMDXComponents } from '@yx-elite/notestack/mdx';
import { defaultLanguageOf, siteFor } from '@yx-elite/notestack';
import type { MDXComponents } from 'mdx/types';
import site from '@/site.config';

/** The theme's MDX components, in the page's language (`lang` from the URL) */
export const getMDXComponents = (components?: MDXComponents, lang = defaultLanguageOf(site)) =>
  notesMDXComponents(components, { site: siteFor(site, lang) });
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
