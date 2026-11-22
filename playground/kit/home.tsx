// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import Link from 'fumadocs-core/link';
import { ArrowRight } from 'lucide-react';
import { repoUrl, type SiteConfig } from './site';

/**
 * Default landing page: badge, big title, description, author, and the way
 * into the docs. Each notes site can replace it with its own page.
 */
export function NotesHome({ site, docsPath = '/docs' }: { site: SiteConfig; docsPath?: string }) {
  return (
    <main className="fs-home">
      <div className="fs-home-hero">
        {site.tag && <span className="fs-home-badge">{site.tag}</span>}
        <h1 className="fs-home-title">{site.name}</h1>
        <p className="fs-home-text">{site.description}</p>
        <div className="fs-home-actions">
          <Link href={docsPath} className="fs-button fs-button-primary">
            Start reading
            <ArrowRight />
          </Link>
          <a href={repoUrl(site)} className="fs-button fs-button-secondary" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
        {site.author && <p className="fs-home-author">by {site.author}</p>}
      </div>
    </main>
  );
}
