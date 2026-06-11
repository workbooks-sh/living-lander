<script>
  // ── LIVING MACHINE — LIVING-PROOF archetype (canon §5.3) ───────────────────
  // There is a real living thing to show: the agent, working, on a timeline.
  // The agent is a visible CHARACTER — a breathing green dot (sacred --live),
  // a live-status badge, and a timeline whose entries reveal in sequence the
  // way the organism actually authors itself. Tabular figures (.tnum) on every
  // timestamp. ONE idea: "the agent is alive and you can watch it build."
  //
  // Composition: col-offset (canon §5.2 — right-weighted, breaks center). The
  // material is real glass (§3.4), never a flat card. Motion = breathe on the
  // agent dot + scrub-reveal on the timeline (entries clear as you scroll).
  import { onMount } from 'svelte';
  import { gsap, scrub, breathe } from '../motion.js';
  import { SectionShell, Kicker, Glass } from '../ui/index.js';

  // a real slice of the agent's worklog (machine voice, tabular timestamps)
  const log = [
    { t: '00:00', s: 'wake', m: 'agent online · reading the workbook', live: false },
    { t: '00:03', s: 'plan', m: 'goal: add a revenue chart from the orders table', live: false },
    { t: '00:07', s: 'reach', m: 'pulling the charts toolkit into the runtime', live: false },
    { t: '00:11', s: 'weave', m: 'writing the cell · binding orders → bars', live: false },
    { t: '00:14', s: 'live', m: 'chart rendered · committed to the workbook', live: true },
  ];

  let dotEl = $state(null);
  let listEl = $state(null);
  let counterEl = $state(null);

  onMount(() => {
    // the agent dot breathes — genuinely alive (.alive, 4.2s, sacred green)
    if (dotEl) breathe(dotEl);

    if (!listEl) return;
    const rows = gsap.utils.toArray('.row', listEl);
    const ticks = gsap.utils.toArray('.tick', listEl);
    gsap.set(rows, { opacity: 0.18 });
    gsap.set(ticks, { scale: 0.4, opacity: 0.3, transformOrigin: '50% 50%' });

    // the timeline lights up entry-by-entry as the section passes through
    scrub(listEl, (tl) => {
      rows.forEach((r, i) => {
        tl.to(ticks[i], { scale: 1, opacity: 1, duration: 0.3, ease: 'settle' }, i * 0.4);
        tl.to(r, { opacity: 1, duration: 0.35, ease: 'grow' }, i * 0.4);
      });
    });

    // the live counter ticks up (tabular figures, alive)
    if (counterEl) {
      const obj = { v: 0 };
      scrub(listEl, (tl) => {
        tl.to(obj, {
          v: 1240,
          duration: 2,
          ease: 'organic',
          onUpdate: () => {
            counterEl.textContent = Math.round(obj.v).toLocaleString();
          },
        });
      });
    }
  });
</script>

<SectionShell id="living-proof" col="offset" class="living-proof">
  <Kicker>live · the agent at work</Kicker>
  <h2 class="t-h2 title">It isn't a render. It's the organism, building.</h2>

  <Glass as="div" class="stage" pad="0">
    <header class="bar">
      <span class="who">
        <span class="dot alive" bind:this={dotEl} aria-hidden="true"></span>
        <span class="name">workbooks agent</span>
      </span>
      <span class="status">
        <span class="pip"></span>
        LIVE
      </span>
    </header>

    <ol class="timeline" bind:this={listEl}>
      {#each log as e, i (e.t)}
        <li class={`row ${e.live ? 'row--live' : ''}`}>
          <time class="ts tnum">{e.t}</time>
          <span class="tick" class:tick--live={e.live}></span>
          <span class="body">
            <span class={`stage-k ${e.live ? 'stage-k--live' : ''}`}>{e.s}</span>
            <span class="msg">{e.m}</span>
          </span>
        </li>
      {/each}
    </ol>

    <footer class="meta">
      <span class="stat">
        <b class="tnum" bind:this={counterEl}>0</b>
        <span class="unit">cells woven this week</span>
      </span>
      <span class="hb tnum">heartbeat 4.2s · uptime 100%</span>
    </footer>
  </Glass>
</SectionShell>

<style>
  .title {
    margin: var(--s-3) 0 var(--s-7);
    max-width: 20ch;
    color: var(--ink);
  }

  :global(.living-proof .stage) {
    overflow: hidden;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--s-4) var(--s-5);
    border-bottom: 1px solid var(--line);
    background: linear-gradient(180deg, var(--cyan-dim), transparent);
  }
  .who {
    display: flex;
    align-items: center;
    gap: var(--s-3);
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--live);
    box-shadow: 0 0 12px var(--live-glow);
    display: inline-block;
  }
  .name {
    font: 500 13px/1 var(--mono);
    letter-spacing: 0.02em;
    color: var(--ink);
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font: 500 var(--fs-kicker) / 1 var(--mono);
    letter-spacing: 0.16em;
    color: var(--live);
    font-feature-settings: 'tnum' 1;
  }
  .pip {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--live-bright);
    box-shadow: 0 0 8px var(--live-glow);
    animation: lp-pip 1.6s ease-in-out infinite;
  }
  @keyframes lp-pip {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 1; }
  }

  .timeline {
    list-style: none;
    margin: 0;
    padding: var(--s-4) var(--s-5);
    display: flex;
    flex-direction: column;
  }
  .row {
    display: grid;
    grid-template-columns: 5ch 16px 1fr;
    align-items: start;
    gap: var(--s-4);
    padding: var(--s-3) 0;
    position: relative;
  }
  /* the connecting rail behind the ticks */
  .row:not(:last-child)::before {
    content: '';
    position: absolute;
    left: calc(5ch + var(--s-4) + 7px);
    top: calc(var(--s-3) + 14px);
    bottom: -2px;
    width: 1px;
    background: var(--line);
  }
  .ts {
    font: 400 12px/1.5 var(--mono);
    color: var(--faint);
    padding-top: 2px;
  }
  .tick {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    margin-top: 6px;
    margin-left: 4px;
    background: var(--base-sink);
    border: 1.5px solid var(--cyan);
    box-shadow: 0 0 0 3px var(--base-sink);
    z-index: 1;
  }
  .tick--live {
    background: var(--live);
    border-color: var(--live);
    box-shadow: 0 0 12px var(--live-glow), 0 0 0 3px var(--base-sink);
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .stage-k {
    font: 500 var(--fs-kicker) / 1 var(--mono);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--cyan);
  }
  .stage-k--live {
    color: var(--live);
  }
  .msg {
    font: 400 var(--fs-mono-body) / 1.55 var(--mono);
    color: var(--dim);
  }
  .row--live .msg {
    color: var(--ink);
  }

  .meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--s-4);
    padding: var(--s-4) var(--s-5);
    border-top: 1px solid var(--line);
    flex-wrap: wrap;
  }
  .stat {
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
  }
  .stat b {
    font: 400 var(--fs-stat) / 1 var(--mono);
    color: var(--live);
    letter-spacing: -0.01em;
  }
  .unit {
    font: 400 var(--fs-small) / 1 var(--sans);
    color: var(--dim);
  }
  .hb {
    font: 400 12px/1 var(--mono);
    color: var(--faint);
    letter-spacing: 0.02em;
  }

  @media (prefers-reduced-motion: reduce) {
    .pip {
      animation: none;
      opacity: 1;
    }
  }
  @media (max-width: 639px) {
    .meta {
      flex-direction: column;
      gap: var(--s-3);
    }
  }
</style>
