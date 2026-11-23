import { defineTranslations, type TranslationPreset } from 'fumadocs-core/i18n';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import { ja } from '@fumadocs/language/ja';
import { zhCN } from '@fumadocs/language/zh-cn';
import { zhTW } from '@fumadocs/language/zh-tw';
import { languageOf, type LanguageConfig } from './index.js';

/** Fumadocs' own text (search, "On this page", pagination, theme switch, 404) for the languages @fumadocs/language ships */
function fumadocsPreset(language: string): TranslationPreset<string> | undefined {
  const tag = language.toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(tag)) return zhTW();
  if (tag === 'zh' || tag.startsWith('zh-')) return zhCN();
  if (tag === 'ja' || tag.startsWith('ja-')) return ja();
  return undefined;
}

/**
 * The `i18n` prop for Fumadocs' <RootProvider>, for a site written in one language:
 * Fumadocs' built-in text in that language, no language switch, no URL change.
 */
export function notesI18n(site?: LanguageConfig): I18nProviderProps {
  const translations = defineTranslations().extend(uiTranslations());
  const preset = fumadocsPreset(languageOf(site));
  return i18nProvider(preset ? translations.preset(preset) : translations);
}
