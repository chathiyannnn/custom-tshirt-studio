import * as THREE from 'three';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(e0, e1, x) {
  const t = Math.max(0, Math.min(1, (e1 === e0 ? 0 : (x - e0) / (e1 - e0))));
  return t * t * (3 - 2 * t);
}

function sampleKeys(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const u = (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]);
      return lerp(keys[i - 1][1], keys[i][1], u);
    }
  }
  return keys[keys.length - 1][1];
}

function gridToGeometry(grid, nu, nv, closedU) {
  const positions = [];
  const uvs = [];
  for (let v = 0; v < nv; v++) {
    for (let u = 0; u < nu; u++) {
      const p = grid[v][u];
      positions.push(p.x, p.y, p.z);
      uvs.push(u / (closedU ? nu : nu - 1), v / (nv - 1));
    }
  }
  const indices = [];
  const umax = closedU ? nu : nu - 1;
  for (let v = 0; v < nv - 1; v++) {
    for (let u = 0; u < umax; u++) {
      const a = v * nu + u;
      const b = v * nu + (u + 1) % nu;
      const c = (v + 1) * nu + u;
      const d = (v + 1) * nu + (u + 1) % nu;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function flipWinding(geo) {
  const arr = geo.index.array;
  for (let i = 0; i < arr.length; i += 3) {
    const tmp = arr[i];
    arr[i] = arr[i + 2];
    arr[i + 2] = tmp;
  }
}

function thicken(grid, nu, nv, thickness) {
  const geoOuter = gridToGeometry(grid, nu, nv, true);
  geoOuter.computeVertexNormals();
  const nrm = geoOuter.attributes.normal;
  const inner = [];
  for (let v = 0; v < nv; v++) {
    inner[v] = [];
    for (let u = 0; u < nu; u++) {
      const i = v * nu + u;
      const p = grid[v][u];
      inner[v][u] = new THREE.Vector3(
        p.x - nrm.getX(i) * thickness,
        p.y - nrm.getY(i) * thickness,
        p.z - nrm.getZ(i) * thickness
      );
    }
  }
  const geoInner = gridToGeometry(inner, nu, nv, true);
  flipWinding(geoInner);

  const rim = (rowOuter, rowInner) => {
    const pos = [];
    const idx = [];
    for (let u = 0; u < nu; u++) {
      const a = rowOuter[u];
      const b = rowOuter[(u + 1) % nu];
      const c = rowInner[u];
      const d = rowInner[(u + 1) % nu];
      const base = pos.length / 3;
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z);
      idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };

  return mergeGeos([
    geoOuter,
    geoInner,
    rim(grid[0], inner[0]),
    rim(inner[nv - 1], grid[nv - 1]),
  ]);
}

function mergeGeos(geos) {
  const pos = [];
  const nrm = [];
  const uv = [];
  const idx = [];
  let offset = 0;
  geos.forEach(g => {
    g.computeVertexNormals();
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const t = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      nrm.push(n ? n.getX(i) : 0, n ? n.getY(i) : 1, n ? n.getZ(i) : 0);
      if (t) uv.push(t.getX(i), t.getY(i));
      else uv.push(0, 0);
    }
    const index = g.index;
    if (index) {
      for (let i = 0; i < index.count; i++) idx.push(index.getX(i) + offset);
    }
    offset += p.count;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  out.setIndex(idx);
  out.computeVertexNormals();
  return out;
}

function bodyGrid(preset, nu, nv) {
  const grid = [];
  for (let vi = 0; vi < nv; vi++) {
    const t = vi / (nv - 1);
    const y = lerp(preset.hemY, preset.neckY, t);
    grid[vi] = [];
    for (let ui = 0; ui < nu; ui++) {
      const ang = (ui / nu) * Math.PI * 2;
      const side = Math.abs(Math.sin(ang));
      const front = Math.max(0, Math.cos(ang));
      const back = Math.max(0, -Math.cos(ang));
      let r = sampleKeys(t, preset.profile);

      const wing = preset.wing || 0;
      if (wing > 0) {
        const plateau = smoothstep(0.58, 0.78, t) * (1 - smoothstep(0.90, 0.98, t));
        r += wing * plateau * (0.15 + 0.85 * side);
      }
      // Keep shoulder WIDTH; only shrink collarbone (front/back) so it is not a vest.
      const neckT = smoothstep(0.84, 1, t);
      r *= 1 - neckT * (preset.neckPinch || 0.22) * (1 - side);

      const scoop = (preset.neckScoop || 0) * neckT;
      const yOff = -scoop * (0.55 * front + 0.28 * back);

      let sx = Math.sin(ang) * r;
      let sz = Math.cos(ang) * r * preset.squash;
      sz *= 1 + preset.chest * front * smoothstep(0.38, 0.72, t);
      sz *= 1 + preset.back * back * smoothstep(0.3, 0.7, t);

      const wr = preset.wrinkle;
      const radial = Math.hypot(sx, sz) || 1;
      const fold =
        Math.sin(ang * 2) * Math.sin(y * 7) * wr.side +
        front * Math.sin(sx * 14) * Math.sin((y - 0.15) * 9) * wr.chest +
        back * Math.sin(y * 6 + ang) * wr.back +
        Math.exp(-Math.pow((Math.abs(Math.abs(ang) - Math.PI / 2) - 0.08) / 0.25, 2)) *
          Math.sin(y * 11) * wr.armpit * smoothstep(0.45, 0.85, t) +
        Math.sin(y * 10) * wr.hem * (1 - t);
      sx += (sx / radial) * fold;
      sz += (sz / radial) * fold;

      grid[vi][ui] = new THREE.Vector3(sx, y + yOff, sz);
    }
  }
  return grid;
}

function sleeveGrid(side, preset, nu, nv) {
  const s = side;
  if (preset.holeX == null) {
    const path = new THREE.CatmullRomCurve3(
      preset.sleevePath.map(([x, y, z]) => new THREE.Vector3(s * x, y, z))
    );
    const grid = [];
    for (let vi = 0; vi < nv; vi++) {
      const t = vi / (nv - 1);
      const center = path.getPointAt(t);
      const r = lerp(preset.sleeveR0, preset.sleeveR1, t);
      grid[vi] = [];
      for (let ui = 0; ui < nu; ui++) {
        const a = (ui / nu) * Math.PI * 2;
        grid[vi][ui] = new THREE.Vector3(
          center.x,
          center.y + Math.sin(a) * r,
          center.z + Math.cos(a) * r
        );
      }
    }
    return grid;
  }

  const grid = [];
  for (let vi = 0; vi < nv; vi++) {
    const t = vi / (nv - 1);
    const e = t * t * (3 - 2 * t);
    const cx = s * lerp(preset.holeX, preset.hemX, e);
    const cy = lerp(preset.holeY, preset.hemY, e);
    const cz = lerp(preset.holeZ || 0, preset.hemZ || 0.08, e);
    const ry = lerp(preset.holeRy, preset.sleeveR1, e);
    const rz = lerp(preset.holeRz, preset.sleeveR1, e);
    const wrinkle = preset.sleeveWrinkle || 0;
    grid[vi] = [];
    for (let ui = 0; ui < nu; ui++) {
      const a = (ui / nu) * Math.PI * 2;
      const fold = Math.sin(a * 4 + t * 10) * wrinkle;
      grid[vi][ui] = new THREE.Vector3(
        cx + Math.sin(a * 2) * fold * 0.4 * s,
        cy + Math.sin(a) * (ry + fold),
        cz + Math.cos(a) * (rz + fold)
      );
    }
  }
  return grid;
}

function hoodGrid(nu, nv) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.68, -0.06),
    new THREE.Vector3(0, 0.90, -0.28),
    new THREE.Vector3(0, 1.22, -0.14),
    new THREE.Vector3(0, 1.18, 0.12),
    new THREE.Vector3(0, 0.92, 0.26),
  ]);
  const radii = [0.26, 0.32, 0.34, 0.28, 0.22];
  const grid = [];
  const a0 = -Math.PI * 0.72;
  const a1 = Math.PI * 0.72;
  for (let vi = 0; vi < nv; vi++) {
    const t = vi / (nv - 1);
    const center = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const r = sampleKeys(t, radii.map((v, i) => [i / (radii.length - 1), v]));
    let up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(tangent.dot(up)) > 0.92) up = new THREE.Vector3(0, 0, 1);
    const side = new THREE.Vector3().crossVectors(tangent, up).normalize();
    up = new THREE.Vector3().crossVectors(side, tangent).normalize();
    grid[vi] = [];
    for (let ui = 0; ui < nu; ui++) {
      const u = ui / (nu - 1);
      const a = lerp(a0, a1, u);
      const fold = Math.sin(a * 4) * 0.01 * t + Math.sin(t * 10) * 0.008;
      const p = center.clone()
        .addScaledVector(side, Math.sin(a) * (r + fold))
        .addScaledVector(up, Math.cos(a) * (r + fold) * 0.92);
      grid[vi][ui] = p;
    }
  }
  return grid;
}

