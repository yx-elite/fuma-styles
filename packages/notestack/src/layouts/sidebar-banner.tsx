import { BookOpen } from 'lucide-react';
import { repoUrl, type SiteConfig } from '../config/site.js';
import { notesText } from '../i18n/index.js';

/** Top-left box in the sidebar: the subject, its one-line description and a link */
export function SidebarBanner({ site }: { site: SiteConfig }) {
  const link = site.bannerLink ?? { label: notesText(site).viewOnGitHub, href: repoUrl(site) };
  const external = /^https?:\/\//.test(link.href);

  return (
    <div className="ns-banner">
      <div className="ns-banner-dots" aria-hidden />
      <p className="ns-banner-title">
        {site.name}
        {site.tag && <span className="ns-banner-tag">{site.tag}</span>}
      </p>
      <p className="ns-banner-text">{site.description}</p>
      <a
        className="ns-banner-link"
        href={link.href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        <BookOpen />
        {link.label}
      </a>
    </div>
  );
}
