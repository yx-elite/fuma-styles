import type { NextConfig } from 'next';

/**
 * Static-export settings every notes site needs, for hosting on S3 with no server.
 * Loaded by Node before Next.js starts: no React, no CSS in this file.
 *
 *   export default createMDX()(withNotestack({ ...your options }));
 */
export function withNotestack(config: NextConfig = {}): NextConfig {
  return {
    reactStrictMode: true,
    ...config,
    output: 'export',
    // S3 serves docs/x/index.html for /docs/x/
    trailingSlash: true,
    // A static export has no image server, so images are served as they are
    images: { ...config.images, unoptimized: true },
  };
}
