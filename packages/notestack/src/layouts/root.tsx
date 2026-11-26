import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  AccentPicker,
  AccentPickerProvider,
  AccentPickerScript,
  type AccentPickerText,
} from '../components/accent-picker.js';
import { SiteStyle, type SiteConfig } from '../config/site.js';
import { notesI18n } from '../i18n/fumadocs.js';
import { hasLanguageRoutes, languageOf, notesText, siteFor } from '../i18n/index.js';
import { RememberLanguage } from '../i18n/remember.js';
import { NotesProvider } from './provider.js';
import { PageTransitions } from './transitions.js';

/** Only the picker's labels go to the browser, not every phrase of the site */
const pickerText = ({ accent, accentPanel, accentOpen, accentReset, accentCustom, accentNote }: AccentPickerText) => ({
  accent,
  accentPanel,
  accentOpen,
  accentReset,
  accentCustom,
  accentNote,
});

/**
 * The whole root layout: <html> and <body>, the accent from the site config,
 * Fumadocs' provider with static search, and the page transitions.
 *
 *   <NotesRoot site={site} className={`${sans.variable} ${mono.variable}`}>{children}</NotesRoot>
 *
 * On a site with `languages`, pass the page's `language` (from the `[lang]` segment).
 */
export function NotesRoot({
  site,
  language,
  className,
  accentPicker = false,
  children,
}: {
  site: SiteConfig;
  /** The page's language, on a site with `languages` */
  language?: string;
  /** Classes for <html>, e.g. the font variables from next/font */
  className?: string;
  /** Demo sites only: a palette button next to the header's theme switch that lets visitors try other accents */
  accentPicker?: boolean;
  children: ReactNode;
}) {
  const local = language ? siteFor(site, language) : site;
  const lang = languageOf(local);

  return (
    <html lang={lang} className={className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        {accentPicker && <AccentPickerScript />}
        <SiteStyle site={local} />
        <NotesProvider i18n={notesI18n(local)}>
          {hasLanguageRoutes(site) && <RememberLanguage language={lang} />}
          <PageTransitions languages={site.languages} />
          {accentPicker ? (
            <AccentPickerProvider text={pickerText(notesText(local))}>
              {children}
              {/* phones: the header has no theme switch, so the picker floats in the corner */}
              <AccentPicker text={pickerText(notesText(local))} floating />
            </AccentPickerProvider>
          ) : (
            children
          )}
        </NotesProvider>
      </body>
    </html>
  );
}

/**
 * The root layout's metadata: the site name as the title ("Page · Site" on every page),
 * the description, and `url` as the base for share-image links.
 *
 *   export const metadata = notesMetadata(site);
 */
export function notesMetadata(site: SiteConfig, language?: string): Metadata {
  const local = language ? siteFor(site, language) : site;
  return {
    ...(local.url && { metadataBase: new URL(local.url) }),
    title: { default: local.name, template: `%s · ${local.name}` },
    description: local.description,
  };
}
