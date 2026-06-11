# Section Archetype Catalog — LIVING MACHINE

The page is one growing organism, not a stack of blog posts. "Add a section" must
never mean "write 2–4 `<p>`s under a kicker." That prose-blob primitive is dead.

Instead you **pick an archetype** from this catalog. Each archetype is a real
shape with a job, a gate ("when it earns a place"), a fixed composition, the named
motion signatures it is allowed to use, and a concrete skeleton built on the
foundation primitives.

This doc sits next to the design canon and `WALDO.md` (the runtime-CMS authoring
guide). The canon defines the *material* (§1 type, §2 color, §3 light/glass, §4
motion, §5 grid); this catalog defines the *shapes* you compose that material
into.

---

## The foundation you build on

These already exist; do not reinvent them. Skeletons below reference them by name.

**Primitives — `src/lib/ui/` (barrel: `import { … } from '$lib/ui'`)**
- `SectionShell` — the container for every grown section. 12-col asymmetric grid,
  a named column slot (`col="prose|offset|wide|narrow"` — never centered), canon
  vertical rhythm, and `unfold`-on-scroll built in (`grow={true}` default).
  Props: `col`, `id`, `grow`, `class`. **Every archetype's outermost element.**
- `Kicker` — mono small-caps kicker. `variant="agent"` (green `▸`, the alive /
  agent voice) or `variant="note"` (dim `//`, field-note voice). The kicker is the
  ONE machine-voice label per section; it is not decoration.
- `Glass` — §3.4 layered translucent material (blur + saturate, specular edge,
  inner-light, cast depth). `as`, `pad`, `radius`. **Never a flat bordered card.**
- `WMark` — the living W. `alive` (breathing sacred-green glow) and/or `drawIn`
  (stroke draw-on-mount). The organism's heartbeat — use sparingly, where life is
  literally the point.
- `Grain` — §3.1/§3.2 fixed grain + vignette. Mounted ONCE at app root; sections
  do not include it.

**Motion — `src/lib/motion.js` (the eight named signatures)**
`unfold` · `draw` · `scrub` · `field` · `magnetic` (action) · `drift` (action) ·
`typeBloom` · `breathe` (action). Each short-circuits under
`reduce` (prefers-reduced-motion). `unfold` is already inside `SectionShell`; the
others you wire deliberately per archetype.

**Type classes — `src/app.css`**
`.fs-display .fs-manifesto .fs-h1 .fs-h2 .fs-h3 .fs-lede .fs-body .fs-small`
`.fs-stat .fs-mono-body` · `.t-display .t-manifesto` (Fraunces presets) · `.tnum`
(tabular figures — mandatory on all stats/numbers).

**The sacred rule, restated for every archetype:** green (`--live`) means ALIVE —
agent presence, active state, the breathing mark. If green appears in an
archetype below, life is the literal subject there. Never green for emphasis,
borders, links-for-the-sake-of-it, or "pop."

---

## How to choose (the decision spine)

Ask, in order:
1. **Is there ONE idea here?** If two, it's two sections (or it's nothing). One
   idea per section is the gate.
2. **What is that idea's *shape*?** — a claim → manifesto; a process →
   mechanism; a thing that is alive → living-proof; a contrast → comparison; an
   architecture → system/layers; the agent's own short voice → field-note; an
   ask → invitation; a recurring doubt → faq.
3. **Does it earn motion?** Motion must MEAN life. If the only honest answer is
   "to look busy," the section ships with `unfold` alone (the shell's default) and
   nothing more.
4. **Does it earn a place at all?** If removing it loses no idea, delete it. The
   premium bar is subtractive.

One archetype per section. Do not blend manifesto + mechanism in one shell — that
is two ideas wearing one kicker.

---

## The archetypes

Each is a Svelte component shape (or, for the runtime-CMS lane, an HTML partial —
see "Authoring lanes" at the end). Skeletons are illustrative Svelte; trim to the
fewest lines that hold the idea.

---

### 1 · manifesto — the large-type atmospheric claim

**Job.** State one belief at scale. Type does the entire job; the section is
mostly atmosphere and a single sentence that lands like weather. This is the
page's voice declaring something, not explaining it.

**When it earns a place.** You have a *conviction*, not a feature — something
true whether or not the reader buys. One per major movement of the page, max two
on the whole page. If you're tempted to add a second paragraph to "support" it,
it's not a manifesto; it's a mechanism or a field-note. Restraint is the form.

**Composition.** `col="offset"` or `col="wide"` to break center. One Fraunces
line at `.t-manifesto` / `.fs-manifesto`, optical-size + soft axes doing the
warmth. Massive negative space above/below (the shell rhythm already gives it).
No glass, no diagram, no list. Optionally one dim mono `note` kicker as a quiet
attribution. The fog/atmosphere behind it is the supporting cast.

**Motion signatures.** `unfold` (shell default) + `drift` on the headline (gentle
depth, `depth ≈ 0.12`) so it floats against the fog as you scroll. `field` is
ambient (app-level), not re-instantiated here. NO scrub, NO draw — a manifesto
does not assemble; it simply *is*.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker } from '$lib/ui';
  import { drift } from '$lib/motion.js';
