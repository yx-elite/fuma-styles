import { LanguageRedirect } from 'notestack';
import site from '@/site.config';

export default function Page() {
  return <LanguageRedirect site={site} />;
}
