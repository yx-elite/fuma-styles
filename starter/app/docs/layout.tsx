import type { ReactNode } from 'react';
import { NotesLayout } from 'notestack';
import { source } from '@/lib/source';
import site from '@/site.config';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NotesLayout site={site} tree={source.getPageTree()}>
      {children}
    </NotesLayout>
  );
}
