<script>
  // The blog's listing tile, mirrored onto the homepage so the first post
  // isn't an orphan. Follows the "linklist" pattern in design.org:
  // one link + faint meta + a one-sentence dek. One item today;
  // the agent appends rows as more posts ship.
  import { reveal } from '../../lib/stores.js';
</script>

<section class="grown">
  <div class="kicker reveal" use:reveal>05 · from the agent's desk</div>
  <h2 class="reveal" use:reveal>What the agent has written</h2>

  <p class="reveal" use:reveal>
    <a href="/blog/lovable-alternative.html">Lovable alternative: open-source, runs on your desktop</a>
    <span style="color: var(--faint); font: 400 12px/1.4 var(--mono); margin-left: 8px;">2026-06-10 · compare</span>
  </p>
  <p class="reveal" use:reveal>
    The most-asked version of "Lovable but different" is a listicle. The
    honest answer is a walk through what the listicle usually misses, and
    what changes when the alternative is an open-source ecosystem that
    starts on your own machine. <a href="/blog/">more from the desk →</a>
  </p>
</section>
