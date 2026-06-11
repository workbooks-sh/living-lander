<script>
  // ── LIVING MACHINE — the flagship hero (canon §1 type, §3 material, §4 motion, §5 grid) ──
  // NOT centered-everything. An asymmetric composition where the agent is a
  // visible CHARACTER from frame one: the living W breathes + draws itself, the
  // headline is AUTHORED live by the agent cursor (the existing build
  // choreography in stores.js types #h1text), and the bottom void is filled by a
  // live build-ticker reading the same feed the page is actually built from.
  import AtmosphereField from '../lib/AtmosphereField.svelte';
  import { WMark, Kicker, Glass } from '../lib/ui';
  import { registerRef, onFeed, describeCommit, relTime } from '../lib/stores.js';
  import { glyph, glyphAsync } from '../lib/glyphs.js';
  import { field, magnetic, typeBloom, reduce } from '../lib/motion.js';
  import { onMount } from 'svelte';

  let h1textEl, caretEl, eyebrowEl, fogEl;
  $effect(() => {
    registerRef('h1text', h1textEl);
    registerRef('caret', caretEl);
  });

  // ── the hero's atmosphere reacts to the cursor; the eyebrow blooms into being
  // (the canon type-bloom signature — the live-typed h1 is the agent's own hand,
  // so the bloom rides the static eyebrow above it). ──
  onMount(() => {
    const teardown = fogEl ? field(fogEl) : undefined;
    if (eyebrowEl) typeBloom(eyebrowEl);
    return () => { if (typeof teardown === 'function') teardown(); };
  });

  // ── live build-ticker — the page's own pulse, from the ONE engine feed ──
  // Shows what the agent is doing right now + its latest authored commits. This
  // is the page proving it's alive: it's literally maintained by the feed it shows.
  let ticker = $state([]);     // [{ who, tag, color, text, sha, ts }]
  let agent = $state(null);    // { active, running, ... }
  onMount(() =>
    onFeed(({ changes, agent: a }) => {
      agent = a;
      ticker = (changes || []).slice(0, 5).map(describeCommit);
    })
  );
  // a one-line "what it's doing now" from agent status (honest: working / dreaming / idle).
  const pulse = $derived(
    !agent ? 'connecting to the live runtime…'
    : !agent.active ? 'the agent is offline — last build still served live'
    : agent.running ? 'the agent is building right now'
    : 'the agent is resting — it returns on its own clock'
  );
  const live = $derived(!!(agent && agent.running));

  // ── "build with your favorite agent" — section C (unchanged data, recomposed) ──
  const INSTALL_CMD = 'npx skills add workbooks-sh/workbooks.sh';
  const AGENT_PROMPT =
    'Install the Workbooks agent skills, then read `getting-started` before doing anything else. ' +
    'Run: `npx skills add workbooks-sh/workbooks.sh` — this installs the `SKILL.md` folders into ' +
    '`.claude/skills` (and your Codex/Cursor skill dirs). Then load the `getting-started` skill and ' +
    'follow it to set up the project.';

  const SLOTS = [
    { key: 'claude',  async: 'brand:claude ai',       sync: 'brand:anthropic', label: 'Claude' },
    { key: 'codex',   async: 'brand:codex',           sync: 'brand:openai',    label: 'Codex' },
    { key: 'cursor',  async: 'brand:cursor',          sync: null,              label: 'Cursor' },
    { key: 'copilot', async: 'brand:github copilot',  sync: 'brand:github',    label: 'Copilot' },
    { key: 'gemini',  async: 'brand:gemini',          sync: 'brand:google',    label: 'Gemini' },
  ];
  let marks = $state({});
  $effect(() => {
    for (const s of SLOTS) {
      const fallback = s.sync ? glyph(s.sync, { size: '1.25em', title: s.label }) : null;
      if (fallback) marks = { ...marks, [s.key]: fallback };
      glyphAsync(s.async, { size: '1.25em', title: s.label }).then((svg) => {
        if (svg) marks = { ...marks, [s.key]: svg };
      });
    }
  });

  async function copy(text, e) {
    try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
    const b = e.currentTarget, t = b.textContent;
    b.textContent = 'Copied ✓';
    setTimeout(() => { b.textContent = t; }, 1500);
  }

  // magnetic CTA — attracts the cursor; no-op under reduced-motion (action guards).
  const mag = (node) => magnetic(node, { radius: 110, strength: 0.32 });