function hoodToGeometry(grid, nu, nv, thickness) {
  const outer = gridToGeometry(grid, nu, nv, false);
  outer.computeVertexNormals();
  const nrm = outer.attributes.normal;
  const inner = [];
  for (let v = 0; v < nv; v++) {
    inner[v] = [];
    for (let u = 0; u < nu; u++) {
      const i = v * nu + u;
      const p = grid[v][u];
      inner[v][u] = new THREE.Vector3(
        p.x - nrm.getX(i) * thickness,
        p.y - nrm.getY(i) * thickness,
        p.z - nrm.getZ(i) * thickness
      );
    }
  }
  const geoInner = gridToGeometry(inner, nu, nv, false);
  flipWinding(geoInner);

  const rimStrip = (a, b) => {
    const pos = [];
    const idx = [];
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      const base = pos.length / 3;
      pos.push(a[i].x, a[i].y, a[i].z, a[i + 1].x, a[i + 1].y, a[i + 1].z,
        b[i].x, b[i].y, b[i].z, b[i + 1].x, b[i + 1].y, b[i + 1].z);
      idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };

  const leftO = grid.map(row => row[0]);
  const leftI = inner.map(row => row[0]);
  const rightO = grid.map(row => row[nu - 1]);
  const rightI = inner.map(row => row[nu - 1]);
  const openO = grid[nv - 1];
  const openI = inner[nv - 1];
  const neckO = grid[0];
  const neckI = inner[0];

  return mergeGeos([
    outer,
    geoInner,
    rimStrip(leftO, leftI),
    rimStrip(rightI, rightO),
    rimStrip(openO, openI),
    rimStrip(neckI, neckO),
  ]);
}

