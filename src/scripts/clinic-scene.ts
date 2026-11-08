/**
 * Scène 3D de l'accueil : la maquette blanche d'un cabinet dentaire qui passe du plan au bâtiment équipé.
 * Pilotée par la progression du défilement (0 → 1), fournie par ScrollTrigger dans motion-home.ts.
 *
 *   0.00–0.22  plan vu de dessus, le circuit patient (or) se dessine
 *   0.18–0.50  les murs montent, la caméra passe en vue axonométrique
 *   0.48–0.78  les murs passent en coupe (1,15 m, chapeaux navy), les sols se teintent, les équipements apparaissent
 *   0.75–1.00  la caméra plonge vers les salles de soins
 *
 * Principes repris d'AbstractThreeScene (SDK @paycii/ui-framework) : boucle hors framework, plafond d'images/s,
 * pause onglet caché et hors écran, densité de pixels plafonnée, libération complète des ressources.
 */
import {
  AmbientLight, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3, CylinderGeometry,
  DirectionalLight, EdgesGeometry, Float32BufferAttribute, Group, HemisphereLight, LineBasicMaterial, LineSegments, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, SRGBColorSpace,
  TubeGeometry, Vector3, WebGLRenderer, type Material,
} from 'three';

const NAVY = 0x142c43;
const TEAL = 0x168c91;
const GOLD = 0xc6a66b;
const WALL = 0xffffff;
const FLOOR = 0xeef1f2;
const CUT = 1.15; // hauteur de coupe de la maquette (m)
const W = 16; // largeur du plan (m)
const D = 10; // profondeur (m)
const H = 2.6; // hauteur des murs (m)
const T = 0.16; // épaisseur des murs (m)

/** Segments de murs [x1, z1, x2, z2] — les ouvertures sont les portes. */
const WALLS: [number, number, number, number][] = [
  [0, 0, 16, 0], [16, 0, 16, 10], [16, 10, 0, 10], [0, 10, 0, 2.6], [0, 1.1, 0, 0],
  [6, 0, 6, 1.4], [6, 2.5, 6, 6.3], [6, 7.4, 6, 10],
  [0, 4, 2, 4], [4, 4, 6, 4],
  [6, 5, 7.6, 5], [8.6, 5, 12, 5], [12.9, 5, 16, 5],
  [11, 0, 11, 3.6],
  [10, 5, 10, 10], [13, 6, 13, 10],
];
/** Sols des pièces [x1, z1, x2, z2, couleur, opacité] : teintés quand la maquette s'équipe. */
const FLOORS: [number, number, number, number, number, number][] = [
  [0, 0, 6, 4, 0xc6a66b, 0.18], [0, 4, 6, 10, 0xc6a66b, 0.1], [6, 0, 11, 5, 0x168c91, 0.16], [11, 0, 16, 5, 0x168c91, 0.16],
  [6, 5, 10, 10, 0x142c43, 0.08], [10, 5, 13, 10, 0x142c43, 0.12], [13, 5, 16, 10, 0x142c43, 0.05],
];
const ROOMS: [string, number, number][] = [
  ['ACCUEIL', 3, 2], ['ATTENTE', 3, 7.2], ['FAUTEUIL 1', 8.5, 2.5], ['FAUTEUIL 2', 13.5, 2.5],
  ['STÉRILISATION', 8, 7.5], ['LOCAL TECH.', 11.5, 7.5], ['SANITAIRE', 14.5, 7.5],
];
/** Circuit patient : entrée → accueil → attente → salle de soins. */
const CIRCUIT: [number, number][] = [[-1.2, 1.85], [1.5, 1.85], [3, 3.2], [3, 6.8], [5.2, 6.9], [6.6, 6.9], [7.2, 5.6], [8.1, 4.6], [8.5, 3]];

const ox = -W / 2;
const oz = -D / 2;
const v = (x: number, y: number, z: number) => new Vector3(x + ox, y, z + oz);
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const span = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

export interface ClinicScene {
  setProgress(p: number): void;
  dispose(): void;
}

