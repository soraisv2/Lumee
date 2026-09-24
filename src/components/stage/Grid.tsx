import type { Scene } from "./scenes";

const STAGGER_MS = 45;
const DOT_REVEAL_MS = 1100;

type Vars = React.CSSProperties & Record<`--${string}`, number | string>;

// Lines keep stable keys across scenes, so changing scene moves the same
// elements and CSS transitions animate them to their new positions.
export function Grid({ scene }: { scene: Scene }) {
  const vDelay = (i: number) => i * STAGGER_MS;
  const hDelay = (i: number) => (scene.v.length + i) * STAGGER_MS;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {scene.v.map((x, i) => (
        <span
          key={`v${i}`}
          className="grid-line grid-line-v"
          style={{ "--p": x, "--o": scene.vOff?.includes(i) ? 0 : 1, transitionDelay: `${vDelay(i)}ms` } as Vars}
        />
      ))}
      {scene.h.map((y, i) => (
        <span
          key={`h${i}`}
          className="grid-line grid-line-h"
          style={{ "--p": y, "--o": scene.hOff?.includes(i) ? 0 : 1, transitionDelay: `${hDelay(i)}ms` } as Vars}
        />
      ))}
      {scene.v.flatMap((x, vi) =>
        scene.h.map((y, hi) => {
          const on = scene.dots.some(([a, b]) => a === vi && b === hi);
          const reveal = on ? DOT_REVEAL_MS : 0;
          return (
            <span
              key={`d${vi}-${hi}`}
              className="grid-dot"
              style={
                {
                  "--x": x,
                  "--y": y,
                  "--o": on ? 1 : 0,
                  transitionDelay: `${vDelay(vi)}ms, ${hDelay(hi)}ms, ${reveal}ms, ${reveal}ms`,
                } as Vars
              }
            />
          );
        }),
      )}
    </div>
  );
}
