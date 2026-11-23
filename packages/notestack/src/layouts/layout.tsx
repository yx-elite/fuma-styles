import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type * as PageTree from 'fumadocs-core/page-tree';
import { icons } from 'lucide-react';
import { createElement, type ReactNode } from 'react';
import { NavTitle } from './nav-title.js';
import { SidebarBanner } from './sidebar-banner.js';
import { SidebarLinks } from './sidebar-links.js';
import { TabletMenu } from './tablet-menu.js';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { notesText } from '../i18n/index.js';

/** Shared header options: the same header on the home page and in the docs */
export function baseOptions(site: SiteConfig): BaseLayoutProps {
  return {
    // See-through until the page scrolls
    nav: { title: <NavTitle site={site} />, transparentMode: 'top' },
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
