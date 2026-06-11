<script>
  // ── LIVING MACHINE — SectionShell (canon §5.1, §5.2, §4.2) ──
  // Every grown section's container: canon vertical rhythm, the 12-col
  // asymmetric grid + a named column slot (never centered), and unfold-on-scroll.
  // One organism — sections flow, they do not stack as bordered cards.
  import { unfold } from '../motion.js';

  let {
    col = 'prose',     // prose | offset | wide | narrow  (canon §5.2)
    id = undefined,
    grow = true,        // unfold-on-scroll
    class: klass = '',
    children,
    ...rest
  } = $props();

  function shell(node) {
    if (grow) unfold(node);
    return {};
  }
</script>

<section class={`shell ${klass}`} {id} {...rest}>
  <div class="wrap">
    <div class="grid">
      <div class={`col col-${col}`} use:shell>
        {@render children?.()}
      </div>
    </div>
  </div>
</section>

<style>
  .shell {
    position: relative;
    padding-block: clamp(96px, 14vh, 192px); /* --s-9 → --s-11; atmosphere needs room */
  }
  .wrap {
    width: min(1200px, 100% - var(--s-7));
    margin-inline: auto;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--s-5);
    align-items: start;
  }
  /* asymmetric defaults — break center */
  .col-prose {
    grid-column: 2 / 8;
  }
  .col-offset {
    grid-column: 5 / 12;
  }
  .col-wide {
    grid-column: 2 / 12;
  }
  .col-narrow {
    grid-column: 3 / 8;
  }

  @media (max-width: 1023px) {
    .col-prose,
    .col-offset {
      grid-column: 1 / 7;
    }
    .col-wide,
    .col-narrow {
      grid-column: 1 / 7;
    }
    .grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }
  @media (max-width: 639px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .col-prose,
    .col-offset,
    .col-wide,
    .col-narrow {
      grid-column: 1 / -1;
    }
  }
</style>
