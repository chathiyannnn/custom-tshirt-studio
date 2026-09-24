import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   PRISHIRT — OpenIV Texture Dictionary (.ytd) Generator
   Generates authentic GTA V fabric textures & custom skin mappings
═══════════════════════════════════════════════════════════════════ */

export const OPENIV_TEXTURE_PRESETS = [
  {
    id: 'uppr_diff_027_a',
    name: 'Red/Black Flannel Plaid',
    ytdName: 'uppr_diff_027_a_uni.ytd',
    type: 'plaid',
    primary: '#7a2228',
    secondary: '#1c1c1f',
    accent: '#d4a373',
    vestColor: '#202125',
    tag: 'GTA V Default'
  },
  {
    id: 'uppr_diff_027_b',
    name: 'Navy/White Plaid Flannel',
    ytdName: 'uppr_diff_027_b_uni.ytd',
    type: 'plaid',
    primary: '#1d3557',
    secondary: '#111b27',
    accent: '#f1faee',
    vestColor: '#3a2e26',
    tag: 'Variation B'
  },
  {
    id: 'uppr_diff_027_c',
    name: 'Forest Green Buffalo Check',
    ytdName: 'uppr_diff_027_c_uni.ytd',
    type: 'plaid',
    primary: '#2d4a3e',
    secondary: '#14201a',
    accent: '#e9d8a6',
    vestColor: '#2b2d2f',
    tag: 'Variation C'
  },
  {
    id: 'uppr_diff_027_d',
    name: 'Monochrome Grey Tartan',
    ytdName: 'uppr_diff_027_d_uni.ytd',
    type: 'plaid',
    primary: '#4a4e55',
    secondary: '#1f2023',
    accent: '#e0e0e0',
    vestColor: '#171719',
    tag: 'Variation D'
  },
  {
    id: 'uppr_diff_027_e',
    name: 'Tactical Urban Camo',
    ytdName: 'uppr_diff_027_e_uni.ytd',
    type: 'camo',
    primary: '#3e443e',
    secondary: '#252926',
    accent: '#5a6358',
    vestColor: '#1e211f',
    tag: 'Military Camo'
  },
  {
    id: 'uppr_diff_027_f',
    name: 'Vintage Distressed Denim',
    ytdName: 'uppr_diff_027_f_uni.ytd',
    type: 'denim',
    primary: '#2b4162',
    secondary: '#1e2d42',
    accent: '#7b9bb8',
    vestColor: '#1c1c1f',
    tag: 'Raw Denim'
  },
  {
    id: 'uppr_diff_027_g',
    name: 'Heavyweight Bio Cotton Weave',
    ytdName: 'uppr_diff_027_g_uni.ytd',
    type: 'cotton',
    primary: '#f5f0eb',
    secondary: '#e5ddd3',
    accent: '#b8a694',
    vestColor: '#222327',
    tag: '240 GSM Weave'
  }
];

/* Generate Procedural Fabric Texture Canvas */
export function generateFabricTexture(preset, customImage = null) {
  if (customImage) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    const tex = loader.load(customImage);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (preset.type === 'camo') {
    // Camouflage Texture
    ctx.fillStyle = preset.primary;
    ctx.fillRect(0, 0, 512, 512);

    const colors = [preset.secondary, preset.accent, '#111311', '#4b5548'];
    for (let c of colors) {
      ctx.fillStyle = c;
      for (let i = 0; i < 24; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 24 + Math.random() * 48;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (preset.type === 'denim') {
    // Denim Weave Texture
    ctx.fillStyle = preset.primary;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = preset.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = -512; i < 1024; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
    ctx.strokeStyle = preset.secondary;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 1024; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i - 512, 512);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  } else if (preset.type === 'cotton') {
    // Heavyweight Cotton Pique
    ctx.fillStyle = preset.primary;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = preset.secondary;
    for (let x = 0; x < 512; x += 6) {
      for (let y = 0; y < 512; y += 6) {
        if ((x + y) % 12 === 0) {
          ctx.fillRect(x, y, 3, 3);
        }
      }
    }
  } else {
    // Classic GTA V Plaid Flannel (uppr_diff_027)
    ctx.fillStyle = preset.primary;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = preset.secondary;
    const step = 48;
    for (let i = 0; i < 512; i += step) {
      ctx.fillRect(i, 0, 22, 512);
      ctx.fillRect(0, i, 512, 22);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    for (let i = 0; i < 512; i += step) {
      ctx.fillRect(i + 22, 0, 8, 512);
      ctx.fillRect(0, i + 22, 512, 8);
    }

    ctx.fillStyle = preset.accent;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 512; i += step) {
      ctx.fillRect(i + 11, 0, 2.5, 512);
      ctx.fillRect(0, i + 11, 512, 2.5);
    }
    ctx.globalAlpha = 1.0;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
