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
    { text: 'Installation', url: '/docs/installation', icon: 'Download' },
    { text: 'Showcase', url: '/docs/showcase/typography', icon: 'LayoutGrid' },
    { text: 'Glossary', url: '/docs/showcase/glossary', icon: 'BookA' },
  ],
  // This playground is the theme's demo, so it shows how to install the theme
  start: {
    title: 'Turn your notes into a site like this',
    text: 'Start from a plain Fumadocs app, add the theme, and let it set up the files. Your notes stay plain Markdown.',
    steps: [
      { title: 'Create a Fumadocs app', text: 'Pick Next.js and Fumadocs MDX when asked.', command: 'npm create fumadocs-app@latest my-notes' },
      { title: 'Add the theme', text: 'Installs @yx-elite/fuma-styles from npm.', command: 'cd my-notes && npm install @yx-elite/fuma-styles' },
      { title: 'Apply it', text: 'Writes site.config.ts and points the app files at the theme.', command: 'npx fuma-styles init' },
      { title: 'Start writing', text: 'Open localhost:3000. Edit site.config.ts for your name, links and accent.', command: 'npm run dev' },
    ],
  },
});
