/**
 * Accueil : défilement normal, aucun épinglage, aucun effet piloté par le défilement (sans GSAP : script léger).
 * - Héros : à la première visite, introduction plein écran (la maquette se construit, ~20 s, « Passer » / Échap /
 *   molette), puis la planche rejoint sa place à côté du titre. Ensuite (et à chaque retour : mémorisé dans
 *   localStorage `esm-intro-v1`), la maquette livrée tourne lentement ; « Revoir la construction » et les étapes
 *   relancent la lecture ; bouton pause (WCAG 2.2.2). Lecture suspendue hors écran ou onglet caché ; scène chargée
 *   à l'approche de l'écran, libérée quand on s'en éloigne sur appareil modeste (`gl-lite`).
 * - [data-strip] : desktop, la bande survolée s'élargit (première ouverte) ; mobile, accordéon au toucher.
 * - [data-cases] : l'image collante change quand un projet type passe au centre de l'écran ; sa fiche se dessine.
 * Le plan des spécialités (SpecPlan.astro) a son propre script.
 */
const root = document.documentElement;
const immersive = root.classList.contains('webgl');
const lite = root.classList.contains('gl-lite');

/* ---------- 1. Héros : introduction, puis maquette livrée en vitrine ---------- */
const INTRO_KEY = 'esm-intro-v1';
const journey = document.getElementById('journey');
const frame = journey?.querySelector<HTMLElement>('[data-journey-frame]');
const canvas = journey?.querySelector<HTMLCanvasElement>('canvas');
if (journey && frame && canvas && immersive) {
  const steps = [...journey.querySelectorAll<HTMLElement>('[data-step]')];
  const bars = steps.map((s) => s.querySelector<HTMLElement>('[data-step-bar]'));
  const introBars = [...journey.querySelectorAll<HTMLElement>('[data-intro-bar]')];
  const introNum = journey.querySelector<HTMLElement>('[data-intro-num]');
  const introTitle = journey.querySelector<HTMLElement>('[data-intro-title]');
  const introText = journey.querySelector<HTMLElement>('[data-intro-text]');
  const pauseBtn = journey.querySelector<HTMLButtonElement>('[data-journey-pause]');
  const replayBtn = journey.querySelector<HTMLButtonElement>('[data-journey-replay]');
  const skipBtn = journey.querySelector<HTMLButtonElement>('[data-intro-skip]');
  const chapters = steps.map((s) => ({
    title: s.querySelector('.journey-step-title')?.textContent ?? '',
    text: s.querySelector('.journey-step-text')?.textContent ?? '',
  }));
  const STOPS = [0, 0.24, 0.5, 0.76, 1];
  const INTRO_MS = 20000; // introduction plein écran
  const PLAY_MS = 26000; // « Revoir la construction »
  type Scene = { setProgress(p: number): void; setOrbit(on: boolean): void; dispose(): void };
  let scene: Scene | null = null;
  let loading = false;
  // Visiteur déjà venu (ou intro passée) : la maquette est livrée, elle tourne lentement
  let intro = root.classList.contains('intro') && window.scrollY < 10;
  if (!intro) root.classList.remove('intro');
  let playing = intro;
  let progress = intro ? 0 : 1;
  let paused = false;
  let onScreen = true;
  let last = 0;
  let current = -1;

  const remember = () => {
    try {
      localStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* navigation privée : l'intro sera simplement rejouée */
    }
  };

  const setStep = (p: number) => {
    let idx = 0;
    for (let i = 0; i < 4; i++) if (p >= STOPS[i]!) idx = i;
    if (idx !== current) {
      current = idx;
      steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        s.querySelector('button')?.setAttribute('aria-current', i === idx ? 'step' : 'false');
      });
      if (introNum) introNum.textContent = String(idx + 1).padStart(2, '0');
      if (introTitle) introTitle.textContent = chapters[idx]?.title ?? '';
      if (introText) introText.textContent = chapters[idx]?.text ?? '';
    }
    const a = STOPS[idx]!;
    const b = STOPS[idx + 1]!;
    const fill = (i: number) => (i < idx ? 1 : i > idx ? 0 : Math.min(1, (p - a) / (b - a)));
    bars.forEach((bar, i) => bar && (bar.style.transform = `scaleX(${fill(i)})`));
    introBars.forEach((bar, i) => (bar.style.transform = `scaleX(${fill(i)})`));
  };
  setStep(progress);
  journey.classList.toggle('is-playing', playing);

  // Fin de l'introduction : la planche plein écran rejoint sa place dans le héros
  const endIntro = (animate: boolean) => {
    if (!intro) return;
    // Le garde-fou du <head> a déjà rendu la page (scène trop lente à charger) : rien à animer
    if (!root.classList.contains('intro')) {
      intro = false;
      return;
    }
    intro = false;
    remember();
    if (!animate) {
      root.classList.remove('intro');
      return;
    }
    const slot = frame.parentElement!.getBoundingClientRect();
    frame.style.transition = 'none';
    Object.assign(frame.style, { position: 'fixed', top: '0px', left: '0px', width: '100vw', height: '100svh', zIndex: '80', borderRadius: '0px' });
    root.classList.remove('intro');
    root.classList.add('intro-out');
    void frame.offsetWidth;
    frame.style.transition = 'top 1s var(--ease-lux), left 1s var(--ease-lux), width 1s var(--ease-lux), height 1s var(--ease-lux), border-radius 1s var(--ease-lux)';
    Object.assign(frame.style, { top: `${slot.top}px`, left: `${slot.left}px`, width: `${slot.width}px`, height: `${slot.height}px`, borderRadius: '8px' });
    const done = () => {
      frame.removeAttribute('style');
      root.classList.remove('intro-out');
    };
    frame.addEventListener('transitionend', (e) => e.propertyName === 'width' && done(), { once: true });
    setTimeout(done, 1400);
  };
  const finishPlay = () => {
    playing = false;
    journey.classList.remove('is-playing');
    scene?.setOrbit(true);
    if (intro) setTimeout(() => endIntro(true), 900);
  };
  const play = (from = 0) => {
    playing = true;
    progress = from;
    journey.classList.add('is-playing');
    scene?.setOrbit(false);
    scene?.setProgress(progress);
    setStep(progress);
  };

  const tick = (now: number) => {
    requestAnimationFrame(tick);
    const dt = last ? Math.min(250, now - last) : 0;
    last = now;
    if (!scene || paused || !onScreen || document.hidden || !playing) return;
    progress = Math.min(1, progress + dt / (intro ? INTRO_MS : PLAY_MS));
    scene.setProgress(progress);
    setStep(progress);
    if (progress >= 1) finishPlay();
  };
  requestAnimationFrame(tick);

  // Commandes : revoir, pause, étapes, passer l'intro (bouton, Échap, molette, glissement)
  replayBtn?.addEventListener('click', () => play(0));
  steps.forEach((s, i) => s.querySelector('button')?.addEventListener('click', () => play(STOPS[i]! + 0.001)));
  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Reprendre l’animation' : 'Mettre l’animation en pause');
    scene?.setOrbit(!paused && !playing);
  });
  const skip = () => {
    if (!intro) return;
    progress = 1;
    scene?.setProgress(1);
    setStep(1);
    playing = false;
    journey.classList.remove('is-playing');
    scene?.setOrbit(true);
    endIntro(true);
  };
  skipBtn?.addEventListener('click', skip);
  if (intro) {
    window.addEventListener('keydown', (e) => e.key === 'Escape' && skip());
    window.addEventListener('wheel', skip, { passive: true, once: true });
    window.addEventListener('touchmove', skip, { passive: true, once: true });
    skipBtn?.focus({ preventScroll: true });
  }

  const unmount = () => {
    scene?.dispose();
    scene = null;
    journey.classList.remove('scene-ready');
  };
  // Repli propre si le navigateur retire le contexte WebGL (mémoire saturée)
  const fallback = () => {
    unmount();
    if (intro) endIntro(false);
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
        scene.setOrbit(!playing && !paused);
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
  new IntersectionObserver(([e]) => (onScreen = intro || !!e?.isIntersecting)).observe(frame);
  new IntersectionObserver(
    ([e]) => {
      if (e?.isIntersecting || intro) mount();
      else if (lite) unmount();
    },
    { rootMargin: '300px 0px' },
  ).observe(frame);
}

