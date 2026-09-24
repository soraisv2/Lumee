export type SceneId = "index" | "studio" | "projets" | "contact";

/**
 * Line layout of a scene. Every scene uses the same number of lines (4 vertical,
 * 4 horizontal) so changing scene moves lines instead of remounting them.
 */
export interface Geometry {
  /** Vertical line positions, in % of viewport width. */
  v: number[];
  /** Horizontal line positions, in % of viewport height. */
  h: number[];
  /** Indexes of lines that fade out; parking them on a visible line makes them split off it later. */
  vOff?: number[];
  hOff?: number[];
  /** Intersections marked with a dot, as [vertical index, horizontal index]. */
  dots: [number, number][];
}

export interface Scene extends Geometry {
  id: SceneId;
  path: string;
  label: string;
}

export const scenes: Scene[] = [
  {
    id: "index",
    path: "/",
    label: "Index",
    v: [36, 36, 36, 36],
    vOff: [1, 2, 3],
    h: [74, 74, 74, 74],
    hOff: [1, 2, 3],
    dots: [[0, 0]],
  },
  {
    id: "studio",
    path: "/studio",
    label: "Studio",
    v: [6, 11, 67, 92],
    h: [58, 88, 88, 88],
    hOff: [2, 3],
    dots: [
      [0, 0], [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1], [3, 1],
    ],
  },
  {
    // Lines come from projectsLayout(), which adapts the grid to the viewport.
    id: "projets",
    path: "/projets",
    label: "Projets",
    v: [50, 50, 50, 50],
    h: [50, 50, 50, 50],
    dots: [],
  },
  {
    id: "contact",
    path: "/contact",
    label: "Contact",
    v: [6, 50, 50, 94],
    vOff: [2],
    h: [46, 88, 88, 88],
    hOff: [2, 3],
    dots: [
      [0, 0], [3, 0],
      [0, 1], [1, 1], [3, 1],
    ],
  },
];
