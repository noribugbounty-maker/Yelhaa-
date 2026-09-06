import * as THREE from "three";

/**
 * PLACEHOLDER — replace before production (design decision document §10.6).
 *
 * The gallery previews do not exist as assets yet. Until they do, each
 * preview is a monochrome wireframe of a web interface drawn on a canvas:
 * never a photograph, never a real product screenshot presented as one.
 * Swapping to real captures means replacing `makePreviewTexture` with a
 * `TextureLoader` call; the gallery itself does not change.
 */

export type PreviewLayout =
  | "landing"
  | "dashboard"
  | "editorial"
  | "mobile"
  | "commerce"
  | "docs";

export type GalleryPreview = {
  /** Read by assistive tech, never drawn on the texture. */
  title: string;
  /** Deterministic variation of block widths. */
  seed: number;
  layout: PreviewLayout;
};

/** Mulberry32 — small, deterministic, good enough for block widths. */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const BG = "#0a0a0a";
const CHROME = "#060606";
const LINE = "rgba(255,255,255,0.10)";
const SURFACE = "rgba(255,255,255,0.05)";
const SURFACE_2 = "rgba(255,255,255,0.09)";
const TEXT = "rgba(255,255,255,0.28)";
const TEXT_STRONG = "rgba(255,255,255,0.72)";

