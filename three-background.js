import * as THREE from "three";

const canvas = document.getElementById("three-canvas");

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const THEMES = {
  fire: {
    dark: new THREE.Color(0x050507),
    mid: new THREE.Color(0x8a2a0a),
    bright: new THREE.Color(0xe85a0a),
    ember: new THREE.Color(0xff6a2b),
    accent: new THREE.Color(0xc6a85a),
  },
  frost: {
    dark: new THREE.Color(0x050a12),
    mid: new THREE.Color(0x1a3a5a),
    bright: new THREE.Color(0x4a8aba),
    ember: new THREE.Color(0x7fbfdf),
    accent: new THREE.Color(0xbfdfff),
  },
  amber: {
    dark: new THREE.Color(0x120a05),
    mid: new THREE.Color(0x8a6a2a),
    bright: new THREE.Color(0xd4a030),
    ember: new THREE.Color(0xe8c84a),
    accent: new THREE.Color(0xf0d878),
  },
  violet: {
    dark: new THREE.Color(0x0a0512),
    mid: new THREE.Color(0x4a1a6a),
    bright: new THREE.Color(0x8a4aba),
    ember: new THREE.Color(0xb86ae8),
    accent: new THREE.Color(0xc6a85a),
  },
};

const themeName = document.body.dataset.theme || "fire";
const theme = THEMES[themeName] || THEMES.fire;

const uniforms = {
  time: { value: 0 },
  resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uDark: { value: theme.dark },
  uMid: { value: theme.mid },
  uBright: { value: theme.bright },
  uEmber: { value: theme.ember },
  uAccent: { value: theme.accent },
};

const bgVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bgFragment = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 uDark;
  uniform vec3 uMid;
  uniform vec3 uBright;
  uniform vec3 uEmber;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(random(i + vec2(0.0)), random(i + vec2(1.0, 0.0)), u.x),
      mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5; float f = 1.0;
    for (int i = 0; i < 5; i++) { v += a * noise(p * f); f *= 2.3; a *= 0.48; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = resolution.x / resolution.y;
    vec2 pos = (uv - 0.5) * vec2(aspect, 1.0);
    float t = time * 0.09;

    vec3 color = uDark;

    float n1 = fbm(pos * 1.2 + t);
    float n2 = fbm(pos * 2.0 - t * 0.7 + 5.0);
    float n3 = fbm(pos * 3.5 + vec2(0.0, t * 1.5));
    float n4 = fbm(pos * 5.0 + vec2(t, t * 0.6));

    float fire = smoothstep(0.25, 0.75, n1 * 0.7 + n2 * 0.5 + n3 * 0.3);
    vec3 fireColor = mix(uMid, uBright, fire);
    color += fireColor * fire * 0.8;

    float ember = smoothstep(0.5, 0.8, n3 * n4 * 2.5);
    color += uEmber * ember * 0.6;

    color += uMid * n2 * 0.3;

    color *= 0.85 + 0.15 * fbm(pos * 0.8 + t * 0.5);

    float vignette = 1.0 - length(pos) * length(pos) * 0.65;
    color *= clamp(vignette, 0.0, 1.0);

    color = pow(color, vec3(0.75));
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

scene.add(new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({ uniforms, vertexShader: bgVertex, fragmentShader: bgFragment })
));

function domToNDC(el) {
  const r = el.getBoundingClientRect();
  return {
    x: ((r.left + r.width / 2) / window.innerWidth) * 2 - 1,
    y: -((r.top + r.height / 2) / window.innerHeight) * 2 + 1,
  };
}

const cardEmbers = [];

document.querySelectorAll(".kingdom-card").forEach((card) => {
  const N = 18;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const siz = new Float32Array(N);
  const meta = [];

  const ember = new THREE.Color(theme.ember);
  const accent = new THREE.Color(theme.accent);

  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = 0.015 + Math.random() * 0.015;
    const i3 = i * 3;
    pos[i3] = Math.cos(a) * r;
    pos[i3 + 1] = Math.sin(a) * r + 0.025;
    pos[i3 + 2] = 0;

    const t = Math.random();
    const c = ember.clone().lerp(accent, t);
    col[i3] = c.r;
    col[i3 + 1] = c.g;
    col[i3 + 2] = c.b;

    siz[i] = Math.random() * 4 + 2;
    meta.push({ a, r, speed: 0.3 + Math.random() * 0.5, phase: Math.random() * 6.28, vy: 0.2 + Math.random() * 0.3, oy: pos[i3 + 1] });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(siz, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.025, vertexColors: true, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });

  const pts = new THREE.Points(geo, mat);
  pts.visible = false;
  scene.add(pts);

  const st = { pts, meta, geo, mat, card, visible: false };
  card.addEventListener("mouseenter", () => { st.visible = true; pts.visible = true; });
  card.addEventListener("mouseleave", () => { st.visible = false; });
  cardEmbers.push(st);
});

