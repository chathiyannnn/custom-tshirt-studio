import React, {
  useRef, useEffect, useLayoutEffect, useMemo, Suspense, useState, useCallback,
} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import GarmentModel from './garments/GarmentModel';
import { TEXTURE_FILENAMES } from '../utils/decalPlacement';
import { getGarmentAsset } from '../utils/garmentAssets';
import { exportPrintReadyPNG, downloadDataURL } from '../utils/printExporter';

function CameraSnapper({ angle, version, ctrlRef, focus }) {
  const { camera, invalidate } = useThree();

  useLayoutEffect(() => {
    const center = focus
      ? new THREE.Vector3(focus.cx, focus.cy, focus.cz)
      : new THREE.Vector3(0, 0.05, 0);
    const radius = Math.max(0.9, focus?.radius || 1.2);
    const dist = Math.max(2.4, radius * 2.55);
    const offset = {
      front: new THREE.Vector3(0, 0, dist),
      back: new THREE.Vector3(0, 0, -dist),
      left: new THREE.Vector3(-dist, 0, 0),
      right: new THREE.Vector3(dist, 0, 0),
    }[angle] || new THREE.Vector3(0, 0, dist);
    camera.position.copy(center).add(offset);
    camera.lookAt(center);
    if (ctrlRef.current) {
      ctrlRef.current.target.copy(center);
      ctrlRef.current.minDistance = radius * 0.7;
      ctrlRef.current.maxDistance = Math.max(9, radius * 10);
      ctrlRef.current.update();
    }
    invalidate();
  }, [angle, version, focus, camera, invalidate, ctrlRef]);

  return null;
}

class AssetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Html center>
          <div style={{
            width: 280,
            padding: 12,
            background: 'rgba(18,24,32,0.92)',
            color: '#E6C04A',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 12,
            border: '1px solid rgba(230,192,74,0.35)',
            borderRadius: 8,
            textAlign: 'left',
          }}>
            Could not load garment GLB.
            <div style={{ color: '#c0ccd8', marginTop: 8, lineHeight: 1.45 }}>
              Place <b>tshirt.glb</b> and <b>hoodie.glb</b> in <b>public/models/</b>.
              OpenIV <b>.ydd</b> files must be exported to glTF first.
            </div>
          </div>
        </Html>
      );
    }
    return this.props.children;
  }
}

function DecalDragger({ enabled, activeDecalId, onUpdateXY, side }) {
  const { gl, camera, scene } = useThree();
  const rc = useMemo(() => new THREE.Raycaster(), []);
  const dragging = useRef(false);

  useEffect(() => {
    if (!enabled || !activeDecalId) return;
    const canvas = gl.domElement;

    const pick = (cx, cy) => {
      const rect = canvas.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((cx - rect.left) / rect.width) * 2 - 1,
        -((cy - rect.top) / rect.height) * 2 + 1
      );
      rc.setFromCamera(ndc, camera);
      const root = scene.getObjectByName('garmentRoot');
      const meshes = [];
      (root || scene).traverse(o => {
        if (o.isMesh && o.geometry && !o.isDecal) meshes.push(o);
      });
      const hits = rc.intersectObjects(meshes, true);
      if (hits[0]) {
        const obj = hits[0].object;
        const p = obj.worldToLocal(hits[0].point.clone());
        if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
        const bb = obj.geometry.boundingBox;
        const sx = Math.max(0.02, bb.max.x - bb.min.x);
        const sy = Math.max(0.02, bb.max.y - bb.min.y);
        const cx = (bb.min.x + bb.max.x) * 0.5;
        const cy = (bb.min.y + bb.max.y) * 0.5;
        return {
          x: Math.max(-1, Math.min(1, ((p.x - cx) / (sx * 0.5)) * (side === 'back' ? -1 : 1))) * 150,
          y: Math.max(-1, Math.min(1, (p.y - cy) / (sy * 0.5))) * 150,
        };
      }
      const plane = new THREE.Plane(
        side === 'back' ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 0, 1),
        -0.32
      );
      const hit = new THREE.Vector3();
      rc.ray.intersectPlane(plane, hit);
      return {
        x: Math.max(-0.4, Math.min(0.4, hit.x * (side === 'back' ? -1 : 1))),
        y: Math.max(-0.85, Math.min(0.9, hit.y)),
      };
    };

    const down = e => {
      dragging.current = true;
      const xy = pick(e.clientX, e.clientY);
      onUpdateXY(activeDecalId, xy.x, xy.y);
    };
    const move = e => {
      if (!dragging.current) return;
      const xy = pick(e.clientX, e.clientY);
      onUpdateXY(activeDecalId, xy.x, xy.y);
    };
    const up = () => { dragging.current = false; };

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('mouseleave', up);
    return () => {
      canvas.removeEventListener('mousedown', down);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', up);
      canvas.removeEventListener('mouseleave', up);
    };
  }, [enabled, activeDecalId, onUpdateXY, side, camera, gl, rc, scene]);

  return null;
}

