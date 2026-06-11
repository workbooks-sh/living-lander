<script>
  // ── LIVING MACHINE — the living W mark (canon §3.5 breathe + §4.3 draw) ──
  // The Workbooks "W" as a genuinely-alive element: breathes (the sacred green
  // glow) and can draw itself in on mount (native stroke-dashoffset, NOT
  // DrawSVG). The path geometry is the single source from lib/Wmark.svelte.
  import { onMount } from 'svelte';
  import { breathe as breatheAction, draw } from '../motion.js';

  let {
    size = 28,
    alive = true,        // breathing green glow
    drawIn = false,      // stroke-draw on mount
    class: klass = '',
    ...rest
  } = $props();

  const D =
    'M0 206V0.00231123H69.1194V76L126.393 0L168.946 0.00231123V76L223.295 0L280 0.00231147L223.295 88L248.626 176.683C252.823 191.375 241.791 206 226.511 206H116.27L112.626 140.5L41.5 206H0Z';

  let pathEl = $state(null);

  function aliveAction(node) {
    if (!alive) return {};
    return breatheAction(node);
  }

  onMount(() => {
    if (drawIn && pathEl) draw([pathEl], { duration: 1.4, stagger: 0 });
  });
</script>

<svg
  class={`wmark ${klass}`}
  viewBox="0 0 280 206"
  width={size}
  height={(size * 206) / 280}
  fill="none"
  use:aliveAction
  {...rest}
>
  {#if drawIn}
    <path
      bind:this={pathEl}
      d={D}
      fill="none"
      stroke="var(--live)"
      stroke-width="6"
      stroke-linejoin="round" />
  {:else}
    <path d={D} fill="currentColor" />
  {/if}
</svg>

<style>
  .wmark {
    display: inline-block;
    color: var(--live);
    overflow: visible;
  }
</style>
