import type { ReactNode } from 'react';
import { defaultLanguageOf } from '@yx-elite/notestack';
import site from '@/site.config';
import '../global.css';

// Only the page at `/`, which sends readers to /<language>/. Every other page uses app/[lang]/layout.tsx.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLanguageOf(site)}>
      <body>{children}</body>
    </html>
  );
}