function OpenIVGrid() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(16, 16, 0x4a5668, 0x3a4455);
    g.position.y = -1.18;
    return g;
  }, []);
  return (
    <>
      <primitive object={grid} />
      <mesh position={[0, -1.178, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 0.012]} />
        <meshBasicMaterial color="#cc3333" depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.178, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[24, 0.012]} />
        <meshBasicMaterial color="#33aa33" depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 6, 4]} />
        <meshBasicMaterial color="#33aa33" depthWrite={false} />
      </mesh>
    </>
  );
}

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.95} color="#d5dde6" />
      <directionalLight position={[-3.2, 6, 5]} intensity={1.55} color="#fff6ea" />
      <directionalLight position={[0.2, 2.2, -5]} intensity={0.55} color="#b8c8d8" />
    </>
  );
}

const hudMono = {
  fontFamily: 'Consolas, "Courier New", monospace',
  userSelect: 'none',
};

function Flag({ label, value, onClick, interactive }) {
  return (
    <button
      type="button"
      onClick={interactive ? onClick : undefined}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'right',
        background: 'none',
        border: 'none',
        color: value ? '#E6C04A' : '#6a8494',
        fontSize: '0.65rem',
        lineHeight: 1.65,
        cursor: interactive ? 'pointer' : 'default',
        fontFamily: 'Consolas, monospace',
        padding: 0,
      }}
    >
      {label}: {typeof value === 'boolean' ? (value ? 'True' : 'False') : value}
    </button>
  );
}

