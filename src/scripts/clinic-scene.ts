/**
 * Scène 3D de l'accueil : la maquette d'un cabinet dentaire, du plan d'architecte au cabinet équipé et réceptionné.
 * Pilotée par la progression du défilement (0 → 1), fournie par ScrollTrigger dans motion-home.ts.
 *
 *   0.00–0.30  plan coté : murs en poché navy, portes et débattements, fenêtres, surfaces, emprises des équipements,
 *              circuit patient (or), marche en avant de la stérilisation, flèche du nord
 *   0.24–0.40  réseaux encastrés (fluides teal, électricité or) qui partent du local technique
 *   0.32–0.50  les murs montent, menuiseries et vitrages en place
 *   0.50–0.74  coupe de maquette à 1,15 m, sols finis, équipements en cascade
 *   0.78–1.00  réception : pastilles de PV par pièce, lumière plus chaude, caméra au plus près des salles de soins
 *
 * Toutes les dimensions sont celles d'un plan d'illustration (16 × 10 m), pas d'un projet réel.
 * Principes repris d'AbstractThreeScene (SDK @paycii/ui-framework, non modifié) : boucle hors framework, plafond
 * d'images/s, pause onglet caché et hors écran, densité de pixels plafonnée, libération complète des ressources.
 * Ombres douces recalculées seulement quand la maquette change (pas à chaque image). Mode `lite` pour les appareils
 * modestes : sans ombres, densité 1,75× max, 30 images/s (choisi dans BaseLayout via deviceMemory, etc.).
 * La scène se cadre dans son conteneur (planche du héros) et ne dépend plus du défilement : la progression
 * est fournie par la lecture automatique de motion-home.ts.
 */
import {
  AmbientLight, Box3, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3, CurvePath, CylinderGeometry,
  DirectionalLight, EdgesGeometry, Float32BufferAttribute, Group, HemisphereLight, IcosahedronGeometry, LineBasicMaterial,
  LineCurve3, LineSegments, Mesh, MeshBasicMaterial, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera,
  PlaneGeometry, Scene, Sprite, SpriteMaterial, SRGBColorSpace, TubeGeometry, Vector3, WebGLRenderer,
  type Material, type Object3D,
} from 'three';

const NAVY = 0x142c43;
const TEAL = 0x168c91;
const TEAL_SOFT = 0x7cc4c7;
const GOLD = 0xc6a66b;
const GOLD_DEEP = 0x9c7b42;
const WALL = 0xffffff;
const GROUND = 0xeef1f2;
const STEEL = 0xb9c3c9;
const WOOD = 0xd9c4a0;
const LEAF = 0x7f9f8a;
const W = 16; // largeur du plan (m)
const D = 10; // profondeur (m)
const H = 2.6; // hauteur sous plafond (m)
const T = 0.16; // épaisseur des cloisons (m)
const CUT = 1.15; // hauteur de coupe de la maquette (m)

type Seg = [number, number, number, number];

