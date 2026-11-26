import { ArrowUpRight, Bot, NotebookText, Pencil, Star } from 'lucide-react';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { notesText } from '../i18n/index.js';
import { Credit } from '../layouts/credit.js';
import { isNotestackSite } from '../layouts/stack.js';

/**
 * The card at the bottom of "On this page". On a notes site: the notes are open, with
 * a link that opens this page's file for editing on GitHub, and "Built with Notestack".
 * On Notestack's own docs site: a star link for the theme instead, so notes sites never
 * ask their readers to star Notestack. Under the card, the site's llms.txt files.
 *
 * `placement`: `toc` pins it to the bottom of the "On this page" column (1280px and
 * wider); `footer` puts it at the end of the page where that column is hidden, without
 * its own "Built with" line, which the row under it already has.
 */
export function PageCard({
  site,
  editUrl,
  placement,
}: {
  site: SiteConfig;
  editUrl?: string;
  placement: 'toc' | 'footer';
}) {
  const text = notesText(site);
  const own = isNotestackSite(site);

  return (
    <div className="ns-page-card-wrap" data-placement={placement}>
      <div className="ns-page-card">
        <span className="ns-page-card-deco" aria-hidden>
          {own ? <Star /> : <NotebookText />}
          {own ? <Star /> : <Pencil />}
        </span>
        <span className="ns-page-card-label">{own ? text.pageCardStarLabel : text.pageCardLabel}</span>
        <p className="ns-page-card-title">{own ? text.pageCardStarTitle : text.pageCardTitle}</p>
        <p className="ns-page-card-text">{own ? text.pageCardStarText : text.pageCardText}</p>
        <a
          href={own ? repoUrl(site) : (editUrl ?? repoUrl(site))}
          target="_blank"
          rel="noreferrer"
          className="ns-page-card-link"
        >
          {own ? text.starOnGitHub : text.pageCardLink}
          <ArrowUpRight aria-hidden />
        </a>
        {!own && placement === 'toc' && (
          <div className="ns-page-card-credit">
            <Credit site={site} />
          </div>
        )}
      </div>
      <p className="ns-page-card-agents">
        <Bot aria-hidden />
        {text.forAgents} <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a>
      </p>
    </div>
  );
}
