/** Everything that differs between notes sites. Lives in each repo's site.config.ts. */
export interface SiteConfig {
  /** Notes name, shown in the header and the sidebar banner, e.g. "AWS SAA-C03 Handbook" */
  name: string;
  /** Shown after the name in the header: "by <author>" */
  author?: string;
  /** Small badge next to the name in the banner, e.g. the exam code "SAA-C03" */
  tag?: string;
  /** One sentence about the subject: the same text as the GitHub repo description */
  description: string;
  /** GitHub repo as "owner/name" */
  repo: string;
  /** Branch the notes live on, for "edit on GitHub" links */
  branch?: string;
  /** Accent colour for each mode; links, active items, glow and banner follow it */
  accent?: { light: string; dark: string };
  /** Banner button */
  bannerLink?: { label: string; href: string };
  /**
   * Fixed links under the banner, above the scrolling page list.
   * `icon` is a Lucide icon name, e.g. "House" or "BookA".
   */
  links?: { text: string; url: string; icon?: string }[];
  /**
   * "Get started" on the landing page: numbered steps beside a terminal that types the commands.
   * Leave it out to show how to run this repo (clone, install, run); `false` hides the section.
   */
  start?: false | StartSection;
}

export interface StartSection {
  title: string;
  text: string;
  steps: { title: string; text: string; command: string }[];
  /** Last terminal line, after the commands. Default: "Ready on http://localhost:3000" */
  done?: string;
}

export function defineSiteConfig(config: SiteConfig): SiteConfig {
  return config;
}

export const repoUrl = (site: SiteConfig) => `https://github.com/${site.repo}`;

/** Sets --ns-accent from the site config. Put it inside <body> in app/layout.tsx. */
export function SiteStyle({ site }: { site: SiteConfig }) {
  if (!site.accent) return null;
  const css = `:root{--ns-accent:${site.accent.light}}.dark{--ns-accent:${site.accent.dark}}`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
