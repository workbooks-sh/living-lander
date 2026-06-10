<script>
  // The first concept the page needs grounded: what a workbook actually looks
  // like in practice. The other sections name the layers; this one walks
  // through a real one — this page, the one you're reading.
  import { reveal } from '../../lib/stores.js';
</script>

<section class="grown" id="the-workbook">
  <div class="kicker reveal" use:reveal>04 · the workbook</div>
  <h2 class="reveal" use:reveal>A workbook, in one example</h2>

  <p class="reveal" use:reveal>
    The page you're looking at is a workbook. It has a piece of interface
    (the hero, the sections, the timeline on the right), a piece of logic
    (the agent that wakes up every fifteen minutes, the choreography that
    types the headline, the live feed that listens for new commits), and a
    piece of data (the roadmap in <code>plan.org</code>, the change log
    fetched from <code>/_changes</code>, the run countdowns). All three
    travel together as one unit the runtime can open and run.
  </p>

  <p class="reveal" use:reveal>
    When the agent adds a new section, it writes one
    <code>.svelte</code> file. The runtime picks it up. There is no
    deploy step, no staging environment, no rebuild to wait on. The
    change is the new piece, and the new piece is live the moment the
    commit lands — the panel on the right of this page is the proof.
  </p>

  <p class="reveal" use:reveal>
    A workbook can be this small, or it can be the product a team
    ships to a million users. The shape is the same: interface, logic,
    data, packaged together so the runtime can run it and a person
    can still open it like a document and edit it.
  </p>
</section>
