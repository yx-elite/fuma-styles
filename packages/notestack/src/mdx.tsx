import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';
import { Glossary } from './components/glossary.js';
import { languageOf, notesText, type LanguageConfig } from './i18n/index.js';

/**
 * Every component a note can use, plus any site-specific overrides.
 * Pass `{ site }` so components with text (the glossary) use the site's language.
 */
export function getMDXComponents(components?: MDXComponents, { site }: { site?: LanguageConfig } = {}) {
  const text = notesText(site);
  const language = languageOf(site);

  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as any)} />,
    Accordion,
    Accordions,
    File,
    Files,
    Folder,
    Glossary: (props: ComponentProps<typeof Glossary>) => <Glossary text={text} language={language} {...props} />,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  } satisfies MDXComponents;
}