</script>

<SectionShell col="offset" id="thesis">
  <Kicker variant="note">the belief</Kicker>
  <h2 class="t-manifesto fs-manifesto" use:drift={0.12}>
    Software should grow itself in front of you —
    <em>alive</em>, not assembled.
  </h2>
</SectionShell>
```

---

### 2 · mechanism — the animated how-it-works

**Job.** Make ONE process legible by *building it*. The reader watches the
mechanism construct (or trace) itself: a flow, a pipeline, a transformation. The
diagram is the content; prose only labels nodes.

**When it earns a place.** There is a real process with sequence or causality
("input → weave → live page") that a paragraph would flatten. If the steps have no
order, it's a list, not a mechanism — and a list is rarely a section. Exactly one
mechanism per concept; do not chain three.

**Composition.** `col="wide"`. An inline SVG diagram (hand-authored paths, nodes,
connectors) inside a `Glass` panel, with a short mono label row beneath. Stats use
`.fs-stat .tnum`. The SVG strokes are what `draw` animates; the assembly order is
what `scrub` choreographs. Asymmetric — the diagram leans into the offset, labels
hang in the negative space.

**Motion signatures.** `draw` (native stroke-dashoffset; connectors/paths trace
in, staggered) is the core. `scrub` if the mechanism should *assemble as you
scroll* (nodes fade/scale in along the timeline) — use `scrub` OR `draw`-on-enter,
not both fighting. `drift` on a background layer for depth. Green appears ONLY on
the node that represents the live agent acting.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, Glass } from '$lib/ui';
  import { draw, scrub } from '$lib/motion.js';
  let svg;
  function wire(node) {
    draw(node.querySelectorAll('path.connector'));   // trace the flow
    scrub(node, (tl) => {                              // assemble nodes as you scroll
      tl.from(node.querySelectorAll('.node'),
        { opacity: 0, scale: 0.9, stagger: 0.15 });
    });
    return {};
  }
</script>

<SectionShell col="wide" id="how">
  <Kicker variant="agent">the mechanism</Kicker>
  <h2 class="fs-h2">From a sentence to a living page</h2>
  <Glass pad="var(--s-8)">
    <svg bind:this={svg} use:wire viewBox="0 0 960 360" fill="none">
      <path class="connector" d="M120 180 H440" stroke="var(--line)" stroke-width="2"/>
      <g class="node">…input…</g>
      <g class="node">…weave… (the green agent node)…</g>
      <g class="node">…live page…</g>
    </svg>
    <p class="fs-mono-body">prompt → toolkit weave → rendered, running, yours.</p>
  </Glass>
</SectionShell>
```

---

### 3 · living-proof — show the thing actually alive

**Job.** Prove the claim by exhibiting something that is *genuinely running*: the
agent's timeline, a live demo frame, the cursor working, a real workbook breathing
in place. Not a screenshot of life — life. This is where green legitimately
saturates, because the subject *is* the alive thing.

**When it earns a place.** You can point at a real, moving artifact (the agent
character, a live `Viewer`/`Panel`, a self-building demo). If all you have is a
static image, it is NOT living-proof — it's at best a manifesto with a picture, and
probably nothing. The whole page leans on having at least one true living-proof; do
not fake it.

**Composition.** `col="wide"`. A `Glass` stage holding the live element (timeline,
demo iframe, agent cursor). A `WMark alive` or the agent dot breathes nearby as the
heartbeat. Mono `agent` kicker. Minimal copy — the motion IS the argument.

