export type SceneId = "index" | "studio" | "expertises" | "projets" | "contact";

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
  /** Where each vertical line starts, in % of viewport height (0 = top edge). */
  vFrom?: number[];
}

export interface Scene extends Geometry {
  id: SceneId;
  path: string;
  label: string;
  /** Overrides applied on portrait screens. */
  portrait?: Partial<Geometry>;
  /** Overrides applied on short landscape screens (phones held sideways). */
  short?: Partial<Geometry>;
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
    // Portrait: the line moves to the left edge so the long title gets the full width.
    portrait: { v: [8, 8, 8, 8] },
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
    // Portrait: manifesto, key figures, AI note and statement stacked in full-width bands.
    portrait: {
      v: [6, 94, 94, 94],
      vOff: [2, 3],
      h: [42, 56, 77, 92],
      hOff: [],
      dots: [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [0, 2], [1, 2], [0, 3], [1, 3],
      ],
    },
    // Sideways phones: a wider right column so the key figures keep their labels on one
    // line, and a higher split so the AI note and its link fit below it.
    short: { v: [6, 11, 62, 94], h: [54, 88, 88, 88] },
  },
  {
    // Four expertises, one per frame of a 2 × 2 grid.
    id: "expertises",
    path: "/expertises",
    label: "Expertises",
    v: [6, 50, 94, 94],
    vOff: [3],
    h: [34, 61, 88, 88],
    hOff: [3],
    dots: [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
    // On portrait screens the title spans the full width, so the middle line starts at the grid.
    portrait: { vFrom: [0, 34, 0, 0] },
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
    // Portrait: the title and the contact details each get a full-width band.
    portrait: {
      v: [6, 94, 94, 94],
      vOff: [2, 3],
      h: [36, 64, 88, 88],
      hOff: [3],
      dots: [
        [0, 0], [1, 0],
        [0, 1], [1, 1],
        [0, 2], [1, 2],
      ],
    },
  },
];
