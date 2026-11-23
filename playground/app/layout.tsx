import { Geist, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import { AccentPicker, AccentPickerScript, notesI18n, notesText, PageTransitions, SiteStyle } from '@yx-elite/notestack';
import site from '@/site.config';
import './global.css';

// Same fonts as fumadocs.dev: Geist for text, JetBrains Mono for code
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang={site.language ?? 'en'} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AccentPickerScript />
        <SiteStyle site={site} />
        <Provider i18n={notesI18n(site)}>
          <PageTransitions />
          {children}
          {/* demo only: lets visitors try other accents; notes sites leave this out */}
          <AccentPicker text={notesText(site)} />
        </Provider>
      </body>
    </html>
  );
}
