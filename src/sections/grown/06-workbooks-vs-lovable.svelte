<script>
  // The at-a-glance version of the comparison the SEO blog post makes the
  // long-form case for. Lives on the landing page so a first-time visitor
  // who has heard of Lovable (the cohort's best-known name) gets the
  // answer without leaving the page; the blog post is the deep dive.
  // Cites strategy/landscape.org "cohort 1" for the wedge.
  import { reveal } from '../../lib/stores.js';
</script>

<section class="grown" id="workbooks-vs-lovable">
  <div class="kicker reveal" use:reveal>06 · lovable, side by side</div>
  <h2 class="reveal" use:reveal>Workbooks, next to the best-known name</h2>

  <p class="reveal" use:reveal>
    Lovable is the most-talked-about AI app builder right now, so the
    honest comparison starts there. The short version: both turn a
    description into a working app. They differ on what happens to
    the app after the first ten minutes. A workbook is a
    self-contained app — interface, logic, and data travel together
    as one unit. The runtime that runs it is
    <a href="https://github.com/workbooks-sh/workbooks.sh">open-source</a>,
    so what runs the app is itself inspectable. The
    <a href="/#get">desktop app</a> is the front door: no sign-up
    before you can build anything, no trial expiry, the first thing
    you make lives on your machine.
  </p>

  <p class="reveal" use:reveal>
    The same artifact scales with you. A workbook built for yourself
    is built the same way as a workbook shipped to a team of fifty
    or fifty thousand — the runtime scales, the app is the same
    file, there is no weekend-prototype-to-rewrite cliff.
    <a href="/#the-workbook">This page is a workbook</a>: the
    interface, the agent that grows the site, the timeline on the
    right are one file running on one runtime.
  </p>

  <p class="reveal" use:reveal>
    <strong>Where Lovable wins.</strong> If you need a hosted
    multi-tenant product in two days with SSO and a billing dashboard
    out of the box, Lovable is the right tool today. The Workbooks
    hosted cloud is planned, not available. The trade is
    <em>slower first run, much longer useful life</em>. The
    <a href="/blog/lovable-alternative.html">long-form comparison</a>
    walks through the five gaps the listicle usually misses.
  </p>
</section>
