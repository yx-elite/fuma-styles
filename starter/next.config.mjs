import { createMDX } from 'fumadocs-mdx/next';
import { withNotestack } from 'notestack/next';

const withMDX = createMDX();

export default withMDX(withNotestack());