export function mountClinicScene(canvas: HTMLCanvasElement, opts: { targetFps?: number; pixelRatio?: number } = {}): ClinicScene {
  const targetFps = opts.targetFps ?? 45;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.pixelRatio ?? 1.5));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 200);
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  // Lumières douces de maquette
  scene.add(new HemisphereLight(0xffffff, 0xc9d3d9, 1.1));
  scene.add(new AmbientLight(0xffffff, 0.25));
  const sun = new DirectionalLight(0xfff6ea, 1.5);
  sun.position.set(-8, 18, 10);
  scene.add(sun);

  // Sol et trame
  const floor = new Mesh(track(new PlaneGeometry(W + 6, D + 6)), track(new MeshStandardMaterial({ color: FLOOR, roughness: 1 })));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  scene.add(floor);
  const gridGeo = new BufferGeometry();
  const gp: number[] = [];
  for (let x = -3; x <= W + 3; x += 1) gp.push(x + ox, 0, -3 + oz, x + ox, 0, D + 3 + oz);
  for (let z = -3; z <= D + 3; z += 1) gp.push(-3 + ox, 0, z + oz, W + 3 + ox, 0, z + oz);
  gridGeo.setAttribute('position', new Float32BufferAttribute(gp, 3));
  const grid = new LineSegments(track(gridGeo), track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.06 })));
  scene.add(grid);

  // Murs : volume blanc + arêtes navy (rendu « maquette d'architecte »)
  const walls = new Group();
  const wallMat = track(new MeshStandardMaterial({ color: WALL, roughness: 0.85 }));
  const edgeMat = track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.55 }));
  const capMat = track(new MeshBasicMaterial({ color: NAVY }));
  const caps = new Group();
  for (const [x1, z1, x2, z2] of WALLS) {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const geo = track(new BoxGeometry(len + T, 1, T));
    geo.translate(0, 0.5, 0);
    const mesh = new Mesh(geo, wallMat);
    const edges = new LineSegments(track(new EdgesGeometry(geo)), edgeMat);
    const g = new Group();
    g.add(mesh, edges);
    g.position.copy(v((x1 + x2) / 2, 0, (z1 + z2) / 2));
    g.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    walls.add(g);
    const cap = new Mesh(track(new BoxGeometry(len + T + 0.01, 0.04, T + 0.01)), capMat);
    cap.position.copy(v((x1 + x2) / 2, 0, (z1 + z2) / 2));
    cap.rotation.y = g.rotation.y;
    caps.add(cap);
  }
  scene.add(walls, caps);

  // Sols teintés par fonction
  const tints = new Group();
  for (const [x1, z1, x2, z2, color, op] of FLOORS) {
    const m = new Mesh(track(new PlaneGeometry(x2 - x1 - T, z2 - z1 - T)), track(new MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })));
    m.rotation.x = -Math.PI / 2;
    m.position.copy(v((x1 + x2) / 2, 0.01, (z1 + z2) / 2));
    m.userData.op = op;
    tints.add(m);
  }
  scene.add(tints);

  // Noms des pièces, posés au sol comme sur un plan
  const labels = new Group();
  for (const [name, x, z] of ROOMS) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = 'rgba(20,44,67,0.72)';
    ctx.font = '600 44px "Inter Variable", Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '6px';
    ctx.fillText(name, 256, 64);
    const tex = track(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    const mat = track(new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    const m = new Mesh(track(new PlaneGeometry(3.2, 0.8)), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.copy(v(x, 0.02, z));
    labels.add(m);
  }
  scene.add(labels);

  // Circuit patient en or, dessiné progressivement
  const curve = new CatmullRomCurve3(CIRCUIT.map(([x, z]) => v(x, 0.06, z)));
  const tubeGeo = track(new TubeGeometry(curve, 160, 0.06, 8, false));
  const tube = new Mesh(tubeGeo, track(new MeshBasicMaterial({ color: GOLD })));
  const tubeIndexCount = tubeGeo.index ? tubeGeo.index.count : 0;
  scene.add(tube);

  // Équipements
  const equip = new Group();
  const tealMat = track(new MeshStandardMaterial({ color: TEAL, roughness: 0.45, metalness: 0.1 }));
  const whiteMat = track(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
  const navyMat = track(new MeshStandardMaterial({ color: NAVY, roughness: 0.5 }));
  const items: Group[] = [];
  const add = (build: (g: Group) => void, x: number, z: number, rot = 0) => {
    const g = new Group();
    build(g);
    g.position.copy(v(x, 0, z));
    g.rotation.y = rot;
    g.scale.setScalar(0.001);
    g.userData.base = 1.15;
    equip.add(g);
    items.push(g);
  };
  const box = (g: Group, w: number, h: number, d: number, m: Material, x = 0, y = 0, z = 0, rx = 0) => {
    const geo = track(new BoxGeometry(w, h, d));
    const mesh = new Mesh(geo, m);
    mesh.position.set(x, y + h / 2, z);
    mesh.rotation.x = rx;
    g.add(mesh);
    const e = new LineSegments(track(new EdgesGeometry(geo)), edgeMat);
    e.position.copy(mesh.position);
    e.rotation.copy(mesh.rotation);
    g.add(e);
  };
  const chair = (g: Group) => {
    box(g, 0.6, 0.45, 0.6, whiteMat);
    box(g, 0.75, 0.18, 1.7, tealMat, 0, 0.45, 0.1);
    box(g, 0.7, 0.16, 0.7, tealMat, 0, 0.75, -0.85, -0.6);
    box(g, 0.08, 1.6, 0.08, navyMat, 0.75, 0, 0.4);
    box(g, 0.5, 0.06, 0.35, whiteMat, 0.75, 1.6, 0.2);
  };
  add(chair, 8.5, 2.4, Math.PI / 2);
  add(chair, 13.5, 2.4, Math.PI / 2);
  add((g) => { box(g, 2.6, 1.05, 0.7, whiteMat); box(g, 2.6, 0.06, 0.9, navyMat, 0, 1.05, 0.1); }, 3, 2.6);
  add((g) => { for (let i = 0; i < 4; i++) box(g, 0.5, 0.45, 0.5, i % 2 ? tealMat : whiteMat, (i - 1.5) * 0.65, 0, 0); }, 3, 8.8);
  add((g) => { box(g, 3, 0.9, 0.6, whiteMat); box(g, 0.6, 0.45, 0.5, navyMat, -0.8, 0.9, 0); box(g, 0.45, 0.35, 0.4, tealMat, 0.6, 0.9, 0); }, 8, 9.3);
  add((g) => {
    const geo = track(new CylinderGeometry(0.35, 0.35, 1.0, 20));
    const m = new Mesh(geo, navyMat);
    m.position.y = 0.5;
    g.add(m);
    box(g, 0.7, 0.8, 0.6, tealMat, 0.75, 0, 0);
  }, 11.3, 8.6);
  scene.add(equip);

  // Caméra : plan (dessus) → axonométrie → orbite → salle de soins
  const keys: { p: number; pos: Vector3; look: Vector3 }[] = [
    { p: 0.0, pos: new Vector3(0.6, 24, 3.2), look: new Vector3(0.6, 0, 0) },
    { p: 0.2, pos: new Vector3(0.6, 21, 5.2), look: new Vector3(0.6, 0, 0) },
    { p: 0.48, pos: new Vector3(15, 13, 16), look: new Vector3(0, 0.6, 0) },
    { p: 0.75, pos: new Vector3(-12, 14, 13), look: new Vector3(0.5, 0, 0) },
    { p: 1.0, pos: v(3.5, 7.5, 12.5), look: v(10.5, 0.4, 3.2) },
  ];
  const camPos = new Vector3();
  const camLook = new Vector3();
  const tmp = new Vector3();

  let progress = 0;
  let smooth = 0;
  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;
  let visible = true;
  let pageVisible = !document.hidden;
  let disposed = false;

  function resize() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Sur écran étroit, on recule pour garder tout le plan dans le cadre
    const narrow = width / height < 0.8;
    camera.fov = narrow ? 58 : 38;
    // Décale la maquette hors du texte : à droite sur grand écran, en bas sur mobile
    if (narrow) camera.setViewOffset(width, height, 0, -height * 0.2, width, height);
    else if (width >= 1024) camera.setViewOffset(width, height, -width * 0.16, 0, width, height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }

  function apply(p: number, t: number) {
    // Murs : de trait de plan à volume
    const wallH = 0.02 + span(p, 0.18, 0.5) * H - span(p, 0.52, 0.66) * (H - CUT);
    walls.children.forEach((g) => (g.scale.y = wallH));
    caps.children.forEach((c) => (c.position.y = wallH + 0.02));
    caps.visible = p > 0.2;
    const tint = span(p, 0.5, 0.68);
    tints.children.forEach((m) => (((m as Mesh).material as MeshBasicMaterial).opacity = tint * (m.userData.op as number)));
    // Circuit
    const drawn = Math.floor(tubeIndexCount * span(p, 0.03, 0.24));
    tubeGeo.setDrawRange(0, drawn - (drawn % 3));
    // Étiquettes : visibles sur le plan, s'effacent quand les murs montent
    const lab = 1 - span(p, 0.3, 0.45);
    labels.children.forEach((m) => {
      const mat = (m as Mesh).material as MeshBasicMaterial;
      mat.opacity = lab;
      m.visible = lab > 0.01;
    });
    // Équipements en cascade
    items.forEach((g, i) => {
      const s = span(p, 0.48 + i * 0.035, 0.6 + i * 0.035);
      g.scale.setScalar(Math.max(0.001, s * (g.userData.base as number)));
    });
    // Caméra
    let k = 0;
    while (k < keys.length - 2 && p > keys[k + 1]!.p) k++;
    const a = keys[k]!;
    const b = keys[k + 1]!;
    const lt = ease(clamp((p - a.p) / (b.p - a.p)));
    camPos.lerpVectors(a.pos, b.pos, lt);
    camLook.lerpVectors(a.look, b.look, lt);
    // Dérive très lente pour que la maquette vive sans défilement
    const drift = Math.sin(t * 0.00025) * 0.35;
    camera.position.set(camPos.x + drift, camPos.y, camPos.z - drift * 0.5);
    camera.lookAt(tmp.copy(camLook));
  }

  function loop(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(loop);
    if (!visible || !pageVisible) return;
    if (now - last < 1000 / targetFps) return;
    last = now;
    smooth += (progress - smooth) * 0.12;
    apply(smooth, now);
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
  io.observe(canvas);
  const onVis = () => (pageVisible = !document.hidden);
  document.addEventListener('visibilitychange', onVis);
  resize();
  apply(0, 0);
  renderer.render(scene, camera);
  frame = requestAnimationFrame(loop);

  return {
    setProgress(p: number) {
      progress = clamp(p);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    },
  };
}
