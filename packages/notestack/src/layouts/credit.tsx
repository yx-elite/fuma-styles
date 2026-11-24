import type { SiteConfig } from '../config/site.js';
import { fill, notesText } from '../i18n/index.js';
import { NotesLogo } from './logo.js';
import { notestack, stackFor } from './stack.js';

/**
 * "Built with Notestack", with the Notestack mark in the text's colour, on notes sites;
 * "Built with Fumadocs" on Notestack's own docs site. Used by the landing page footer
 * and the row under each docs page. Styles in theme.css (Credit).
 */
export function Credit({ site }: { site: SiteConfig }) {
  const credit = stackFor(site)[0];
  return (
    <a href={credit.href} target="_blank" rel="noreferrer" className="ns-credit">
      {credit === notestack && <NotesLogo className="ns-credit-mark" />}
      {fill(notesText(site).footerCredit, { name: credit.name })}
    </a>
  );
}
