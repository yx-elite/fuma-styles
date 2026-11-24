import { createNotesPage } from 'notestack/routes';
import { source } from '@/lib/source';
import site from '@/site.config';

// repoDir: this site lives in playground/ inside the repo, for "Open in GitHub" links
const docs = createNotesPage({ source, site, repoDir: 'playground' });

export default docs.Page;
export const generateStaticParams = docs.generateStaticParams;
export const generateMetadata = docs.generateMetadata;
