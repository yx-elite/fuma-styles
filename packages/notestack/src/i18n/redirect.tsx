import { defaultLanguageOf, languageKey, type LanguageConfig } from './index.js';
import { languageName } from './fumadocs.js';

/**
 * Picks the language and leaves `/` straight away, before React loads:
 * the language the reader last visited, else the first of their browser's
 * languages the site has (exact match, then same base: zh-TW → zh-CN), else the default.
 */
function redirectScript(languages: string[], fallback: string) {
  return `(function(){var l=${JSON.stringify(languages)},d=${JSON.stringify(fallback)},k=${JSON.stringify(languageKey)},p;
try{var s=localStorage.getItem(k);if(l.indexOf(s)>-1)p=s}catch(e){}
if(!p){var w=navigator.languages||[navigator.language],i,j;
for(i=0;i<w.length&&!p;i++)for(j=0;j<l.length;j++)if(l[j].toLowerCase()===String(w[i]).toLowerCase()){p=l[j];break}
for(i=0;i<w.length&&!p;i++)for(j=0;j<l.length;j++)if(l[j].split('-')[0].toLowerCase()===String(w[i]).split('-')[0].toLowerCase()){p=l[j];break}}
location.replace('/'+(p||d)+'/'+location.search+location.hash)})()`;
}

/**
 * The page at `/` of a site with `languages`. A static site can't hide the
 * language in its URLs, so `/` sends each reader to `/<language>/`.
 * Without JavaScript it shows a plain list of the languages.
 */
export function LanguageRedirect({ site }: { site: LanguageConfig }) {
  const languages = site.languages ?? [defaultLanguageOf(site)];
  return (
    <main className="ns-language-redirect">
      <script dangerouslySetInnerHTML={{ __html: redirectScript(languages, defaultLanguageOf(site)) }} />
      <ul>
        {languages.map((language) => (
          <li key={language}>
            <a href={`/${language}/`} hrefLang={language} lang={language}>
              {languageName(language)}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
