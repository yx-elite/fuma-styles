import { NotesHome } from '@/kit/home';
import { source } from '@/lib/source';
import site from '@/site.config';

export default function HomePage() {
  return <NotesHome site={site} source={source} />;
}
