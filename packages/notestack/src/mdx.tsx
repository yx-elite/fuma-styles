import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, ComponentType } from 'react';
import { Callout, type CalloutProps } from './components/callout.js';
import { Glossary } from './components/glossary.js';
import { hasLanguageRoutes, languageOf, localizeHref, notesText, type LanguageConfig } from './i18n/index.js';

/**
 * Every component a note can use, plus any site-specific overrides.
 * Pass `{ site }` (on a site with `languages`, the config for the page's language)
 * so text follows the site's language and `/docs/…` links in notes get the page's
 * language added (`/zh-CN/docs/…`).
 */
// The return type is written out on purpose: left to TypeScript, the published
// mdx.d.ts spelled out every component's full type and grew to over 700 kB.
export function getMDXComponents(
  components?: MDXComponents,
  { site }: { site?: LanguageConfig } = {},
): MDXComponents {
  const text = notesText(site);
  const language = languageOf(site);
  const localize = (href: string | undefined) => localizeHref(href, site);

  const merged = {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    Accordion,
    // Fumadocs' Base UI build opens several panels with `multiple`; `type="multiple"`
    // (the Radix build's prop, in most Fumadocs examples) is ignored there, so map it
    Accordions: ({ type, ...props }: ComponentProps<typeof Accordions> & { type?: 'single' | 'multiple' }) => (
      <Accordions multiple={type === 'multiple' || undefined} {...props} />
    ),
    Callout: (props: CalloutProps) => <Callout text={text} {...props} />,
    File,
    Files,
    Folder,
    Glossary: ({ terms, ...props }: ComponentProps<typeof Glossary>) => (
      <Glossary
        text={text}
        language={language}
        terms={terms.map((term) => ({ ...term, href: localize(term.href) }))}
        {...props}
      />
    ),
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  } satisfies MDXComponents;

  if (!hasLanguageRoutes(site)) return merged;

  // Links and cards: whatever renders them (the site may pass its own `a`), with the language added
  const Anchor = (merged.a ?? 'a') as ComponentType<ComponentProps<'a'>>;
  const Card = merged.Card;
  return {
    ...merged,
    a: (props: ComponentProps<'a'>) => <Anchor {...props} href={localize(props.href)} />,
    Card: (props: ComponentProps<typeof Card>) => <Card {...props} href={localize(props.href)} />,
  } satisfies MDXComponents;
}