function ribBand({ y, r0, r1, h, nu = 48, ribs = 28, amp = 0.006 }) {
  const nv = 8;
  const grid = [];
  for (let vi = 0; vi < nv; vi++) {
    const t = vi / (nv - 1);
    const yy = y + (t - 0.5) * h;
    const r = lerp(r0, r1, Math.sin(t * Math.PI));
    grid[vi] = [];
    for (let ui = 0; ui < nu; ui++) {
      const ang = (ui / nu) * Math.PI * 2;
      const rib = 1 + Math.sin(ang * ribs) * amp / Math.max(0.001, r);
      const rr = r * rib;
      grid[vi][ui] = new THREE.Vector3(
        Math.sin(ang) * rr,
        yy,
        Math.cos(ang) * rr * 0.62
      );
    }
  }
  return thicken(grid, nu, nv, 0.016);
}

const HOODIE = {
  hemY: -0.66,
  neckY: 0.78,
  squash: 0.70,
  chest: 0.12,
  back: 0.10,
  dropShoulder: 0.34,
  wing: 0.16,
  neckPinch: 0.14,
  neckScoop: 0.04,
  thickness: 0.024,
  wrinkle: { side: 0.014, chest: 0.009, back: 0.012, armpit: 0.018, hem: 0.012 },
  profile: [
    [0, 0.52], [0.16, 0.57], [0.34, 0.60], [0.52, 0.62],
    [0.70, 0.60], [0.84, 0.56], [0.94, 0.44], [1, 0.30],
  ],
  holeX: 0.52,
  holeY: 0.46,
  holeZ: 0.04,
  holeRy: 0.18,
  holeRz: 0.15,
  hemX: 0.84,
  hemY: -0.58,
  hemZ: 0.05,
  sleeveR1: 0.118,
  sleeveWrinkle: 0.011,
};

