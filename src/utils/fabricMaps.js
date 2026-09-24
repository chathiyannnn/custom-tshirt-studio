import * as THREE from 'three';

/** Subtle weave + wrinkle normal map so prints sit in the fabric, not on a plastic shell. */
export function makeFabricNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weave = ((x % 4 < 2) ^ (y % 4 < 2)) ? 8 : 0;
      const wrinkle = Math.sin(x * 0.11) * Math.cos(y * 0.07) * 18;
      const n = 128 + weave + wrinkle + (Math.random() * 6 - 3);
      const i = (y * size + x) * 4;
      img.data[i] = n;
      img.data[i + 1] = 255 - n * 0.15;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 12);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

export function makeSkinTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#c9a07a';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(160,110,80,${Math.random() * 0.12})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function shadeHex(hex, light) {
  const c = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  return new THREE.Color().setHSL(hsl.h, Math.min(1, hsl.s * 1.05), Math.max(0.03, Math.min(0.92, light))).getStyle();
}

/**
 * OpenIV-style buffalo check (uppr_diff_027): large red windows, thick black bars,
 * cream pinstripe on the inner edge, yarn weave. Colour picker tints the field only.
 */
export function makeFlannelTexture(hex = '#7a1010') {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const field = hex;
  const black = '#0a0808';
  const barInner = shadeHex(hex, 0.07);
  const cream = '#c9b48a';

  ctx.fillStyle = field;
  ctx.fillRect(0, 0, size, size);

  const cell = 256;
  const bar = 84;
  const pin = 6;

  ctx.fillStyle = black;
  for (let i = 0; i < size; i += cell) {
    ctx.fillRect(i, 0, bar, size);
    ctx.fillRect(0, i, size, bar);
  }

  ctx.fillStyle = barInner;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < size; i += cell) {
    ctx.fillRect(i + bar, 0, 10, size);
    ctx.fillRect(0, i + bar, size, 10);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = cream;
  for (let i = 0; i < size; i += cell) {
    ctx.fillRect(i + bar - pin, 0, pin, size);
    ctx.fillRect(0, i + bar - pin, size, pin);
    ctx.fillRect(i + cell - 4, 0, 3, size);
    ctx.fillRect(0, i + cell - 4, size, 3);
  }

  const weave = ctx.getImageData(0, 0, size, size);
  const d = weave.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const yarn = ((x >> 1) ^ (y >> 1)) & 1 ? 7 : -6;
      const n = ((x * 13 + y * 7) % 5) - 2;
      d[i] = Math.max(0, Math.min(255, d[i] + yarn + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + yarn + n - 1));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + yarn - 2));
    }
  }
  ctx.putImageData(weave, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.15, 2.55);
  tex.anisotropy = 16;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function makeVestTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1c1e22';
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    for (let x = (y % 4 === 0 ? 0 : 1); x < size; x += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Neutral weave — tinted by the garment colour picker, not baked into the map. */
export function makeCottonTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e8e6e2';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let x = 0; x < size; x += 4) {
    for (let y = 0; y < size; y += 4) {
      if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 12);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeRibTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, 64, 128);
  ctx.fillStyle = '#666';
  for (let x = 0; x < 64; x += 4) ctx.fillRect(x, 0, 2, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
