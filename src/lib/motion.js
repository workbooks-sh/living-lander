// ── LIVING MACHINE — motion library (canon §4) ─────────────────────────────
// GSAP (free tier: ScrollTrigger + CustomEase; NO DrawSVG — draw uses native
// stroke-dashoffset) + Lenis smooth-scroll. Eight named signatures, each a
// reusable helper or Svelte `use:` action, each honoring prefers-reduced-motion.

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CustomEase from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export const reduce =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── custom organic eases (asymmetric, never linear) ──
CustomEase.create('grow', 'M0,0 C0.16,1 0.3,1 1,1'); // expo.out + slight overshoot feel
CustomEase.create('settle', 'M0,0 C0.2,0.9 0.1,1.02 1,1'); // overshoot then settle
CustomEase.create('bloom', 'M0,0 C0.25,0.1 0.25,1 1,1'); // soft slow-in slow-out
CustomEase.create('organic', 'M0,0 C0.34,0.01 0,0.99 1,1'); // s-curve (drift/field)

// ── Lenis smooth-scroll, fed into ScrollTrigger (init once) ──
let lenis = null;
export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return lenis;
  lenis = new Lenis({ duration: 1.1, lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis && lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  if (reduce) {
    lenis.destroy(); // native scroll under reduced-motion
    lenis = null;
  }
  return lenis;
}

export { gsap, ScrollTrigger, lenis };

// ── 4.2 unfold — sections GROW from seed (scale + clip-path + blur-clear) ──
export function unfold(el) {
  if (!el) return;
  if (reduce) return gsap.set(el, { opacity: 1, clearProps: 'all' });
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.94, filter: 'blur(14px)', clipPath: 'inset(14% 8% 14% 8% round 18px)' },
    {
      opacity: 1, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0% round 18px)',
      duration: 1.05, ease: 'settle',
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    }
  );
}
// Svelte action form: <div use:unfoldAction>
export function unfoldAction(node) {
  unfold(node);
  return {};
}

// ── 4.3 draw — SVG stroke draw-in (native dashoffset, NOT DrawSVG) ──
export function draw(paths, { stagger = 0.12, duration = 1.2 } = {}) {
  const list = Array.from(paths || []).filter(Boolean);
  if (!list.length) return;
  list.forEach((p) => {
    const L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });
  if (reduce) return gsap.set(list, { strokeDashoffset: 0 });
  gsap.to(list, {
    strokeDashoffset: 0, duration, ease: 'grow', stagger,
    scrollTrigger: { trigger: list[0].ownerSVGElement || list[0], start: 'top 75%', once: true },
  });
}

// ── 4.4 scrub — scroll-scrubbed assembly (a scene builds as you scroll) ──
export function scrub(section, build /* (tl) => void */) {
  if (!section) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section, start: 'top 70%', end: 'bottom 65%',
      scrub: reduce ? false : 1, pin: false,
    },
  });
  build(tl);
  if (reduce) tl.progress(1).kill(); // show finished state
  return tl;
}

// ── 4.5 field — cursor/scroll-reactive fog (drives --fx/--fy on .fog) ──
export function field(target) {
  if (reduce) return;
  const fog = target || document.querySelector('.fog');
  if (!fog) return;
  const set = {
    x: gsap.quickTo(fog, '--fx', { duration: 0.8, ease: 'organic' }),
    y: gsap.quickTo(fog, '--fy', { duration: 0.8, ease: 'organic' }),
  };
  const onMove = (e) => {
    set.x((e.clientX / innerWidth) * 60 + 10 + '%'); // 10%..70%
    set.y((e.clientY / innerHeight) * 50 + 8 + '%'); // 8%..58%
  };
  addEventListener('pointermove', onMove, { passive: true });
  // scroll adds vertical drift to the lower bloom
  const st = ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => fog.style.setProperty('--fy', 8 + s.progress * 40 + '%'),
  });
  return () => {
    removeEventListener('pointermove', onMove);
    st && st.kill();
  };
}

// ── 4.6 magnetic — CTA/mark attracts cursor within radius (Svelte action) ──
export function magnetic(el, { radius = 90, strength = 0.35 } = {}) {
  if (reduce || !el) return {};
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'grow' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'grow' });
  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const d = Math.hypot(dx, dy);
    if (d < radius) {
      xTo(dx * strength);
      yTo(dy * strength);
    } else {
      xTo(0);
      yTo(0);
    }
  };
  addEventListener('pointermove', onMove, { passive: true });
  return { destroy: () => removeEventListener('pointermove', onMove) };
}

// ── 4.7 drift — layered parallax depth on scroll (Svelte action) ──
// depth -0.5..0.5; neg = foreground
export function drift(el, depth = 0.2) {
  if (reduce || !el) return {};
  const tw = gsap.to(el, {
    yPercent: depth * 100, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
  });
  return { destroy: () => tw.scrollTrigger && tw.scrollTrigger.kill() };
}

// ── 4.8 type-bloom — hero condenses into being, per word (blur-clear + rise) ──
export async function typeBloom(headlineEl) {
  if (!headlineEl) return;
  if (document.fonts && document.fonts.ready) await document.fonts.ready; // never bloom in fallback Fraunces
  const words = headlineEl.querySelectorAll('[data-word]');
  if (!words.length) {
    gsap.set(headlineEl, { visibility: 'visible' });
    return;
  }
  if (reduce) {
    gsap.set(headlineEl, { visibility: 'visible' });
    return gsap.set(words, { opacity: 1, filter: 'none', y: 0 });
  }
  gsap.set(headlineEl, { visibility: 'visible' });
  gsap.fromTo(
    words,
    { opacity: 0, filter: 'blur(16px)', y: 22, scale: 0.96 },
    {
      opacity: 1, filter: 'blur(0px)', y: 0, scale: 1,
      duration: 1.0, ease: 'bloom', stagger: 0.085, delay: 0.15,
    }
  );
}

// ── 4.1 breathe — CSS-driven (.alive in app.css). JS action toggles the class
// and respects reduced-motion (adds nothing under reduce). ──
export function breathe(el) {
  if (!el) return {};
  if (reduce) {
    el.style.opacity = '1';
    return {};
  }
  el.classList.add('alive');
  return { destroy: () => el.classList.remove('alive') };
}
