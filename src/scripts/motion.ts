/**
 * Animations au défilement — CSS + IntersectionObserver, sans bibliothèque.
 * - [data-reveal] / [data-reveal-img] : déclenchement unique dès l'entrée dans l'écran
 * - [data-count] : compteur animé une fois (chiffres réels uniquement)
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      if (e.target instanceof HTMLElement && e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    }
  },
  // Déclenchement dès l'entrée dans l'écran : un seuil en % ne serait jamais atteint par un bloc très haut (mobile).
  { threshold: 0, rootMargin: '0px 0px -8% 0px' },
);
const targets = document.querySelectorAll('[data-reveal],[data-reveal-img],[data-count]');
if ('IntersectionObserver' in window) targets.forEach((el) => io.observe(el));
else targets.forEach((el) => el.classList.add('is-in'));

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  if (reduce) { el.textContent = String(target); return; }
  const start = performance.now();
  const dur = 1600;
  const step = (t: number) => {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
