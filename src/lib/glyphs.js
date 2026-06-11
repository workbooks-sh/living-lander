/* glyphs init — configure the shared mark resolver ONCE with the curated +
   svgl packs, then expose glyph (sync, curated-local) / glyphAsync (CDN long
   tail). The packs are plain JSON, inlined at build time by Vite. A miss
   returns null → the caller renders nothing (never a broken-image box). */
import { glyph, glyphAsync, configure } from '$glyphs';
import brands from '../../../../../toolkits/glyphs/packs/curated-brands.json';
import icons from '../../../../../toolkits/glyphs/packs/curated-icons.json';
import svglIndex from '../../../../../toolkits/glyphs/packs/svgl-index.json';

let wired = false;
export function initGlyphs() {
  if (wired) return;
  configure({ brands, icons, svglIndex });
  wired = true;
}

export { glyph, glyphAsync };