</script>

<main class="hero">
  <!-- deep-water atmosphere: volumetric fog (cursor-reactive) + flow-field motes -->
  <div class="hero-fog" bind:this={fogEl} aria-hidden="true">
    <AtmosphereField density={0.00008} />
  </div>

  <!-- the living W, bled off the left edge as a watermark-character: breathes
       (sacred green) + draws itself in on mount. The agent's signature. -->
  <span class="wmark-bleed" id="b-mark" aria-hidden="true">
    <WMark size={520} alive drawIn />
  </span>

  <div class="hero-grid">
    <!-- LEFT-WEIGHTED headline column (cols 2–9) — break center -->
    <div class="lede-col">
      <span class="eyebrow blk" id="b-eyebrow" bind:this={eyebrowEl}>
        <span data-word>One</span> <span data-word>file.</span>
        <span data-word>Served</span> <span data-word>live.</span>
        <span data-word>Always</span> <span data-word>building.</span>
      </span>

      <!-- the agent AUTHORS this headline live (#h1text typed by stores.js).
           Fraunces display, asymmetric, ~110px. The typewriter IS the concept. -->
      <h1 class="display blk" id="b-h1" aria-label="A website that builds itself.">
        <span id="h1text" bind:this={h1textEl}></span><span
          class="caret" id="caret" bind:this={caretEl} hidden></span>
      </h1>

      <p class="sub blk" id="b-sub">
        <b>Workbooks</b> turns what you need into real software — an app for
        yourself, a tool for your team, a product for the world. The thing you
        build in an afternoon is already built to run at any scale.
      </p>

      <div class="ctas blk" id="b-ctas">
        <a class="btn primary" use:mag
           href="https://github.com/workbooks-sh/workbooks.sh/releases/tag/desktop-v0.1.0"
           id="heroDl">download for desktop</a>
        <a class="btn ghost" href="#timeline">watch it work →</a>
      </div>
    </div>

    <!-- RIGHT column — the agent as a present character: works-with strip +
         the live build-ticker. Reads as part of the same organism, off-axis. -->
    <aside class="agent-col">
      <div class="agents blk" id="b-agents">
        <Kicker variant="note">works with your agent</Kicker>
        <p class="agents-line">Point Claude, Cursor, Codex, or Copilot at your
          project — it learns Workbooks from the skills.</p>
        <div class="agents-marks" aria-hidden="true">
          {#each SLOTS as s (s.key)}
            {#if marks[s.key]}<span class="mark" title={s.label}>{@html marks[s.key]}</span>{/if}
          {/each}
        </div>
        <div class="agents-btns">
          <button class="btn primary live" onclick={(e) => copy(INSTALL_CMD, e)}>Copy install</button>
          <button class="btn ghost sm" onclick={(e) => copy(AGENT_PROMPT, e)}>Copy agent prompt</button>
        </div>
      </div>
    </aside>
  </div>

  <!-- the bottom void, FILLED — a live build-ticker. The page shows its own
       pulse: the same feed it is actually built and maintained from. -->
  <Glass as="aside" class="ticker blk" id="b-ticker" pad="0" aria-label="Live build activity">
    <div class="ticker-head">
      <span class="pulse" class:on={live} aria-hidden="true"></span>
      <Kicker variant="agent">{live ? 'building' : 'live'}</Kicker>
      <span class="pulse-text">{pulse}</span>
      <a class="ticker-link" href="#timeline">open the timeline →</a>
    </div>
    <ol class="ticker-feed tnum">
      {#if ticker.length === 0}
        <li class="trow placeholder"><span class="tdot"></span>
          <span class="ttext">reading the live feed…</span></li>
      {:else}
        {#each ticker as c (c.sha)}
          <li class="trow">
            <span class="tdot" style={`background:${c.color}`}></span>
            {#if c.tag}<span class="ttag" style={`color:${c.color}`}>{c.tag}</span>{/if}
            <span class="ttext">{c.text}</span>
            <span class="tmeta">{relTime(c.ts)}</span>
          </li>
        {/each}
      {/if}
    </ol>
  </Glass>
</main>

<style>
  /* ── the hero: an asymmetric stage, not a centered stack ── */
  .hero {
    position: relative;
    overflow: hidden;
    min-height: 100dvh;
    display: grid;
    grid-template-rows: 1fr auto;
    align-items: center;
    padding: clamp(96px, 12vh, 150px) clamp(24px, 5vw, 80px) clamp(20px, 3vh, 40px);
    text-align: left; /* break the centered-everything default */
  }
  .hero > :global(:not(.hero-fog)) { position: relative; z-index: 2; }

  .hero-fog { position: absolute; inset: 0; z-index: 0; }
  /* fade the field into the page floor at the bottom */
  .hero-fog::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 34%;
    background: linear-gradient(transparent, var(--base)); pointer-events: none;
  }

  /* the living W watermark — oversized, bled off the left edge, low-opacity so
     it's atmosphere/character, never decoration competing with the type. */
  .wmark-bleed {
    position: absolute; left: -7vw; top: 50%; translate: 0 -54%;
    z-index: 1; opacity: 0.06; pointer-events: none;
    color: var(--live);
  }
  .wmark-bleed :global(svg) { display: block; width: clamp(280px, 42vw, 560px); height: auto; }

  /* 12-col asymmetric grid — headline left-weighted, agent column off-axis right */
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--s-6);
    align-items: center;
    width: 100%;
    max-width: 1280px;
    margin-inline: auto;
  }
  .lede-col { grid-column: 1 / 9; }
  .agent-col { grid-column: 9 / 13; align-self: center; }

  /* eyebrow — mono machine voice, blooms in (canon type-bloom) */
  .eyebrow {
    display: block; margin: 0 0 var(--s-5);
    font: 500 var(--fs-kicker)/1.4 var(--mono);
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim);
  }
  .eyebrow :global([data-word]) { display: inline-block; }

  /* the AUTHORED headline — Fraunces display, soft + wonk, ~110px, asymmetric.
     min-height holds the layout while the agent types it in (#h1text). */
  .display {
    margin: 0 0 var(--s-6);
    font-family: var(--display);
    font-variation-settings: 'opsz' 144, 'SOFT' 60, 'WONK' 1, 'wght' 460;
    font-weight: 460;
    font-optical-sizing: none;
    font-size: clamp(54px, 9vw, 112px);
    line-height: 0.95; letter-spacing: -0.025em;
    color: var(--ink);
    max-width: 15ch; min-height: 1.9em;
    text-wrap: balance;
  }
  .display .caret {
    display: inline-block; width: 0.05em; height: 0.82em; margin-left: 0.06em;
    background: var(--live); vertical-align: -0.06em;
    box-shadow: 0 0 12px var(--live-glow);
    animation: blink 1s steps(1) infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  .sub {
    margin: 0 0 var(--s-7); color: var(--dim);
    font: 400 var(--fs-lede)/1.55 var(--sans); letter-spacing: -0.006em;
    max-width: 48ch;
  }
  .sub b { color: var(--ink); font-weight: 520; }

  .ctas { display: flex; gap: var(--s-3); align-items: center; flex-wrap: wrap; }
  .btn {
    border-radius: var(--r); text-decoration: none; cursor: pointer;
    font: 500 13.5px/1 var(--mono); padding: 13px 20px; letter-spacing: -0.01em;
    border: 1px solid transparent; transition: background 0.15s, color 0.15s, border-color 0.15s;
    will-change: transform;
  }
  .btn.primary { background: var(--ink); color: var(--base); }
  .btn.primary:hover { background: #fff; }
  .btn.ghost { color: var(--dim); border-color: var(--line); background: transparent; }
  .btn.ghost:hover { color: var(--ink); border-color: var(--faint); }
  .btn.sm { padding: 11px 15px; font-size: 12.5px; }

  /* ── agent column ── */
  .agents {
    display: flex; flex-direction: column; gap: var(--s-3);
    align-items: flex-start; text-align: left;
  }
  .agents-line {
    margin: 2px 0 4px; color: var(--ink);
    font: 400 clamp(13.5px, 1.1vw, 15px)/1.5 var(--sans); max-width: 30ch;
  }
  .agents-marks {
    display: flex; align-items: center; gap: 16px; opacity: 0.75; font-size: 20px;
    margin: 2px 0 6px;
  }
  .agents-marks .mark { display: inline-flex; line-height: 0; }
  .agents-marks :global(svg) { height: 1.25em; width: auto; }
  .agents-marks :global(.glyph--mono) { color: var(--dim); }
  .agents-btns { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  /* brand rule: green fill, INK text — never white on green */
  .btn.primary.live { background: var(--live); color: var(--live-ink); border-color: transparent; }
  .btn.primary.live:hover { background: var(--live-bright); }

  /* ── the live build-ticker (fills the bottom void) ── */
  .hero :global(.ticker) {
    width: 100%; max-width: 1280px; margin: clamp(28px, 4vh, 56px) auto 0;
  }
  .ticker-head {
    display: flex; align-items: center; gap: var(--s-3);
    padding: 12px var(--s-5); border-bottom: 1px solid var(--line-soft);
    flex-wrap: wrap;
  }
  .pulse {
    width: 8px; height: 8px; border-radius: 50%; background: var(--faint);
    flex: 0 0 auto;
  }
  .pulse.on {
    background: var(--live);
    box-shadow: 0 0 0 0 var(--live-glow);
    animation: tpulse 1.8s ease-out infinite;
  }
  @keyframes tpulse {
    0% { box-shadow: 0 0 0 0 var(--live-glow); }
    100% { box-shadow: 0 0 0 10px rgba(63, 224, 129, 0); }
  }
  .pulse-text {
    font: 400 var(--fs-mono-body)/1.3 var(--mono); color: var(--dim);
    flex: 1 1 auto; min-width: 0;
  }
  .ticker-link {
    font: 500 11.5px/1 var(--mono); color: var(--faint); text-decoration: none;
    letter-spacing: -0.01em; white-space: nowrap;
  }
  .ticker-link:hover { color: var(--live); }

  .ticker-feed {
    list-style: none; margin: 0; padding: 8px var(--s-5) 12px;
    display: grid; gap: 7px;
  }
  .trow {
    display: flex; align-items: baseline; gap: 10px;
    font: 400 var(--fs-mono-body)/1.4 var(--mono); color: var(--ink);
    min-width: 0;
  }
  .trow.placeholder { color: var(--faint); }
  .tdot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--faint);
    flex: 0 0 auto; align-self: center;
  }
  .ttag {
    font: 500 9.5px/1 var(--mono); letter-spacing: 0.05em; text-transform: uppercase;
    flex: 0 0 auto;
  }
  .ttext {
    flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    color: var(--dim);
  }
  .tmeta { font-size: 10.5px; color: var(--faint); flex: 0 0 auto; }

  /* ── responsive: collapse the asymmetry gracefully (keep generous spacing) ── */
  @media (max-width: 1023px) {
    .lede-col { grid-column: 1 / 13; }
    .agent-col { grid-column: 1 / 13; align-self: start; margin-top: var(--s-6); }
    .agents { align-items: flex-start; }
    .wmark-bleed { opacity: 0.04; }
  }
  @media (max-width: 640px) {
    .hero { padding-inline: 22px; }
    .display { font-size: clamp(46px, 13vw, 72px); min-height: 2.2em; }
    .ticker-head { gap: 8px; }
    .ticker-link { display: none; }
  }
</style>
