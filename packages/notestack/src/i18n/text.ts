/**
 * Every piece of text Notestack itself shows (Fumadocs' own text is translated
 * separately, see ./fumadocs.ts). `{name}` marks a value filled in at render time.
 * A site changes any of them with `text` in site.config.ts.
 */

/** Text that depends on a count. `other` is required; languages without plurals (Chinese) only need it. */
export interface Plural {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export interface NotesText {
  /* Landing page: hero */
  startReading: string;
  viewOnGitHub: string;
  /** `{n}` */
  pageCount: Plural;
  /** `{n}` */
  sectionCount: Plural;
  /** `{date}` */
  updated: string;
  /** `{name}`: the site name, read out for the docs preview link */
  openDocs: string;
  onThisPage: string;

  /* Landing page: sections */
  contentsEyebrow: string;
  contentsTitle: string;
  /** `{pages}`, `{sections}`: the two counts above */
  contentsText: string;
  /** Name of the first section when the docs start with pages before any separator */
  firstSection: string;
  /** `{n}` pages not listed */
  andMore: string;
  /** `{page}` */
  startWith: string;
  builtWith: string;

  /* Landing page: search and footer */
  searchTitle: string;
  searchText: string;
  searchButton: string;
  /** `{author}` */
  byAuthor: string;
  builtWithFumadocs: string;
  footerNav: string;

  /* Landing page: "Get started" */
  getStarted: string;
  terminal: string;
  copyCommands: string;
  terminalDone: string;
  runTitle: string;
  runText: string;
  runCloneTitle: string;
  runCloneText: string;
  runInstallTitle: string;
  runInstallText: string;
  runRunTitle: string;
  runRunText: string;

  /* Docs */
  quickLinks: string;
  /** `{date}` */
  lastUpdated: string;

  /* Glossary */
  /** `{n}`: number of terms */
  glossaryFilter: string;
  glossaryFilterLabel: string;
  /** `{n}`: number of matches */
  glossaryFound: string;
  glossaryLetters: string;
  /** `{letter}` */
  glossaryLetter: string;
  /** `{query}` */
  glossaryEmpty: string;
  /** Letter-bar label for terms that don't start with A–Z */
  glossaryOther: string;
  readMore: string;

  /* Buttons */
  copy: string;
  copied: string;

  /* Accent picker (demo sites) */
  accent: string;
  accentPanel: string;
  accentOpen: string;
  accentReset: string;
  accentCustom: string;
  accentNote: string;
}

export const en: NotesText = {
  startReading: 'Start reading',
  viewOnGitHub: 'View on GitHub',
  pageCount: { one: '{n} page', other: '{n} pages' },
  sectionCount: { one: '{n} section', other: '{n} sections' },
  updated: 'Updated {date}',
  openDocs: 'Open the docs: {name}',
  onThisPage: 'On this page',

  contentsEyebrow: 'Contents',
  contentsTitle: "What's inside",
  contentsText: '{pages} in {sections}. Jump into any of them, or start from the first page.',
  firstSection: 'Start here',
  andMore: ' and {n} more',
  startWith: 'Start with {page}',
  builtWith: 'Built with',

  searchTitle: 'Find anything in seconds',
  searchText: 'Every page is searchable. Search runs in your browser, so results show as you type.',
  searchButton: 'Search the notes',
  byAuthor: 'by {author}',
  builtWithFumadocs: 'Built with Fumadocs',
  footerNav: 'Footer',

  getStarted: 'Get started',
  terminal: 'Terminal',
  copyCommands: 'Copy the commands',
  terminalDone: 'Ready on http://localhost:3000',
  runTitle: 'Run the notes on your machine',
  runText: 'The notes are a plain Fumadocs site. Three commands and you can read them offline, or edit your own copy.',
  runCloneTitle: 'Clone the repo',
  runCloneText: 'Get your own copy from GitHub.',
  runInstallTitle: 'Install',
  runInstallText: 'Fumadocs, Next.js and the theme, from npm.',
  runRunTitle: 'Run',
  runRunText: 'Start the site, then open localhost:3000. Edits show as you save.',

  quickLinks: 'Quick links',
  lastUpdated: 'Last updated on {date}',

  glossaryFilter: 'Filter {n} terms…',
  glossaryFilterLabel: 'Filter terms',
  glossaryFound: '{n} found',
  glossaryLetters: 'Jump to letter',
  glossaryLetter: 'Terms starting with {letter}',
  glossaryEmpty: 'No terms match “{query}”.',
  glossaryOther: 'Other terms',
  readMore: 'Read more',

  copy: 'Copy',
  copied: 'Copied',

  accent: 'Accent',
  accentPanel: 'Accent colour',
  accentOpen: 'Change the accent colour',
  accentReset: 'Reset',
  accentCustom: 'Custom colour',
  accentNote: "Only changes this browser. The site's own accent comes from site.config.ts.",
};

/** Simplified Chinese. Shared words follow @fumadocs/language's zh-cn pack (本页目录, 最后更新于, 搜索). */
export const zhCN: NotesText = {
  startReading: '开始阅读',
  viewOnGitHub: '在 GitHub 上查看',
  pageCount: { other: '{n} 页' },
  sectionCount: { other: '{n} 个章节' },
  updated: '更新于 {date}',
  openDocs: '打开文档：{name}',
  onThisPage: '本页目录',

  contentsEyebrow: '目录',
  contentsTitle: '内容一览',
  contentsText: '共 {sections}，{pages}。可以从任意章节开始，也可以从第一页读起。',
  firstSection: '从这里开始',
  andMore: '，以及另外 {n} 页',
  startWith: '从「{page}」开始',
  builtWith: '构建工具',

  searchTitle: '几秒内找到任何内容',
  searchText: '每一页都可以搜索。搜索在浏览器中运行，输入时即显示结果。',
  searchButton: '搜索笔记',
  byAuthor: '作者：{author}',
  builtWithFumadocs: '基于 Fumadocs 构建',
  footerNav: '页脚',

  getStarted: '快速开始',
  terminal: '终端',
  copyCommands: '复制命令',
  terminalDone: '已在 http://localhost:3000 启动',
  runTitle: '在本机运行这些笔记',
  runText: '这些笔记是一个普通的 Fumadocs 站点。只需三条命令，就能离线阅读，或编辑你自己的副本。',
  runCloneTitle: '克隆仓库',
  runCloneText: '从 GitHub 获取你自己的副本。',
  runInstallTitle: '安装',
  runInstallText: '从 npm 安装 Fumadocs、Next.js 和主题。',
  runRunTitle: '运行',
  runRunText: '启动站点，然后打开 localhost:3000。保存后即可看到修改。',

  quickLinks: '快速链接',
  lastUpdated: '最后更新于 {date}',

  glossaryFilter: '筛选 {n} 个术语…',
  glossaryFilterLabel: '筛选术语',
  glossaryFound: '找到 {n} 个',
  glossaryLetters: '按首字母跳转',
  glossaryLetter: '以 {letter} 开头的术语',
  glossaryEmpty: '没有与“{query}”匹配的术语。',
  glossaryOther: '其他术语',
  readMore: '阅读更多',

  copy: '复制',
  copied: '已复制',

  accent: '强调色',
  accentPanel: '强调色',
  accentOpen: '更改强调色',
  accentReset: '重置',
  accentCustom: '自定义颜色',
  accentNote: '只在此浏览器中生效。站点本身的强调色来自 site.config.ts。',
};
