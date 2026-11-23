import { source } from '@/lib/source';
import { NotesHomeLayout } from '@yx-elite/notestack';
import site from '@/site.config';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <NotesHomeLayout site={site} tree={source.getPageTree()}>
      {children}
    </NotesHomeLayout>
  );
}
