export type SceneId = "index" | "studio" | "projets" | "contact";

export interface Scene {
  id: SceneId;
  path: string;
  label: string;
  /** Vertical line positions, in % of viewport width. Always 4 so lines morph instead of remounting. */
  v: [number, number, number, number];
  /** Horizontal line positions, in % of viewport height. */
  h: [number, number];
  /** Indexes of lines that fade out in this scene; parking them on a visible line makes them split off it later. */
  vOff?: number[];
  hOff?: number[];
  /** Intersections marked with a dot, as [vertical index, horizontal index]. */
  dots: [number, number][];
}

export const scenes: Scene[] = [
  {
    id: "index",
    path: "/",
    label: "Index",
    v: [36, 36, 36, 36],
    vOff: [1, 2, 3],
    h: [74, 74],
    hOff: [1],
    dots: [[0, 0]],
  },
  {
    id: "studio",
    path: "/studio",
    label: "Studio",
    v: [6, 11, 67, 92],
    h: [58, 88],
    dots: [
      [0, 0], [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1], [3, 1],
    ],
  },
  {
    id: "projets",
    path: "/projets",
    label: "Projets",
    v: [8, 40, 60, 92],
    h: [30, 72],
    dots: [
      [1, 0], [2, 0],
      [1, 1], [2, 1],
    ],
  },
  {
    id: "contact",
    path: "/contact",
    label: "Contact",
    v: [6, 50, 50, 94],
    vOff: [2],
    h: [46, 88],
    dots: [
      [0, 0], [3, 0],
      [0, 1], [1, 1], [3, 1],
    ],
  },
];
