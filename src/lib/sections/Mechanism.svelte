<script>
  // ── LIVING MACHINE — MECHANISM archetype (canon §5.3) ──────────────────────
  // How-it-works is best *shown* assembling. An SVG flow diagram draws its
  // connectors in (native stroke-dashoffset, NOT DrawSVG) and the whole scene
  // scrub-builds as you scroll: nodes settle, the signal pulse travels the
  // path, mono labels clear. ONE idea — "a workbook flows through the runtime
  // and grows via toolkits" — shown, not prose-blobbed.
  //
  // Composition: col-wide (canon §5.2 — diagrams live wide). Type does the
  // heavy lifting (Fraunces h2 + mono labels). Green is sacred: only the live
  // SIGNAL pulse + the active node ring are --live; the static diagram skeleton
  // is --cyan / --line.
  import { onMount } from 'svelte';
  import { draw, scrub, gsap } from '../motion.js';
  import { SectionShell, Kicker } from '../ui/index.js';

  let svgEl = $state(null);
  let sceneEl = $state(null);

  // the three stages of the mechanism (mono machine-voice labels)
  const stages = [
    { k: 'open', t: 'a workbook', d: 'data · logic · interface — one portable piece' },
    { k: 'run', t: 'the runtime', d: 'one engine weaves it — laptop to open internet' },
    { k: 'grow', t: 'toolkits', d: 'every capability authored the same way' },
  ];

  onMount(() => {
    if (!svgEl || !sceneEl) return;

    // 1. draw — the connector spine + node rings stroke themselves in
    const connectors = svgEl.querySelectorAll('[data-draw]');
    draw(connectors, { duration: 1.3, stagger: 0.18 });

    // 2. scrub — the scene assembles as the section passes through the viewport
    const nodes = gsap.utils.toArray('[data-node]', svgEl);
    const labels = gsap.utils.toArray('[data-label]', sceneEl);
    const pulse = svgEl.querySelector('[data-pulse]');

    // seed states (so reduced-motion's progress(1) lands on the finished frame)
    gsap.set(nodes, { transformOrigin: '50% 50%', scale: 0.4, opacity: 0 });
    gsap.set(labels, { opacity: 0, y: 14, filter: 'blur(8px)' });
    gsap.set(pulse, { opacity: 0 });

    // MotionPath is Club-only — travel the spine on the cx attr (free-tier safe;
    // the spine is near-horizontal so cx alone reads as flowing along it).
    scrub(sceneEl, (tl) => {
      nodes.forEach((n, i) => {
        tl.to(n, { scale: 1, opacity: 1, duration: 0.5, ease: 'settle' }, i * 0.55);
        tl.to(labels[i], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'grow' }, i * 0.55 + 0.15);
      });
      // the live signal travels the spine — life only, on the green pulse
      tl.to(pulse, { opacity: 1, duration: 0.2 }, 0.25);
      tl.to(pulse, { attr: { cx: 880 }, duration: 2.4, ease: 'organic' }, 0.3);
      tl.to(pulse, { opacity: 0, duration: 0.3 }, 2.6);
    });
  });
</script>

<SectionShell id="mechanism" col="wide" class="mechanism">
  <Kicker>how it works</Kicker>
  <h2 class="t-h2 title">One piece, woven by one engine, grown the same way.</h2>

  <div class="scene" bind:this={sceneEl}>
    <svg
      bind:this={svgEl}
      class="diagram"
      viewBox="0 0 940 240"
      fill="none"
      role="img"
      aria-label="A workbook flows through the runtime and is extended by toolkits"
    >
      <!-- the spine: a single flowing path the live signal travels -->
      <path
        data-spine
        data-draw
        d="M60 120 C 220 120, 260 120, 470 120 S 720 120, 880 120"
        stroke="var(--cyan)"
        stroke-width="1.5"
        stroke-opacity="0.5"
        stroke-linecap="round"
        fill="none"
      />

      <!-- three node rings (static skeleton = cyan/line, never sacred green) -->
      <g data-node>
        <circle cx="60" cy="120" r="34" data-draw stroke="var(--line)" stroke-width="1.5" fill="var(--base-sink)" />
        <circle cx="60" cy="120" r="6" fill="var(--cyan)" fill-opacity="0.55" />
      </g>
      <g data-node>
        <circle cx="470" cy="120" r="46" data-draw stroke="var(--live-glow)" stroke-width="1.5" fill="var(--base-sink)" />
        <circle cx="470" cy="120" r="7" class="core alive" fill="var(--live)" />
      </g>
      <g data-node>
        <circle cx="880" cy="120" r="34" data-draw stroke="var(--line)" stroke-width="1.5" fill="var(--base-sink)" />
        <circle cx="880" cy="120" r="6" fill="var(--cyan)" fill-opacity="0.55" />
      </g>

      <!-- the live signal that travels the spine (sacred green = alive) -->
      <circle data-pulse cx="60" cy="120" r="4.5" fill="var(--live-bright)" />
    </svg>

    <ol class="labels">
      {#each stages as s, i (s.k)}
        <li data-label class="label" style={`--at:${[6, 50, 94][i]}%`}>
          <span class="lk">{s.k}</span>
          <span class="lt">{s.t}</span>
          <span class="ld">{s.d}</span>
        </li>
      {/each}
    </ol>
  </div>
</SectionShell>

<style>
  .title {
    margin: var(--s-3) 0 0;
    max-width: 18ch;
    color: var(--ink);
  }
  .scene {
    margin-top: var(--s-8);
    position: relative;
  }
  .diagram {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
  }
  .diagram .core {
    filter: drop-shadow(0 0 10px var(--live-glow));
  }

  .labels {
    list-style: none;
    margin: var(--s-5) 0 0;
    padding: 0;
    position: relative;
    height: 84px;
  }
  .label {
    position: absolute;
    top: 0;
    left: var(--at);
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 26ch;
    max-width: 30vw;
    text-align: center;
  }
  .label:first-child {
    transform: translateX(-12%);
    text-align: left;
  }
  .label:last-child {
    transform: translateX(-88%);
    text-align: right;
  }
  .lk {
    font: 500 var(--fs-kicker) / 1 var(--mono);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--cyan);
    font-feature-settings: 'tnum' 1;
  }
  .label:nth-child(2) .lk {
    color: var(--live);
  }
  .lt {
    font: 400 16px/1.2 var(--display);
    font-variation-settings: 'opsz' 48, 'SOFT' 30, 'WONK' 0, 'wght' 520;
    color: var(--ink);
  }
  .ld {
    font: 400 var(--fs-mono-body) / 1.5 var(--mono);
    color: var(--dim);
  }

  @media (max-width: 639px) {
    /* stack the diagram vertically-readable: keep the spine, drop absolute labels */
    .labels {
      height: auto;
      display: flex;
      flex-direction: column;
      gap: var(--s-5);
      margin-top: var(--s-6);
    }
    .label,
    .label:first-child,
    .label:last-child {
      position: static;
      transform: none;
      left: auto;
      width: auto;
      max-width: none;
      text-align: left;
    }
  }
</style>
