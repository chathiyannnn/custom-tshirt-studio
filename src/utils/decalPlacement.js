/** Map UI offsets (slider px OR world units) into a -1..1 range. */
export function normalizeAxis(v = 0) {
  const n = Number(v) || 0;
  if (Math.abs(n) > 2.5) return Math.max(-1, Math.min(1, n / 150));
  return Math.max(-1, Math.min(1, n));
}

export function meshLocalBounds(mesh) {
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const sx = Math.max(0.02, bb.max.x - bb.min.x);
  const sy = Math.max(0.02, bb.max.y - bb.min.y);
  const sz = Math.max(0.02, bb.max.z - bb.min.z);
  return {
    minX: bb.min.x,
    maxX: bb.max.x,
    minY: bb.min.y,
    maxY: bb.max.y,
    minZ: bb.min.z,
    maxZ: bb.max.z,
    cx: (bb.min.x + bb.max.x) * 0.5,
    cy: (bb.min.y + bb.max.y) * 0.5,
    cz: (bb.min.z + bb.max.z) * 0.5,
    sx,
    sy,
    sz,
  };
}

export function getDecalPose(decal, bounds) {
  const x = normalizeAxis(decal.x);
  const y = normalizeAxis(decal.y);
  const scaleMul = decal.scale || 1;
  const zRot = ((decal.rotation || 0) * Math.PI) / 180;
  const placement = decal.placement || 'front';
  const b = bounds;
  const lift = Math.max(b.sx, b.sy, b.sz) * 0.06;
  const w = b.sx * 0.38 * scaleMul;
  const h = b.sy * 0.28 * scaleMul;
  const depth = Math.max(b.sz * 0.45, lift * 3);

  if (placement === 'back') {
    return {
      position: [b.cx + x * b.sx * 0.28, b.cy + b.sy * 0.08 + y * b.sy * 0.28, b.minZ - lift],
      rotation: [0, Math.PI, zRot],
      scale: [w, h, depth],
    };
  }
  if (placement === 'left') {
    return {
      position: [b.minX - lift, b.cy + y * b.sy * 0.22, b.cz + x * b.sz * 0.18],
      rotation: [0, -Math.PI / 2, zRot],
      scale: [w * 0.55, h * 0.7, depth],
    };
  }
  if (placement === 'right') {
    return {
      position: [b.maxX + lift, b.cy + y * b.sy * 0.22, b.cz + x * b.sz * 0.18],
      rotation: [0, Math.PI / 2, zRot],
      scale: [w * 0.55, h * 0.7, depth],
    };
  }
  return {
    position: [b.cx + x * b.sx * 0.28, b.cy + b.sy * 0.08 + y * b.sy * 0.28, b.maxZ + lift],
    rotation: [0, 0, zRot],
    scale: [w, h, depth],
  };
}

export const TEXTURE_FILENAMES = {
  tshirt: { ytd: 'uppr_diff_000_a_uni.ytd', ydd: 'uppr_000_u.ydd' },
  longsleeve: { ytd: 'uppr_diff_001_a_uni.ytd', ydd: 'uppr_001_u.ydd' },
  hoodie: { ytd: 'uppr_diff_027_a_uni.ytd', ydd: 'uppr_027_u.ydd' },
  zipjacket: { ytd: 'uppr_diff_028_a_uni.ytd', ydd: 'uppr_028_u.ydd' },
  buttonshirt: { ytd: 'uppr_diff_027_a_uni.ytd', ydd: 'uppr_027_u.ydd' },
};
