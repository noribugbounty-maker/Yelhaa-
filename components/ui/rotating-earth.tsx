"use client";

import { useEffect, useRef } from "react";
import {
  geoContains,
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

import { cn } from "@/lib/utils";

/**
 * RotatingEarth — design decision document §4.5 and §7.3.
 *
 * Kept from the reference: orthographic projection, auto-rotation, drag,
 * device-pixel-ratio handling, graticule.
 *
 * Changed: strictly monochrome (white on `#050505`), land rendered as a
 * field of white/grey points rather than filled shapes, markers passed in by
 * the caller and labelled illustrative in the UI, the `requestAnimationFrame`
 * loop stops when the canvas leaves the viewport, and `prefers-reduced-motion`
 * disables auto-rotation (drag still works). All per-frame values live in
 * refs (§D4). Every listener, observer and frame is released on unmount.
 *
 * The land topology is fetched from `/geo/land-110m.json` so it never
 * enters the JavaScript bundle.
 */

export type EarthMarker = {
  /** [longitude, latitude] in degrees. */
  coordinates: [number, number];
};

export type RotatingEarthProps = {
  markers?: readonly EarthMarker[];
  /** Degrees per second when idle. */
  speed?: number;
  /** Angular spacing of the land dots, in degrees. Larger = fewer dots. */
  dotStep?: number;
  className?: string;
  /** Accessible description; the canvas itself is decorative. */
  label: string;
};

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const LAND_URL = "/geo/land-110m.json";
const HALF_PI = Math.PI / 2;
const DEG = Math.PI / 180;

type LandTopology = Topology<{ land: GeometryCollection }>;

/** Samples a lat/lon grid and keeps the points that fall on land. */
function sampleLand(
  land: GeoPermissibleObjects,
  step: number,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let lat = -58; lat <= 84; lat += step) {
    const lonStep = step / Math.max(0.2, Math.cos(lat * DEG));
    for (let lon = -180; lon < 180; lon += lonStep) {
      const point: [number, number] = [lon, lat];
      if (geoContains(land, point)) points.push(point);
    }
  }
  return points;
}

export function RotatingEarth({
  markers = [],
  speed = 6,
  dotStep = 2.4,
  className,
  label,
}: RotatingEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Everything the frame loop touches.
  const rotation = useRef<[number, number]>([-20, -18]);
  const dragging = useRef(false);
  const lastPointer = useRef<[number, number]>([0, 0]);
  const dots = useRef<Array<[number, number]>>([]);
  const visible = useRef(true);
  const reducedMotion = useRef(false);
  const frame = useRef(0);
  const lastTime = useRef(0);
  const size = useRef(0);
  const dirty = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const projection = geoOrthographic().clipAngle(90);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const center: [number, number] = [0, 0];
    let cancelled = false;

    const motion = window.matchMedia(REDUCE_QUERY);
    reducedMotion.current = motion.matches;
    const onMotion = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
      dirty.current = true;
    };
    motion.addEventListener("change", onMotion);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const side = Math.max(1, Math.floor(Math.min(rect.width, rect.height)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = side;
      canvas.width = side * dpr;
      canvas.height = side * dpr;
      canvas.style.width = `${side}px`;
      canvas.style.height = `${side}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.translate([side / 2, side / 2]).scale(side / 2 - 2);
      dirty.current = true;
    };

    const render = () => {
      const side = size.current;
      if (side === 0) return;
      const [lambda, phi] = rotation.current;
      projection.rotate([lambda, phi]);
      center[0] = -lambda;
      center[1] = -phi;

      ctx.clearRect(0, 0, side, side);

      // Sphere: black disc, white hairline.
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = "#050505";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.stroke();

      // Graticule: barely there.
      ctx.beginPath();
      path(graticule);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.stroke();

      // Land as points. Alpha falls off toward the limb.
      const radius = Math.max(0.9, side / 520);
      const land = dots.current;
      for (let i = 0; i < land.length; i++) {
        const point = land[i];
        if (!point) continue;
        const distance = geoDistance(point, center);
        if (distance >= HALF_PI) continue;
        const projected = projection(point);
        if (!projected) continue;
        const alpha = 0.18 + 0.62 * Math.cos(distance);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(projected[0], projected[1], radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Markers: white point with a thin ring.
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        if (!marker) continue;
        if (geoDistance(marker.coordinates, center) >= HALF_PI - 0.05) continue;
        const projected = projection(marker.coordinates);
        if (!projected) continue;
        ctx.beginPath();
        ctx.arc(projected[0], projected[1], 3, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(projected[0], projected[1], 8, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      frame.current = 0;
      if (cancelled) return;

      const dt = lastTime.current ? Math.min((now - lastTime.current) / 1000, 0.05) : 0;
      lastTime.current = now;

      const rotating = !dragging.current && !reducedMotion.current;
      if (rotating) {
        const r = rotation.current;
        r[0] = (r[0] + speed * dt + 540) % 360 - 180;
        dirty.current = true;
      }

      if (dirty.current) {
        render();
        dirty.current = false;
      }

      if (visible.current && (rotating || dragging.current)) {
        frame.current = requestAnimationFrame(tick);
      } else {
        lastTime.current = 0;
      }
    };

    const start = () => {
      if (frame.current || cancelled) return;
      lastTime.current = 0;
      frame.current = requestAnimationFrame(tick);
    };

    // Pointer drag.
    const onPointerDown = (event: PointerEvent) => {
      dragging.current = true;
      lastPointer.current = [event.clientX, event.clientY];
      canvas.setPointerCapture(event.pointerId);
      start();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current) return;
      const [px, py] = lastPointer.current;
      const dx = event.clientX - px;
      const dy = event.clientY - py;
      lastPointer.current = [event.clientX, event.clientY];
      const sensitivity = 90 / Math.max(1, size.current);
      const r = rotation.current;
      r[0] = (r[0] + dx * sensitivity + 540) % 360 - 180;
      r[1] = Math.max(-75, Math.min(75, r[1] - dy * sensitivity));
      dirty.current = true;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      start();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // Frame loop only while on screen.
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry?.isIntersecting ?? true;
        if (visible.current) start();
      },
      { threshold: 0 },
    );
    intersection.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      start();
    });
    resizeObserver.observe(container);
    resize();

    // Land data: fetched, sampled once, then only read.
    const controller = new AbortController();
    fetch(LAND_URL, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((topology: LandTopology | null) => {
        if (cancelled || !topology) return;
        const land = feature(topology, topology.objects.land);
        // Simplified on small screens (§D7): fewer points, cheaper frames.
        const step = size.current < 420 ? dotStep * 1.6 : dotStep;
        dots.current = sampleLand(land, step);
        dirty.current = true;
        start();
      })
      .catch(() => {
        // Sphere, graticule and markers still render without land dots.
      });

    start();

    return () => {
      cancelled = true;
      controller.abort();
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
      intersection.disconnect();
      resizeObserver.disconnect();
      motion.removeEventListener("change", onMotion);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [dotStep, markers, speed]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      className={cn(
        "relative flex aspect-square w-full items-center justify-center",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="cursor-grab touch-none active:cursor-grabbing"
      />
    </div>
  );
}
