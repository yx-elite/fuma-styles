import { defineSiteConfig } from '@/kit/site';

// The one file that differs per notes site.
export default defineSiteConfig({
  name: 'Fuma Styles',
  author: 'yx-elite',
  tag: 'playground',
  description: 'Shared Fumadocs theme for study-notes sites, published as @yx-elite/fuma-styles.',
  repo: 'yx-elite/fuma-styles',
  branch: 'main',
  // Trying NativeWind's cyan
  accent: { light: '#0092b3', dark: '#3ad1ff' },
  links: [
    { text: 'Playground', url: '/docs', icon: 'House' },
    { text: 'Glossary', url: '/docs/glossary', icon: 'BookA' },
  ],
});
