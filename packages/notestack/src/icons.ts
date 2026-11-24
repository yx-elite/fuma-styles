import { icons } from 'lucide-react';
import { createElement } from 'react';

/** Lucide icon by name ("MapPin"), resolved on the server so the icon set is never sent to the browser */
export function lucideIcon(name?: string) {
  if (!name || !(name in icons)) return undefined;
  return createElement(icons[name as keyof typeof icons]);
}
