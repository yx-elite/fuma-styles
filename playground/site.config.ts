import { defineSiteConfig } from '@yx-elite/notestack';

// The one file that differs per notes site.
export default defineSiteConfig({
  name: 'Notestack',
  author: 'yx-elite',
  tag: 'playground',
  description: 'A Fumadocs theme for study notes. Write in Markdown or Obsidian, publish a site that reads beautifully.',
  repo: 'yx-elite/notestack',
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
    text: 'One command makes a Fumadocs site with the theme already set up. Your notes stay plain Markdown.',
    steps: [
      { title: 'Create the site', text: 'Makes my-notes/ and installs @yx-elite/notestack.', command: 'npm create notestack@latest my-notes' },
      { title: 'Start writing', text: 'Open localhost:3000. Edit site.config.ts for your name, links and accent.', command: 'cd my-notes && npm run dev' },
    ],
  },
});
