'use client';
import { useEffect } from 'react';
import { languageKey } from './index.js';

/** Keeps the language of the page being read, so `/` opens it next time. Renders nothing. */
export function RememberLanguage({ language }: { language: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(languageKey, language);
    } catch {
      // private mode or storage off: `/` falls back to the browser's language
    }
  }, [language]);
  return null;
}
