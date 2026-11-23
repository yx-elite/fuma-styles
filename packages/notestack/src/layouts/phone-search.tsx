'use client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { LanguageSelect } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { SearchTrigger, type SearchTriggerProps } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { Languages } from 'lucide-react';

/**
 * The phone header's search button, with the language switch just before it on a
 * site with several languages, so readers can change language without opening the
 * menu. Used as Fumadocs' `slots.searchTrigger.sm`, which only shows on phones.
 */
export function PhoneSearchTrigger(props: SearchTriggerProps) {
  const { locales = [] } = useI18n();
  return (
    <>
      {locales.length > 1 && (
        <LanguageSelect className="ns-phone-language p-2">
          <Languages className="size-4.5" />
        </LanguageSelect>
      )}
      <SearchTrigger {...props} />
    </>
  );
}
