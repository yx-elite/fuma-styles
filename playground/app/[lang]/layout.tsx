import { Geist, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import {
  AccentPicker,
  AccentPickerScript,
  notesI18n,
  notesText,
  PageTransitions,
  RememberLanguage,
  siteFor,
  SiteStyle,
} from '@yx-elite/notestack';
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

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const local = siteFor(site, lang);

  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AccentPickerScript />
        <SiteStyle site={local} />
        <Provider i18n={notesI18n(local)}>
          <RememberLanguage language={lang} />
          <PageTransitions languages={site.languages} />
          {children}
          {/* demo only: lets visitors try other accents; notes sites leave this out */}
          <AccentPicker text={notesText(local)} />
        </Provider>
      </body>
    </html>
  );
}
