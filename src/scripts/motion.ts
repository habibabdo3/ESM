/**
 * Animations au défilement — CSS + IntersectionObserver, sans bibliothèque.
 * - [data-reveal] / [data-reveal-img] : déclenchement unique à 20 % de visibilité
 * - .parallax : déplacement vertical ≤ 6 %, desktop uniquement
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
  { threshold: 0.2 },
);
document.querySelectorAll('[data-reveal],[data-reveal-img],[data-count]').forEach((el) => io.observe(el));

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

const parallax = [...document.querySelectorAll<HTMLElement>('.parallax')];
if (parallax.length && !reduce && window.matchMedia('(min-width: 768px)').matches) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
      el.style.setProperty('--py', `${(-progress * 6).toFixed(2)}%`);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
