// PROTOTYPE of the package's layouts/ entry. Moves to packages/fuma-styles/src/ at migration.
import { BookOpen } from 'lucide-react';
import { repoUrl, type SiteConfig } from './site';

/** Top-left box in the sidebar: the subject, its one-line description and a link */
export function SidebarBanner({ site }: { site: SiteConfig }) {
  const link = site.bannerLink ?? { label: 'View on GitHub', href: repoUrl(site) };
  const external = /^https?:\/\//.test(link.href);

  return (
    <div className="fs-banner">
      <div className="fs-banner-dots" aria-hidden />
      <p className="fs-banner-title">
        {site.name}
        {site.tag && <span className="fs-banner-tag">{site.tag}</span>}
      </p>
      <p className="fs-banner-text">{site.description}</p>
      <a
        className="fs-banner-link"
        href={link.href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        <BookOpen />
        {link.label}
      </a>
    </div>
  );
}
