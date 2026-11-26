'use client';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GitHubMark } from './github-mark.js';

/** How long a fetched count is kept in this browser before asking GitHub again */
const MAX_AGE = 60 * 60 * 1000;

/**
 * "Star on GitHub" with the repo's live star count, for the landing page hero.
 * The count is fetched in the browser (the site is a static export) and kept in
 * localStorage for an hour, which stays well inside GitHub's limit of 60 requests
 * an hour per visitor. If GitHub doesn't answer, the button shows no number.
 * Styles in theme.css (Buttons).
 */
export function StarButton({ repo, label, language }: { repo: string; label: string; language: string }) {
  const [stars, setStars] = useState<number>();

  useEffect(() => {
    const key = `ns-stars:${repo}`;
    try {
      const cached = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (cached && Date.now() - cached.at < MAX_AGE) {
        setStars(cached.stars);
        return;
      }
    } catch {
      // storage off: fetch every time
    }

    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${repo}`, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((data) => {
        if (typeof data?.stargazers_count !== 'number') return;
        setStars(data.stargazers_count);
        try {
          localStorage.setItem(key, JSON.stringify({ stars: data.stargazers_count, at: Date.now() }));
        } catch {
          // storage off
        }
      })
      .catch(() => {
        // offline or rate-limited: no number
      });
    return () => controller.abort();
  }, [repo]);

  const count =
    stars === undefined ? undefined : new Intl.NumberFormat(language, { notation: 'compact', maximumFractionDigits: 1 }).format(stars);

  return (
    <a href={`https://github.com/${repo}`} className="ns-button ns-button-secondary ns-star-button" target="_blank" rel="noreferrer">
      {/* one box for mark and label, so on phones it centres in the space the count leaves */}
      <span className="ns-star-label">
        <GitHubMark />
        {label}
      </span>
      {count !== undefined && (
        <span className="ns-star-count">
          <Star aria-hidden />
          {count}
        </span>
      )}
    </a>
  );
}
