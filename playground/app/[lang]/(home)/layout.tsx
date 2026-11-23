import { source } from '@/lib/source';
import { NotesHomeLayout, siteFor } from '@yx-elite/notestack';
import site from '@/site.config';

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <NotesHomeLayout site={siteFor(site, lang)} tree={source.getPageTree(lang)}>
      {children}
    </NotesHomeLayout>
  );
}
