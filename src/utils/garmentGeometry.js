import * as THREE from 'three';

function squashZ(geometry, factor) {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) * factor);
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Shirt body from OpenIV uppr_027 front/3/4 views:
 * rounded hem, modest shoulders, open neck for the collar.
 */
export function makeOpenIVTorso(segments = 64) {
  const pts = [
    [0.36, -0.74],
    [0.39, -0.66],
    [0.405, -0.42],
    [0.41, -0.18],
    [0.425, 0.08],
    [0.44, 0.32],
    [0.445, 0.52],
    [0.40, 0.66],
    [0.26, 0.80],
    [0.155, 0.88],
    [0.13, 0.92],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  return squashZ(new THREE.LatheGeometry(pts, segments), 0.50);
}

/**
 * Utility vest: shorter than the shirt, open at the front so the placket shows.
 * phi gap sits on +Z (camera front).
 */
export function makeVestGeometry(segments = 56) {
  const pts = [
    [0.40, -0.58],
    [0.44, -0.40],
    [0.455, -0.18],
    [0.46, 0.08],
    [0.455, 0.34],
    [0.44, 0.54],
    [0.36, 0.68],
    [0.20, 0.80],
    [0.14, 0.84],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const gap = 0.28;
  return squashZ(
    new THREE.LatheGeometry(pts, segments, gap / 2, Math.PI * 2 - gap),
    0.44
  );
}

function sleeveControlPoints(side, short) {
  const s = side;
  if (short) {
    return [
      new THREE.Vector3(s * 0.32, 0.62, 0.03),
      new THREE.Vector3(s * 0.48, 0.40, 0.09),
      new THREE.Vector3(s * 0.58, 0.20, 0.11),
    ];
  }
  return [
    new THREE.Vector3(s * 0.32, 0.62, 0.03),
    new THREE.Vector3(s * 0.50, 0.36, 0.11),
    new THREE.Vector3(s * 0.66, 0.06, 0.15),
    new THREE.Vector3(s * 0.74, -0.26, 0.10),
    new THREE.Vector3(s * 0.76, -0.58, 0.03),
  ];
}

/**
 * One skinned-looking sleeve: continuous tube with an elbow kink and a slight taper.
 * Matches OpenIV A-pose (arms down-out, no ball joints, no hands).
 */
function taperTube(curve, tubular, radial, r0, r1, elbowAmt = 0) {
  const geo = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = geo.attributes.position;
  const rings = tubular + 1;
  const vpr = radial + 1;
  for (let i = 0; i < rings; i++) {
    const t = i / tubular;
    const r = r0 + (r1 - r0) * t;
    const elbow = elbowAmt ? Math.exp(-Math.pow((t - 0.40) / 0.10, 2)) * elbowAmt : 0;
    const scale = r + elbow;
    const c = curve.getPointAt(Math.min(1, t));
    for (let j = 0; j < vpr; j++) {
      const idx = i * vpr + j;
      pos.setXYZ(
        idx,
        c.x + (pos.getX(idx) - c.x) * scale,
        c.y + (pos.getY(idx) - c.y) * scale,
        c.z + (pos.getZ(idx) - c.z) * scale
      );
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export function makeBentSleeve(side = 1, { short = false, style } = {}) {
  const s = side;
  const kind = style || (short ? 'teeShort' : 'hoodie');
  let pts;
  let r0;
  let r1;
  let tubular;
  let elbow = 0.008;
  if (kind === 'teeShort') {
    pts = [
      new THREE.Vector3(s * 0.30, 0.66, 0.04),
      new THREE.Vector3(s * 0.48, 0.48, 0.10),
      new THREE.Vector3(s * 0.56, 0.30, 0.12),
    ];
    r0 = 0.128;
    r1 = 0.120;
    tubular = 12;
    elbow = 0;
  } else if (kind === 'teeSkin') {
    pts = [
      new THREE.Vector3(s * 0.54, 0.32, 0.11),
      new THREE.Vector3(s * 0.64, 0.02, 0.12),
      new THREE.Vector3(s * 0.70, -0.38, 0.06),
    ];
    r0 = 0.072;
    r1 = 0.052;
    tubular = 14;
    elbow = 0.004;
  } else {
    pts = [
      new THREE.Vector3(s * 0.36, 0.62, 0.04),
      new THREE.Vector3(s * 0.56, 0.32, 0.13),
      new THREE.Vector3(s * 0.70, 0.00, 0.15),
      new THREE.Vector3(s * 0.78, -0.34, 0.10),
      new THREE.Vector3(s * 0.80, -0.70, 0.03),
    ];
    r0 = 0.148;
    r1 = 0.118;
    tubular = 32;
  }
  return taperTube(new THREE.CatmullRomCurve3(pts), tubular, 18, r0, r1, elbow);
}

export function makeCuffGeometry(side = 1) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.79, -0.58, 0.05),
    new THREE.Vector3(side * 0.81, -0.74, 0.02),
  ]);
  const geo = new THREE.TubeGeometry(curve, 8, 0.128, 16, false);
  geo.computeVertexNormals();
  return geo;
}

function addClothFolds(geometry, amount = 0.01) {
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const fold = Math.sin(x * 16) * Math.sin(y * 6.5) * amount;
    const front = z > 0 ? 1.15 : 0.55;
    const len = Math.hypot(x, z) || 1;
    pos.setX(i, x + (x / len) * fold * front);
    pos.setZ(i, z + (z / len) * fold * front);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/** Fitted crew-neck tee from the OpenIV t-shirt screenshots. */
export function makeTeeTorso() {
  const pts = [
    [0.33, -0.70],
    [0.35, -0.58],
    [0.345, -0.32],
    [0.36, -0.06],
    [0.385, 0.22],
    [0.405, 0.46],
    [0.39, 0.62],
    [0.28, 0.74],
    [0.175, 0.82],
    [0.15, 0.86],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  return addClothFolds(squashZ(new THREE.LatheGeometry(pts, 64), 0.48), 0.011);
}

/** Baggy pullover / zip hoodie body. */
export function makeHoodieTorso({ zip = false } = {}) {
  const pts = [
    [0.44, -0.70],
    [0.49, -0.52],
    [0.51, -0.22],
    [0.525, 0.08],
    [0.53, 0.36],
    [0.51, 0.56],
    [0.42, 0.70],
    [0.26, 0.82],
    [0.16, 0.88],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = zip
    ? new THREE.LatheGeometry(pts, 64, 0.08, Math.PI * 2 - 0.16)
    : new THREE.LatheGeometry(pts, 64);
  return addClothFolds(squashZ(g, 0.66), 0.008);
}

export function makeHoodGeometry() {
  const pts = [
    new THREE.Vector2(0.10, 0.00),
    new THREE.Vector2(0.24, 0.05),
    new THREE.Vector2(0.36, 0.16),
    new THREE.Vector2(0.40, 0.34),
    new THREE.Vector2(0.36, 0.50),
    new THREE.Vector2(0.22, 0.60),
    new THREE.Vector2(0.10, 0.56),
    new THREE.Vector2(0.07, 0.40),
  ];
  return squashZ(new THREE.LatheGeometry(pts, 40, 0.7, Math.PI * 2 - 1.4), 0.95);
}

export function makeVestTorso() {
  return makeVestGeometry();
}

export const OPENIV_POSE = {
  sleeveAngle: 0.55,
  sleeveFwd: 0.12,
  shoulder: [0.32, 0.62, 0.03],
  longLen: 1.28,
  shortLen: 0.46,
  radiusTop: 0.122,
  radiusBot: 0.094,
};

export const GARMENT_PRESETS = {
  tshirt: { id: 'tshirt', sleeveLen: OPENIV_POSE.shortLen, radiusTop: 0.122, radiusBot: 0.112, segmented: false },
  hoodie: { id: 'hoodie', sleeveLen: OPENIV_POSE.longLen, radiusTop: 0.124, radiusBot: 0.096, segmented: true },
  zipjacket: { id: 'zipjacket', sleeveLen: OPENIV_POSE.longLen, radiusTop: 0.122, radiusBot: 0.094, segmented: true },
  buttonshirt: { id: 'buttonshirt', sleeveLen: OPENIV_POSE.longLen, radiusTop: 0.122, radiusBot: 0.094, segmented: true },
};

export function sleevePose(length, side) {
  const s = side === 'left' ? -1 : 1;
  const { sleeveAngle, sleeveFwd, shoulder } = OPENIV_POSE;
  const dir = new THREE.Vector3(
    s * Math.sin(sleeveAngle),
    -Math.cos(sleeveAngle),
    sleeveFwd
  ).normalize();
  const [sx, sy, sz] = shoulder;
  const origin = new THREE.Vector3(s * sx, sy, sz);
  const pos = origin.clone().addScaledVector(dir, length / 2);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().negate()
  );
  const euler = new THREE.Euler().setFromQuaternion(quat);
  const cuff = origin.clone().addScaledVector(dir, length);
  return {
    pos: [pos.x, pos.y, pos.z],
    euler: [euler.x, euler.y, euler.z],
    cuff: [cuff.x, cuff.y, cuff.z],
  };
}
