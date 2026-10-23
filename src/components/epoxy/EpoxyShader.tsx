"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  MirroredRepeatWrapping,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  type Texture,
} from "three";
import { EPOXY_FRAG, EPOXY_VERT } from "./glsl";
import { FINISH_WEIGHTS, type Finish } from "./finishes";

/*
  Liquid metallic-epoxy surface. Loaded with next/dynamic (ssr: false) only
  when the section nears the viewport, so three.js never ships on first load.

  - progressRef (0..1, written by the section's ScrollTrigger) drives the flow,
    which settles into a mirror finish as it reaches 1.
  - The cursor moves the specular highlight and drops gentle ripples.
  - Finish changes crossfade texture weights; Flake "broadcasts" its chips.
  - Stops rendering when off-screen or when the tab is hidden.
*/

type Props = {
  finish: Finish;
  progressRef: RefObject<number>;
  pointerTarget?: RefObject<HTMLElement | null>;
  label: string;
  onReady?: () => void;
  onFail?: () => void;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function EpoxyShader({ finish, progressRef, pointerTarget, label, onReady, onFail }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finishRef = useRef<Finish>(finish);
  const cbs = useRef({ onReady, onFail });

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  useEffect(() => {
    cbs.current = { onReady, onFail };
  }, [onReady, onFail]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      cbs.current.onFail?.();
      return;
    }
    renderer.outputColorSpace = LinearSRGBColorSpace;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const loader = new TextureLoader();
    let loaded = 0;
    const textures: Texture[] = [];
    const tex = (url: string, mirror = false) => {
      const t = loader.load(url, () => {
        loaded++;
      });
      t.colorSpace = NoColorSpace;
      t.wrapS = t.wrapT = mirror ? MirroredRepeatWrapping : RepeatWrapping;
      t.minFilter = LinearMipmapLinearFilter;
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      textures.push(t);
      return t;
    };

    const [w0, w1, w2] = FINISH_WEIGHTS[finishRef.current];
    const uniforms = {
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uSettle: { value: 0 },
      uFlakeT: { value: 1 },
      uAspect: { value: 1 },
      uResY: { value: 1 },
      uMouse: { value: new Vector2(0.64, 0.72) },
      uW: { value: new Vector3(w0, w1, w2) },
      uRipples: { value: Array.from({ length: 8 }, () => new Vector4(0, 0, 0, 0)) },
      uMetal: { value: tex("/textures/e3-metallic.jpg", true) },
      uSolid: { value: tex("/textures/e1-solid.jpg") },
      uFlake: { value: tex("/textures/e2-flake.jpg") },
    };

    const geometry = new PlaneGeometry(2, 2);
    const material = new ShaderMaterial({ vertexShader: EPOXY_VERT, fragmentShader: EPOXY_FRAG, uniforms });
    scene.add(new Mesh(geometry, material));

    const resize = () => {
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
      uniforms.uResY.value = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // pointer: highlight + ripples
    const mouseTarget = new Vector2(0.64, 0.72);
    let ripIdx = 0;
    let lastRip = { x: -1, y: -1, t: 0 };
    const target = pointerTarget?.current ?? canvas;
    const toUv = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    };
    const drop = (x: number, y: number, s: number) => {
      uniforms.uRipples.value[ripIdx].set(x, y, 0, s);
      ripIdx = (ripIdx + 1) % 8;
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toUv(e);
      mouseTarget.set(x, y);
      const now = performance.now();
      if (Math.hypot(x - lastRip.x, y - lastRip.y) > 0.035 && now - lastRip.t > 80) {
        drop(x, y, 0.9);
        lastRip = { x, y, t: now };
      }
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = toUv(e);
      drop(x, y, 1.6);
    };
    const onLeave = () => mouseTarget.set(0.64, 0.72);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerdown", onDown);
    target.addEventListener("pointerleave", onLeave);

    // render loop, paused off-screen / hidden
    let raf = 0;
    let running = false;
    let onScreen = true;
    let last = performance.now();
    let flow = 0;
    let settle = 0;
    let flakeT = 1;
    let lastFinish = finishRef.current;
    let announced = false;
    const wTarget = new Vector3();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-dt * 5);

      uniforms.uTime.value += dt;
      const p = progressRef.current ?? 0;
      flow += (p - flow) * k;
      settle += (smooth(0.3, 0.92, p) - settle) * k;
      uniforms.uFlow.value = flow;
      uniforms.uSettle.value = settle;
      uniforms.uMouse.value.lerp(mouseTarget, 1 - Math.exp(-dt * 6));

      const f = finishRef.current;
      if (f !== lastFinish) {
        if (f === "flake") flakeT = 0;
        lastFinish = f;
      }
      flakeT = Math.min(1, flakeT + dt / 1.2);
      uniforms.uFlakeT.value = flakeT;
      const [a, b, c] = FINISH_WEIGHTS[f];
      uniforms.uW.value.lerp(wTarget.set(a, b, c), 1 - Math.exp(-dt * 4));

      for (const r of uniforms.uRipples.value) {
        if (r.w > 0) {
          r.z += dt;
          if (r.z > 3) r.w = 0;
        }
      }

      renderer.render(scene, camera);
      if (!announced && loaded >= 3) {
        announced = true;
        cbs.current.onReady?.();
      }
    };

    const update = () => {
      const should = onScreen && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      update();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", update);
    update();

    const onLost = (e: Event) => {
      e.preventDefault();
      cbs.current.onFail?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", update);
      canvas.removeEventListener("webglcontextlost", onLost);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointerleave", onLeave);
      textures.forEach((t) => t.dispose());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [progressRef, pointerTarget]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className="block h-full w-full" />;
}
