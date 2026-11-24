'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import type { ReactNode } from 'react';
import { StaticSearchDialog } from '../components/search-dialog.js';

/** Fumadocs' root provider with static search. `NotesRoot` uses it; pass `notesI18n(site)` as `i18n`. */
export function NotesProvider({ i18n, children }: { i18n?: I18nProviderProps; children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog: StaticSearchDialog }} i18n={i18n}>
      {children}
    </RootProvider>
  );
}
