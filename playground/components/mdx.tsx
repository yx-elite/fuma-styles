import { getMDXComponents } from '@yx-elite/notestack/mdx';

export { getMDXComponents };
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