/* ---------- 2. Expertises ---------- */
// Desktop : comme avant — première bande ouverte, la bande survolée (ou cliquée, ou ciblée au clavier) s'élargit.
// Mobile : accordéon replié, un toucher ouvre ou referme une bande.
document.querySelectorAll<HTMLElement>('[data-strips]').forEach((section) => {
  const strips = [...section.querySelectorAll<HTMLElement>('[data-strip]')];
  const desktop = matchMedia('(min-width: 1024px)');
  const set = (i: number) => {
    strips.forEach((s, k) => {
      const on = k === i;
      s.classList.toggle('is-open', on);
      s.querySelector('[data-strip-toggle]')?.setAttribute('aria-expanded', String(on));
      const body = s.querySelector<HTMLElement>('.strip-body');
      if (body) body.inert = !on;
    });
    section.classList.toggle('has-open', i >= 0);
  };
  const reset = () => set(desktop.matches ? 0 : -1);
  reset();
  desktop.addEventListener('change', reset);
  strips.forEach((s, i) => {
    s.addEventListener('pointerenter', (e) => desktop.matches && (e as PointerEvent).pointerType === 'mouse' && set(i));
    s.addEventListener('focusin', () => desktop.matches && set(i));
    s.querySelector('[data-strip-toggle]')?.addEventListener('click', (e) => {
      const open = s.classList.contains('is-open');
      if (desktop.matches) set(i);
      else set(open ? -1 : i);
      // Au clavier seulement (detail = 0) : le focus passe au titre de la bande ouverte
      if (!open && (e as MouseEvent).detail === 0) s.querySelector<HTMLElement>('.strip-title a')?.focus({ preventScroll: true });
    });
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
    items[i]?.classList.add('is-seen');
    if (count) count.textContent = String(i + 1).padStart(2, '0');
    current = i;
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && show(items.indexOf(e.target as HTMLElement))),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  items.forEach((it) => io.observe(it));
});