const TEE = {
  hemY: -0.68,
  neckY: 0.84,
  squash: 0.58,
  chest: 0.10,
  back: 0.06,
  dropShoulder: 0.22,
  wing: 0.22,
  neckPinch: 0.18,
  neckScoop: 0.07,
  thickness: 0.012,
  wrinkle: { side: 0.016, chest: 0.014, back: 0.011, armpit: 0.02, hem: 0.008 },
  profile: [
    [0, 0.40], [0.16, 0.43], [0.36, 0.47], [0.54, 0.51],
    [0.68, 0.54], [0.82, 0.52], [0.93, 0.38], [1, 0.22],
  ],
  holeX: 0.48,
  holeY: 0.52,
  holeZ: 0.03,
  holeRy: 0.16,
  holeRz: 0.13,
  hemX: 0.70,
  hemY: 0.20,
  hemZ: 0.09,
  sleeveR1: 0.125,
  sleeveWrinkle: 0.008,
};

const SKIN = {
  sleevePath: [
    [0.74, 0.16, 0.10],
    [0.80, -0.08, 0.08],
    [0.82, -0.34, 0.04],
  ],
  sleeveR0: 0.062,
  sleeveR1: 0.048,
  sleeveCap: 0,
  elbow: 0.005,
  sleeveWrinkle: 0.002,
};

export function buildHoodieBody() {
  const nu = 72;
  const nv = 52;
  return thicken(bodyGrid(HOODIE, nu, nv), nu, nv, HOODIE.thickness);
}

export function buildTeeBody() {
  const nu = 72;
  const nv = 52;
  return thicken(bodyGrid(TEE, nu, nv), nu, nv, TEE.thickness);
}

export function buildHoodieSleeve(side) {
  const nu = 28;
  const nv = 36;
  return thicken(sleeveGrid(side, HOODIE, nu, nv), nu, nv, 0.018);
}

export function buildTeeSleeve(side) {
  const nu = 28;
  const nv = 22;
  return thicken(sleeveGrid(side, TEE, nu, nv), nu, nv, 0.01);
}

export function buildSkinArm(side) {
  const nu = 18;
  const nv = 18;
  return gridToGeometry(sleeveGrid(side, SKIN, nu, nv), nu, nv, true);
}

export function buildHood() {
  const nu = 28;
  const nv = 22;
  return hoodToGeometry(hoodGrid(nu, nv), nu, nv, 0.022);
}

export function buildHoodieHem() {
  return ribBand({ y: -0.72, r0: 0.50, r1: 0.55, h: 0.20, ribs: 32, amp: 0.009 });
}

export function buildHoodieCuff(side) {
  const g = ribBand({ y: 0, r0: 0.118, r1: 0.134, h: 0.15, ribs: 22, amp: 0.008 });
  g.rotateZ(side * 0.10);
  g.rotateX(0.30);
  g.translate(side * 0.86, -0.64, 0.05);
  return g;
}

export function buildCrewNeck() {
  return ribBand({ y: 0.80, r0: 0.20, r1: 0.22, h: 0.055, ribs: 26, amp: 0.004 });
}

export function buildTeeHem() {
  return ribBand({ y: -0.70, r0: 0.39, r1: 0.42, h: 0.05, ribs: 22, amp: 0.003 });
}

export function buildPocket() {
  const geo = new THREE.BoxGeometry(0.42, 0.24, 0.055, 8, 6, 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, pos.getZ(i) + (0.22 - x * x) * 0.08);
    pos.setZ(i, pos.getZ(i) + Math.sin(y * 12) * 0.004);
  }
  geo.computeVertexNormals();
  geo.translate(0, -0.14, 0.38);
  return geo;
}
