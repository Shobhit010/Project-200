'use client';

import { useEffect, useRef } from 'react';
// Named imports only — a namespace import would pull all of three.js into the bundle.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { ACCENTS } from '@/data/categories';
import { EDGES, NODES, mulberry32 } from '@/data/derived';

interface Props {
  /** How many of the 200 nodes have been revealed. */
  revealed: number;
  /** 0 = camera pressed against the origin, 1 = the whole field in frame. */
  zoom: number;
  /** Edge opacity multiplier, 0..1. */
  links: number;
  /** Pauses the render loop when the hero is off screen. */
  active: boolean;
}

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aIndex;
  attribute float aPhase;
  uniform float uRevealed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    float appear = clamp(uRevealed - aIndex, 0.0, 1.0);
    float breathe = 0.85 + 0.15 * sin(uTime * 0.8 + aPhase);
    vAlpha = appear * breathe;

    vec3 pos = position;
    pos.z += sin(uTime * 0.25 + aPhase) * 0.06;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (18.0 / -mv.z) * (0.4 + appear * 0.6);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 3.0);
    gl_FragColor = vec4(vColor * (0.55 + glow * 1.6), vAlpha * glow);
  }
`;

/**
 * The one place in the archive that uses WebGL. 200 points and ~400 line
 * segments live in two buffers with a single draw call each; nothing is
 * allocated per frame.
 */
export function ConstellationGL({ revealed, zoom, links, active }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ revealed, zoom, links });
  targetRef.current = { revealed, zoom, links };
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const mobile = window.matchMedia('(max-width: 767px)').matches;
    const renderer = new WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 100);

    /* ── Points ── */
    const rand = mulberry32(7);
    const count = NODES.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const indices = new Float32Array(count);
    const phases = new Float32Array(count);
    const spread = 6.4;
    const posByDay = new Map<number, [number, number, number]>();

    NODES.forEach((node, i) => {
      const x = node.x * spread;
      const y = node.y * spread * 0.58;
      const z = (node.z - 0.5) * 3.2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      posByDay.set(node.day, [x, y, z]);

      const hex = ACCENTS[node.accent].hex;
      const c = new Color(hex);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 3.4 + rand() * 2.6 + (node.day % 50 === 0 ? 5 : 0);
      // Reveal order follows the day, so the field fills chronologically.
      indices[i] = (node.day - 1) / count;
      phases[i] = rand() * Math.PI * 2;
    });

    const pointsGeo = new BufferGeometry();
    pointsGeo.setAttribute('position', new BufferAttribute(positions, 3));
    pointsGeo.setAttribute('aColor', new BufferAttribute(colors, 3));
    pointsGeo.setAttribute('aSize', new BufferAttribute(sizes, 1));
    pointsGeo.setAttribute('aIndex', new BufferAttribute(indices, 1));
    pointsGeo.setAttribute('aPhase', new BufferAttribute(phases, 1));

    const uniforms = {
      uRevealed: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    };

    const pointsMat = new ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    const points = new Points(pointsGeo, pointsMat);
    scene.add(points);

    /* ── Edges ── */
    const usableEdges = mobile ? EDGES.filter((_, i) => i % 2 === 0) : EDGES;
    const linePositions = new Float32Array(usableEdges.length * 6);
    const lineColors = new Float32Array(usableEdges.length * 6);
    usableEdges.forEach((edge, i) => {
      const a = posByDay.get(edge.a);
      const b = posByDay.get(edge.b);
      if (!a || !b) return;
      linePositions.set(a, i * 6);
      linePositions.set(b, i * 6 + 3);
      const c = new Color(ACCENTS[edge.accent].hex);
      lineColors.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });

    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute('position', new BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new BufferAttribute(lineColors, 3));
    const lineMat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const lines = new LineSegments(lineGeo, lineMat);
    scene.add(lines);

    /* ── Resize ── */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* ── Pointer parallax ── */
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    /* ── Loop ── */
    const smooth = { revealed: 0, zoom: 0, links: 0 };
    let raf = 0;
    let last = performance.now();
    let hidden = document.hidden;
    const onVisibility = () => {
      hidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (hidden || !activeRef.current) return;

      const t = targetRef.current;
      const k = 1 - Math.pow(0.001, dt);
      smooth.revealed += (t.revealed / NODES.length - smooth.revealed) * k;
      smooth.zoom += (t.zoom - smooth.zoom) * k * 0.75;
      smooth.links += (t.links - smooth.links) * k;

      uniforms.uRevealed.value = smooth.revealed + 0.0001;
      uniforms.uTime.value = now / 1000;
      lineMat.opacity = smooth.links * 0.16;

      const dist = 2.2 + (1 - smooth.zoom) * -1.1 + smooth.zoom * 9.4;
      camera.position.set(pointer.x * 0.35 * smooth.zoom, -pointer.y * 0.25 * smooth.zoom, dist);
      camera.lookAt(0, 0, 0);
      points.rotation.z = Math.sin(now / 14000) * 0.05 * smooth.zoom;
      lines.rotation.z = points.rotation.z;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      pointsGeo.dispose();
      pointsMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" aria-hidden />;
}

export default ConstellationGL;
