import { CalloutContainer, CalloutDescription, CalloutTitle } from 'fumadocs-ui/components/callout';
import { CircleCheck, CircleX, Info, Lightbulb, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { notesText } from '../i18n/index.js';
import type { NotesText } from '../i18n/text.js';
import { lucideIcon } from '../icons.js';

/** Each type's icon, and the label a callout without a title shows */
const types = {
  info: { icon: Info, label: 'calloutInfo' },
  warning: { icon: TriangleAlert, label: 'calloutWarning' },
  error: { icon: CircleX, label: 'calloutError' },
  success: { icon: CircleCheck, label: 'calloutSuccess' },
  idea: { icon: Lightbulb, label: 'calloutIdea' },
} satisfies Record<string, { icon: LucideIcon; label: keyof NotesText }>;

/** Named colours, each tuned for light and dark mode in theme.css (--ns-callout-<name>) */
export const calloutColors = ['accent', 'blue', 'teal', 'green', 'purple', 'pink', 'orange', 'red', 'slate'] as const;
export type CalloutColor = (typeof calloutColors)[number];

export interface CalloutProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** `info` (default), `warn`, `error`, `success` or `idea`; sets the colour, icon and label */
  type?: 'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea';
  /** Shown in the pill at the top. Without it, the pill shows the type's name ("Warning"). `false` drops the pill and puts the icon before the text */
  title?: ReactNode | false;
  /** A Lucide icon name, e.g. "MapPin" (lucide.dev/icons), or any element. Without it, the type's icon */
  icon?: string | ReactNode;
  /**
   * The box's colour instead of the type's: a named colour ("teal", "accent" for the
   * site's accent…) that suits both modes, or any CSS colour ("#1d9e75")
   */
  color?: CalloutColor | (string & {});
  /** Notestack's text, for the type's name. getMDXComponents() passes the site's. */
  text?: NotesText;
}

/**
 * Fumadocs' callout with the icon and title in a pill at the top and the text
 * full width below. In notes: <Callout type="warn" title="Costs money" icon="Wallet">,
 * or with its own colour: <Callout title="Exam tip" icon="GraduationCap" color="purple">,
 * or with no pill, the icon before the text: <Callout title={false}>.
 */
export function Callout({
  type = 'info',
  title,
  icon,
  color,
  text = notesText(),
  className,
  style,
  children,
  ...props
}: CalloutProps) {
  const kind = types[type === 'warn' ? 'warning' : type] ?? types.info;
  const TypeIcon = kind.icon;
  const shownIcon = (typeof icon === 'string' ? lucideIcon(icon) : icon) ?? <TypeIcon />;
  const named = (calloutColors as readonly string[]).includes(color ?? '');
  const colorStyle = color
    ? ({ '--callout-color': named ? `var(--ns-callout-${color})` : color } as CSSProperties)
    : undefined;

  return (
    // icon={false}: the icon goes in the pill instead of Fumadocs' column beside the text.
    // ns-callout and ns-callout-body are what theme.css styles (section Callouts).
    <CalloutContainer
      type={type}
      icon={false}
      className={className ? `ns-callout ${className}` : 'ns-callout'}
      style={{ ...colorStyle, ...style }}
      data-ns-plain={title === false || undefined}
      {...props}
    >
      {title === false ? (
        <span className="ns-callout-icon">{shownIcon}</span>
      ) : (
        <CalloutTitle className="ns-callout-title">
          {shownIcon}
          <span>{title ?? text[kind.label]}</span>
        </CalloutTitle>
      )}
      <CalloutDescription className="ns-callout-body">{children}</CalloutDescription>
    </CalloutContainer>
  );
}
