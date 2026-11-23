'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import { type ReactNode } from 'react';

export function Provider({ i18n, children }: { i18n?: I18nProviderProps; children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} i18n={i18n}>
      {children}
    </RootProvider>
  );
}