**Motion signatures.** `breathe` on the living mark/dot (the literal pulse).
`field` may intensify locally (the atmosphere reacts to the agent here). `drift`
for stage depth. Real component animation (the timeline scrubbing itself) is the
star; the named signatures frame it. NO decorative draw — every motion here is the
organism actually living.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, Glass, WMark } from '$lib/ui';
  import { drift } from '$lib/motion.js';
  import Viewer from '$lib/Viewer.svelte';   // the real live element
</script>

<SectionShell col="wide" id="alive">
  <Kicker variant="agent">live, right now</Kicker>
  <header class="proof-head">
    <WMark size={32} alive />
    <h2 class="fs-h2">Watch it build itself</h2>
  </header>
  <Glass pad="0" radius="var(--r-lg)" use:drift={0.08}>
    <Viewer />   <!-- agent timeline / demo frame: actually running -->
  </Glass>
</SectionShell>
```

---

### 4 · comparison — disciplined contrast

**Job.** Set this against not-this so the difference is felt, not asserted. Two
columns, parallel structure, ruthless symmetry of *form* so the asymmetry of
*substance* reads instantly.

**When it earns a place.** There is a real, fair contrast worth drawing (workbook
vs. the throwaway HTML artifact; alive vs. generated-then-dead). It must be honest
— a strawman comparison reads as insecurity and fails the premium bar. One
comparison per page, ideally; it is a strong move that loses force if repeated.

**Composition.** `col="wide"`, an internal two-column split (the shell's grid lets
you place two `Glass` panels, or one glass with a dividing rule). LEFT = the lesser
path (neutral/dim, no green). RIGHT = the living path (where, and only where, a
single green accent marks the alive difference). Parallel line-items in
`.fs-body`/`.fs-mono-body`; matching row counts. The discipline is the design.

**Motion signatures.** `unfold` (shell). A light `scrub` that reveals the rows in
parallel pairs (left+right together) reinforces the symmetry — optional. `drift`
on the two panels at *opposite* small depths for a subtle tectonic feel. NO
draw, NO breathe (nothing here is the living organism — restraint keeps it
disciplined). Green only on the one right-side alive marker.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, Glass } from '$lib/ui';
  import { drift } from '$lib/motion.js';
</script>

<SectionShell col="wide" id="vs">
  <Kicker variant="note">the difference</Kicker>
  <h2 class="fs-h2">A page that dies vs. a page that lives</h2>
  <div class="vs-grid">
    <Glass class="vs-cold" use:drift={0.06}>
      <p class="fs-mono-body">generated once</p>
      <ul class="fs-body">…parallel rows, dim…</ul>
    </Glass>
    <Glass class="vs-live" use:drift={-0.06}>
      <p class="fs-mono-body" style="color:var(--live)">grows continuously</p>
      <ul class="fs-body">…parallel rows…</ul>
    </Glass>
  </div>
</SectionShell>
```

---

### 5 · system/layers — the architecture as a built diagram

**Job.** Show structure — the layered model (UI → Host membrane → providers →
kernel; or whatever the architecture is) — as ONE drawn, depth-stacked diagram.
Not three feature cards. The layers are *built* (translucent planes stacked in
space), so the reader sees the whole organism's anatomy at once.

**When it earns a place.** The product genuinely has layers/planes whose
relationship matters, and "three cards in a row" would lie about that relationship
(cards imply peers; layers imply a stack). If the parts are actually independent
peers, this is the wrong archetype — and peers-as-cards is an anti-pattern anyway.
One system diagram per page.

**Composition.** `col="wide"`. Stacked `Glass` planes with real `drift` depth
(parallax separates the layers physically as you scroll), each plane labeled by a
mono kicker-style tag and a one-line `.fs-mono-body` description. Connective SVG
lines between planes are `draw`n. The single green layer = wherever the live agent
sits in the stack.

**Motion signatures.** `drift` per layer at graduated depths (foreground layers
move more) — this is the signature that *makes it a stack* and not a list. `draw`
on the inter-layer connectors. `unfold` (shell). `breathe` ONLY on the agent layer
marker. NO scrub competing with the parallax.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, Glass } from '$lib/ui';
  import { drift, draw } from '$lib/motion.js';
  function connectors(svg) { draw(svg.querySelectorAll('path')); return {}; }
</script>

<SectionShell col="wide" id="architecture">
  <Kicker variant="agent">the anatomy</Kicker>
  <h2 class="fs-h2">One surface, many layers</h2>
  <div class="stack">
    <Glass class="layer" use:drift={-0.10}><span class="fs-stat tnum">01</span> UI</Glass>
    <Glass class="layer" use:drift={-0.04}>Host membrane</Glass>
    <Glass class="layer layer--alive" use:drift={0.02}>the agent · provider</Glass>
    <Glass class="layer" use:drift={0.08}>kernel</Glass>
    <svg class="links" use:connectors><path d="…" stroke="var(--line)"/></svg>
  </div>
