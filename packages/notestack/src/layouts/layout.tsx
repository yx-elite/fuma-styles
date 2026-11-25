import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { FullSearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { PhoneSearchTrigger } from './phone-search.js';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { lucideIcon } from '../icons.js';
import { baseOptions } from './nav-title.js';
import { SidebarBanner } from './sidebar-banner.js';
import { SidebarLinks } from './sidebar-links.js';
import { TabletMenu } from './tablet-menu.js';
import type { SiteConfig } from '../config/site.js';
import { notesText } from '../i18n/index.js';

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
  const links = (site.links ?? []).map((link) => ({ ...link, icon: lucideIcon(link.icon) }));

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions(site)}
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