function Tshirt3DCanvas({
  shirtColor = '#1A1A1A',
  garmentType = 'tshirt',
  decals = [],
  cameraTargetAngle = 'front',
  snapVersion = 0,
  activeDecalId,
  onUpdateDecalXY,
  onAddTexture,
}) {
  const ctrlRef = useRef(null);
  const fileRef = useRef(null);
  const [mode, setMode] = useState('rotate');
  const wrapRef = useRef(null);
  const [live, setLive] = useState(true);
  const [stats, setStats] = useState({ polygons: 0, vertices: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showGeometry, setShowGeometry] = useState(true);
  const [edgedFaces, setEdgedFaces] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(false);
  const [showLayerList, setShowLayerList] = useState(false);
  const [lod] = useState('High');
  const [focus, setFocus] = useState(null);
  const asset = getGarmentAsset(garmentType);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => {
      setLive(entry.isIntersecting);
    }, { threshold: 0.08, rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleBounds = useCallback(b => {
    if (typeof b.polygons === 'number') {
      setStats({ polygons: b.polygons, vertices: b.vertices || 0 });
    }
    setFocus(prev => {
      const next = { cx: b.center.x, cy: b.center.y, cz: b.center.z, radius: b.radius };
      if (
        prev &&
        Math.abs(prev.cx - next.cx) < 0.02 &&
        Math.abs(prev.cy - next.cy) < 0.02 &&
        Math.abs(prev.cz - next.cz) < 0.02 &&
        Math.abs(prev.radius - next.radius) < 0.02
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const handleXY = useCallback((id, x, y) => {
    onUpdateDecalXY?.(id, x, y);
  }, [onUpdateDecalXY]);

  const activeSide = cameraTargetAngle === 'back' ? 'back' : 'front';
  const files = TEXTURE_FILENAMES[garmentType] || TEXTURE_FILENAMES.tshirt;

  const handleExport = async () => {
    try {
      const front = await exportPrintReadyPNG(decals, 'front');
      const back = await exportPrintReadyPNG(decals, 'back');
      downloadDataURL(front, `prishirt-${garmentType}-front.png`);
      downloadDataURL(back, `prishirt-${garmentType}-back.png`);
    } catch {
      /* keep viewer usable if export fails */
    }
  };

  const onFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onAddTexture?.(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      ref={wrapRef}
      style={{
      width: '100%',
      aspectRatio: '4 / 3',
      minHeight: 460,
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #5a6677 0%, #475060 45%, #363f4e 100%)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.35)',
      cursor: mode === 'design' ? 'crosshair' : 'grab',
      contain: 'layout paint',
      ...hudMono,
    }}>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onFile} />

      <Canvas
        frameloop={live ? 'demand' : 'never'}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.05, 5.35], fov: 38, near: 0.04, far: 80 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          stencil: false,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#4a5464']} />

        <StudioLights />
        <CameraSnapper angle={cameraTargetAngle} version={snapVersion} ctrlRef={ctrlRef} focus={focus} />

        <OrbitControls
          ref={ctrlRef}
          enabled={mode === 'rotate'}
          enableZoom
          enablePan={false}
          enableRotate
          enableDamping={false}
          minPolarAngle={Math.PI * 0.08}
          maxPolarAngle={Math.PI * 0.92}
          rotateSpeed={0.7}
          zoomSpeed={0.55}
          minDistance={0.6}
          maxDistance={40}
          target={[0, 0.05, 0]}
          makeDefault
        />

        <Suspense fallback={<Html center style={{ color: '#E6C04A', fontFamily: 'monospace', fontSize: 12 }}>Loading garment…</Html>}>
          <AssetErrorBoundary resetKey={asset.src}>
            <GarmentModel
              key={`${garmentType}-${asset.src}`}
              garmentType={garmentType}
              color={shirtColor}
              decals={decals}
              showGeometry={showGeometry}
              edgedFaces={edgedFaces}
              displayPoints={displayPoints}
              onBounds={handleBounds}
            />
          </AssetErrorBoundary>

          {showGrid && <OpenIVGrid />}
        </Suspense>

        <DecalDragger
          enabled={mode === 'design'}
          activeDecalId={activeDecalId}
          onUpdateXY={handleXY}
          side={activeSide}
        />
      </Canvas>

      {/* Title bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 22,
        background: 'rgba(22,28,36,0.94)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 10px', fontSize: '0.66rem', color: '#c0ccd8',
        pointerEvents: 'none',
      }}>
        <span>
          <span style={{ color: '#E6C04A', fontWeight: 700 }}>{files.ydd}</span>
          {' '}— OpenIV Model Viewer
        </span>
        <span style={{ color: '#7a8fa0', fontSize: '0.60rem' }}>Geometry | Bounds | Skeleton</span>
      </div>

      {/* Left OpenIV sidebar */}
      <div style={{
        position: 'absolute', top: 22, left: 0, bottom: 0, width: 155,
        background: 'rgba(18,24,32,0.88)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 0',
        userSelect: 'none', pointerEvents: 'none',
        fontSize: '0.64rem',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
          background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <input type="checkbox" checked readOnly style={{ width: 10, height: 10 }} />
          <span style={{ color: '#c0ccd8', fontWeight: 600 }}>Multiple Rendering</span>
        </div>
        <div style={{ padding: '6px 14px', color: '#a0b4c2' }}>{files.ydd.replace('.ydd', '')}</div>
      </div>

      {/* Top-left metrics */}
      <div style={{
        position: 'absolute', top: 28, left: 175,
        pointerEvents: 'none',
      }}>
        <div style={{ color: '#E6C04A', fontSize: '0.72rem', fontWeight: 700 }}>
          Render: on demand
        </div>
        <div style={{ color: '#E6C04A', fontSize: '0.68rem' }}>
          Geometry: {showGeometry ? 'True' : 'False'}
        </div>
        <div style={{ color: '#E6C04A', fontSize: '0.68rem' }}>
          Polygons: {stats.polygons.toLocaleString()}
        </div>
        <div style={{ color: '#E6C04A', fontSize: '0.68rem' }}>
          Vertices: {stats.vertices.toLocaleString()}
        </div>
        <div style={{ color: '#7a9aaa', fontSize: '0.62rem', marginTop: 3 }}>[ Mesh stats ]</div>
      </div>

      <div style={{
        position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
        color: '#E6C04A', fontSize: '0.68rem', pointerEvents: 'none',
      }}>
        Geometry | <span style={{ color: '#6a8494' }}>Bounds</span>
      </div>

      {/* Top-right interactive flags */}
      <div style={{
        position: 'absolute', top: 28, right: 10, textAlign: 'right', zIndex: 8,
      }}>
        <div style={{ color: '#7a9aaa', fontSize: '0.65rem', marginBottom: 4 }}>Click flags to toggle</div>
        <Flag label="Camera mode" value="Around" interactive={false} />
        <Flag label="Show grid" value={showGrid} interactive onClick={() => setShowGrid(v => !v)} />
        <Flag label="Geometry" value={showGeometry} interactive onClick={() => setShowGeometry(v => !v)} />
        <Flag label="Edged Faces" value={edgedFaces} interactive onClick={() => setEdgedFaces(v => !v)} />
        <Flag label="Display Points" value={displayPoints} interactive onClick={() => setDisplayPoints(v => !v)} />
        <Flag label="Level of Detail" value={lod} interactive={false} />
      </div>

      {/* Bottom-right texture panel */}
      <div style={{
        position: 'absolute', bottom: 52, right: 10,
        textAlign: 'right', fontSize: '0.65rem', lineHeight: 1.7, zIndex: 8,
        background: 'rgba(14,18,24,0.55)',
        padding: '8px 10px',
        borderRadius: 8,
        border: '1px solid rgba(230,192,74,0.2)',
        minWidth: 210,
      }}>
        <div style={{ color: '#E6C04A' }}>Using textures:</div>
        <div style={{ color: '#44ff88', fontWeight: 700 }}>{files.ytd} [-]</div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={linkBtn}
        >
          [+] Add texture
        </button>
        <div style={{ color: '#E6C04A' }}>{files.ydd}</div>
        <button type="button" onClick={() => setShowLayerList(v => !v)} style={linkBtn}>
          [ View embedded textures ]
        </button>
        <button type="button" onClick={handleExport} style={linkBtn}>
          [ Export embedded textures ]
        </button>

        {showLayerList && (
          <div style={{
            marginTop: 8, textAlign: 'left',
            maxHeight: 140, overflowY: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 6,
          }}>
            {decals.length === 0 && (
              <div style={{ color: '#7a9aaa' }}>No graphic layers</div>
            )}
            {decals.map((d, i) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <img src={d.url} alt="" style={{ width: 22, height: 22, objectFit: 'cover', borderRadius: 3 }} />
                <span style={{ color: '#c0ccd8' }}>
                  Layer {i + 1} · {d.placement || 'front'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 52, left: 162, pointerEvents: 'none',
      }}>
        <div style={{ fontSize: '3.4rem', fontWeight: 200, color: 'rgba(255,255,255,0.14)', lineHeight: 1 }}>1</div>
        <div style={{ display: 'flex', gap: 8, fontSize: '0.68rem', fontWeight: 700 }}>
          <span style={{ color: '#ff4444' }}>x</span>
          <span style={{ color: '#44cc44' }}>y</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 10,
        left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, zIndex: 20,
      }}>
        <div style={{
          display: 'flex', gap: 5,
          background: 'rgba(14,18,24,0.88)',
          padding: '3px 5px', borderRadius: 999,
          border: '1px solid rgba(230,192,74,0.35)',
        }}>
          {['rotate', 'design'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              style={{
                padding: '5px 14px', borderRadius: 999,
                fontSize: '0.68rem', fontFamily: 'Consolas, monospace',
                fontWeight: 700, letterSpacing: '0.05em',
                border: 'none', cursor: 'pointer',
                background: mode === m ? '#E6C04A' : 'transparent',
                color: mode === m ? '#14181e' : '#E6C04A',
              }}
            >
              {m === 'rotate' ? '🔄 ROTATE' : '✏️ MOVE GRAPHIC'}
            </button>
          ))}
        </div>
        <div style={{
          background: 'rgba(10,14,20,0.72)',
          color: mode === 'design' ? '#E6C04A' : '#8aa0b4',
          padding: '2px 14px', borderRadius: 999,
          fontSize: '0.59rem',
          pointerEvents: 'none',
        }}>
          {mode === 'design'
            ? 'Click & drag to project graphic on the mesh'
            : 'Orbit Around · Scroll to zoom · Tilt freely'}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Tshirt3DCanvas);

const linkBtn = {
  display: 'block',
  width: '100%',
  textAlign: 'right',
  background: 'none',
  border: 'none',
  color: '#E6C04A',
  cursor: 'pointer',
  fontSize: '0.65rem',
  fontFamily: 'Consolas, monospace',
  padding: 0,
  lineHeight: 1.7,
};
