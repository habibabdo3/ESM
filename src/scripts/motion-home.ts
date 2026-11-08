/**
 * Orchestration du parcours immersif de l'accueil (GSAP + ScrollTrigger, comme GsapService du SDK).
 * - #journey : scène 3D épinglée ; la progression du défilement pilote la maquette, la légende et le sommaire.
 * - [data-hrail] : panneaux d'expertise en défilement horizontal épinglé (desktop), mot géant en parallaxe,
 *   image qui s'ouvre, contenu qui monte, étapes actives ; défilement natif avec accroche sur mobile.
 * - [data-words] : phrase qui s'allume mot à mot ; [data-inline-media] : images insérées qui s'ouvrent.
 * - [data-pillar] : pictogrammes dessinés au trait ; [data-clip-reveal] : image dont le cadre s'ouvre.
 * - [data-drag-rail] : rail glissable à la souris, flèches précédent/suivant (pages hub).
 * L'index des spécialités a son propre script (SpecIndex.astro).
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
  const navButtons = [...journey.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const bar = journey.querySelector<HTMLElement>('[data-journey-bar]');
  const canvas = journey.querySelector<HTMLCanvasElement>('canvas');
  const stops = chapters.map((c) => Number(c.dataset.chapter));
  let scene: { setProgress(p: number): void } | null = null;
  let current = -1;

  const setChapter = (p: number) => {
    let idx = 0;
    stops.forEach((s, i) => p >= s && (idx = i));
    if (idx === current) return;
    current = idx;
    chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
    // Le sommaire ne liste que les 4 étapes (le titre est l'étape 0)
    navButtons.forEach((b, i) => {
      const on = i === idx - 1;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    journey.classList.toggle('past-hero', idx > 0);
  };
  setChapter(0);

  const st = ScrollTrigger.create({
    trigger: journey,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scene?.setProgress(self.progress);
      setChapter(self.progress);
      if (bar) bar.style.transform = `scaleX(${self.progress})`;
    },
  });

  // Sommaire : chaque étape renvoie au moment du parcours où elle commence
  navButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const at = Number(b.dataset.goto) + 0.04;
      window.scrollTo({ top: st.start + (st.end - st.start) * at, behavior: 'smooth' });
    }),
  );

  // La scène (three.js) se charge après le premier affichage : le titre reste l'élément principal.
  const load = () =>
    import('./clinic-scene').then(({ mountClinicScene }) => {
      if (!canvas) return;
      try {
        scene = mountClinicScene(canvas);
        scene.setProgress(st.progress);
        journey.classList.add('scene-ready');
      } catch {
        document.documentElement.classList.remove('webgl');
      }
    });
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(load, { timeout: 1200 });
  else setTimeout(load, 300);
}

/* ---------- 2. Expertises : défilement horizontal épinglé ---------- */
gsap.matchMedia().add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  document.querySelectorAll<HTMLElement>('[data-hrail]').forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-hrail-track]');
    if (!track) return;
    const ghost = section.querySelector<HTMLElement>('[data-hrail-ghost]');
    const panels = [...section.querySelectorAll<HTMLElement>('[data-hrail-panel]')];
    const steps = [...section.querySelectorAll<HTMLElement>('[data-hrail-step]')];
    section.classList.add('is-pinned');
    const distance = () => track.scrollWidth - window.innerWidth;

    const setStep = () => {
      const mid = window.innerWidth * 0.55;
      let idx = -1;
      panels.forEach((p, i) => p.getBoundingClientRect().left < mid && (idx = i));
      steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    };

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
        onUpdate: setStep,
      },
    });

    // Mot géant : arrière-plan plus lent que les panneaux
    if (ghost) {
      gsap.to(ghost, {
        xPercent: -35,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: 1 },
      });
    }

    panels.forEach((panel) => {
      const media = panel.querySelector<HTMLElement>('[data-hrail-media]');
      const img = panel.querySelector<HTMLElement>('[data-hrail-img]');
      const body = panel.querySelector<HTMLElement>('[data-hrail-body]');
      const enter = { trigger: panel, containerAnimation: tween, start: 'left 100%', end: 'left 40%', scrub: true };
      if (media) gsap.fromTo(media, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: enter });
      if (img) {
        gsap.fromTo(img, { xPercent: -8, scale: 1.12 }, {
          xPercent: 8,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      }
      if (body) {
        gsap.fromTo(body.children, { y: 48, opacity: 0 }, {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 85%', end: 'left 35%', scrub: true },
        });
      }
    });

    return () => {
      section.classList.remove('is-pinned');
      steps.forEach((s) => s.classList.remove('is-active'));
    };
  });
});

/* ---------- 3. Manifeste : mots qui s'allument, images insérées qui s'ouvrent ---------- */
document.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
  if (reduce) return;
  el.setAttribute('aria-label', (el.textContent ?? '').replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').trim());
  // Découpe uniquement les nœuds texte : les images insérées restent en place
  const words: HTMLElement[] = [];
  [...el.childNodes].forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const parts = (node.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) frag.append(document.createTextNode(' '));
      else {
        const w = document.createElement('span');
        w.className = 'w';
        w.setAttribute('aria-hidden', 'true');
        w.textContent = part;
        frag.append(w);
        words.push(w);
      }
    });
    node.replaceWith(frag);
  });
  // Gris de départ ≥ 3:1 sur blanc (texte large, WCAG AA) même au milieu de l'animation
  gsap.fromTo(words, { color: '#7D8A95' }, {
    color: '#142C43',
    stagger: 0.08,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
  el.querySelectorAll<HTMLElement>('[data-inline-media]').forEach((m) => {
    gsap.fromTo(m, { clipPath: 'inset(0% 50% 0% 50% round 999px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 999px)',
      ease: 'none',
      scrollTrigger: { trigger: m, start: 'top 85%', end: 'top 55%', scrub: true },
    });
  });
});

/* ---------- 4. Piliers dessinés au trait ---------- */
if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-pillar]').forEach((pillar) => {
    const paths = pillar.querySelectorAll('path');
    gsap.fromTo(paths, { strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      stagger: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: pillar, start: 'top 88%', end: 'top 50%', scrub: true },
    });
  });
}

/* ---------- 5. Image révélée (le cadre s'ouvre au défilement) ---------- */
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

/* ---------- 6. Rails glissables (pages hub) ---------- */
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
