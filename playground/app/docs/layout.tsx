import { source } from '@/lib/source';
import { NotesLayout } from '@yx-elite/notestack';
import site from '@/site.config';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <NotesLayout site={site} tree={source.getPageTree()}>
      {children}
    </NotesLayout>
  );
}
