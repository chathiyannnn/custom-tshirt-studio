/**
 * Authored garment meshes. Runtime never edits position arrays.
 *
 * Local files live in /public/models (copied from criticberlin/3D_Clothes_Project, MIT).
 * OpenIV .ydd is not a browser format — export glTF from OpenIV/CodeWalker and
 * drop the file here using the names below.
 */
export const GARMENT_ASSETS = {
  tshirt: {
    src: '/models/tshirt.glb',
    label: 'uppr_000_u.ydd',
  },
  hoodie: {
    src: '/models/hoodie.glb',
    label: 'uppr_027_u.ydd',
  },
  zipjacket: {
    src: '/models/hoodie.glb',
    label: 'uppr_028_u.ydd',
  },
  buttonshirt: {
    src: '/models/hoodie.glb',
    label: 'uppr_027_u.ydd',
  },
  longsleeve: {
    src: '/models/longsleeve.glb',
    label: 'uppr_001_u.ydd',
  },
};

export function getGarmentAsset(garmentType) {
  return GARMENT_ASSETS[garmentType] || GARMENT_ASSETS.tshirt;
}

export function isBrowserMeshUrl(url = '') {
  return /\.(glb|gltf)(\?.*)?$/i.test(url);
}
