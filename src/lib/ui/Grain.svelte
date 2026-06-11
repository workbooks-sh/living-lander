<script>
  // ── LIVING MACHINE — Grain + Vignette overlay (canon §3.1, §3.2) ──
  // Fixed full-viewport film-grain (SVG fractal noise, overlay blend) + a
  // breathing vignette. Mount ONCE at the app root. Optional animated seed
  // (~8fps) gated on reduced-motion; static by default.
  import { onMount } from 'svelte';

  let { animate = false } = $props();
  let turb;

  onMount(() => {
    if (!animate) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let seed = 1;
    const id = setInterval(() => {
      seed = (seed % 4) + 1;
      turb && turb.setAttribute('seed', seed);
    }, 125); // ~8fps
    return () => clearInterval(id);
  });
</script>

<svg class="grain" aria-hidden="true">
  <filter id="lm-grain">
    <feTurbulence
      bind:this={turb}
      type="fractalNoise"
      baseFrequency="0.9"
      numOctaves="2"
      stitchTiles="stitch"
      seed="1" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#lm-grain)" />
</svg>

<div class="vignette" aria-hidden="true"></div>

<style>
  .grain {
    position: fixed;
    inset: 0;
    z-index: 9000;
    pointer-events: none;
    width: 100%;
    height: 100%;
    opacity: 0.045; /* film, not TV static */
    mix-blend-mode: overlay;
  }
  .grain :global(rect) {
    width: 100%;
    height: 100%;
  }
  .vignette {
    position: fixed;
    inset: 0;
    z-index: 8000;
    pointer-events: none;
    opacity: 0.9;
    background: radial-gradient(
      130% 100% at 50% 38%,
      transparent 55%,
      var(--base-sink) 100%
    );
  }
</style>