/** Murs [x1, z1, x2, z2] ; les ouvertures sont les portes et les fenêtres. */
const WALLS: Seg[] = [
  [0, 0, 1.6, 0], [4.4, 0, 7.2, 0], [9.8, 0, 12.4, 0], [15, 0, 16, 0],
  [16, 0, 16, 1], [16, 4, 16, 10],
  [16, 10, 4.5, 10], [1.5, 10, 0, 10],
  [0, 10, 0, 2.6], [0, 1.1, 0, 0],
  [6, 0, 6, 1.4], [6, 2.5, 6, 6.3], [6, 7.4, 6, 10],
  [0, 4, 2, 4], [4, 4, 6, 4],
  [6, 5, 7.6, 5], [8.6, 5, 12, 5], [12.9, 5, 16, 5],
  [11, 0, 11, 3.6],
  [10, 5, 10, 10], [13, 6, 13, 10],
];
const WINDOWS: Seg[] = [[1.6, 0, 4.4, 0], [7.2, 0, 9.8, 0], [12.4, 0, 15, 0], [16, 1, 16, 4], [4.5, 10, 1.5, 10]];
/** Portes [x1, z1, x2, z2, nx, nz] : charnière en (x1, z1), ouverture vers la normale (nx, nz). */
const DOORS: [number, number, number, number, number, number][] = [
  [0, 1.1, 0, 2.6, 1, 0], [6, 1.4, 6, 2.5, 1, 0], [6, 6.3, 6, 7.4, 1, 0],
  [7.6, 5, 8.6, 5, 0, 1], [12, 5, 12.9, 5, 0, 1], [13, 5, 13, 6, 1, 0],
];
/** Pièces : nom, surface du plan d'illustration, position de l'étiquette. */
const ROOMS: [string, string, number, number][] = [
  ['ACCUEIL', '24 m²', 2.2, 2.8], ['ATTENTE', '36 m²', 3, 5.6], ['FAUTEUIL 1', '25 m²', 8.5, 4.1],
  ['FAUTEUIL 2', '25 m²', 13.5, 4.1], ['STÉRILISATION', '20 m²', 8, 6.3], ['LOCAL TECH.', '15 m²', 11.5, 6.0],
  ['SANITAIRE', '15 m²', 14.5, 6.6],
];
const BADGES: [number, number][] = [[2.6, 2.2], [3, 7], [8.5, 2.4], [13.5, 2.4], [8, 7.6], [11.5, 7.6], [14.5, 7.8]];
/** Sols finis [x1, z1, x2, z2, couleur]. */
const FLOORS: [number, number, number, number, number][] = [
  [0, 0, 6, 4, 0xe9dcc2], [0, 4, 6, 10, 0xe9dcc2], [6, 0, 11, 5, 0xdcebea], [11, 0, 16, 5, 0xdcebea],
  [6, 5, 10, 10, 0xe2ebeb], [10, 5, 13, 10, 0xdde2e5], [13, 5, 16, 10, 0xe8eef0],
];
/** Circuit patient : entrée → accueil → attente → salle de soins. */
const CIRCUIT: [number, number][] = [[-1.2, 1.85], [1.2, 1.85], [2.6, 2.4], [3, 4], [4.6, 5.6], [5.6, 6.9], [6.7, 6.9], [7.3, 5.6], [8.1, 4.4], [8.4, 3.2]];
/** Réseaux encastrés depuis le local technique : fluides (teal) et électricité (or). */
const NETWORKS: { color: number; y: number; paths: [number, number][][] }[] = [
  {
    color: TEAL,
    y: 0.05,
    paths: [
      [[11.3, 8.2], [11.3, 5.3], [8.7, 5.3], [8.7, 3.4]],
      [[11.3, 5.3], [13.6, 5.3], [13.6, 3.4]],
      [[11.3, 8.2], [10.3, 8.2], [10.3, 9.1], [6.9, 9.1]],
      [[10.3, 9.1], [10.3, 9.6], [14, 9.6]],
    ],
  },
  {
    color: GOLD_DEEP,
    y: 0.08,
    paths: [
      [[12.2, 9.5], [12.2, 5.5], [9.1, 5.5], [9.1, 3.4]],
      [[12.2, 5.5], [14, 5.5], [14, 3.4]],
      [[9.1, 5.5], [6.4, 5.5], [6.4, 0.6], [3.6, 0.6]],
    ],
  },
];

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

export interface ClinicSceneOptions {
  targetFps?: number;
  pixelRatio?: number;
  /** Appareil modeste (peu de mémoire, peu de cœurs, réseau lent) : sans ombres, densité plafonnée à 1,75×. */
  lite?: boolean;
}

