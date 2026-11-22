import { Geist, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import { SiteStyle } from '@/kit/site';
import { PageTransitions } from '@/kit/transitions';
import site from '@/site.config';
import './global.css';

// Same fonts as fumadocs.dev: Geist for text, JetBrains Mono for code
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <SiteStyle site={site} />
        <Provider>
          <PageTransitions />
          {children}
        </Provider>
      </body>
    </html>
  );
}
