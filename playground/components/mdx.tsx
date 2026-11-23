import { getMDXComponents as notesMDXComponents } from '@yx-elite/notestack/mdx';
import type { MDXComponents } from 'mdx/types';
import site from '@/site.config';

export const getMDXComponents = (components?: MDXComponents) => notesMDXComponents(components, { site });
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