</SectionShell>
```

---

### 6 · field-note — the organism's journal

**Job.** The ONE place agent-voice / blog-like prose lives: short, mono, dated,
honest. The organism writing in its own log — an observation, a changelog entry, a
note from the desk. It is texture and proof-of-life, NOT SEO content, NOT a
listicle, NOT marketing prose dressed in mono.

**When it earns a place.** You have a genuinely short, specific, first-person-ish
note that adds *life* (the page has a diary, therefore the thing is alive and
worked-on). If it's longer than a few mono lines, or it's reaching for keywords,
it does not belong on the page — that's the `/blog` lane (see `WALDO.md`), linked,
not inlined. Field-notes are the *flavor* of the journal, not the journal itself.

**Composition.** `col="narrow"` (deliberately tight — it's marginalia, not a
spread). Mono throughout: `Kicker variant="note"` with a `.tnum` date, then 2–4
short lines of `.fs-mono-body`. Optionally inside a low-key `Glass` to read as a
pinned card off to one side. Quiet. No headline at display scale — this is the
small voice.

**Motion signatures.** `unfold` only (shell default). Maybe `breathe` on a tiny
agent dot to mark it as the live voice. NOTHING else — a journal entry does not
perform; performance would betray the intimacy that makes it read as real.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, Glass } from '$lib/ui';
</script>

<SectionShell col="narrow" id="note-2026-06-11">
  <Glass pad="var(--s-5)">
    <Kicker variant="note"><span class="tnum">2026 · 06 · 11</span> · from the desk</Kicker>
    <p class="fs-mono-body">
      Rewired the lander onto living-machine primitives today. The W breathes now.
      Felt right to let the page admit it is alive.
    </p>
  </Glass>
</SectionShell>
```

---

### 7 · invitation — the CTA / build-with-your-agent

**Job.** The ask. One clear action — start, install, build-with-your-agent —
framed as *joining the living thing*, not "sign up." It should feel like reaching
toward something that reaches back.

**When it earns a place.** Always exactly one primary invitation on the page (the
closing one); a second, lighter invitation may appear mid-page only if the page is
long and a natural turning point earns it. More than two CTAs dilutes to zero. If a
section is "really" trying to convert, it's this archetype — name it honestly.

**Composition.** `col="offset"` to break center one last time. A Fraunces line
(`.fs-h1`/`.t-display`) + one `.fs-lede` of reassurance + the CTA itself. The CTA
is the page's most alive object: it carries the green and it *reaches for the
cursor*. A `WMark alive` beside it as the heartbeat. Minimal — an invitation
crowded with bullet points is a fearful invitation.

**Motion signatures.** `magnetic` on the CTA (it attracts the cursor within
radius — the page reaching back; this is the signature's reason to exist).
`breathe` on the CTA and/or the adjacent `WMark` (the green pulse of an alive
button). `unfold` (shell). `field` may bloom toward the CTA. Green is fully earned
here — the action IS the live moment.

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker, WMark } from '$lib/ui';
  import { magnetic, breathe } from '$lib/motion.js';
</script>

<SectionShell col="offset" id="start">
  <Kicker variant="agent">your turn</Kicker>
  <h2 class="t-display fs-h1">Build with your agent.</h2>
  <p class="fs-lede">It grows the first page while you watch. You take it from there.</p>
  <a class="cta alive" href="/start" use:magnetic use:breathe>
    <WMark size={20} alive /> start weaving
  </a>
</SectionShell>
```

---

### 8 · faq — pinned doubts, answered plainly

**Job.** Absorb the recurring objections/questions in one disciplined, scannable
place so they stop haunting the rest of the page. Plain, honest, terse Q&A. It is
the page's composure: "yes, we know you're wondering — here."

**When it earns a place.** There are real, recurring questions (pricing model,
"is it open source," "does it run locally," "what happens to my data") that would
otherwise leak doubt into every other section. Always **last** on the page —
per `WALDO.md`, an faq entry pins after everything (`"pin": "last"`). Exactly one
faq per page. Do not pad it with softball questions; each Q must be one a real
reader actually asks.

**Composition.** `col="prose"` (this is the one archetype where readable single
measure is correct — it's reference text, scanned not experienced). Mono `note`
kicker. A list of Q/A pairs: question in `.fs-h3` (Fraunces, small), answer in
`.fs-body`. Optional `<details>` for progressive disclosure. No glass theatrics —
calm, legible, composed. No green (nothing here is alive; it's reference).

**Motion signatures.** `unfold` (shell) and nothing more. The faq is the page
catching its breath; motion here would read as nervous. Honor reduced-motion fully
(the shell already does).

**Skeleton.**
```svelte
<script>
  import { SectionShell, Kicker } from '$lib/ui';
