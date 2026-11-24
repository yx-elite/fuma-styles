import { Geist, JetBrains_Mono } from 'next/font/google';
import { NotesRoot, notesMetadata } from '@yx-elite/notestack';
import site from '@/site.config';
import '../global.css';

// Same fonts as fumadocs.dev: Geist for text, JetBrains Mono for code
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

// One copy of the site per language in site.config.ts
export const dynamicParams = false;
export function generateStaticParams() {
  return (site.languages ?? []).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return notesMetadata(site, lang);
}

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    // accentPicker: demo only, lets visitors try other accents; notes sites leave it out
    <NotesRoot site={site} language={lang} className={`${sans.variable} ${mono.variable}`} accentPicker>
      {children}
    </NotesRoot>
  );
}
