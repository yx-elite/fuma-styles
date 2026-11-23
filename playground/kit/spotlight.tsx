'use client';
// PROTOTYPE of the package's layouts/ entry. Moves to packages/notestack/src/ at migration.
import { useEffect, useRef } from 'react';

/**
 * Interactive landing background: a soft accent glow that follows the cursor,
 * revealing a dot matrix around it like a torch. Only for a real mouse
 * (no touch screens) and not for "reduce motion". Styles in theme.css (.ns-spotlight).
 * Updates two CSS variables at most once per frame, so it stays cheap.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;

    const apply = () => {
      frame = 0;
      el.style.setProperty('--ns-x', `${x}px`);
      el.style.setProperty('--ns-y', `${y}px`);
    };
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      el.dataset.active = 'true';
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.dataset.active = 'false';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="ns-spotlight" data-active="false" aria-hidden>
      <div className="ns-spotlight-glow" />
      <div className="ns-spotlight-dots" />
    </div>
  );
}
