"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  makePreviewTexture,
  type GalleryPreview,
} from "@/components/ui/preview-texture";
import { cn } from "@/lib/utils";

/**
 * InfiniteGallery — design decision document §4.3 and §7.2.
 *
 * What is kept from the reference: planes recycled along the depth axis,
 * perspective corridor, texture management, hover, depth fade, wheel,
 * keyboard, autoplay.
 *
 * What changes:
 * - every per-frame value (offset, velocity, hover target) lives in a ref,
 *   never in React state (§D4);
 * - `useFrame` allocates nothing — colours and scales are mutated in place;
 * - textures, geometry and materials are disposed explicitly on unmount;
 * - fewer planes and a smaller texture on mobile (§D7);
 * - the render loop stops when the section leaves the viewport;
 * - `prefers-reduced-motion` disables autoplay (interaction still works);
 * - the canvas has a text alternative and carries no essential information.
 *
 * Only horizontal wheel/trackpad deltas (or shift+wheel) drive the gallery:
 * vertical scrolling keeps scrolling the page. No scroll hijacking.
 */

export type InfiniteGalleryProps = {
  previews: readonly GalleryPreview[];
  /** Accessible name of the region. */
  label: string;
  className?: string;
};

const PLANE_W = 3.2;
const PLANE_H = 2;
const SPACING = 2.4;
/** World units per second when idle. */
const AUTOPLAY = 0.45;
const FRICTION = 0.9;
const IDLE_MS = 1400;
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 768px)";

type Input = {
  offset: number;
  velocity: number;
  hovered: number;
  dragging: boolean;
  lastX: number;
  lastInteraction: number;
  reducedMotion: boolean;
};

type PlanesProps = {
  textures: THREE.Texture[];
  input: React.RefObject<Input>;
};

function Planes({ textures, input }: PlanesProps) {
  const count = textures.length;
  const total = count * SPACING;

  const geometry = useMemo(() => new THREE.PlaneGeometry(PLANE_W, PLANE_H), []);
  const materials = useMemo(
    () =>
      textures.map(
        (map) =>
          new THREE.MeshBasicMaterial({
            map,
            transparent: true,
            opacity: 0,
            toneMapped: false,
            depthWrite: false,
          }),
      ),
    [textures],
  );

  const meshes = useRef<Array<THREE.Mesh | null>>([]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      for (const material of materials) material.dispose();
    };
  }, [geometry, materials]);

  useFrame((_, delta) => {
    const state = input.current;
    if (!state) return;
    const dt = Math.min(delta, 0.05);
    const idle =
      !state.dragging && performance.now() - state.lastInteraction > IDLE_MS;

    if (idle && !state.reducedMotion) {
      state.velocity += (AUTOPLAY - state.velocity) * 0.05;
    } else if (!state.dragging) {
      state.velocity *= Math.pow(FRICTION, dt * 60);
      if (Math.abs(state.velocity) < 0.0005) state.velocity = 0;
    }

    state.offset += state.velocity * dt;

    for (let i = 0; i < count; i++) {
      const mesh = meshes.current[i];
      const material = materials[i];
      if (!mesh || !material) continue;

      let depth = (i * SPACING + state.offset) % total;
      if (depth < 0) depth += total;
      // depth 0 = far end of the corridor, `total` = camera.
      const z = depth - total + 0.4;

      const lane = i % 2 === 0 ? -1 : 1;
      mesh.position.set(
        lane * (1.85 + 0.25 * Math.sin(i * 1.7)),
        ((i % 3) - 1) * 0.62,
        z,
      );

      const near = depth / total;
      const fadeIn = THREE.MathUtils.clamp((depth - 0.2) / 3.2, 0, 1);
      const fadeOut = THREE.MathUtils.clamp((-z - 0.9) / 1.8, 0, 1);
      material.opacity = fadeIn * fadeOut;
      material.color.setScalar(0.5 + 0.5 * near);

      const target = state.hovered === i ? 1.06 : 1;
      const s = mesh.scale.x + (target - mesh.scale.x) * 0.12;
      mesh.scale.set(s, s, 1);
      mesh.renderOrder = Math.round(depth * 100);
    }
  });

  return (
    <>
      {materials.map((material, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          geometry={geometry}
          material={material}
          dispose={null}
          onPointerOver={() => {
            const state = input.current;
            if (state) state.hovered = i;
          }}
          onPointerOut={() => {
            const state = input.current;
            if (state && state.hovered === i) state.hovered = -1;
          }}
        />
      ))}
    </>
  );
}

