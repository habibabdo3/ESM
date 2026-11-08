/**
 * Orchestration du parcours immersif de l'accueil (GSAP + ScrollTrigger, comme GsapService du SDK).
 * - #journey : scène 3D épinglée ; la planche encadrée s'étire en plein écran, puis la progression pilote la maquette,
 *   la légende et le sommaire. Appareils modestes (classe `gl-lite`) : scène allégée (sans ombres, 30 i/s, 1×).
 * - [data-strips] : bandes d'expertise ; la bande active s'élargit au défilement (épinglé, desktop) ou au survol.
 * - [data-stack] : projets types en cartes qui s'empilent, la carte recouverte recule légèrement.
 * - [data-drag-rail] : rail glissable à la souris, flèches précédent/suivant (pages hub).
 * Les spécialités (SpecPlan.astro) et l'index des spécialités (SpecIndex.astro) ont leur propre script.
 * Sans WebGL, appareil trop modeste ou « réduire les animations » : tout reste lisible, rien n'est épinglé.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const immersive = root.classList.contains('webgl') && !reduce;
const lite = root.classList.contains('gl-lite');
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/* ---------- 1. Parcours 3D ---------- */
const journey = document.getElementById('journey');
if (journey && immersive) {
  const chapters = [...journey.querySelectorAll<HTMLElement>('[data-chapter]')];
  const navButtons = [...journey.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const bar = journey.querySelector<HTMLElement>('[data-journey-bar]');
  const frame = journey.querySelector<HTMLElement>('[data-journey-frame]');
  const canvas = journey.querySelector<HTMLCanvasElement>('canvas');
  const stops = chapters.map((c) => Number(c.dataset.chapter));
  const narrow = matchMedia('(max-width: 767px)');
  let scene: { setProgress(p: number): void; dispose(): void } | null = null;
  let current = -1;

  const setChapter = (p: number) => {
    let idx = 0;
    stops.forEach((s, i) => p >= s && (idx = i));
    if (idx === current) return;
    current = idx;
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    navButtons.forEach((b, i) => {
      const on = i === idx - 1;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    journey.classList.toggle('past-hero', idx > 0);
  };

  // Planche encadrée → plein écran (mêmes valeurs de départ que le CSS)
  const setFrame = (p: number) => {
    if (!frame) return;
    const k = 1 - clamp(p / 0.09);
    const e = k * k * (3 - 2 * k);
    const [t, r, b, l] = narrow.matches ? [61, 4, 11, 4] : [13, 3, 9, 47];
    frame.style.clipPath = `inset(${t * e}% ${r * e}% ${b * e}% ${l * e}% round ${8 * e}px)`;
  };

  const st = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scene?.setProgress(self.progress);
      setChapter(self.progress);
      setFrame(self.progress);
      journey.classList.toggle('leaving-hero', self.progress > 0.02);
      if (bar) bar.style.transform = `scaleX(${self.progress})`;
    },
  });
  setChapter(st.progress);
  setFrame(st.progress);
  narrow.addEventListener('change', () => setFrame(st.progress));

  navButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const at = Number(b.dataset.goto) + 0.04;
      window.scrollTo({ top: st.start + (st.end - st.start) * at, behavior: 'smooth' });
    }),
  );

  // Repli propre si le navigateur retire le contexte WebGL (mémoire saturée)
  const fallback = () => {
    scene?.dispose();
    scene = null;
    root.classList.remove('webgl');
    journey.classList.remove('scene-ready');
    if (frame) frame.style.clipPath = '';
    ScrollTrigger.refresh();
  };
  canvas?.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    fallback();
  });

  // La scène (three.js) se charge après le premier affichage : le titre reste l'élément principal.
  const load = () =>
    import('./clinic-scene').then(({ mountClinicScene }) => {
      if (!canvas || !root.classList.contains('webgl')) return;
      try {
        scene = mountClinicScene(canvas, lite ? { lite: true, targetFps: 30, pixelRatio: 1 } : {});
        scene.setProgress(st.progress);
        journey.classList.add('scene-ready');
      } catch {
        fallback();
      }
    });
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(load, { timeout: 1500 });
  else setTimeout(load, 400);
}

/* ---------- 2. Expertises : bandes qui s'élargissent ---------- */
document.querySelectorAll<HTMLElement>('[data-strips]').forEach((section) => {
  const strips = [...section.querySelectorAll<HTMLElement>('[data-strip]')];
  let current = 0;
  const open = (i: number) => {
    if (i === current) return;
    current = i;
    strips.forEach((s, k) => s.classList.toggle('is-open', k === i));
  };
  strips.forEach((s, i) => {
    s.addEventListener('pointerenter', (e) => (e as PointerEvent).pointerType === 'mouse' && open(i));
    s.addEventListener('focusin', () => open(i));
  });
  gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('is-pinned');
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.2}`,
      pin: true,
      onUpdate: (self) => open(Math.min(strips.length - 1, Math.floor(self.progress * strips.length))),
    });
    return () => section.classList.remove('is-pinned');
  });
});

/* ---------- 3. Projets types : cartes qui s'empilent ---------- */
if (!reduce) {
  const items = [...document.querySelectorAll<HTMLElement>('[data-stack]')];
  items.forEach((item, i) => {
    const next = items[i + 1];
    const card = item.firstElementChild as HTMLElement | null;
    if (!next || !card) return;
    gsap.to(card, {
      scale: 0.93,
      opacity: 0.55,
      ease: 'none',
      transformOrigin: '50% 0%',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
    });
  });
}

/* ---------- 4. Rails glissables (pages hub) ---------- */
document.querySelectorAll<HTMLElement>('[data-drag-rail]').forEach((wrap) => {
  const rail = wrap.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;
  const prev = wrap.querySelector<HTMLButtonElement>('[data-rail-prev]');
  const next = wrap.querySelector<HTMLButtonElement>('[data-rail-next]');
  const step = () => (rail.querySelector<HTMLElement>('[data-rail-item]')?.offsetWidth ?? 320) + 24;
  const update = () => {
    if (prev) prev.disabled = rail.scrollLeft < 4;
    if (next) next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 4;
  };
  prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  rail.addEventListener('scroll', update, { passive: true });
  update();

  let down = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true;
    moved = false;
    startX = e.clientX;
    startLeft = rail.scrollLeft;
    rail.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    rail.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    down = false;
    rail.classList.remove('is-dragging');
  });
  rail.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);
});
