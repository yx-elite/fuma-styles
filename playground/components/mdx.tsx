import { getMDXComponents } from '@/kit/mdx';

export { getMDXComponents };
export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
