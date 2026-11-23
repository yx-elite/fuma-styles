import { source } from '@/lib/source';
import { NotesLayout, siteFor } from '@yx-elite/notestack';
import site from '@/site.config';

export default async function Layout({ params, children }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  return (
    <NotesLayout site={siteFor(site, lang)} tree={source.getPageTree(lang)}>
      {children}
    </NotesLayout>
  );
}
