import { useId } from 'react';

const SIDE = 13.4; // each layer: a rounded square, turned 45° and flattened to half height
const RADIUS = 2.6;
const GAP = 4.4; // distance between layers

/**
 * The notes mark, in greyscale: three stacked layers with rounded corners. The top
 * layer is filled with a gradient from the page background to the text colour and
 * every outline is in the text colour (`currentColor`), so it is black in light mode,
 * white in dark mode, whatever the accent, dims and brightens with the text around it,
 * and matches the black-and-white favicon (app/icon.svg). Inline SVG on purpose: a
 * separate .svg file could not read the page's colours. Size it with CSS.
 */
export function NotesLogo({ className }: { className?: string }) {
  const id = `ns-logo-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  const layer = (y: number, fill: string, opacity: number) => (
    <rect
      x={-SIDE / 2}
      y={-SIDE / 2}
      width={SIDE}
      height={SIDE}
      rx={RADIUS}
      transform={`translate(12 ${y}) scale(1 0.5) rotate(45)`}
      fill={fill}
      opacity={opacity}
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    />
  );

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        {/* in the layer's own (unturned) space: runs from its top-left to its bottom-right edge */}
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={-SIDE / 2} y1="0" x2={SIDE / 2} y2="0">
          <stop offset="15%" stopColor="var(--color-fd-background)" />
          <stop offset="85%" stopColor="currentColor" />
        </linearGradient>
      </defs>
      {layer(12 + GAP, 'var(--color-fd-background)', 0.4)}
      {layer(12, 'var(--color-fd-background)', 0.7)}
      {layer(12 - GAP, `url(#${id})`, 1)}
    </svg>
  );
}
