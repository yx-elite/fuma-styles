import { NotesHome, siteFor } from '@yx-elite/notestack';
import { source } from '@/lib/source';
import site from '@/site.config';

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  return <NotesHome site={siteFor(site, lang)} source={source} />;
}
