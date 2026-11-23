import { createMDX } from 'fumadocs-mdx/next';
import { withNotestack } from '@yx-elite/notestack/next';

const withMDX = createMDX();

export default withMDX(
  withNotestack({
    // Dev server only: let phones and tablets on the home network (192.168.x.x) load
    // the dev scripts. Without it, Next.js blocks them and buttons stay dead on those devices.
    allowedDevOrigins: ['192.168.*.*'],
  }),
);
