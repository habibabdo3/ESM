/**
 * Orchestration du parcours immersif de l'accueil (GSAP + ScrollTrigger, comme GsapService du SDK).
 * - #journey : scène 3D épinglée, la progression du défilement pilote la maquette et les chapitres.
 * - [data-hrail] : panneaux plein cadre, défilement horizontal épinglé (desktop) ; accroche native sur mobile.
 * - [data-words] : texte qui s'allume mot à mot (l'index des spécialités a son propre script : SpecIndex.astro).
 * - [data-method] : frise et compteur · [data-clip-reveal] : image dont le cadre s'ouvre.
 * - [data-drag-rail] : rail glissable à la souris, flèches précédent/suivant.
 * - [data-draw-line] : filet qui se dessine au défilement.
 * Sans WebGL ou avec « réduire les animations » : tout reste lisible, rien n'est épinglé.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const immersive = document.documentElement.classList.contains('webgl') && !reduce;

/* ---------- 1. Parcours 3D ---------- */
const journey = document.getElementById('journey');
if (journey && immersive) {
  const chapters = [...journey.querySelectorAll<HTMLElement>('[data-chapter]')];
  const bar = journey.querySelector<HTMLElement>('[data-journey-bar]');
  const canvas = journey.querySelector<HTMLCanvasElement>('canvas');
  let scene: { setProgress(p: number): void } | null = null;
  let current = -1;

  const setChapter = (p: number) => {
    const stops = chapters.map((c) => Number(c.dataset.chapter));
    let idx = 0;
    stops.forEach((s, i) => p >= s && (idx = i));
    if (idx === current) return;
    current = idx;
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
  };
  setChapter(0);

  ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (st) => {
      scene?.setProgress(st.progress);
      setChapter(st.progress);
      if (bar) bar.style.transform = `scaleX(${st.progress})`;
    },
  });

  // La scène (three.js) se charge après le premier affichage : le texte du héros reste l'élément principal.
  const load = () =>
    import('./clinic-scene').then(({ mountClinicScene }) => {
      if (!canvas) return;
      try {
        scene = mountClinicScene(canvas);
        journey.classList.add('scene-ready');
      } catch {
        document.documentElement.classList.remove('webgl');
      }
    });
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 300);
}

/* ---------- 2. Expertises : panneaux plein cadre en défilement horizontal épinglé ---------- */
gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const kills: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>('[data-hrail]').forEach((section) => {
      const track = section.querySelector<HTMLElement>('[data-hrail-track]');
      const bar = section.querySelector<HTMLElement>('[data-hrail-bar]');
      if (!track) return;
      section.classList.add('is-pinned');
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (st) => bar && (bar.style.transform = `scaleX(${st.progress})`),
        },
      });
      // Profondeur : l'image glisse moins vite que son cadre
      const imgs = [...section.querySelectorAll<HTMLElement>('[data-hrail-img]')].map((img) =>
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        }),
      );
      kills.push(() => {
        imgs.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
        tween.scrollTrigger?.kill();
        tween.kill();
        section.classList.remove('is-pinned');
        gsap.set(track, { clearProps: 'transform' });
      });
    });
    return () => kills.forEach((k) => k());
});

/* ---------- 3. Texte qui s'allume mot à mot ---------- */
document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
  if (reduce) return;
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.setAttribute('aria-label', words.join(' '));
  const esc = (w: string) => w.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`).join(' ');
  // Gris de départ ≥ 3:1 sur blanc (texte large, WCAG AA) même au milieu de l'animation
  gsap.fromTo(el.querySelectorAll('.w'), { color: '#7D8A95' }, {
    color: '#142C43',
    stagger: 0.08,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
});

/* ---------- 5. Méthode : frise et compteur ---------- */
document.querySelectorAll<HTMLElement>('[data-method]').forEach((root) => {
  const bar = root.querySelector<HTMLElement>('[data-method-bar]');
  const num = root.querySelector<HTMLElement>('[data-method-num]');
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  if (bar && !reduce) {
    gsap.fromTo(bar, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: bar.parentElement, start: 'top 60%', end: 'bottom 60%', scrub: true },
    });
  }
  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 62%',
      onEnter: () => { step.classList.add('is-on'); if (num) num.textContent = String(i + 1).padStart(2, '0'); },
      onLeaveBack: () => { step.classList.remove('is-on'); if (num) num.textContent = String(Math.max(i, 1)).padStart(2, '0'); },
    });
  });
});

/* ---------- 6. Image révélée (le cadre s'ouvre au défilement) ---------- */
if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-clip-reveal]').forEach((fig) => {
    const media = fig.querySelector<HTMLElement>('.reveal-media');
    if (!media) return;
    gsap.fromTo(media, { clipPath: 'inset(12% 14% 12% 14%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top 85%', end: 'top 25%', scrub: true },
    });
    const img = media.querySelector('img');
    if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- 7. Rails glissables (pages hub) ---------- */
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

  // Glisser à la souris (le doigt utilise le défilement natif)
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
  // Un glissé ne doit pas ouvrir la carte sous le pointeur
  rail.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);
});

/* ---------- 8. Filets qui se dessinent ---------- */
if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-draw-line]').forEach((line) => {
    gsap.fromTo(line, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      transformOrigin: 'left center',
      scrollTrigger: { trigger: line.parentElement ?? line, start: 'top 75%', end: 'bottom 60%', scrub: true },
    });
  });
}