export function InfiniteGallery({
  previews,
  label,
  className,
}: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [mobile, setMobile] = useState<boolean | null>(null);

  const input = useRef<Input>({
    offset: 0,
    velocity: 0,
    hovered: -1,
    dragging: false,
    lastX: 0,
    lastInteraction: 0,
    reducedMotion: false,
  });

  // Viewport class and motion preference — read once, then on change.
  useEffect(() => {
    const motion = window.matchMedia(REDUCE_QUERY);
    const width = window.matchMedia(MOBILE_QUERY);
    input.current.reducedMotion = motion.matches;
    setMobile(width.matches);

    const onMotion = (event: MediaQueryListEvent) => {
      input.current.reducedMotion = event.matches;
    };
    const onWidth = (event: MediaQueryListEvent) => setMobile(event.matches);
    motion.addEventListener("change", onMotion);
    width.addEventListener("change", onWidth);
    return () => {
      motion.removeEventListener("change", onMotion);
      width.removeEventListener("change", onWidth);
    };
  }, []);

  // Stop rendering entirely when the section is off-screen.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry?.isIntersecting ?? true),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Horizontal wheel only, registered non-passive so it can be consumed.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      const horizontal =
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal) return;
      event.preventDefault();
      const delta = event.shiftKey ? event.deltaY : event.deltaX;
      const state = input.current;
      state.velocity += delta * 0.012;
      state.lastInteraction = performance.now();
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, []);

  const visiblePreviews = useMemo(
    () => (mobile ? previews.slice(0, 6) : previews),
    [mobile, previews],
  );

  const textures = useMemo(() => {
    if (mobile === null) return [];
    const width = mobile ? 512 : 1024;
    return visiblePreviews.map((preview) =>
      makePreviewTexture(preview, width),
    );
  }, [mobile, visiblePreviews]);

  useEffect(() => {
    return () => {
      for (const texture of textures) texture.dispose();
    };
  }, [textures]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = input.current;
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastInteraction = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = input.current;
    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    state.lastX = event.clientX;
    state.velocity = dx * 0.35;
    state.lastInteraction = performance.now();
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = input.current;
    if (!state.dragging) return;
    state.dragging = false;
    state.lastInteraction = performance.now();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const state = input.current;
    let impulse = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") impulse = 1.6;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") impulse = -1.6;
    if (impulse === 0) return;
    event.preventDefault();
    state.velocity += impulse;
    state.lastInteraction = performance.now();
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      aria-roledescription="interactive gallery"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        "relative w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-[6px] border border-line bg-void active:cursor-grabbing",
        className,
      )}
    >
      {/* Text alternative: the previews as a list, the interaction as a hint. */}
      <ul className="sr-only">
        {previews.map((preview) => (
          <li key={preview.title}>{preview.title}</li>
        ))}
      </ul>
      <p className="sr-only">
        Use the left and right arrow keys, drag, or scroll horizontally to
        move through the gallery.
      </p>

      {textures.length > 0 ? (
        <Canvas
          flat
          dpr={mobile ? 1 : [1, 1.5]}
          frameloop={active ? "always" : "never"}
          camera={{ position: [0, 0, 0], fov: 58, near: 0.1, far: 80 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          className="!absolute !inset-0"
          aria-hidden="true"
        >
          <Planes textures={textures} input={input} />
        </Canvas>
      ) : null}

      {/* Edge fades — masks, never painted gradients over content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_55%,var(--color-void)_100%)]"
      />
    </div>
  );
}
