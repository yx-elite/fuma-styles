import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { FullSearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { PhoneSearchTrigger } from './phone-search.js';
import type * as PageTree from 'fumadocs-core/page-tree';
import { icons } from 'lucide-react';
import { createElement, type ReactNode } from 'react';
import { NavTitle } from './nav-title.js';
import { SidebarBanner } from './sidebar-banner.js';
import { SidebarLinks } from './sidebar-links.js';
import { TabletMenu } from './tablet-menu.js';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { localizeHref, notesText } from '../i18n/index.js';

/** Shared header options: the same header on the home page and in the docs */
export function baseOptions(site: SiteConfig): BaseLayoutProps {
  return {
    // See-through until the page scrolls
    // The logo goes to this language's home page on a site with languages
    nav: { title: <NavTitle site={site} />, url: localizeHref('/', site), transparentMode: 'top' },
    themeSwitch: { mode: 'light-dark-system' },
    githubUrl: repoUrl(site),
  };
}

/** Lucide icon by name, resolved on the server so the icon set is never sent to the browser */
export function lucideIcon(name?: string) {
  if (!name || !(name in icons)) return undefined;
  return createElement(icons[name as keyof typeof icons]);
}

/**
 * The notes layout: Notebook layout with the header across the top,
 * sidebar banner with fixed links under it, and no collapse button on desktop.
 */
export function NotesLayout({
  site,
  tree,
  children,
}: {
  site: SiteConfig;
  tree: PageTree.Root;
  children: ReactNode;
}) {
  const base = baseOptions(site);
  const links = (site.links ?? []).map((link) => ({ ...link, icon: lucideIcon(link.icon) }));

  return (
    <DocsLayout
      tree={tree}
      {...base}
      nav={{ ...base.nav, mode: 'top' }}
      // phones: the language switch sits in the header, before the search button
      slots={{ searchTrigger: { sm: PhoneSearchTrigger, full: FullSearchTrigger } }}
      sidebar={{
        collapsible: false,
        banner: (
          <>
            <SidebarBanner site={site} />
            {links.length > 0 && <SidebarLinks items={links} label={notesText(site).quickLinks} />}
          </>
        ),
      }}
    >
      <TabletMenu />
      {children}
    </DocsLayout>
  );
}
