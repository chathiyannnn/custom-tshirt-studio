import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  makeBentSleeve,
  makeCuffGeometry,
  makeOpenIVTorso,
  makeVestGeometry,
} from '../../utils/garmentGeometry';

function Cloth({ map, color = '#ffffff', shininess = 5 }) {
  return (
    <meshPhongMaterial
      map={map || null}
      color={color}
      shininess={shininess}
      specular="#111111"
      side={THREE.DoubleSide}
    />
  );
}

/** Continuous bent sleeve — cloth only, OpenIV A-pose. */
export function OpenIVSleeve({
  side = 'right',
  map,
  color = '#ffffff',
  short = false,
  style,
  cuffColor = '#1a0a0a',
  showCuff = true,
}) {
  const s = side === 'left' ? -1 : 1;
  const kind = style || (short ? 'teeShort' : 'hoodie');
  const sleeveGeo = useMemo(() => makeBentSleeve(s, { style: kind }), [s, kind]);
  const cuffGeo = useMemo(
    () => (showCuff && kind === 'hoodie' ? makeCuffGeometry(s) : null),
    [s, showCuff, kind]
  );
  const name = side === 'left' ? 'leftSleeve' : 'rightSleeve';

  return (
    <group>
      <mesh name={name} geometry={sleeveGeo} castShadow receiveShadow>
        <Cloth map={map} color={color} />
      </mesh>
      {cuffGeo && (
        <mesh geometry={cuffGeo} castShadow>
          <meshPhongMaterial color={cuffColor} shininess={4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export function OpenIVCollar({ map, color }) {
  return (
    <group>
      <mesh position={[0, 0.86, 0.02]} rotation={[0.12, 0, 0]}>
        <cylinderGeometry args={[0.145, 0.175, 0.085, 28, 1, true]} />
        <Cloth map={map} color={color} />
      </mesh>
      <mesh position={[0.09, 0.90, 0.12]} rotation={[0.72, 0.38, 0.08]} castShadow>
        <boxGeometry args={[0.16, 0.09, 0.01]} />
        <Cloth map={map} color={color} />
      </mesh>
      <mesh position={[-0.09, 0.90, 0.12]} rotation={[0.72, -0.38, -0.08]} castShadow>
        <boxGeometry args={[0.16, 0.09, 0.01]} />
        <Cloth map={map} color={color} />
      </mesh>
    </group>
  );
}

export function OpenIVPlacket() {
  return (
    <group>
      <mesh position={[0, 0.12, 0.225]} castShadow>
        <boxGeometry args={[0.042, 1.18, 0.01]} />
        <meshPhongMaterial color="#3a1010" shininess={4} />
      </mesh>
      {[-0.32, -0.12, 0.08, 0.28, 0.48].map((y, i) => (
        <mesh key={i} position={[0, y, 0.232]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.006, 10]} />
          <meshPhongMaterial color="#e8e0d4" shininess={28} specular="#888" />
        </mesh>
      ))}
    </group>
  );
}

function VestPocket({ position, rotation, wide = false }) {
  const w = wide ? 0.175 : 0.132;
  const h = wide ? 0.175 : 0.145;
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w, h, 0.022]} />
        <meshPhongMaterial color="#1a1d20" shininess={3} />
      </mesh>
      <mesh position={[0, h * 0.42, 0.004]}>
        <boxGeometry args={[w + 0.008, 0.038, 0.012]} />
        <meshPhongMaterial color="#141618" shininess={3} />
      </mesh>
    </group>
  );
}

export function OpenIVVest({ map, color = '#1c1f22' }) {
  const geo = useMemo(() => makeVestGeometry(), []);
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhongMaterial
          map={map || null}
          color={color}
          shininess={3}
          specular="#0a0a0a"
          side={THREE.DoubleSide}
        />
      </mesh>
      <VestPocket position={[-0.15, 0.34, 0.235]} rotation={[0.04, -0.12, 0]} />
      <VestPocket position={[0.15, 0.34, 0.235]} rotation={[0.04, 0.12, 0]} />
      <VestPocket position={[-0.17, -0.14, 0.24]} rotation={[0.02, -0.08, 0]} wide />
      <VestPocket position={[0.17, -0.14, 0.24]} rotation={[0.02, 0.08, 0]} wide />
      {[-1, 1].map(side => (
        <mesh
          key={side}
          position={[side * 0.34, 0.70, 0.04]}
          rotation={[0.18, side * 0.45, 0]}
          castShadow
        >
          <boxGeometry args={[0.13, 0.07, 0.04]} />
          <meshPhongMaterial color="#181b1e" shininess={3} />
        </mesh>
      ))}
    </group>
  );
}

export function OpenIVTorsoMesh({ map, color, children }) {
  const geo = useMemo(() => makeOpenIVTorso(), []);
  return (
    <mesh name="torso" geometry={geo} castShadow receiveShadow>
      <Cloth map={map} color={color} />
      {children}
    </mesh>
  );
}

export { Cloth };
