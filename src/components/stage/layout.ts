import type { Geometry } from "./scenes";

/** A box in % of the viewport. */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ProjectsLayout {
  geometry: Geometry;
  cells: Rect[];
  frame: Rect;
}

const LINES = 4;

// Pads line positions to the fixed line count; the extras sit hidden on the last
// line so they can split off it when another layout needs them.
function lines(positions: number[]) {
  const padded = [...positions];
  while (padded.length < LINES) padded.push(positions[positions.length - 1]);
  const hidden = padded.map((_, i) => i).filter((i) => i >= positions.length);
  return { positions: padded, hidden };
}

function frameGeometry(xs: number[], ys: number[]): Geometry {
  const v = lines(xs);
  const h = lines(ys);
  const dots: [number, number][] = [];
  xs.forEach((_, vi) => ys.forEach((_, hi) => dots.push([vi, hi])));
  return { v: v.positions, vOff: v.hidden, h: h.positions, hOff: h.hidden, dots };
}

// "L'IA chez Lumee": the Studio lines regroup into three frames, one per point —
// side by side on landscape screens, stacked on portrait ones.
export function aiLayout(portrait: boolean): Geometry {
  return portrait
    ? frameGeometry([6, 94], [40, 56, 72, 88])
    : frameGeometry([6, 35.33, 64.67, 94], [46, 86]);
}

// Landscape screens get 16:10 frames, at most 3 per row. Portrait screens get at
// most 2 per row, with a ratio between 4:5 and 16:10 that best fills the space
// (tall on phones, wider on portrait tablets). Frames keep their ratio and the
// grid is centred in the free area, so the lines always draw clean cells.
export function projectsLayout(count: number, width: number, height: number, open: number | null): ProjectsLayout {
  const portrait = height > width;
  const cols = Math.min(portrait ? 2 : 3, count);
  const rows = Math.ceil(count / cols);
  const area = portrait
    ? { left: 0.05 * width, right: 0.95 * width, top: 0.17 * height, bottom: 0.9 * height }
    : { left: 0.06 * width, right: 0.94 * width, top: 0.2 * height, bottom: 0.88 * height };

  const areaW = area.right - area.left;
  const areaH = area.bottom - area.top;
  const fillRatio = areaW / cols / (areaH / rows);
  const ratio = portrait ? Math.min(Math.max(fillRatio, 4 / 5), 16 / 10) : 16 / 10;
  const cellW = Math.min(areaW / cols, (areaH / rows) * ratio);
  const cellH = cellW / ratio;
  const x0 = area.left + (areaW - cellW * cols) / 2;
  const y0 = area.top + (areaH - cellH * rows) / 2;

  const px = (value: number) => (value / width) * 100;
  const py = (value: number) => (value / height) * 100;

  const cells = Array.from({ length: count }, (_, i) => ({
    x: px(x0 + (i % cols) * cellW),
    y: py(y0 + Math.floor(i / cols) * cellH),
    w: px(cellW),
    h: py(cellH),
  }));

  const frameW = Math.min(portrait ? 0.9 * width : 0.8 * width, (portrait ? 0.66 : 0.68) * height * ratio);
  const frameH = frameW / ratio;
  const frameX = (width - frameW) / 2;
  const frameY = portrait ? area.top + (areaH - frameH) / 2 : 0.53 * height - frameH / 2;
  const frame = { x: px(frameX), y: py(frameY), w: px(frameW), h: py(frameH) };

  const geometry =
    open === null
      ? frameGeometry(
          Array.from({ length: cols + 1 }, (_, c) => px(x0 + c * cellW)),
          Array.from({ length: rows + 1 }, (_, r) => py(y0 + r * cellH)),
        )
      : frameGeometry([frame.x, frame.x + frame.w], [frame.y, frame.y + frame.h]);

  return { geometry, cells, frame };
}
