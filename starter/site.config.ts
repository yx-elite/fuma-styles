import { defineSiteConfig } from 'notestack';

// Your site's settings: the only code file you need to edit.
// Every option is explained in the Notestack docs:
// https://github.com/yx-elite/notestack/blob/main/playground/content/docs/en/configuration.mdx
export default defineSiteConfig({
  // Shown in the header, the sidebar banner and the browser tab
  name: 'My Notes',
  author: 'your-name',
  // One sentence about the notes (also the description search engines show)
  description: 'My study notes, written in Markdown and published as a fast static site.',
  // Your GitHub repo as "owner/name", for the GitHub links
  repo: 'your-name/my-notes',

  // The address the site will be served from, for link previews. Add it once you have one.
  // url: 'https://notes.example.com',

  // A colour for each mode: links, the active page, the glow and the banner follow it
  // accent: { light: '#0092b3', dark: '#3ad1ff' },

  // A small badge next to the name, e.g. a course code
  // tag: 'NET-101',
});
