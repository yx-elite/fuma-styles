'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/notestack/src/ at migration.
import { useEffect } from 'react';

const ease = (t: number) => 1 - (1 - t) ** 3;

/**
 * The landing page's motion, in one small client component (the page itself stays a server component):
 * - `.ns-reveal` elements rise into view the first time they scroll in
 * - the docs preview (`.ns-home-preview`) starts tilted back and lies flat as it scrolls up
 * - `[data-ns-count]` numbers count up from zero
 * - `.ns-card` borders glow where the mouse is
 * All of it is skipped for "reduce motion"; the page reads the same without JavaScript.
 * Styles in theme.css (Home page).
 */
export function HomeEffects() {
  useEffect(() => {
    const home = document.querySelector<HTMLElement>('.ns-home');
    if (!home || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cleanups: (() => void)[] = [];

    // Reveal on scroll. Things already on screen are left alone, so nothing blinks.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'shown';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    for (const el of home.querySelectorAll<HTMLElement>('.ns-reveal')) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      el.dataset.reveal = 'hidden';
      observer.observe(el);
    }
    cleanups.push(() => observer.disconnect());

    // Tilt the preview back, flattening as it scrolls up the screen
    const preview = home.querySelector<HTMLElement>('.ns-home-preview');
    if (preview) {
      let frame = 0;
      const update = () => {
        frame = 0;
        // fully tilted while its top is low on the screen, flat once it reaches the upper fifth
        const top = preview.getBoundingClientRect().top;
        const vh = window.innerHeight;
        const t = Math.min(1, Math.max(0, (top - vh * 0.2) / (vh * 0.6)));
        preview.style.setProperty('--ns-tilt', (t * t * (3 - 2 * t)).toFixed(4));
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    }

    // Count up the hero numbers
    for (const el of home.querySelectorAll<HTMLElement>('[data-ns-count]')) {
      const target = Number(el.dataset.nsCount);
      if (!Number.isFinite(target) || target <= 0) continue;
      const start = performance.now() + 350; // wait for the hero to rise in
      const duration = 1100;
      let frame = 0;
      const step = (now: number) => {
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        el.textContent = String(Math.round(target * ease(t)));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      el.textContent = '0';
      frame = requestAnimationFrame(step);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        el.textContent = String(target);
      });
    }

    // Card glow follows the mouse
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const onMove = (event: PointerEvent) => {
        const card = (event.target as Element | null)?.closest<HTMLElement>('.ns-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--ns-mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--ns-my', `${event.clientY - rect.top}px`);
      };
      home.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => home.removeEventListener('pointermove', onMove));
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
