/**
 * Accueil : défilement normal, aucun épinglage, aucun effet piloté par le défilement (sans GSAP : script léger).
 * - Héros : la maquette 3D se construit seule (lecture automatique en boucle, à son rythme), étapes cliquables,
 *   bouton pause (WCAG 2.2.2). Lecture suspendue hors écran ou onglet caché. La scène three.js n'est chargée
 *   qu'à l'approche de l'écran ; sur appareil modeste (`gl-lite`) elle est libérée quand on s'en éloigne.
 * - [data-strip] : la bande survolée ou ciblée au clavier s'élargit.
 * - [data-cases] : l'image collante change quand un projet type passe au centre de l'écran.
 * Le plan des spécialités (SpecPlan.astro) a son propre script.
 */
const root = document.documentElement;
const immersive = root.classList.contains('webgl');
const lite = root.classList.contains('gl-lite');

/* ---------- 1. Héros : maquette en lecture automatique ---------- */
const journey = document.getElementById('journey');
const frame = journey?.querySelector<HTMLElement>('[data-journey-frame]');
const canvas = journey?.querySelector<HTMLCanvasElement>('canvas');
if (journey && frame && canvas && immersive) {
  const steps = [...journey.querySelectorAll<HTMLElement>('[data-step]')];
  const bars = steps.map((s) => s.querySelector<HTMLElement>('[data-step-bar]'));
  const pauseBtn = journey.querySelector<HTMLButtonElement>('[data-journey-pause]');
  const STOPS = [0, 0.24, 0.5, 0.76, 1];
  const DURATION = 28000; // une construction complète, en ms
  const HOLD = 3500; // pause sur le cabinet livré avant de recommencer
  type Scene = { setProgress(p: number): void; dispose(): void };
  let scene: Scene | null = null;
  let loading = false;
  let progress = 0;
  let held = 0;
  let paused = false;
  let onScreen = false;
  let last = 0;
  let current = -1;

  const setStep = (p: number) => {
    let idx = 0;
    for (let i = 0; i < 4; i++) if (p >= STOPS[i]!) idx = i;
    if (idx !== current) {
      current = idx;
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        s.classList.toggle('is-done', i < idx);
        s.querySelector('button')?.setAttribute('aria-current', i === idx ? 'step' : 'false');
      });
    }
    const a = STOPS[idx]!;
    const b = STOPS[idx + 1]!;
    bars.forEach((bar, i) => {
      if (!bar) return;
      const f = i < idx ? 1 : i > idx ? 0 : Math.min(1, (p - a) / (b - a));
      bar.style.transform = `scaleX(${f})`;
    });
  };
  setStep(0);

  const tick = (now: number) => {
    requestAnimationFrame(tick);
    const dt = last ? Math.min(100, now - last) : 0;
    last = now;
    if (!scene || paused || !onScreen || document.hidden) return;
    if (progress < 1) progress = Math.min(1, progress + dt / DURATION);
    else if ((held += dt) > HOLD) {
      progress = 0;
      held = 0;
    }
    scene.setProgress(progress);
    setStep(progress);
  };
  requestAnimationFrame(tick);

  steps.forEach((s, i) =>
    s.querySelector('button')?.addEventListener('click', () => {
      progress = STOPS[i]! + 0.001;
      held = 0;
      scene?.setProgress(progress);
      setStep(progress);
    }),
  );
  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Reprendre l’animation' : 'Mettre l’animation en pause');
  });

  const unmount = () => {
    scene?.dispose();
    scene = null;
    journey.classList.remove('scene-ready');
  };
  // Repli propre si le navigateur retire le contexte WebGL (mémoire saturée)
  const fallback = () => {
    unmount();
    root.classList.remove('webgl', 'gl-lite');
  };
  const mount = () => {
    if (scene || loading || !root.classList.contains('webgl')) return;
    loading = true;
    import('./clinic-scene')
      .then(({ mountClinicScene }) => {
        loading = false;
        if (scene || !root.classList.contains('webgl')) return;
        scene = mountClinicScene(canvas, lite ? { lite: true, targetFps: 30 } : {});
        scene.setProgress(progress);
        journey.classList.add('scene-ready');
      })
      .catch(() => {
        loading = false;
        fallback();
      });
  };
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    fallback();
  });

  // Lecture seulement à l'écran ; chargement à l'approche ; libération loin de l'écran sur appareil modeste
  new IntersectionObserver(([e]) => (onScreen = !!e?.isIntersecting)).observe(frame);
  new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting) mount();
      else if (lite) unmount();
    },
    { rootMargin: '300px 0px' },
  ).observe(frame);
}

/* ---------- 2. Expertises : la bande survolée s'élargit ---------- */
document.querySelectorAll<HTMLElement>('[data-strips]').forEach((section) => {
  const strips = [...section.querySelectorAll<HTMLElement>('[data-strip]')];
  const open = (i: number) => strips.forEach((s, k) => s.classList.toggle('is-open', k === i));
  strips.forEach((s, i) => {
    s.addEventListener('pointerenter', (e) => (e as PointerEvent).pointerType === 'mouse' && open(i));
    s.addEventListener('focusin', () => open(i));
  });
});

/* ---------- 3. Réalisations : l'image change au fil du défilement ---------- */
document.querySelectorAll<HTMLElement>('[data-cases]').forEach((section) => {
  const items = [...section.querySelectorAll<HTMLElement>('[data-case]')];
  const media = [...section.querySelectorAll<HTMLElement>('[data-case-media]')];
  const count = section.querySelector<HTMLElement>('[data-case-count]');
  let current = 0;
  const show = (i: number) => {
    if (i < 0 || i === current) return;
    media.forEach((m, k) => {
      m.classList.toggle('is-prev', k === current);
      m.classList.toggle('is-active', k === i);
    });
    items.forEach((it, k) => it.classList.toggle('is-active', k === i));
    if (count) count.textContent = String(i + 1).padStart(2, '0');
    current = i;
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && show(items.indexOf(e.target as HTMLElement))),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  items.forEach((it) => io.observe(it));
});
