<script>
  // The homepage content region. This is the DEFAULT content of #route — the
  // sections that were previously inlined in App.svelte. Extracted so the shell
  // (nav/Cursor/Viewer/Panel) can stay mounted while #route swaps between home,
  // the blog index, and a post. The intro build choreography targets these
  // nodes (#b-*, #grown) and runs once on first load of `/`; navigating back
  // here from a post does NOT replay it (the nodes are already built).
  import { revealHome } from '../lib/stores.js';
  import Hero from './Hero.svelte';
  import Mechanism from '../lib/sections/Mechanism.svelte';
  import LivingProof from '../lib/sections/LivingProof.svelte';
  import Grown from './Grown.svelte';
  import Wmark from '../lib/Wmark.svelte';
  // Reset to the LIVING MACHINE core (2026-06-11): the legacy old-palette
  // sections (Layers / Who / Get — blue+amber tints, centered card grids the
  // canon retired) are dropped. The page now seeds with the redesigned Hero +
  // the two on-canon exemplars; Waldo (now on Claude Opus) regrows the rest via
  // the archetype catalog into #grown, gated by design-gate.org.
  // remount-safe: reveal instantly when the intro has already played (the
  // $effect runs after children mount, so all #b-* refs are registered).
  $effect(() => { revealHome(); });
</script>

<Hero />
<Mechanism />
<LivingProof />

<!-- the agent appends new sections here (sections/grown/*.svelte) -->
<Grown />

<footer class="foot">
  <div class="inner">
    <span class="glyph"><Wmark /></span>
    <span>workbooks</span>
    <a href="https://github.com/workbooks-sh/workbooks.sh">github</a>
    <a href="https://github.com/workbooks-sh/living-lander">this site's source</a>
    <span class="tail">served live by the workbooks runtime · kept by waldo</span>
  </div>
</footer>
