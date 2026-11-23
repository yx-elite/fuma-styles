'use client';
import { usePathname } from 'fumadocs-core/framework';
import { useEffect } from 'react';

const TABLET = '(min-width: 768px) and (max-width: 1023px)';
// Fumadocs' menu button. Found by what it controls, not its aria-label: the label is
// translated ("打开侧边栏" on a Chinese site) and switches to "Close Sidebar" when open.
const TRIGGER = '#nd-subnav button[aria-controls="nd-sidebar-mobile"]';

/**
 * Tablets in portrait (768–1023px, e.g. iPads): the sidebar becomes a panel that
 * slides in from the right, opened by the menu button at the right end of the header.
 * Fumadocs only switches to its drawer below 768px (hard-coded), so this takes over
 * that button at tablet width. Closes on tap outside, Esc, or when a page opens.
 * The panel itself is styled in theme.css (html[data-ns-menu='open']).
 */
export function TabletMenu() {
  const pathname = usePathname();

  // Close after navigating
  useEffect(() => {
    delete document.documentElement.dataset.nsMenu;
    document.querySelector(TRIGGER)?.setAttribute('aria-expanded', 'false');
  }, [pathname]);

  useEffect(() => {
    const tablet = window.matchMedia(TABLET);
    const root = document.documentElement;

    const setOpen = (open: boolean) => {
      if (open) root.dataset.nsMenu = 'open';
      else delete root.dataset.nsMenu;
      document.querySelector(TRIGGER)?.setAttribute('aria-expanded', String(open));
    };

    const onClick = (event: MouseEvent) => {
      if (!tablet.matches) return;
      const target = event.target as Element | null;
      if (target?.closest(TRIGGER)) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(root.dataset.nsMenu !== 'open');
        return;
      }
      if (root.dataset.nsMenu === 'open' && !target?.closest('#nd-sidebar')) {
        // a tap on the dimmed page only closes the panel; it must not also press what is underneath
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onResize = () => {
      if (!tablet.matches) setOpen(false);
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    tablet.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey);
      tablet.removeEventListener('change', onResize);
      setOpen(false);
    };
  }, []);

  return <div className="ns-menu-dim" aria-hidden="true" />;
}
