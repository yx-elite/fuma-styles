import { defineSiteConfig } from '@yx-elite/notestack';

// The one file that differs per notes site.
export default defineSiteConfig({
  name: 'Notestack',
  author: 'yx-elite',
  tag: 'playground',
  description: 'Write your notes in Markdown, with search, diagrams and dark mode built in. Publish a site that reads beautifully.',
  repo: 'yx-elite/notestack',
  url: 'https://notestack.yxelite.dev',
  branch: 'main',
  // Trying NativeWind's cyan
  accent: { light: '#0092b3', dark: '#3ad1ff' },
  // This playground is the theme's demo, so it shows how to install the theme
  start: {
    title: 'Turn your notes into a site like this',
    text: 'One command makes a Fumadocs site with the theme already set up. Your notes stay plain Markdown.',
    steps: [
      { title: 'Create the site', text: 'Makes my-notes/ and installs @yx-elite/notestack.', command: 'npm create notestack@latest my-notes' },
      { title: 'Start writing', text: 'Open localhost:3000. Edit site.config.ts for your name, links and accent.', command: 'cd my-notes && npm run dev' },
    ],
    // Prototype: the "With your agent" tab
    agent: {
      prompt:
        'Make me a study-notes site with Notestack. Run `npm create notestack@latest my-notes`, then read node_modules/@yx-elite/notestack/WRITING.md before writing anything. Set the name and description in site.config.ts, replace the sample notes with notes on networking, and run `npm run build` until it passes.',
      steps: [
        'npm create notestack@latest my-notes',
        'Read WRITING.md',
        'Edited site.config.ts',
        'Wrote 6 notes in content/docs/',
        'npm run build',
      ],
      done: 'Done. Run npm run dev and open localhost:3000.',
    },
  },
  // The theme's docs in two languages: notes in content/docs/en/ and content/docs/zh-CN/.
  // Pages not translated yet show in English.
  languages: ['en', 'zh-CN'],
  translations: {
    'zh-CN': {
      tag: '演示',
      description: '用 Markdown 写笔记，搜索、图表和深色模式都已内置，发布一个读起来舒服的网站。',
      start: {
        title: '把你的笔记变成这样的网站',
        text: '一条命令即可创建一个已经配置好主题的 Fumadocs 站点。你的笔记仍然是普通的 Markdown。',
        steps: [
          { title: '创建站点', text: '创建 my-notes/ 并安装 @yx-elite/notestack。', command: 'npm create notestack@latest my-notes' },
          { title: '开始写作', text: '打开 localhost:3000。在 site.config.ts 中修改名称、链接和强调色。', command: 'cd my-notes && npm run dev' },
        ],
        agent: {
          prompt:
            '用 Notestack 帮我做一个学习笔记网站。运行 `npm create notestack@latest my-notes`，写任何内容之前先读 node_modules/@yx-elite/notestack/WRITING.md。在 site.config.ts 中设置名称和简介，把示例笔记换成网络方面的笔记，然后运行 `npm run build`，直到通过为止。',
          steps: [
            'npm create notestack@latest my-notes',
            '已读 WRITING.md',
            '已修改 site.config.ts',
            '已在 content/docs/ 写了 6 篇笔记',
            'npm run build',
          ],
          done: '完成。运行 npm run dev，打开 localhost:3000。',
        },
      },
    },
  },
});
