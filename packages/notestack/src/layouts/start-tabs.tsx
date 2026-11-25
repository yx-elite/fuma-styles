'use client';
import { type CSSProperties, type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';

/**
 * The two tabs of "Get started" when `start.agent` is set: by hand, and with an agent.
 * Both panels are rendered on the server; this only switches between them. A pill slides
 * under the chosen tab, and the panel slides in from that side. A panel's CSS animations
 * start again each time it is shown. Styles in theme.css (Get started).
 */
export function StartTabs({ labels, children }: { labels: [string, string]; children: [ReactNode, ReactNode] }) {
  const [active, setActive] = useState(0);
  // Panels slide in only after the reader switches, not on page load
  const [switched, setSwitched] = useState(false);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // The pill follows the chosen tab; measured again when the tabs change size (fonts loading, resizing)
  useEffect(() => {
    const tab = tabs.current[active];
    if (!tab) return;
    const measure = () => setPill({ left: tab.offsetLeft, width: tab.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(tab);
    return () => observer.disconnect();
  }, [active]);

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const next = active === 0 ? 1 : 0;
    setActive(next);
    setSwitched(true);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ns-start-tabs" data-switched={switched || undefined}>
      <div className="ns-start-tablist ns-reveal" role="tablist" onKeyDown={onKey}>
        {pill && (
          <span
            className="ns-start-pill"
            style={{ '--ns-pill-x': `${pill.left}px`, '--ns-pill-w': `${pill.width}px` } as CSSProperties}
            aria-hidden
          />
        )}
        {labels.map((label, i) => (
          <button
            key={i}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className="ns-start-tab"
            onClick={() => {
              setActive(i);
              setSwitched(true);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          className="ns-start-panel"
          data-from={i === 0 ? 'left' : 'right'}
          hidden={active !== i}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
