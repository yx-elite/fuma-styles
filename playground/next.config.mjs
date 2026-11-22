import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  // Static export has no image server, so images are served as-is
  images: { unoptimized: true },
  // Dev server only: let phones and tablets on the home network (192.168.x.x) load
  // the dev scripts. Without it, Next.js blocks them and buttons stay dead on those devices.
  allowedDevOrigins: ['192.168.*.*'],
};

export default withMDX(config);
