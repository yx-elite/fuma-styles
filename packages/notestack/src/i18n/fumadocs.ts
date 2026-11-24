import { defineI18n, defineTranslations, type I18nAPI, type TranslationPreset } from 'fumadocs-core/i18n';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import { ja } from '@fumadocs/language/ja';
import { zhCN } from '@fumadocs/language/zh-cn';
import { zhTW } from '@fumadocs/language/zh-tw';
import { defaultLanguageOf, hasLanguageRoutes, languageOf, type LanguageConfig } from './index.js';

/** Fumadocs' own text (search, "On this page", pagination, theme switch, 404) for the languages @fumadocs/language ships */
function fumadocsPreset(language: string): TranslationPreset<string> | undefined {
  const tag = language.toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(tag)) return zhTW();
  if (tag === 'zh' || tag.startsWith('zh-')) return zhCN();
  if (tag === 'ja' || tag.startsWith('ja-')) return ja();
  return undefined;
}

/** A language's name in itself, for the language switch: "English", "简体中文", "Français" */
export function languageName(language: string): string {
  const fromPreset = (fumadocsPreset(language)?.value as { displayName?: string } | undefined)?.displayName;
  if (fromPreset) return fromPreset;
  try {
    const name = new Intl.DisplayNames([language], { type: 'language' }).of(language) ?? language;
    return name.charAt(0).toLocaleUpperCase(language) + name.slice(1);
  } catch {
    return language;
  }
}

/**
 * Fumadocs' language config for a site with `languages`, for `loader({ i18n })`
 * in lib/source.ts. Notes live in one folder per language (content/docs/en/…);
 * a page missing in one language shows the default language's page.
 * Undefined for a one-language site.
 */
export function notesLanguages(site: LanguageConfig): I18nAPI<string> | undefined {
  if (!hasLanguageRoutes(site)) return undefined;
  return defineI18n({
    languages: site.languages!,
    defaultLanguage: defaultLanguageOf(site),
    parser: 'dir',
  });
}

/**
 * The `i18n` prop for Fumadocs' <RootProvider>: Fumadocs' built-in text in the
 * page's language. With `languages`, also the language switch in the header;
 * pass the site for the current language (`siteFor(site, lang)`).
 */
export function notesI18n(site?: LanguageConfig): I18nProviderProps {
  const config = site && notesLanguages(site);
  if (!config) {
    const translations = defineTranslations().extend(uiTranslations());
    const preset = fumadocsPreset(languageOf(site));
    return i18nProvider(preset ? translations.preset(preset) : translations);
  }

  let translations = config.translations().extend(uiTranslations());
  for (const language of config.languages) {
    const preset = fumadocsPreset(language);
    if (preset) translations = translations.preset(language, preset);
  }
  translations = translations.add(
    Object.fromEntries(config.languages.map((language) => [language, { displayName: languageName(language) }])),
  );
  return i18nProvider(translations, languageOf(site));
}
