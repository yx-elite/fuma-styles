'use client';
import { usePathname, useRouter } from 'fumadocs-core/framework';
import { useEffect, useRef } from 'react';

type Section = 'home' | 'docs';

// One array for every render: a new [] each time would re-run the effect below on every page change
const noLanguages: string[] = [];

/**
 * Animated page change between the home page and the docs (both directions),
 * using the browser's View Transitions API. Catches every internal link click
 * that crosses between the two, including Fumadocs' own links (the header title).
 * Browsers without the API, and "reduce motion" users, navigate normally.
 * The animation itself is in theme.css (data-ns-transition on <html>).
 */
export function PageTransitions({
  docsPath = '/docs',
  languages = noLanguages,
}: {
  docsPath?: string;
  /** A site's `languages`: their URL prefix is ignored, so /en/docs/x and /zh-CN/docs/x are both docs */
  languages?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const done = useRef<(() => void) | null>(null);

  // The new page has rendered once the path changes: let the transition finish
  useEffect(() => {
    done.current?.();
    done.current = null;
  }, [pathname]);

  useEffect(() => {
    const withoutLanguage = (path: string) => {
      const first = path.split('/')[1];
      return first && languages.includes(first) ? path.slice(first.length + 1) || '/' : path;
    };
    const sectionOf = (url: string): Section => {
      const path = withoutLanguage(url);
      return path === docsPath || path.startsWith(`${docsPath}/`) ? 'docs' : 'home';
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const from = sectionOf(window.location.pathname);
      const to = sectionOf(url.pathname);
      if (from === to) return;

      if (
        typeof document.startViewTransition !== 'function' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      )
        return;

      // Take over from the framework's link handler for this one navigation
      event.preventDefault();
      event.stopPropagation();

      const root = document.documentElement;
      root.dataset.nsTransition = to === 'docs' ? 'to-docs' : 'to-home';
      // Scrolled down: the page being left moves out as part of the screen's snapshot
      // instead of as its own (taller than the screen) element, which Safari draws from its top
      if (window.scrollY > 0) root.dataset.nsScrolled = '';

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            done.current = resolve;
            router.push(url.pathname + url.search + url.hash);
            setTimeout(resolve, 2000); // never hang if the path does not change
          }),
      );
      transition.finished.finally(() => {
        delete root.dataset.nsTransition;
        delete root.dataset.nsScrolled;
      });
    };

    // Capture phase: runs before the framework's own link handling
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router, docsPath, languages]);

  return null;
}