const D_N = 80;
const dPos = new Float32Array(D_N * 3);
const dCol = new Float32Array(D_N * 3);
const dSiz = new Float32Array(D_N);
const dOff = [];

for (let i = 0; i < D_N; i++) {
  const t = i / D_N;
  const i3 = i * 3;
  dPos[i3] = (t - 0.5) * 0.5;
  dPos[i3 + 1] = 0;
  dPos[i3 + 2] = 0;

  const w = Math.random();
  const ec = new THREE.Color(theme.ember);
  const ac = new THREE.Color(theme.accent);
  const c = ec.lerp(ac, w);
  dCol[i3] = c.r;
  dCol[i3 + 1] = c.g;
  dCol[i3 + 2] = c.b;
  dSiz[i] = Math.random() * 3 + 1.5;
  dOff.push({ sx: (Math.random() - 0.5) * 0.03, sy: (Math.random() - 0.5) * 0.02, sz: (Math.random() - 0.5) * 0.05 });
}

const dGeo = new THREE.BufferGeometry();
dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
dGeo.setAttribute("color", new THREE.BufferAttribute(dCol, 3));
dGeo.setAttribute("size", new THREE.BufferAttribute(dSiz, 1));

const dMat = new THREE.PointsMaterial({
  size: 0.025, vertexColors: true, transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: false,
});

const dragon = new THREE.Points(dGeo, dMat);
scene.add(dragon);

let dTimer = 9;
let dPlaying = false;
let dProgress = 0;
const dTmp = new Float32Array(D_N * 3);

let prevTime = performance.now();

function animate() {
  const now = performance.now();
  const dt = Math.min((now - prevTime) / 1000, 0.1);
  prevTime = now;
  uniforms.time.value += dt;

  for (const st of cardEmbers) {
    const pos = st.geo.attributes.position.array;
    const ndc = domToNDC(st.card);
    st.mat.opacity += (st.visible ? 1 : -1) * dt * 3;
    st.mat.opacity = Math.max(0, Math.min(1, st.mat.opacity));

    if (st.mat.opacity < 0.01) { st.pts.visible = false; continue; }
    st.pts.visible = true;

    for (let i = 0; i < st.meta.length; i++) {
      const m = st.meta[i];
      const i3 = i * 3;
      const elapsed = uniforms.time.value;
      const a = m.a + elapsed * m.speed;
      const r = m.r + Math.sin(elapsed * 0.5 + m.phase) * 0.005;
      pos[i3] = ndc.x + Math.cos(a) * r;
      pos[i3 + 1] = ndc.y + m.oy + Math.sin(elapsed * m.vy + m.phase) * 0.008;
    }
    st.geo.attributes.position.needsUpdate = true;
  }

  if (!dPlaying) {
    dTimer -= dt;
    if (dTimer <= 0) {
      dPlaying = true;
      dProgress = 0;
      dTimer = 18 + Math.random() * 6;
    }
  }

  if (dPlaying) {
    dProgress += dt / 5;
    if (dProgress >= 1) { dPlaying = false; dMat.opacity = 0; }
    else {
      const p = dProgress;
      const ex = -1.4 + p * 2.8;
      const ey = 0.3 + Math.sin(p * Math.PI) * 0.4;
      const flap = Math.sin(p * Math.PI * 4);

      for (let i = 0; i < D_N; i++) {
        const i3 = i * 3;
        const lt = i / D_N;
        const wing = Math.sin(lt * Math.PI * 6 + p * Math.PI * 2) * (1 - lt) * 0.12;
        dTmp[i3] = ex + (lt - 0.5) * 0.5 + dOff[i].sx;
        dTmp[i3 + 1] = ey + wing + flap * 0.02 + dOff[i].sy;
        dTmp[i3 + 2] = dOff[i].sz;
      }
      dGeo.attributes.position.array.set(dTmp);
      dGeo.attributes.position.needsUpdate = true;
      dMat.opacity = Math.sin(p * Math.PI) * 0.5;
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});
