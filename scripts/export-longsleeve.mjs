import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result = null;
    onloadend = null;
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer()).then(buf => {
        this.result = buf;
        this.onloadend?.({ target: this });
      });
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function merge(geos) {
  const pos = [];
  const nrm = [];
  const uv = [];
  const idx = [];
  let off = 0;
  for (const g of geos) {
    g.computeVertexNormals();
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const t = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      nrm.push(n.getX(i), n.getY(i), n.getZ(i));
      uv.push(t ? t.getX(i) : 0, t ? t.getY(i) : 0);
    }
    const index = g.index;
    if (index) {
      for (let i = 0; i < index.count; i++) idx.push(index.getX(i) + off);
    } else {
      for (let i = 0; i < p.count; i++) idx.push(off + i);
    }
    off += p.count;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  out.setIndex(idx);
  out.computeVertexNormals();
  return out;
}

function bodyLathe() {
  const pts = [
    [0.205, -0.34], [0.22, -0.30], [0.228, -0.12], [0.235, 0.02],
    [0.242, 0.10], [0.22, 0.16], [0.12, 0.22], [0.078, 0.245],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, 48);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) * 0.52);
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function sleeve(side) {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(side * 0.22, 0.12, 0.02),
    new THREE.Vector3(side * 0.32, 0.02, 0.05),
    new THREE.Vector3(side * 0.40, -0.12, 0.04),
    new THREE.Vector3(side * 0.44, -0.28, 0.02),
  ]);
  const nv = 28;
  const nu = 16;
  const pos = [];
  const uv = [];
  const idx = [];
  for (let v = 0; v <= nv; v++) {
    const t = v / nv;
    const center = path.getPointAt(t);
    const tangent = path.getTangentAt(t).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    let bin = new THREE.Vector3().crossVectors(up, tangent);
    if (bin.lengthSq() < 1e-6) bin.set(0, 0, 1);
    bin.normalize();
    const nrm = new THREE.Vector3().crossVectors(tangent, bin).normalize();
    const r = 0.09 - t * 0.026;
    for (let u = 0; u < nu; u++) {
      const a = (u / nu) * Math.PI * 2;
      const p = center.clone()
        .addScaledVector(nrm, Math.cos(a) * r)
        .addScaledVector(bin, Math.sin(a) * r);
      pos.push(p.x, p.y, p.z);
      uv.push(u / nu, t);
    }
  }
  for (let v = 0; v < nv; v++) {
    for (let u = 0; u < nu; u++) {
      const a = v * nu + u;
      const b = v * nu + (u + 1) % nu;
      const c = (v + 1) * nu + u;
      const d = (v + 1) * nu + (u + 1) % nu;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const geo = merge([bodyLathe(), sleeve(-1), sleeve(1)]);
const mat = new THREE.MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.82, metalness: 0 });
const mesh = new THREE.Mesh(geo, mat);
mesh.name = 'torso';
const root = new THREE.Group();
root.name = 'LongSleeveTee';
root.add(mesh);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(root, { binary: true });
const out = path.join(__dirname, '../public/models/longsleeve.glb');
fs.writeFileSync(out, Buffer.from(glb));
console.log('wrote', out, fs.statSync(out).size);
