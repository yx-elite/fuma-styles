import { readFileSync } from 'node:fs';
import type { NextConfig } from 'next';

/** This package's version, from its package.json (one folder up from src/ and dist/) */
function notestackVersion(): string | undefined {
  try {
    return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
  } catch {
    return undefined;
  }
}

/**
 * Static-export settings every notes site needs, for hosting on S3 with no server.
 * Loaded by Node before Next.js starts: no React, no CSS in this file.
 *
 *   export default createMDX()(withNotestack({ ...your options }));
 */
export function withNotestack(config: NextConfig = {}): NextConfig {
  const version = notestackVersion();
  return {
    reactStrictMode: true,
    // Dev server only: lets phones and tablets on the home network load the dev scripts.
    // Without it Next.js blocks them, and buttons stay dead when testing on a phone.
    allowedDevOrigins: ['192.168.*.*', '10.*.*.*'],
    ...config,
    // The installed theme's version, for the version pill on Notestack's own landing page
    env: { ...config.env, ...(version && { NOTESTACK_VERSION: version }) },
    output: 'export',
    // S3 serves docs/x/index.html for /docs/x/
    trailingSlash: true,
    // A static export has no image server, so images are served as they are
    images: { ...config.images, unoptimized: true },
  };
}
