<script>
  // ── LIVING MACHINE — AtmosphereField (canon §3.3 fog + the flow-field art) ──
  // A canvas flow-field of drifting bioluminescent motes over the teal-black
  // volumetric fog. Particles follow a slowly-evolving noise field; the cursor
  // bends the field locally (the atmosphere is REACTIVE, not decorative). Cheap:
  // additive blend, capped particle count, dpr-aware, paused off-screen, killed
  // under prefers-reduced-motion.
  import { onMount } from 'svelte';

  let { density = 0.00009, hue = 'live' } = $props();

  let canvas;

  onMount(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = 1;
    let parts = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };
    let t = 0;

    // bioluminescent palette — green life + cold cyan highlight + faint amber.
    const COLORS = [
      [63, 224, 129],   // --live
      [111, 233, 255],  // --cyan
      [232, 192, 122],  // --amber (rare warm catch)
    ];

    // cheap value-noise field (no deps) — smooth, periodic-ish.
    function noise(x, y, z) {
      const s = Math.sin(x * 1.7 + z) + Math.sin(y * 1.3 - z * 0.8) +
                Math.sin((x + y) * 0.9 + z * 0.6);
      return s / 3; // -1..1
    }
    // angle of the flow field at a point
    function flow(x, y) {
      const n = noise(x * 0.0016, y * 0.0016, t * 0.00018);
      return n * Math.PI * 1.6;
    }

    function makePart() {
      const c = COLORS[Math.random() < 0.08 ? 2 : Math.random() < 0.4 ? 1 : 0];
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: 0, vy: 0,
        life: Math.random(),
        r: 0.5 + Math.random() * 1.6,
        c,
        a: 0.12 + Math.random() * 0.5,
      };
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(w * h * density);
      parts = Array.from({ length: Math.max(40, Math.min(target, 420)) }, makePart);
    }

    function step() {
      if (!running) return;
      t += 16;
      // trail fade — never fully clear → soft luminous trails (deep-water glow).
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(4, 11, 9, 0.16)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter'; // additive bloom

      for (const p of parts) {
        let ang = flow(p.x, p.y);
        // cursor bends the field locally
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const d = Math.sqrt(d2) || 1;
            const push = (1 - d / 200) * 0.9;
            ang += Math.atan2(dy, dx) * push;
          }
        }
        p.vx += Math.cos(ang) * 0.06;
        p.vy += Math.sin(ang) * 0.06;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.0025;

        // wrap + respawn
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        if (p.life <= 0) Object.assign(p, makePart());

        const flick = 0.6 + 0.4 * Math.sin(t * 0.004 + p.r * 9);
        const alpha = p.a * Math.min(1, p.life * 2.4) * flick;
        const [r, g, b] = p.c;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= w && mouse.y <= h;
    }
    function onLeave() { mouse.active = false; }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (!reduce) {
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerleave', onLeave, { passive: true });
      // pause when tab hidden — save battery
      const onVis = () => {
        running = !document.hidden;
        if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(step); }
      };
      document.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(step);
      return () => {
        running = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        removeEventListener('pointermove', onMove);
        removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVis);
      };
    }
    // reduced-motion: paint one static frame of motes, no loop.
    running = false;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      const [r, g, b] = p.c;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grd.addColorStop(0, `rgba(${r},${g},${b},${p.a * 0.6})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    return () => ro.disconnect();
  });
</script>

<!-- the volumetric fog (CSS, cursor-reactive via motion.field) sits behind the
     flow-field canvas; together they are the deep-water atmosphere. -->
<div class="atmosphere" aria-hidden="true">
  <div class="fog"></div>
  <canvas bind:this={canvas} class="field-canvas"></canvas>
</div>

<style>
  .atmosphere {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .field-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
