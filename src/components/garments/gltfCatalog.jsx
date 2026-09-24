import React, { useLayoutEffect, useMemo, useState } from 'react';
import { createPortal, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Decal } from '@react-three/drei';
import { getDecalPose, meshLocalBounds } from '../../utils/decalPlacement';
import { GARMENT_ASSETS, getGarmentAsset, isBrowserMeshUrl } from '../../utils/garmentAssets';

/** @deprecated use GARMENT_ASSETS — kept so existing imports keep working */
export const GLB_URLS = {
  tshirt: GARMENT_ASSETS.tshirt.src,
  longsleeve: GARMENT_ASSETS.longsleeve.src,
  hoodie: GARMENT_ASSETS.hoodie.src,
  zipjacket: GARMENT_ASSETS.zipjacket.src,
  buttonshirt: GARMENT_ASSETS.buttonshirt.src,
};

const texCache = {};

function useDecalTexture(url) {
  const [tex, setTex] = useState(url ? texCache[url] || null : null);
  React.useEffect(() => {
    if (!url) return;
    if (texCache[url]) {
      setTex(texCache[url]);
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      url,
      t => {
        t.colorSpace = THREE.SRGBColorSpace;
        texCache[url] = t;
        setTex(t);
      },
      undefined,
      () => setTex(null)
    );
  }, [url]);
  return tex;
}

function ProjectedDecal({ decal, bounds }) {
  const map = useDecalTexture(decal.url);
  if (!map || !bounds) return null;
  const pose = getDecalPose(decal, bounds);
  return (
    <Decal
      position={pose.position}
      rotation={pose.rotation}
      scale={pose.scale}
      map={map}
      depthTest
      polygonOffsetFactor={-12}
    >
      <meshBasicMaterial
        map={map}
        transparent
        opacity={decal.opacity ?? 1}
        polygonOffset
        polygonOffsetFactor={-12}
        depthWrite={false}
        toneMapped={false}
      />
    </Decal>
  );
}

function tagMeshes(root) {
  const meshes = [];
  root.traverse(obj => {
    if (obj.isMesh && obj.geometry) meshes.push(obj);
  });
  meshes.sort((a, b) => (b.geometry.attributes.position?.count || 0) - (a.geometry.attributes.position?.count || 0));
  if (meshes[0] && !meshes[0].name) meshes[0].name = 'torso';
  if (meshes[0]) meshes[0].userData.decalTarget = 'torso';

  meshes.forEach(mesh => {
    const box = new THREE.Box3().setFromObject(mesh);
    const c = box.getCenter(new THREE.Vector3());
    const n = (mesh.name || '').toLowerCase();
    if (n.includes('left') && n.includes('sleeve')) mesh.userData.decalTarget = 'leftSleeve';
    else if (n.includes('right') && n.includes('sleeve')) mesh.userData.decalTarget = 'rightSleeve';
    else if (c.x < -0.12 && meshes.length > 1) mesh.userData.decalTarget = 'leftSleeve';
    else if (c.x > 0.12 && meshes.length > 1) mesh.userData.decalTarget = 'rightSleeve';
  });
  return meshes;
}

function tintMaterial(source, color) {
  const copy = source.clone();
  copy.shadowSide = THREE.FrontSide;
  if (copy.color && color) copy.color.set(color);
  if ('sheenColor' in copy && copy.sheenColor && color) copy.sheenColor.set(color);
  if ('envMapIntensity' in copy) copy.envMapIntensity = 0;
  if ('metalness' in copy) copy.metalness = Math.min(copy.metalness ?? 0, 0.08);
  return copy;
}

function prepareClone(scene, color) {
  const cloned = cloneSkinned(scene);
  cloned.traverse(obj => {
    if (!obj.isMesh) return;
    obj.castShadow = false;
    obj.receiveShadow = false;
    obj.frustumCulled = true;
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      const next = mats.map(m => tintMaterial(m, color));
      obj.material = Array.isArray(obj.material) ? next : next[0];
    }
  });
  tagMeshes(cloned);
  return cloned;
}

export function TintedGltf({
  src,
  color,
  decals = [],
  garmentType = 'tshirt',
  edgedFaces = false,
  displayPoints = false,
  onBounds,
}) {
  const { scene } = useGLTF(src, false);
  const cloned = useMemo(() => prepareClone(scene, color), [scene, color]);
  const { invalidate } = useThree();

  useLayoutEffect(() => {
    let polygons = 0;
    let vertices = 0;
    cloned.traverse(obj => {
      if (!obj.isMesh || !obj.geometry) return;
      const g = obj.geometry;
      const v = g.attributes.position?.count || 0;
      vertices += v;
      polygons += g.index ? g.index.count / 3 : v / 3;
    });
    const box = new THREE.Box3().setFromObject(cloned);
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const radius = Math.max(size.x, size.y, size.z) * 0.5;
      onBounds?.({
        center,
        radius,
        size,
        polygons: Math.round(polygons),
        vertices: Math.round(vertices),
      });
    }
    invalidate();
  }, [cloned, onBounds, invalidate, decals, edgedFaces, displayPoints]);

  const meshes = useMemo(() => {
    const list = [];
    cloned.traverse(obj => {
      if (obj.isMesh) list.push(obj);
    });
    list.sort((a, b) => (b.geometry.attributes.position?.count || 0) - (a.geometry.attributes.position?.count || 0));
    return list;
  }, [cloned]);

  const printMesh = meshes[0];

  return (
    <group name="garmentRoot">
      <primitive object={cloned} />
      {printMesh && (decals.length > 0 || edgedFaces || displayPoints) && createPortal(
        <>
          {decals.map(d => (
            <ProjectedDecal key={d.id} decal={d} bounds={meshLocalBounds(printMesh)} />
          ))}
          {edgedFaces && (
            <lineSegments>
              <wireframeGeometry args={[printMesh.geometry]} />
              <lineBasicMaterial color="#E6C04A" transparent opacity={0.35} />
            </lineSegments>
          )}
          {displayPoints && (
            <points geometry={printMesh.geometry}>
              <pointsMaterial color="#44ff88" size={0.01} sizeAttenuation />
            </points>
          )}
        </>,
        printMesh
      )}
    </group>
  );
}

export function AssetGarment({
  garmentType,
  color,
  decals,
  showGeometry = true,
  edgedFaces = false,
  displayPoints = false,
  onBounds,
}) {
  const asset = getGarmentAsset(garmentType);
  if (!showGeometry) return null;
  if (!isBrowserMeshUrl(asset.src)) {
    return null;
  }
  return (
    <TintedGltf
      src={asset.src}
      color={color}
      decals={decals}
      garmentType={garmentType}
      edgedFaces={edgedFaces}
      displayPoints={displayPoints}
      onBounds={onBounds}
    />
  );
}

useGLTF.preload(GARMENT_ASSETS.tshirt.src, false);