export function mountClinicScene(canvas: HTMLCanvasElement, opts: ClinicSceneOptions = {}): ClinicScene {
  const lite = opts.lite ?? false;
  const targetFps = opts.targetFps ?? 45;
  // Netteté : jusqu'à 2× (écrans de téléphone denses) ; anticrénelage conservé même en mode allégé
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: lite ? 'low-power' : 'default' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.pixelRatio ?? (lite ? 1.75 : 2)));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = !lite;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 200);
  const disposables: { dispose(): void }[] = [];
  const track = <X extends { dispose(): void }>(x: X) => (disposables.push(x), x);

  // ---------- Lumières de maquette, ombres douces ----------
  const hemi = new HemisphereLight(0xffffff, 0xc9d3d9, 1.05);
  const sun = new DirectionalLight(0xfff6ea, 1.6);
  sun.position.set(-9, 20, 11);
  sun.castShadow = !lite;
  const shadowSize = window.innerWidth < 768 ? 1024 : 2048;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12, near: 1, far: 60 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(hemi, new AmbientLight(0xffffff, 0.25), sun);

  // ---------- Sol et trame ----------
  const ground = new Mesh(track(new PlaneGeometry(W + 12, D + 12)), track(new MeshStandardMaterial({ color: GROUND, roughness: 1 })));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  scene.add(ground);
  const gp: number[] = [];
  for (let x = -4; x <= W + 4; x += 1) gp.push(x + ox, 0, -4 + oz, x + ox, 0, D + 4 + oz);
  for (let z = -4; z <= D + 4; z += 1) gp.push(-4 + ox, 0, z + oz, W + 4 + ox, 0, z + oz);
  const gridGeo = track(new BufferGeometry());
  gridGeo.setAttribute('position', new Float32BufferAttribute(gp, 3));
  scene.add(new LineSegments(gridGeo, track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.06 }))));

  // ---------- Matériaux ----------
  const std = (color: number, roughness = 0.6, metalness = 0) => track(new MeshStandardMaterial({ color, roughness, metalness }));
  const M = {
    wall: std(WALL, 0.85),
    white: std(0xffffff, 0.55),
    teal: std(TEAL, 0.45),
    navy: std(NAVY, 0.5),
    steel: std(STEEL, 0.35, 0.5),
    wood: std(WOOD, 0.8),
    door: std(0xf3efe7, 0.7),
    leaf: track(new MeshStandardMaterial({ color: LEAF, roughness: 0.9, flatShading: true })),
    glass: track(new MeshStandardMaterial({ color: TEAL_SOFT, transparent: true, opacity: 0.35, roughness: 0.1 })),
  };
  const edgeMat = track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.5 }));
  const fineEdge = track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.2 }));
  const capMat = track(new MeshBasicMaterial({ color: NAVY }));

  /** Matériaux du plan coté, effacés ensemble quand les murs montent : [matériau, opacité de base]. */
  const planMats: [{ opacity: number }, number][] = [];
  const planGroup = new Group();
  scene.add(planGroup);
  const planLineMat = track(new LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.75 }));
  planMats.push([planLineMat, 0.75]);
  const planPts: number[] = [];
  const seg = (arr: number[], x1: number, z1: number, x2: number, z2: number, y = 0.03) =>
    arr.push(x1 + ox, y, z1 + oz, x2 + ox, y, z2 + oz);

  /** Texte posé au sol comme sur un plan (canevas → texture). */
  const floorText = (lines: [string, number, string][], w: number, x: number, z: number, angle = 0) => {
    const c = document.createElement('canvas');
    const lh = lines.reduce((s, [, size]) => s + size * 1.35, 0);
    c.width = 512;
    c.height = Math.ceil(lh + 24);
    const ctx = c.getContext('2d')!;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let y = 12;
    for (const [text, size, color] of lines) {
      ctx.fillStyle = color;
      ctx.font = `600 ${size}px "Inter Variable", Inter, system-ui, sans-serif`;
      ctx.letterSpacing = `${Math.round(size / 8)}px`;
      ctx.fillText(text, 256, y + (size * 1.35) / 2);
      y += size * 1.35;
    }
    const tex = track(new CanvasTexture(c));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = lite ? 1 : 4;
    const mat = track(new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    planMats.push([mat, 1]);
    const m = new Mesh(track(new PlaneGeometry(w, (w * c.height) / 512)), mat);
    m.rotation.set(-Math.PI / 2, 0, angle);
    m.position.copy(v(x, 0.02, z));
    planGroup.add(m);
  };

  // ---------- Murs : volume blanc, arêtes navy, chapeau navy (poché du plan, coupe de la maquette) ----------
  const wallPiece = (x1: number, z1: number, x2: number, z2: number, mat: Material, extra: number, edges = true) => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const geo = track(new BoxGeometry(len + extra, 1, T));
    geo.translate(0, 0.5, 0);
    const mesh = new Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const g = new Group();
    g.add(mesh);
    if (edges) g.add(new LineSegments(track(new EdgesGeometry(geo)), edgeMat));
    g.position.copy(v((x1 + x2) / 2, 0, (z1 + z2) / 2));
    g.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    scene.add(g);
    return { g, len };
  };
  const walls: Group[] = [];
  const caps: Mesh[] = [];
  for (const [x1, z1, x2, z2] of WALLS) {
    const { g, len } = wallPiece(x1, z1, x2, z2, M.wall, T);
    walls.push(g);
    const cap = new Mesh(track(new BoxGeometry(len + T + 0.01, 0.04, T + 0.01)), capMat);
    cap.position.copy(g.position);
    cap.rotation.y = g.rotation.y;
    scene.add(cap);
    caps.push(cap);
  }

  // Fenêtres : allège, vitrage, linteau ; symbole à trois traits sur le plan
  const windows: { sill: Group; glass: Mesh; lintel: Group }[] = [];
  for (const [x1, z1, x2, z2] of WINDOWS) {
    const sill = wallPiece(x1, z1, x2, z2, M.wall, -T).g;
    const lintel = wallPiece(x1, z1, x2, z2, M.wall, -T).g;
    const len = Math.hypot(x2 - x1, z2 - z1);
    const gg = track(new BoxGeometry(len - T, 1, 0.03));
    gg.translate(0, 0.5, 0);
    const glass = new Mesh(gg, M.glass);
    glass.position.copy(sill.position);
    glass.rotation.y = sill.rotation.y;
    scene.add(glass);
    windows.push({ sill, glass, lintel });
    const nx = -(z2 - z1) / len;
    const nz = (x2 - x1) / len;
    for (const k of [-T / 2, 0, T / 2]) seg(planPts, x1 + nx * k, z1 + nz * k, x2 + nx * k, z2 + nz * k);
  }

  // Portes : vantail 3D + débattement en quart de cercle sur le plan
  const doors: Group[] = [];
  for (const [x1, z1, x2, z2, nx, nz] of DOORS) {
    const full = Math.hypot(x2 - x1, z2 - z1);
    const w = full - 0.08;
    const dx = (x2 - x1) / full;
    const dz = (z2 - z1) / full;
    const N = 16;
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * (Math.PI / 2);
      const a1 = ((i + 1) / N) * (Math.PI / 2);
      seg(planPts,
        x1 + w * (Math.cos(a0) * dx + Math.sin(a0) * nx), z1 + w * (Math.cos(a0) * dz + Math.sin(a0) * nz),
        x1 + w * (Math.cos(a1) * dx + Math.sin(a1) * nx), z1 + w * (Math.cos(a1) * dz + Math.sin(a1) * nz));
    }
    seg(planPts, x1, z1, x1 + w * nx, z1 + w * nz);
    const geo = track(new BoxGeometry(0.05, 1, w));
    geo.translate(0, 0.5, w / 2);
    const leaf = new Mesh(geo, M.door);
    leaf.castShadow = true;
    const g = new Group();
    g.add(leaf, new LineSegments(track(new EdgesGeometry(geo)), fineEdge));
    g.position.copy(v(x1 + dx * 0.04, 0, z1 + dz * 0.04));
    g.rotation.y = Math.atan2(nx, nz);
    scene.add(g);
    doors.push(g);
  }

  // Cotes : 16,00 m en façade, partiels 6,00 / 5,00 / 5,00, 10,00 m en profondeur
  const dim = (x1: number, z1: number, x2: number, z2: number, nx: number, nz: number, off: number, text: string) => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const dx = (x2 - x1) / len;
    const dz = (z2 - z1) / len;
    const ax = x1 + nx * off;
    const az = z1 + nz * off;
    const bx = x2 + nx * off;
    const bz = z2 + nz * off;
    seg(planPts, ax - dx * 0.2, az - dz * 0.2, bx + dx * 0.2, bz + dz * 0.2);
    for (const [px, pz] of [[x1, z1], [x2, z2]] as const) {
      seg(planPts, px + nx * 0.35, pz + nz * 0.35, px + nx * (off + 0.2), pz + nz * (off + 0.2));
      const tx = px + nx * off;
      const tz = pz + nz * off;
      seg(planPts, tx - (dx + nx) * 0.13, tz - (dz + nz) * 0.13, tx + (dx + nx) * 0.13, tz + (dz + nz) * 0.13);
    }
    const mx = (ax + bx) / 2 + nx * 0.32;
    const mz = (az + bz) / 2 + nz * 0.32;
    floorText([[text, 44, 'rgba(20,44,67,0.85)']], 2.2, mx, mz, Math.abs(dz) > 0.5 ? Math.PI / 2 : 0);
  };
  dim(0, 0, 16, 0, 0, -1, 1.5, '16,00 m');
  dim(0, 0, 6, 0, 0, -1, 0.7, '6,00');
  dim(6, 0, 11, 0, 0, -1, 0.7, '5,00');
  dim(11, 0, 16, 0, 0, -1, 0.7, '5,00');
  dim(16, 0, 16, 10, 1, 0, 1.1, '10,00 m');

  // Flèche du nord et marche en avant de la stérilisation
  const nX = 17.6;
  const nZ = 11.4;
  for (let i = 0; i < 24; i++) {
    const a0 = (i / 24) * Math.PI * 2;
    const a1 = ((i + 1) / 24) * Math.PI * 2;
    seg(planPts, nX + Math.cos(a0) * 0.45, nZ + Math.sin(a0) * 0.45, nX + Math.cos(a1) * 0.45, nZ + Math.sin(a1) * 0.45);
  }
  seg(planPts, nX, nZ + 0.45, nX, nZ - 0.7);
  seg(planPts, nX, nZ - 0.7, nX - 0.18, nZ - 0.35);
  seg(planPts, nX, nZ - 0.7, nX + 0.18, nZ - 0.35);
  floorText([['N', 44, 'rgba(20,44,67,0.85)']], 0.8, nX + 0.65, nZ - 0.45);
  for (let x = 6.8; x < 9.2; x += 0.3) seg(planPts, x, 8.5, x + 0.16, 8.5);
  seg(planPts, 9.4, 8.5, 9.15, 8.35);
  seg(planPts, 9.4, 8.5, 9.15, 8.65);
  floorText([['SALE → PROPRE', 30, 'rgba(15,110,114,0.95)']], 2.4, 8.1, 8.0);

  // Noms et surfaces des pièces
  for (const [name, area, x, z] of ROOMS) floorText([[name, 40, 'rgba(20,44,67,0.78)'], [area, 30, 'rgba(15,110,114,0.95)']], 3, x, z);

  const planGeo = track(new BufferGeometry());
  planGeo.setAttribute('position', new Float32BufferAttribute(planPts, 3));
  planGroup.add(new LineSegments(planGeo, planLineMat));

  // ---------- Circuit patient (or), dessiné progressivement ----------
  const curve = new CatmullRomCurve3(CIRCUIT.map(([x, z]) => v(x, 0.07, z)));
  const tubeGeo = track(new TubeGeometry(curve, 200, 0.06, 8, false));
  scene.add(new Mesh(tubeGeo, track(new MeshBasicMaterial({ color: GOLD }))));
  const tubeCount = tubeGeo.index ? tubeGeo.index.count : 0;

  // ---------- Réseaux encastrés ----------
  const nets: { geo: TubeGeometry; count: number }[] = [];
  const netMats: MeshBasicMaterial[] = [];
  for (const net of NETWORKS) {
    const mat = track(new MeshBasicMaterial({ color: net.color, transparent: true }));
    netMats.push(mat);
    for (const path of net.paths) {
      const cp = new CurvePath<Vector3>();
      for (let i = 0; i < path.length - 1; i++) {
        const [ax, az] = path[i]!;
        const [bx, bz] = path[i + 1]!;
        cp.add(new LineCurve3(v(ax, net.y, az), v(bx, net.y, bz)));
      }
      const geo = track(new TubeGeometry(cp, 48 * path.length, 0.045, 6, false));
      scene.add(new Mesh(geo, mat));
      nets.push({ geo, count: geo.index ? geo.index.count : 0 });
    }
  }

  // ---------- Sols finis ----------
  const floorMats: MeshStandardMaterial[] = [];
  for (const [x1, z1, x2, z2, color] of FLOORS) {
    const mat = track(new MeshStandardMaterial({ color, roughness: 0.9, transparent: true, opacity: 0, depthWrite: false }));
    floorMats.push(mat);
    const m = new Mesh(track(new PlaneGeometry(x2 - x1 - T, z2 - z1 - T)), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.copy(v((x1 + x2) / 2, 0.012, (z1 + z2) / 2));
    m.receiveShadow = true;
    scene.add(m);
  }

  // ---------- Équipements ----------
  const box = (g: Group, w: number, h: number, d: number, m: Material, x = 0, y = 0, z = 0, rx = 0, edges = true) => {
    const geo = track(new BoxGeometry(w, h, d));
    const mesh = new Mesh(geo, m);
    mesh.position.set(x, y + h / 2, z);
    mesh.rotation.x = rx;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
    if (edges) {
      const e = new LineSegments(track(new EdgesGeometry(geo)), fineEdge);
      e.position.copy(mesh.position);
      e.rotation.copy(mesh.rotation);
      g.add(e);
    }
  };
  const cyl = (g: Group, r: number, h: number, m: Material, x = 0, y = 0, z = 0, axis: 'y' | 'x' | 'z' = 'y') => {
    const mesh = new Mesh(track(new CylinderGeometry(r, r, h, 24)), m);
    if (axis === 'y') mesh.position.set(x, y + h / 2, z);
    else {
      mesh.position.set(x, y, z);
      if (axis === 'x') mesh.rotation.z = Math.PI / 2;
      else mesh.rotation.x = Math.PI / 2;
    }
    mesh.castShadow = true;
    g.add(mesh);
  };
  const stool = (g: Group, x: number, z: number) => {
    cyl(g, 0.24, 0.04, M.steel, x, 0, z);
    cyl(g, 0.03, 0.45, M.steel, x, 0.04, z);
    cyl(g, 0.21, 0.08, M.teal, x, 0.49, z);
  };
  const dentalUnit = (g: Group) => {
    box(g, 0.5, 0.36, 0.7, M.white, 0, 0, 0.1);
    box(g, 0.64, 0.14, 1.0, M.teal, 0, 0.36, 0.25);
    box(g, 0.6, 0.12, 0.8, M.teal, 0, 0.5, -0.5, -0.7);
    box(g, 0.34, 0.09, 0.26, M.teal, 0, 0.9, -0.98, -0.3);
    box(g, 0.5, 0.1, 0.6, M.teal, 0, 0.26, 0.98, 0.35);
    cyl(g, 0.05, 0.72, M.white, -0.5, 0, -0.15);
    cyl(g, 0.15, 0.08, M.white, -0.5, 0.72, -0.15);
    cyl(g, 0.035, 2.0, M.navy, 0.62, 0, -1.05);
    box(g, 0.05, 0.05, 1.0, M.navy, 0.62, 1.98, -0.55, 0, false);
    box(g, 0.42, 0.09, 0.2, M.white, 0.62, 1.86, -0.05);
    box(g, 0.05, 0.05, 0.5, M.navy, 0.62, 0.8, 0.2, 0, false);
    box(g, 0.46, 0.05, 0.34, M.white, 0.75, 0.85, 0.45);
    stool(g, 0.95, -0.55);
    stool(g, -0.9, -0.4);
    box(g, 0.04, 0.75, 0.04, M.navy, -0.75, 0.4, -0.95, 0, false);
    box(g, 0.56, 0.34, 0.04, M.navy, -0.75, 1.15, -0.95);
  };
  const counter = (g: Group, len: number) => {
    box(g, len, 0.85, 0.6, M.white);
    box(g, len + 0.02, 0.04, 0.62, M.navy, 0, 0.85, 0, 0, false);
    box(g, 0.45, 0.03, 0.36, M.steel, len * 0.3, 0.885, 0, 0, false);
    cyl(g, 0.02, 0.26, M.steel, len * 0.3, 0.89, -0.22);
  };
  const reception = (g: Group) => {
    box(g, 2.4, 1.1, 0.16, M.white, 0, 0, 0.32);
    box(g, 2.5, 0.04, 0.34, M.wood, 0, 1.1, 0.3);
    box(g, 2.4, 0.74, 0.7, M.white, 0, 0, -0.12);
    box(g, 2.42, 0.03, 0.72, M.navy, 0, 0.74, -0.12, 0, false);
    box(g, 0.04, 0.2, 0.04, M.navy, 0.4, 0.77, -0.15, 0, false);
    box(g, 0.56, 0.34, 0.04, M.navy, 0.4, 0.97, -0.15);
    stool(g, 0.4, -0.75);
    stool(g, -0.6, -0.75);
  };
  const waitingChair = (g: Group, x: number, m: Material) => {
    box(g, 0.48, 0.42, 0.04, M.steel, x, 0, 0.18, 0, false);
    box(g, 0.48, 0.42, 0.04, M.steel, x, 0, -0.18, 0, false);
    box(g, 0.5, 0.07, 0.48, m, x, 0.42, 0);
    box(g, 0.5, 0.44, 0.06, m, x, 0.49, -0.22);
  };
  const row = (n: number) => (g: Group) => {
    for (let i = 0; i < n; i++) waitingChair(g, (i - (n - 1) / 2) * 0.62, i % 3 === 1 ? M.teal : M.white);
  };
  const plant = (g: Group) => {
    cyl(g, 0.17, 0.34, M.white);
    const a = new Mesh(track(new IcosahedronGeometry(0.32, 0)), M.leaf);
    a.position.set(0, 0.68, 0);
    a.castShadow = true;
    const b = new Mesh(track(new IcosahedronGeometry(0.22, 0)), M.leaf);
    b.position.set(0.12, 0.98, 0.06);
    b.castShadow = true;
    g.add(a, b);
  };
  const sterilBench = (g: Group) => {
    counter(g, 3.2);
    box(g, 0.55, 0.42, 0.5, M.steel, -0.35, 0.89, 0);
    cyl(g, 0.15, 0.03, M.navy, -0.35, 1.1, 0.26, 'z');
    box(g, 0.42, 0.12, 0.3, M.white, -1.15, 0.89, 0);
    box(g, 0.58, 0.82, 0.04, M.steel, 0.4, 0, 0.31, 0, false);
  };
  const tallCabinet = (g: Group) => {
    box(g, 0.9, 1.9, 0.5, M.white);
    box(g, 0.02, 0.5, 0.02, M.navy, -0.05, 0.9, 0.26, 0, false);
    box(g, 0.02, 0.5, 0.02, M.navy, 0.05, 0.9, 0.26, 0, false);
  };
  const compressor = (g: Group) => {
    cyl(g, 0.28, 1.0, M.navy, 0, 0.36, 0, 'x');
    box(g, 0.45, 0.32, 0.34, M.teal, 0.1, 0.64, 0);
    box(g, 0.08, 0.1, 0.4, M.steel, -0.35, 0, 0, 0, false);
    box(g, 0.08, 0.1, 0.4, M.steel, 0.35, 0, 0, 0, false);
  };
  const aspiration = (g: Group) => {
    box(g, 0.6, 0.95, 0.5, M.steel);
    box(g, 0.3, 0.06, 0.02, M.teal, 0, 0.75, 0.26, 0, false);
  };
  const tgbt = (g: Group) => {
    box(g, 0.9, 1.8, 0.22, M.white);
    box(g, 0.01, 1.7, 0.01, M.navy, 0, 0.05, 0.12, 0, false);
    box(g, 0.12, 0.05, 0.02, M.teal, 0.3, 1.55, 0.12, 0, false);
  };
  const wc = (g: Group) => {
    box(g, 0.38, 0.4, 0.5, M.white, 0, 0, 0.1);
    box(g, 0.42, 0.36, 0.18, M.white, 0, 0.4, -0.18);
  };
  const basin = (g: Group) => {
    cyl(g, 0.07, 0.8, M.white);
    box(g, 0.56, 0.1, 0.42, M.white, 0, 0.8, 0);
    box(g, 0.36, 0.02, 0.26, M.steel, 0, 0.9, 0.02, 0, false);
  };
  const table = (g: Group) => box(g, 0.9, 0.4, 0.6, M.wood);

  const items: Group[] = [];
  const fpPts: number[] = [];
  const add = (build: (g: Group) => void, x: number, z: number, rot = 0) => {
    const g = new Group();
    build(g);
    g.position.copy(v(x, 0, z));
    g.rotation.y = rot;
    g.updateMatrixWorld(true);
    // Emprise au sol, tracée sur le plan avant que l'équipement n'apparaisse
    const b = new Box3().setFromObject(g);
    const y = 0.025;
    fpPts.push(
      b.min.x, y, b.min.z, b.max.x, y, b.min.z, b.max.x, y, b.min.z, b.max.x, y, b.max.z,
      b.max.x, y, b.max.z, b.min.x, y, b.max.z, b.min.x, y, b.max.z, b.min.x, y, b.min.z,
    );
    g.scale.setScalar(0.001);
    scene.add(g);
    items.push(g);
  };
  add(reception, 3.6, 0.95);
  add(plant, 0.5, 3.4);
  add(plant, 5.5, 3.4);
  add(row(5), 3, 9.5, Math.PI);
  add(row(4), 0.48, 6.6, Math.PI / 2);
  add(table, 2.8, 7.4);
  add(plant, 5.5, 9.4);
  add(dentalUnit, 8.5, 2.4, Math.PI / 2);
  add((g) => counter(g, 2.0), 9.8, 4.62, Math.PI);
  add(dentalUnit, 13.5, 2.4, Math.PI / 2);
  add((g) => counter(g, 2.0), 14.5, 4.62, Math.PI);
  add(plant, 15.4, 0.55);
  add(sterilBench, 8, 9.6, Math.PI);
  add(tallCabinet, 9.65, 7.2, -Math.PI / 2);
  add(compressor, 11.2, 8.6);
  add(aspiration, 10.5, 6.1);
  add(tgbt, 12.2, 9.8, Math.PI);
  add(wc, 15.4, 9.45, Math.PI);
  add(basin, 14.1, 9.7, Math.PI);

  const fpMat = track(new LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.6 }));
  const fpGeo = track(new BufferGeometry());
  fpGeo.setAttribute('position', new Float32BufferAttribute(fpPts, 3));
  const footprints = new LineSegments(fpGeo, fpMat);
  scene.add(footprints);

  // ---------- Réception : pastilles « PV » par pièce ----------
  const bc = document.createElement('canvas');
  bc.width = bc.height = 128;
  const bctx = bc.getContext('2d')!;
  bctx.fillStyle = '#168C91';
  bctx.beginPath();
  bctx.arc(64, 64, 58, 0, Math.PI * 2);
  bctx.fill();
  bctx.strokeStyle = '#FFFFFF';
  bctx.lineWidth = 12;
  bctx.lineCap = 'round';
  bctx.lineJoin = 'round';
  bctx.beginPath();
  bctx.moveTo(38, 66);
  bctx.lineTo(56, 84);
  bctx.lineTo(90, 46);
  bctx.stroke();
  const btex = track(new CanvasTexture(bc));
  btex.colorSpace = SRGBColorSpace;
  const bmat = track(new SpriteMaterial({ map: btex, transparent: true }));
  const badges = BADGES.map(([x, z]) => {
    const s = new Sprite(bmat);
    s.position.copy(v(x, 2.1, z));
    s.visible = false;
    scene.add(s);
    return s;
  });

  // ---------- Caméra : plan → réseaux → axonométrie → orbite → salles de soins ----------
  const keys: { p: number; pos: Vector3; look: Vector3 }[] = [
    { p: 0.0, pos: new Vector3(0.6, 26, 5.2), look: new Vector3(0.6, 0, 0.6) },
    { p: 0.22, pos: new Vector3(0.6, 23, 7.2), look: new Vector3(0.6, 0, 0.4) },
    { p: 0.36, pos: new Vector3(6, 17, 15), look: new Vector3(0.4, 0, 0) },
    { p: 0.52, pos: new Vector3(15, 12.5, 15), look: new Vector3(0, 0.6, 0) },
    { p: 0.76, pos: new Vector3(-12, 13, 12.5), look: new Vector3(0.5, 0, 0) },
    { p: 1.0, pos: v(3.2, 8.2, 13.6), look: v(9.6, 0.3, 3.4) },
  ];
  const camPos = new Vector3();
  const camLook = new Vector3();

  let progress = 0;
  let smooth = 0;
  let shadowAt = -1;
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
    camera.fov = width / height < 1 ? 50 : 38;
    renderer.shadowMap.needsUpdate = true;
    camera.updateProjectionMatrix();
  }

  const setH = (o: Object3D, bottom: number, top: number) => {
    const h = top - bottom;
    o.visible = h > 0.005;
    o.position.y = bottom;
    o.scale.y = Math.max(h, 0.001);
  };

  function apply(p: number, t: number) {
    // Murs : trait de plan → volume → coupe
    const wallH = 0.02 + span(p, 0.32, 0.5) * (H - 0.02) - span(p, 0.52, 0.62) * (H - CUT);
    walls.forEach((g) => (g.scale.y = wallH));
    caps.forEach((c) => (c.position.y = wallH + 0.02));
    windows.forEach((w) => {
      setH(w.sill, 0, Math.min(0.9, wallH));
      setH(w.glass, 0.9, Math.min(2.2, wallH));
      setH(w.lintel, 2.2, wallH);
    });
    doors.forEach((g) => {
      g.visible = wallH > 0.3;
      g.scale.y = Math.max(0.001, Math.min(2.1, wallH));
    });
    // Plan coté : s'efface quand les murs montent
    const plan = 1 - span(p, 0.3, 0.4);
    planMats.forEach(([m, base]) => (m.opacity = plan * base));
    planGroup.visible = plan > 0.01;
    // Circuit patient
    const drawn = Math.floor(tubeCount * span(p, 0.02, 0.2));
    tubeGeo.setDrawRange(0, drawn - (drawn % 3));
    // Emprises : visibles sur le plan, remplacées par les équipements
    const fp = 1 - span(p, 0.5, 0.62);
    fpMat.opacity = 0.6 * fp;
    footprints.visible = fp > 0.01;
    // Réseaux : se dessinent, puis disparaissent sous les sols finis
    const net = span(p, 0.24, 0.4);
    nets.forEach((n) => {
      const c = Math.floor(n.count * net);
      n.geo.setDrawRange(0, c - (c % 3));
    });
    const netOp = 1 - span(p, 0.5, 0.6);
    netMats.forEach((m) => (m.opacity = netOp));
    // Sols finis
    const fl = span(p, 0.5, 0.64);
    floorMats.forEach((m) => (m.opacity = fl));
    // Équipements en cascade
    const step = 0.2 / items.length;
    items.forEach((g, i) => g.scale.setScalar(Math.max(0.001, span(p, 0.52 + i * step, 0.58 + i * step))));
    // Réception : pastilles de PV
    badges.forEach((b, i) => {
      const s = span(p, 0.8 + i * 0.015, 0.86 + i * 0.015);
      b.visible = s > 0.01;
      b.scale.setScalar(0.62 * s);
      b.position.y = 2.1 + Math.sin(t * 0.002 + i) * 0.05;
    });
    // Lumière plus chaude à la livraison
    const warm = span(p, 0.78, 0.95);
    sun.intensity = 1.6 + warm * 0.3;
    hemi.intensity = 1.05 + warm * 0.15;

    // Caméra
    let k = 0;
    while (k < keys.length - 2 && p > keys[k + 1]!.p) k++;
    const a = keys[k]!;
    const b = keys[k + 1]!;
    const lt = ease(clamp((p - a.p) / (b.p - a.p)));
    camPos.lerpVectors(a.pos, b.pos, lt);
    camLook.lerpVectors(a.look, b.look, lt);
    const drift = Math.sin(t * 0.00025) * 0.35;
    camera.position.set(camPos.x + drift, camPos.y, camPos.z - drift * 0.5);
    camera.lookAt(camLook);
    camera.updateProjectionMatrix();
  }

  function loop(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(loop);
    if (!visible || !pageVisible) return;
    if (now - last < 1000 / targetFps) return;
    last = now;
    smooth += (progress - smooth) * (progress < smooth - 0.2 ? 0.06 : 0.12);
    apply(smooth, now);
    if (!lite && Math.abs(smooth - shadowAt) > 0.0005) {
      renderer.shadowMap.needsUpdate = true;
      shadowAt = smooth;
    }
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
  renderer.shadowMap.needsUpdate = true;
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
