import { createGetUrl } from 'fumadocs-core/source';
import site from '@/site.config';

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';

const [user, repo] = site.repo.split('/');
export const gitConfig = { user, repo, branch: site.branch ?? 'main' };

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
