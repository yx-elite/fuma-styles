/**
 * Two marks a site may use in `name` and `description` (site.config.ts), for the
 * landing page's hero only:
 *
 *   `\n`      a line break        'AWS SAA-C03\nHandbook'
 *   `*text*`  the accent styling  'Publish a site that reads *beautifully*.'
 *
 * The hero reads them with markedLines(); everywhere else (header, banner, footer,
 * <title>, meta description, share images) shows plainText(), without the marks.
 */

/** A run of text, accented or not */
export interface MarkedPart {
  text: string;
  accent: boolean;
}

// `*text*` on one line; a lone `*` stays as it is
const ACCENT = /\*([^*\n]+)\*/g;

/** The text without its marks: line breaks become spaces, `*text*` becomes `text` */
export function plainText(text: string): string {
  return text.replace(ACCENT, '$1').replace(/\s*\n\s*/g, ' ').trim();
}

/** The text as lines (split at `\n`), each a list of plain and accented parts */
export function markedLines(text: string): MarkedPart[][] {
  return text.split(/\s*\n\s*/).map((line) => {
    const parts: MarkedPart[] = [];
    let last = 0;
    for (const match of line.matchAll(ACCENT)) {
      if (match.index > last) parts.push({ text: line.slice(last, match.index), accent: false });
      parts.push({ text: match[1], accent: true });
      last = match.index + match[0].length;
    }
    if (last < line.length) parts.push({ text: line.slice(last), accent: false });
    return parts;
  });
}
