import type * as PageTree from 'fumadocs-core/page-tree';
import { describe, expect, it } from 'vitest';
import { groupPageTree } from '../src/layouts/home.js';

const page = (name: string): PageTree.Item => ({ type: 'page', name, url: `/docs/${name.toLowerCase()}` });

// The sections as names and page URLs, the parts a reader sees
const sections = (tree: PageTree.Root, firstSection?: string) =>
  groupPageTree(tree, firstSection).map((group) => [group.name, group.pages.map((p) => p.url)]);

describe('groupPageTree (the landing page sections)', () => {
  it('groups the pages before any separator under the first section', () => {
    const tree: PageTree.Root = { name: 'Docs', children: [page('Intro'), page('Setup')] };
    expect(sections(tree)).toEqual([['Start here', ['/docs/intro', '/docs/setup']]]);
    expect(sections(tree, '从这里开始')[0][0]).toBe('从这里开始');
  });

  it('starts a section at each separator', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        page('Intro'),
        { type: 'separator', name: 'Writing' },
        page('Callouts'),
        page('Images'),
      ],
    };
    expect(sections(tree)).toEqual([
      ['Start here', ['/docs/intro']],
      ['Writing', ['/docs/callouts', '/docs/images']],
    ]);
  });

  it('puts a folder right after a separator into that section, index page first', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        { type: 'separator', name: 'Publishing' },
        { type: 'folder', name: 'Deployment', index: page('Deployment'), children: [page('S3'), page('Vercel')] },
      ],
    };
    expect(sections(tree)).toEqual([['Publishing', ['/docs/deployment', '/docs/s3', '/docs/vercel']]]);
  });

  it('makes any other folder a section of its own', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        page('Intro'),
        { type: 'folder', name: 'Showcase', children: [page('Markdown')] },
      ],
    };
    expect(sections(tree)).toEqual([
      ['Start here', ['/docs/intro']],
      ['Showcase', ['/docs/markdown']],
    ]);
  });

  it('makes each folder its own section when a separator has several', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        { type: 'separator', name: 'Start here' },
        page('Welcome'),
        { type: 'separator', name: 'Notes' },
        { type: 'folder', name: 'Foundations', index: page('Foundations'), children: [page('Regions')] },
        { type: 'folder', name: 'Identity', children: [page('Users'), page('Roles')] },
        { type: 'folder', name: 'Compute', children: [page('EC2')] },
      ],
    };
    expect(sections(tree)).toEqual([
      ['Start here', ['/docs/welcome']],
      ['Foundations', ['/docs/foundations', '/docs/regions']],
      ['Identity', ['/docs/users', '/docs/roles']],
      ['Compute', ['/docs/ec2']],
    ]);
  });

  it("keeps a separator's loose pages under its name next to its folders", () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        { type: 'separator', name: 'Notes' },
        page('Overview'),
        { type: 'folder', name: 'Identity', children: [page('Users')] },
        { type: 'folder', name: 'Compute', children: [page('EC2')] },
      ],
    };
    expect(sections(tree)).toEqual([
      ['Notes', ['/docs/overview']],
      ['Identity', ['/docs/users']],
      ['Compute', ['/docs/ec2']],
    ]);
  });

  it('drops sections with no pages', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [{ type: 'separator', name: 'Empty' }, { type: 'separator', name: 'Writing' }, page('Callouts')],
    };
    expect(sections(tree)).toEqual([['Writing', ['/docs/callouts']]]);
  });
});
