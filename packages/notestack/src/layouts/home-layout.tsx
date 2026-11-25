'use client';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { FullSearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { PhoneSearchTrigger } from './phone-search.js';
import { SidebarProvider, useSidebar } from 'fumadocs-ui/layouts/notebook/slots/sidebar';
import type * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { baseOptions } from './nav-title.js';
import { Spotlight } from './spotlight.js';
import type { SiteConfig } from '../config/site.js';

// No sidebar, no mobile menu button and no collapse button on the home page
const homeSidebarSlots = {
  provider: SidebarProvider,
  root: () => null,
  trigger: () => null,
  collapseTrigger: () => null,
  useSidebar,
};

/**
 * The home page layout: the very same Notebook layout and header as the docs,
 * with the sidebar switched off. (A client component: the layout's slots are
 * functions, which cannot be passed from a server component.)
 */
export function NotesHomeLayout({
  site,
  tree,
  children,
}: {
  site: SiteConfig;
  tree: PageTree.Root;
  children: ReactNode;
}) {
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions(site)}
      slots={{ sidebar: homeSidebarSlots, searchTrigger: { sm: PhoneSearchTrigger, full: FullSearchTrigger } }}
    >
      {/* One wrapper for any home content, so the page transition always works */}
      <div className="ns-home-root">
        <Spotlight />
        {children}
      </div>
    </DocsLayout>
  );
}
