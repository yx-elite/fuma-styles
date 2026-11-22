'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import { usePathname, useRouter } from 'fumadocs-core/framework';
import { useEffect, useRef } from 'react';

type Section = 'home' | 'docs';

/**
 * Animated page change between the home page and the docs (both directions),
 * using the browser's View Transitions API. Catches every internal link click
 * that crosses between the two, including Fumadocs' own links (the header title).
 * Browsers without the API, and "reduce motion" users, navigate normally.
 * The animation itself is in theme.css (data-fs-transition on <html>).
 */
export function PageTransitions({ docsPath = '/docs' }: { docsPath?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const done = useRef<(() => void) | null>(null);

  // The new page has rendered once the path changes: let the transition finish
  useEffect(() => {
    done.current?.();
    done.current = null;
  }, [pathname]);

  useEffect(() => {
    const sectionOf = (path: string): Section =>
      path === docsPath || path.startsWith(`${docsPath}/`) ? 'docs' : 'home';

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
      root.dataset.fsTransition = to === 'docs' ? 'to-docs' : 'to-home';

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            done.current = resolve;
            router.push(url.pathname + url.search + url.hash);
            setTimeout(resolve, 2000); // never hang if the path does not change
          }),
      );
      transition.finished.finally(() => {
        delete root.dataset.fsTransition;
      });
    };

    // Capture phase: runs before the framework's own link handling
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router, docsPath]);

  return null;
}
