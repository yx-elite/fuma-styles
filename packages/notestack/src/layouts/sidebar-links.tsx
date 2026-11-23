'use client';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import type { ReactNode } from 'react';

export interface SidebarLinkItem {
  text: string;
  url: string;
  icon?: ReactNode;
}

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

/**
 * Fixed links under the sidebar banner (e.g. Home, Glossary). They sit outside
 * the scrolling page list, so the pinned current page never slides over them.
 */
export function SidebarLinks({ items }: { items: SidebarLinkItem[] }) {
  const pathname = normalize(usePathname());

  return (
    <nav className="ns-links" aria-label="Quick links">
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className="ns-link"
          data-active={normalize(item.url) === pathname}
        >
          {item.icon}
          {item.text}
        </Link>
      ))}
    </nav>
  );
}
