<script>
  // ── LIVING MACHINE — Glass panel (canon §3.4) ──
  // Layered translucent material: backdrop blur + saturate, specular top edge,
  // cold inner-light wash, cast depth shadow, directional sheen. NEVER a flat
  // bordered card. Renders as the given `as` element; passes through rest props.
  let {
    as = 'div',
    pad = 'var(--s-6)',
    radius = 'var(--r-lg)',
    children,
    class: klass = '',
    ...rest
  } = $props();
</script>

<svelte:element
  this={as}
  class={`glass ${klass}`}
  style={`--glass-pad:${pad};--glass-radius:${radius};`}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .glass {
    position: relative;
    border-radius: var(--glass-radius, var(--r-lg));
    padding: var(--glass-pad, var(--s-6));
    background: var(--glass);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid var(--glass-edge);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      inset 0 0 40px var(--glass-inner),
      0 20px 60px -24px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }
  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 40%);
  }
</style>
