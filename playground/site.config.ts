import { defineSiteConfig } from '@yx-elite/notestack';

// The one file that differs per notes site.
export default defineSiteConfig({
  name: 'Notestack',
  author: 'yx-elite',
  tag: 'playground',
  description: 'A Fumadocs theme for study notes. Write in Markdown, publish a site that reads beautifully.',
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
  // The theme's docs in two languages: notes in content/docs/en/ and content/docs/zh-CN/.
  // Pages not translated yet show in English.
  languages: ['en', 'zh-CN'],
  translations: {
    'zh-CN': {
      tag: '演示',
      description: '为学习笔记打造的 Fumadocs 主题。用 Markdown 写作，发布一个读起来舒服的网站。',
      links: [
        { text: '安装', url: '/docs/installation', icon: 'Download' },
        { text: '组件展示', url: '/docs/showcase/typography', icon: 'LayoutGrid' },
        { text: '术语表', url: '/docs/showcase/glossary', icon: 'BookA' },
      ],
      start: {
        title: '把你的笔记变成这样的网站',
        text: '一条命令即可创建一个已经配置好主题的 Fumadocs 站点。你的笔记仍然是普通的 Markdown。',
        steps: [
          { title: '创建站点', text: '创建 my-notes/ 并安装 @yx-elite/notestack。', command: 'npm create notestack@latest my-notes' },
          { title: '开始写作', text: '打开 localhost:3000。在 site.config.ts 中修改名称、链接和强调色。', command: 'cd my-notes && npm run dev' },
        ],
      },
    },
  },
});