function rect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  r = 0,
) {
  ctx.fillStyle = fill;
  if (r > 0 && typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

function stroke(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r = 0,
) {
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  if (r > 0 && typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, r);
    ctx.stroke();
  } else {
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
}

/** A run of text lines, widths jittered by the seed. */
function lines(
  ctx: CanvasRenderingContext2D,
  random: () => number,
  x: number,
  y: number,
  maxW: number,
  count: number,
  lineH: number,
  gap: number,
  fill = TEXT,
) {
  for (let i = 0; i < count; i++) {
    const w = maxW * (0.55 + random() * 0.45);
    rect(ctx, x, y + i * (lineH + gap), w, lineH, fill, lineH / 2);
  }
}

function browserChrome(ctx: CanvasRenderingContext2D, w: number) {
  rect(ctx, 0, 0, w, 44, CHROME);
  ctx.fillStyle = LINE;
  ctx.fillRect(0, 44, w, 1);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(22 + i * 18, 22, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = SURFACE_2;
    ctx.fill();
  }
  rect(ctx, w * 0.3, 14, w * 0.4, 16, SURFACE, 8);
}

function drawLanding(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  browserChrome(ctx, w);
  // nav
  rect(ctx, 48, 68, 64, 10, TEXT_STRONG, 5);
  for (let i = 0; i < 4; i++) rect(ctx, w * 0.42 + i * 62, 68, 40, 8, TEXT, 4);
  rect(ctx, w - 140, 62, 92, 22, TEXT_STRONG, 4);
  // hero copy
  const top = h * 0.24;
  rect(ctx, 48, top, w * 0.46 * (0.8 + r() * 0.2), 30, TEXT_STRONG, 6);
  rect(ctx, 48, top + 42, w * 0.38 * (0.7 + r() * 0.3), 30, TEXT_STRONG, 6);
  lines(ctx, r, 48, top + 96, w * 0.36, 3, 9, 8);
  rect(ctx, 48, top + 160, 110, 30, TEXT_STRONG, 4);
  stroke(ctx, 170, top + 160, 110, 30, 4);
  // hero visual
  const vx = w * 0.56;
  rect(ctx, vx, top - 8, w - vx - 48, h - top - 40, SURFACE, 6);
  stroke(ctx, vx, top - 8, w - vx - 48, h - top - 40, 6);
  lines(ctx, r, vx + 22, top + 18, w - vx - 96, 6, 8, 12);
}

function drawDashboard(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  browserChrome(ctx, w);
  const side = 180;
  rect(ctx, 0, 45, side, h - 45, CHROME);
  ctx.fillStyle = LINE;
  ctx.fillRect(side, 45, 1, h - 45);
  rect(ctx, 24, 70, 90, 10, TEXT_STRONG, 5);
  lines(ctx, r, 24, 110, 120, 8, 8, 18);
  // stats
  const gx = side + 32;
  const cw = (w - gx - 32 - 3 * 16) / 4;
  for (let i = 0; i < 4; i++) {
    const x = gx + i * (cw + 16);
    rect(ctx, x, 72, cw, 84, SURFACE, 6);
    stroke(ctx, x, 72, cw, 84, 6);
    rect(ctx, x + 16, 88, cw * 0.5, 7, TEXT, 3);
    rect(ctx, x + 16, 112, cw * (0.35 + r() * 0.3), 20, TEXT_STRONG, 4);
  }
  // chart
  const cy = 180;
  const ch = h - cy - 32;
  rect(ctx, gx, cy, w - gx - 32, ch, SURFACE, 6);
  stroke(ctx, gx, cy, w - gx - 32, ch, 6);
  const bars = 28;
  const bw = (w - gx - 32 - 48) / bars;
  for (let i = 0; i < bars; i++) {
    const bh = ch * (0.15 + r() * 0.6);
    rect(ctx, gx + 24 + i * bw, cy + ch - 20 - bh, bw * 0.55, bh, SURFACE_2, 2);
  }
  ctx.strokeStyle = TEXT_STRONG;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i <= bars; i++) {
    const x = gx + 24 + i * bw;
    const y = cy + ch - 30 - ch * (0.25 + r() * 0.45);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawEditorial(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  browserChrome(ctx, w);
  const cx = w * 0.22;
  const cw = w * 0.56;
  rect(ctx, cx, 72, 60, 8, TEXT, 4);
  rect(ctx, cx, 96, cw * 0.9, 34, TEXT_STRONG, 6);
  rect(ctx, cx, 140, cw * (0.5 + r() * 0.3), 34, TEXT_STRONG, 6);
  rect(ctx, cx, 198, cw, h * 0.34, SURFACE, 6);
  stroke(ctx, cx, 198, cw, h * 0.34, 6);
  lines(ctx, r, cx, 198 + h * 0.34 + 24, cw, 9, 8, 10);
}

function drawMobile(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  const pw = w * 0.2;
  const ph = h * 0.82;
  for (let i = 0; i < 3; i++) {
    const x = w * 0.17 + i * (pw + w * 0.04);
    const y = (h - ph) / 2 + (i === 1 ? -h * 0.03 : h * 0.03);
    rect(ctx, x, y, pw, ph, CHROME, 22);
    stroke(ctx, x, y, pw, ph, 22);
    rect(ctx, x + pw * 0.32, y + 14, pw * 0.36, 7, SURFACE_2, 4);
    rect(ctx, x + 18, y + 44, pw * 0.5, 12, TEXT_STRONG, 5);
    lines(ctx, r, x + 18, y + 70, pw - 36, 3, 6, 8);
    const cards = 3;
    for (let c = 0; c < cards; c++) {
      const cy = y + 120 + c * ((ph - 190) / cards);
      rect(ctx, x + 18, cy, pw - 36, (ph - 190) / cards - 12, SURFACE, 6);
      stroke(ctx, x + 18, cy, pw - 36, (ph - 190) / cards - 12, 6);
    }
    rect(ctx, x + 18, y + ph - 52, pw - 36, 30, TEXT_STRONG, 6);
  }
}

function drawCommerce(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  browserChrome(ctx, w);
  rect(ctx, 48, 68, 80, 10, TEXT_STRONG, 5);
  for (let i = 0; i < 5; i++) rect(ctx, 200 + i * 70, 69, 44, 8, TEXT, 4);
  const cols = 4;
  const gap = 20;
  const cw = (w - 96 - (cols - 1) * gap) / cols;
  const chh = (h - 130) / 2 - gap;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 48 + col * (cw + gap);
      const y = 104 + row * (chh + gap);
      rect(ctx, x, y, cw, chh * 0.66, SURFACE, 6);
      stroke(ctx, x, y, cw, chh * 0.66, 6);
      rect(ctx, x, y + chh * 0.66 + 12, cw * (0.5 + r() * 0.4), 8, TEXT, 4);
      rect(ctx, x, y + chh * 0.66 + 30, cw * 0.3, 8, TEXT_STRONG, 4);
    }
  }
}

function drawDocs(
  ctx: CanvasRenderingContext2D,
  r: () => number,
  w: number,
  h: number,
) {
  browserChrome(ctx, w);
  const side = 200;
  ctx.fillStyle = LINE;
  ctx.fillRect(side, 45, 1, h - 45);
  for (let i = 0; i < 12; i++) {
    rect(ctx, 32, 76 + i * 30, side * (0.35 + r() * 0.4), 7, i % 4 === 0 ? TEXT_STRONG : TEXT, 3);
  }
  const cx = side + 56;
  rect(ctx, cx, 76, 60, 8, TEXT, 4);
  rect(ctx, cx, 100, w * 0.4, 26, TEXT_STRONG, 6);
  lines(ctx, r, cx, 150, w - cx - 220, 5, 8, 10);
  const code = 250;
  rect(ctx, cx, code, w - cx - 220, h - code - 40, CHROME, 6);
  stroke(ctx, cx, code, w - cx - 220, h - code - 40, 6);
  for (let i = 0; i < 9; i++) {
    const indent = (i % 3) * 22;
    rect(ctx, cx + 20 + indent, code + 20 + i * 20, (w - cx - 300 - indent) * (0.3 + r() * 0.5), 7, i % 2 ? TEXT : TEXT_STRONG, 3);
  }
  // right rail
  for (let i = 0; i < 6; i++) rect(ctx, w - 170, 100 + i * 24, 110 * (0.5 + r() * 0.5), 6, TEXT, 3);
}

const DRAW: Record<
  PreviewLayout,
  (ctx: CanvasRenderingContext2D, r: () => number, w: number, h: number) => void
> = {
  landing: drawLanding,
  dashboard: drawDashboard,
  editorial: drawEditorial,
  mobile: drawMobile,
  commerce: drawCommerce,
  docs: drawDocs,
};

/**
 * Draws one preview and wraps it in a `CanvasTexture`. The caller owns the
 * texture and must `dispose()` it on unmount.
 */
export function makePreviewTexture(
  preview: GalleryPreview,
  width: number,
): THREE.Texture {
  const height = Math.round(width * 0.625);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Drawing routines are authored at 1024px; scale for other resolutions.
    const scale = width / 1024;
    ctx.scale(scale, scale);
    const w = 1024;
    const h = 640;
    rect(ctx, 0, 0, w, h, BG);
    DRAW[preview.layout](ctx, rng(preview.seed), w, h);
    // hairline frame
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
