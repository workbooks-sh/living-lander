<script>
  // ── LIVING MACHINE — Kicker (canon §1.5) ──
  // Mono "true small-caps feel": uppercase + reduced size + wide tracking + a
  // leading tick. variant="agent" → green (alive/agent voice), tick "▸".
  // variant="note" → dim field-note voice, tick "//".
  let { variant = 'agent', children, class: klass = '', ...rest } = $props();
</script>

<span class={`kicker kicker--${variant} ${klass}`} {...rest}>
  {@render children?.()}
</span>

<style>
  .kicker {
    font: 500 var(--fs-kicker) / 1 var(--mono);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-feature-settings: 'tnum' 1, 'ss01' 1;
    color: var(--live); /* agent voice = alive = green */
    display: inline-block;
  }
  .kicker--agent::before {
    content: '▸ ';
    opacity: 0.7;
  }
  .kicker--note {
    color: var(--dim);
  }
  .kicker--note::before {
    content: '// ';
    opacity: 0.7;
  }
</style>