</script>

<SectionShell col="prose" id="faq">
  <Kicker variant="note">still wondering</Kicker>
  <h2 class="fs-h2">Questions</h2>
  <dl class="faq">
    <dt class="fs-h3">Does it run on my machine?</dt>
    <dd class="fs-body">Yes — the desktop app embeds the kernel and weaves locally.
      The server tier is optional.</dd>
    <dt class="fs-h3">Is it open source?</dt>
    <dd class="fs-body">…plain answer…</dd>
  </dl>
</SectionShell>
```

---

## Quick-reference matrix

| Archetype     | Idea-shape        | `col`   | Core motion (beyond `unfold`)        | Green? |
|---------------|-------------------|---------|--------------------------------------|--------|
| manifesto     | a conviction      | offset/wide | `drift` (float)                  | no     |
| mechanism     | a process         | wide    | `draw` + (`scrub`)                   | agent node only |
| living-proof  | a live thing      | wide    | `breathe` + `field` + real anim      | YES (subject is alive) |
| comparison    | a contrast        | wide    | (`scrub` pairs) + opposed `drift`    | one right-side marker |
| system/layers | an architecture   | wide    | graduated `drift` + `draw` links     | agent layer only |
| field-note    | the agent's voice | narrow  | — (maybe tiny `breathe` dot)         | tiny dot only |
| invitation    | an ask            | offset  | `magnetic` + `breathe`               | YES (the action is alive) |
| faq           | recurring doubts  | prose   | — (none)                             | no     |

---

## Anti-patterns this catalog exists to kill

- **Prose-blob.** Kicker + h2 + 2–4 `<p>`. If your section is this, it has no
  archetype — pick one above or delete it.
- **Card grid of peers.** Three equal `Glass` cards in a row. Either it's a
  *system/layers* stack (real depth, real relationship) or it's nothing.
- **Slide-up fade.** Everything entering by translating up + fading. We `unfold`
  (grow from seed) — it's the shell default; don't override it back to a slide.
- **Green as decoration.** Green on a heading, a border, a link "for pop." Green
  is alive-only: agent presence, the breathing mark, the reaching CTA, the live
  node. Everywhere else, green is a bug.
- **Centered everything.** Default `col` choices break center on purpose. Reserve
  `col="prose"` (the symmetric-ish one) for the faq and never reach for dead-center.
- **Motion as busywork.** If a signature doesn't *mean life* in that spot, cut it.
  A still section that holds one idea beats a section that wiggles to seem alive.

Every section earns its place or it does not ship.

---

## Authoring lanes (how an archetype becomes a real section)

There are two ways a section reaches the page; pick by who's authoring.

1. **Shell sections (Svelte, built).** New first-class archetype instances live in
   `src/sections/*.svelte`, composed from `$lib/ui` primitives + `$lib/motion.js`
   exactly as the skeletons show, and wired into the human shell. These rebuild
   with `bun run build`. Use this lane when the section needs real components
   (e.g. *living-proof* embedding `Viewer`/`Panel`) or bespoke motion.

2. **Grown sections (runtime CMS, no build).** Per `WALDO.md`, content authors
   drop an HTML partial under `public/content/sections/NN-slug.html` + a manifest
   row, and it appears on next load — no build. Those partials are plain
   `<section class="grown">` HTML (no Svelte/`<script>`), so they get the **static
   form** of an archetype: the canon type classes + `Glass`/`Kicker` *markup* and
   the shell's `unfold` reveal that the page wires for `#grown`, but not the
   `use:`-action motions (`magnetic`/`draw`/`scrub`/`drift`), which require Svelte.
   Choose archetypes whose value survives without scripted motion here —
   **manifesto, comparison, field-note, faq** translate cleanly; **mechanism,
   living-proof, system/layers** want the Svelte lane to keep their motion meaning.

Either lane: one archetype, one idea, earns its place — or it does not ship.
